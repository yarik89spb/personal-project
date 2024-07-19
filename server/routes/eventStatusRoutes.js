import { Router } from 'express';
import { toggleBroadcasting, getBroadcastingStatus } from '../controllers/projectController.js';
import { validateJWT } from '../controllers/userController.js';
import { getViewers } from '../controllers/viewerController.js';
import { getProjectComments } from '../controllers/commentController.js';

const router = Router();

router.post('/toggle-broadcasting', async (req, res)=>{
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

router.post('/toggle-sharing', async (req, res)=>{
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

router.get('/broadcasting', async (req, res)=>{
  try{
    const {projectId} = req.query;
    const onlineStatus = await getBroadcastingStatus(projectId);
    res.status(200).json(onlineStatus);

  }catch(error){
    res.status(400).json({error:`Failed to toggle broadcasting. ${error}`})
  }
})

router.get('/project-viewers', async (req, res) =>{
  try{
    const projectId = req.query.projectId;
    const [hostId, projectViewers] = getViewers(projectId)
    res.status(200).json({hostId, data: projectViewers})
  } catch(error){
    console.error(error);
    res.status(400).json({error: 'Failed to get list of viewers'})
  }
})

router.get('/project-comments', async (req, res) =>{
  try{
    const projectId = req.query.projectId;
    const projectComments = await getProjectComments(projectId);
    res.status(200).json({data: projectComments})
  } catch(error){
    console.error(error);
    res.status(400).json({error: 'Failed to load comments'})
  }
})

export default router;