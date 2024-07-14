import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectToDB from './models/db.js';
import { insertAnswer, getWordCounts } from './models/queries.js';
import { storeComment, storeCommentBatch, getProjectComments } from './controllers/commentController.js';
import { storeEmoji, storeEmojiBatch } from './controllers/emojiController.js'
import { getProjectStatistics } from './controllers/dashboard.js';
import { signUp, signIn, validateJWT } from './controllers/userContoller.js'
import { addViewer, renameViewer, removeViewer, getViewers } from './controllers/viewerController.js';
import { addNewProject, deleteProject, getUserProjects, getProjectData, toggleBroadcasting, getBroadcastingStatus } from './controllers/projectController.js'
import { addWordCounts, addKeyWords } from './utils/callPython.js'
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { useBot } from './controllers/chatBot.js';

dotenv.config();

const app = express();
connectToDB()

const server = createServer(app);
const io = new Server(server, {
  //...
}); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/add-project', async (req, res)=>{
  try{
    const projectData = req.body;
    const projectId = await addNewProject(projectData);
    addKeyWords(projectId)
    res.status(200).json({projectId}) 
  }catch(error){
    res.status(400).json({error:'Failed to add project data'})
  }
})

app.post('/api/delete-project', async (req, res)=>{
  try{
    const {userId, projectId} = req.body;
    await deleteProject(userId, projectId);
    res.status(200).json({message:'Ok'}) 
  }catch(error){
    res.status(400).json({error:'Failed to add project data'})
  }
})

app.get('/api/project-data', async (req, res)=>{
  try{
    const projectId = req.query.projectId;
    const projectData = await getProjectData(projectId);
    res.status(200).json({data: projectData}) 
  }catch(error){
    res.status(400).json({error:`Failed to load data. ${error.message}`})
  }
})

app.get('/api/user-projects', async (req, res)=>{
  try{
    const projectId = req.query.userId;
    const projectData = await getUserProjects(projectId);
    res.status(200).json({data: projectData}) 
  }catch(error){
    console.log(error)
    res.status(400).json({error:'Failed to load data'})
  }
})

app.get('/api/project-viewers', async (req, res) =>{
  try{
    const projectId = req.query.projectId;
    const [hostId, projectViewers] = getViewers(projectId)
    res.status(200).json({hostId, data: projectViewers})
  } catch(error){
    console.error(error);
    res.status(400).json({error: 'Failed to get list of viewers'})
  }
})

app.get('/api/project-comments', async (req, res) =>{
  try{
    const projectId = req.query.projectId;
    const projectComments = await getProjectComments(projectId);
    res.status(200).json({data: projectComments})
  } catch(error){
    console.error(error);
    res.status(400).json({error: 'Failed to load comments'})
  }
})


app.get('/api/project-stats', async (req, res)=>{
  try{
    const projectId = req.query.projectId;
    const data = await getProjectStatistics(projectId);
    res.status(200).json({data: data}) 
  }catch(error){
    res.status(400).json({error:'Failed to load data'})
  }
})

app.get('/api/word-counts', async (req, res)=>{
  try{
    const projectId = req.query.projectId;
    const data = await getWordCounts(projectId);
    res.status(200).json({data: data}) 
  }catch(error){
    res.status(400).json({error:'Failed to load data'})
  }
})

app.post('/api/toggle-broadcasting', async (req, res)=>{
  try{
    const {projectId} = req.query;
    const {broadcasting} = req.query;
    const authHeader = req.headers.authorization;
    const userJWT = authHeader.split(' ')[1];
    if(!userJWT){
      throw new Error('Missing JWT')
    }
    const {userId} = validateJWT(userJWT);
    const broadcastingStatus = await toggleBroadcasting(userId, projectId, broadcasting);
    res.status(200).json(broadcastingStatus) 

  }catch(error){
    res.status(400).json({error:`Failed to toggle broadcasting. ${error}`})
  }
})

app.post('/api/toggle-sharing', async (req, res)=>{
  try{
    const {projectId} = req.query;
    const {sharing} = req.query;
    const authHeader = req.headers.authorization;
    const userJWT = authHeader.split(' ')[1];
    if(!userJWT){
      throw new Error('Missing JWT')
    }
    const {userId} = validateJWT(userJWT);
    const broadcastingStatus = await toggleBroadcasting(userId, projectId, broadcasting);
    res.status(200).json(broadcastingStatus) 

  }catch(error){
    res.status(400).json({error:`Failed to toggle broadcasting. ${error}`})
  }
})

app.get('/api/broadcasting', async (req, res)=>{
  try{
    const {projectId} = req.query;
    const onlineStatus = await getBroadcastingStatus(projectId);
    res.status(200).json(onlineStatus);

  }catch(error){
    res.status(400).json({error:`Failed to toggle broadcasting. ${error}`})
  }
})

app.post('/user/signup', async (req, res) => {
  try{
    const userData = {
      userEmail: req.body.userEmail,
      userName: req.body.userName,
      userPassword: req.body.userPassword,
      userCompany: req.body.userCompany
    }
    if(!userData.userEmail || !userData.userPassword || !userData.userName){
      throw new Error('Incomplete user credentials');
    }
    const userObject = await signUp(userData);
    res.status(201).json(userObject);
  } catch(error) {
    console.error(error)
    res.status(400).json({text: `Failed to register user. ${error.message}`})
  }
})

app.post('/user/signin', async (req, res) => {
  try{
    const userData = {
      userEmail: req.body.userEmail,
      userPassword: req.body.userPassword,
    }
    if(!userData.userEmail || !userData.userPassword){
      throw new Error('Incomplete user credentials');
    }
    const userObject = await signIn(userData);
    res.status(201).json(userObject);
  } catch(error) {
    console.error(error)
    res.status(400).json({text: `Failed to login. ${error.message}`})
  }
})

app.get('/user/verify', (req, res) => {
  // Verify jwt validity
  try{
    const authHeader = req.headers.authorization;
    const userJWT = authHeader.split(' ')[1];
    if(!userJWT){
      throw new Error('Missing JWT')
    }
    const payload = validateJWT(userJWT);
    if(payload){
      res.status(200).json(payload);
    }else{
      throw new Error('JWT validation failed.')
    }
  } catch(error) {
    res.status(400).json({text: `Incorrect or epxired JWT. ${error.message}`})
  }
})

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
    console.log('viewerMessage')
    await storeComment(roomId, message);
  })

  socket.on('changeScreen', async (eventPayload)=>{
    const {roomId} = eventPayload; // roomId = projectId
    const {passedData} = eventPayload;
    
    io.to(roomId).emit('changeScreen', passedData)
    const bot = useBot(roomId);
    const botMessage = bot.readNote(passedData.botNote);
    emitBotMessage(roomId, botMessage)
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