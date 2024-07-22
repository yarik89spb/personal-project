import { validateJWT } from '../controllers/userController.js';
import { searchUserById } from '../models/queries.js'

export const authorizeOperation = async (req, res, next) => {
  // Verify jwt validity
  try{
    const authHeader = req.headers.authorization;
    if(!authHeader){
      throw new Error('Missing JWT.')
    }
    const userJWT = authHeader.split(' ')[1];
    const {projectId} = req.query;
    const payload = validateJWT(userJWT);
    // Get the range of projects the user 
    // is authorized to interact with
    const userData = await searchUserById(payload.userId);
    const userProjects = userData.projects.map((projectObj)=>projectObj.projectId)
    if (!userProjects.includes(projectId)){
      throw new Error('User has no such project.')
    }
    next();

  } catch(error) {
    return res.status(500).json({text: `Not authorized to perform the operation: ${error.message}`})
  }
}