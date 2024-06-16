import express from 'express';
import { createServer } from "http";
import { Server } from 'socket.io';
import { 
  testQuery, 
  insertTestData, 
  getProjectData, 
  insertTestResponse, 
  insertAnswer } from './models/queries.js'
import connectToDB from './models/db.js'

const app = express();
connectToDB()

const server = createServer(app);
const io = new Server(server, {
  //...
});

const testProject = {
  projectName: 'Test project',
  projectId: 't1234567',
  questions:[
    {
      id: 1,
      title: '晚餐',
      content: '晚餐要吃什麽',    
      options: [
        {id: 11, text:'麥當勞', isCorrect: true},
        {id: 12, text:'便利商店', isCorrect: false},
        {id: 13, text:'意麵', isCorrect: false},
        {id: 14, text:'炒飯', isCorrect: false}
      ]
    }, 
    {
      id: 2,
      title: '程式語言',
      content: '最棒的程式語言',
      options: [
        {id: 21, text:'JavaScript', isCorrect: false},
        {id: 22, text:'C++', isCorrect: false},
        {id: 23, text:'Python', isCorrect: true},
        {id: 24, text:'中文', isCorrect: false}
      ]
    },
    {
      id: 3,
      title: '詩人',
      content: '最偉大的詩人',
      options: [
        {id: 31, text:'李白', isCorrect: false},
        {id: 32, text:'毛主席', isCorrect: true},
        {id: 33, text:'周杰倫', isCorrect: false},
        {id: 34, text:'蘇軾', isCorrect: false}
      ]
    }
  ]
}

const testViewerResponse = { text: 'bla bla bla'}

//await insertTestData(testProject);
// await insertTestResponse(testViewerResponse);

// await testQuery();
// await getProjectData('666aacea11816fd400f2f734');

app.get('/api/project-data', async (req, res)=>{
  try{
    const projectId = req.query.id;
    const projectData = await getProjectData(projectId);
    res.status(200).json({data: projectData}) 
  }catch(error){
    res.status(400).json({error:'Failed to load data'})
  }
})

app.post('/api/viewerAnswer', async (req, res)=>{
  try{
    res.status(200).json({text: 'Ok'}) 
  }catch(error){
    res.status(400).json({error:'Failed to load data'})
  }
})

io.on("connection", (socket) => {
  console.log('User connected')
  socket.on('viewerMessage', (message)=>{
    console.log(message)
    io.emit('viewerMessage', message)
  })

  socket.on('changeScreen', (passedData)=>{
    console.log(passedData)
    io.emit('changeScreen', passedData)
  })

  socket.on('startBroadcasting', (passedData)=>{
    console.log(passedData)
    io.emit('startBroadcasting', passedData)
  })

  socket.on('stopBroadcasting', (passedData)=>{
    console.log(passedData)
    io.emit('stopBroadcasting', passedData)
  })

  // Create temporary id for a project:
  const testProjectId = 'a84a11fs68bbs2'

  socket.on('userAnswer', async (answerData)=>{
    io.emit('userAnswer', answerData);
    await insertAnswer(testProjectId, answerData)
  })
  
  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
  });
});

server.listen(3000, () => console.log('Server listening on port 3000'))