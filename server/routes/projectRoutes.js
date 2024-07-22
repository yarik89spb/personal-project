import Router from 'express';
import { addNewProject, deleteProject, getUserProjects, getProjectData } from '../controllers/projectController.js';
import { addKeyWords } from '../utils/callPython.js';
import { authorizeOperation } from '../middleware/userAuthorization.js'

const router = Router();

router.post('/add-project', async (req, res)=>{
  try{
    const projectData = req.body;
    const projectId = await addNewProject(projectData);
    addKeyWords(projectId)
    res.status(200).json({projectId}) 
  }catch(error){
    res.status(400).json({error:'Failed to add project data'})
  }
})

router.post('/delete-project', authorizeOperation, async (req, res)=>{
  try{
    const { projectId } = req.query;
    const { userId } = req.body;
    await deleteProject(userId, projectId);
    res.status(200).json({message:'Ok'}) 
  }catch(error){
    console.error(error)
    res.status(400).json({error:'Failed to add project data'})
  }
})

router.get('/project-data', authorizeOperation, async (req, res)=>{
  try{
    const { projectId } = req.query;
    const projectData = await getProjectData(projectId);
    res.status(200).json({data: projectData}) 
  }catch(error){
    res.status(400).json({error:`Failed to load data. ${error.message}`})
  }
})

router.get('/user-projects', async (req, res)=>{
  try{
    const projectId = req.query.userId;
    const projectData = await getUserProjects(projectId);
    res.status(200).json({data: projectData}) 
  }catch(error){
    console.log(error)
    res.status(400).json({error:'Failed to load data'})
  }
})

export default router;
