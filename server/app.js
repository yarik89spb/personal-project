import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectToDB from './models/db.js';
import { getProjectData, insertAnswer, getWordCounts } from './models/queries.js';
import { storeComment, storeCurrentBatch } from './controllers/commentController.js';
import { getProjectStatistics } from './controllers/dashboard.js';
import { signUp, signIn } from './controllers/userContoller.js'
import { addWordCounts } from './utils/callPython.js'
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
connectToDB()

const server = createServer(app);
const io = new Server(server, {
  //...
}); 


const testProjectId = 'c75a22fs68cgs3'
const testProject = {
  projectName: 'Porko demo',
  projectId: testProjectId ,
  questions:[
    {
      id: 1,
      title: '歡迎',
      content: '歡迎光臨玩Porko。這次的主題是比較了解Batch 24的同學 ',    
      options: [
        {id: 11, text:'OK', isCorrect: true},
      ]
    }, 
    {
      id: 2,
      title: '嗜好',
      content: '空閒喜歡做的事...',
      options: [
        {id: 21, text:'運動', isCorrect: false},
        {id: 22, text:'玩電腦', isCorrect: false},
        {id: 23, text:'寫Stylish API', isCorrect: true},
        {id: 24, text:'復甦死掉的ec2', isCorrect: false},
      ]
    },
    {
      id: 3,
      title: '技術',
      content: '在AppleWorks上課時最我最喜歡做...',
      options: [
        {id: 31, text:'伺服器', isCorrect: false},
        {id: 32, text:'資料庫', isCorrect: true},
        {id: 33, text:'演算法', isCorrect: false},
        {id: 34, text:'客戶端', isCorrect: false},
        {id: 35, text:'Nginx', isCorrect: false},
        {id: 36, text:'快取', isCorrect: false}
      ]
    },
    {
      id: 4,
      title: '技術',
      content: '在AppleWorks上課時最討厭...',
      options: [
        {id: 41, text:'準備簡報', isCorrect: true},
        {id: 42, text:'很早起床', isCorrect: true},
        {id: 43, text:'通勤', isCorrect: true},
        {id: 44, text:'Yarik', isCorrect: false},
      ]
    },
    {
      id: 5,
      title: '結束',
      content: '謝謝參加Demo #1 。請多喝水，愛自己的父母，下課記得打卡',
      options: [
        {id: 51, text:'<3', isCorrect: true},
      ]
    }
  ]
}

// await insertTestData(testProject);
// await insertTestResponse(testViewerResponse);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/project-data', async (req, res)=>{
  try{
    const projectId = req.query.id;
    const projectData = await getProjectData(projectId);
    res.status(200).json({data: projectData}) 
  }catch(error){
    res.status(400).json({error:'Failed to load data'})
  }
})


app.get('/api/project-stats', async (req, res)=>{
  try{
    const data = await getProjectStatistics(testProjectId);
    res.status(200).json({data: data}) 
  }catch(error){
    res.status(400).json({error:'Failed to load data'})
  }
})

app.get('/api/word-counts', async (req, res)=>{
  try{
    const data = await getWordCounts(testProjectId);
    res.status(200).json({data: data}) 
  }catch(error){
    res.status(400).json({error:'Failed to load data'})
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

// Put it after other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on("connection", (socket) => {
  console.log('User connected')
  socket.on('viewerMessage', async (message)=>{
    io.emit('viewerMessage', message)
    await storeComment(testProjectId, message);
  })

  socket.on('changeScreen', async (passedData)=>{
    // console.log(passedData)
    await storeCurrentBatch(testProjectId);
    io.emit('changeScreen', passedData)
  })

  socket.on('startBroadcasting', (passedData)=>{
    // console.log(passedData)
    io.emit('startBroadcasting', passedData)
  })

  socket.on('stopBroadcasting', (passedData)=>{
    // console.log(passedData)
    io.emit('stopBroadcasting', passedData)
    addWordCounts(testProjectId);
  })

  // Create temporary id for a project:

  socket.on('userAnswer', async (answerData)=>{
    io.emit('userAnswer', answerData);
    await insertAnswer(testProjectId, answerData)
  })

  socket.on('userEmoji', async (emoji)=>{
    console.log(emoji)
    io.emit('userEmoji', emoji);
  })

  
  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
  });
});

server.listen(3000, () => console.log('Server listening on port 3000'))