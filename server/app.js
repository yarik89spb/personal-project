import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectToDB from './models/db.js';
import { insertAnswer } from './models/queries.js';
import { storeComment, storeCommentBatch} from './controllers/commentController.js';
import { storeEmoji, storeEmojiBatch } from './controllers/emojiController.js'
import { addViewer, renameViewer, removeViewer } from './controllers/viewerController.js';
import { addWordCounts } from './utils/callPython.js'
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { useBot } from './controllers/chatBot.js';
import projectRouter from './routes/projectRoutes.js'
import userRouter from './routes/userRoutes.js';
import eventStatusRouter from './routes/eventStatusRoutes.js'
import dashboardRouter from './routes/dashboardRoutes.js'

dotenv.config();

connectToDB()

const app = express();
const server = createServer(app);
const io = new Server(server, {
  //...
}); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/project', projectRouter);
app.use('/user', userRouter);
app.use('/event-status', eventStatusRouter);
app.use('/dashboard', dashboardRouter);

// Put it after other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

function emitBotMessage(roomId, botMessage) {
  if (botMessage) {
    io.to(roomId).emit('viewerMessage', {
      userName: 'PorkoBot',
      questionId: 0,
      text: botMessage
    });
  }
}

io.on("connection", (socket) => {
  socket.on('joinRoom', (userPayload) => {

    const roomId = userPayload.roomId;
    socket.join(userPayload.roomId);
    const viewerId = socket.id;
    const viewer = {
      id: viewerId,
      userName: userPayload.userName,
      isBot: false
    }
    console.log(`User ${viewer.userName} joined room ${roomId}`)
    addViewer(roomId, viewer)
    io.to(roomId).emit('joinRoom', viewer);
    // Bot reporting
    const bot = useBot(roomId);
    const botMessage = bot.spawn();
    setTimeout(() => emitBotMessage(roomId, botMessage), 3000)
  });

  socket.on('leaveRoom', (userPayload) => {
    socket.leave(userPayload.roomId);
    const viewerId = socket.id;
    const viewer = {
      id: viewerId,
      userName: userPayload.userName,
      isBot: false
    }
    removeViewer(userPayload.roomId, viewer.id)
    io.to(userPayload.roomId).emit('leaveRoom', viewer);
  });

  socket.on('userNameChange', (eventPayload) => {
    const {roomId} = eventPayload;
    console.log('Changing nickname...', eventPayload.passedData)
    // Client does not know own (socket) id, it is assigned by server
    const usernameData = {
      id:socket.id,
      oldUsername: eventPayload.passedData.oldUsername,
      newUsername: eventPayload.passedData.newUsername,
    }
    renameViewer(roomId, usernameData)
    io.to(roomId).emit('userNameChange', usernameData)
  })

  socket.on('viewerMessage', async (eventPayload)=>{
    const {roomId} = eventPayload; // roomId = projectId
    const message = eventPayload.passedData;
    io.to(roomId).emit('viewerMessage', message)
    await storeComment(roomId, message);
  })

  socket.on('changeScreen', async (eventPayload)=>{
    const {roomId} = eventPayload; // roomId = projectId
    const {passedData} = eventPayload;
    
    io.to(roomId).emit('changeScreen', passedData)
    const bot = useBot(roomId);
    const botMessage = bot.readNote(passedData.botNote);
    emitBotMessage(roomId, botMessage);
    await storeCommentBatch(roomId);
    await storeEmojiBatch(roomId);
  })

  socket.on('startBroadcasting', (eventPayload)=>{
    const {roomId} = eventPayload; // roomId = projectId
    const {passedData} = eventPayload;
    io.to(roomId).emit('startBroadcasting', passedData)
    const bot = useBot(roomId);
    const botMessage = bot.start();
    emitBotMessage(roomId, botMessage)
  })

  socket.on('getCurrentQuestion', (eventPayload)=>{
    const {roomId} = eventPayload; // roomId = projectId
    const {passedData} = eventPayload;
    io.to(roomId).emit('getCurrentQuestion', passedData)
  })

  socket.on('stopBroadcasting', (eventPayload)=>{
    const {roomId} = eventPayload; // roomId = projectId
    const {passedData} = eventPayload;
    io.to(roomId).emit('stopBroadcasting', passedData)
    const bot = useBot(roomId);
    const botMessage = bot.stop();
    emitBotMessage(roomId, botMessage)
    addWordCounts(roomId);
  })

  socket.on('userAnswer', async (eventPayload)=>{
    const {roomId} = eventPayload; // roomId = projectId
    const answerData = eventPayload.passedData;
    io.to(roomId).emit('userAnswer', answerData);
    await insertAnswer(roomId, answerData)
  })

  socket.on('userEmoji', async (eventPayload)=>{
    const {roomId} = eventPayload; // roomId = projectId
    const emojiData = eventPayload.passedData;
    io.to(roomId).emit('userEmoji', emojiData);
    await storeEmoji(roomId, emojiData);
  })

  
  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
  });
});

server.listen(3000, () => console.log('Server listening on port 3000'))