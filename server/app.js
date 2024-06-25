import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectToDB from './models/db.js';
import { getWordCounts } from './models/queries.js';
import { storeComment, storeCurrentBatch } from './controllers/commentController.js';
import { getProjectStatistics } from './controllers/dashboard.js';
import { signUp, signIn, validateJWT } from './controllers/userContoller.js'
import { addNewProject, getUserProjects, getProjectData } from './controllers/projectController.js'
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/add-project', async (req, res)=>{
  try{
    const projectData = req.body;
    const projectId = await addNewProject(projectData);
    res.status(200).json({projectId}) 
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

io.on("connection", (socket) => {
  console.log('User connected')
  socket.on('viewerMessage', async (message)=>{
    io.emit('viewerMessage', message)
    await storeComment(testProjectId, message);
  })

  socket.on('changeScreen', async (passedData)=>{
    console.log(passedData)
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