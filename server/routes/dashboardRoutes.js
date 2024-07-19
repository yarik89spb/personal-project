import express from 'express';
import { getProjectStatistics } from '../controllers/dashboard.js';
import { getWordCounts } from '../models/queries.js';

const router = express.Router();

router.get('/project-stats', async (req, res)=>{
  try{
    const projectId = req.query.projectId;
    const data = await getProjectStatistics(projectId);
    res.status(200).json({data: data}) 
  }catch(error){
    res.status(400).json({error:'Failed to load data'})
  }
})

router.get('/word-counts', async (req, res)=>{
  try{
    const projectId = req.query.projectId;
    const data = await getWordCounts(projectId);
    res.status(200).json({data: data}) 
  }catch(error){
    res.status(400).json({error:'Failed to load data'})
  }
})

export default router;
