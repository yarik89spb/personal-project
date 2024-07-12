import { 
  startBroadcasting,
  stopBroadcasting,
  insertProjectData, 
  searchUserById, 
  searchProjectById, 
  deleteProjectData,
  getBroadcastingData
} from '../models/queries.js'

export async function toggleBroadcasting(userId, projectId, broadcasting){
  const userData = await searchUserById(userId);
  const userProjects = userData.projects.map((projectObj)=>projectObj.projectId)
  if (!userProjects.includes(projectId)){
    throw new Error(`User has no such project`)
  }
  let currentState; 
  if(broadcasting === 'true'){
    currentState = await startBroadcasting(projectId);
  } else {
    currentState = await stopBroadcasting(projectId);
  }
  return {isBroadcasting: currentState}
}

export async function getBroadcastingStatus(projectId){
  const broadcastingObj = await getBroadcastingData(projectId);
  return {
    isBroadcasting: broadcastingObj.isBroadcasting,
    projectName: broadcastingObj.projectName
  };
}

export async function addNewProject(projectData){
  try{
    if(!projectData.questions || projectData.questions.length === 0){
      throw new Error('Project has no questions')
    }

    const projectId = await insertProjectData({
      ...projectData,
      keyWordsEng: [],
      keyWordsCn: []
    })
    return projectId;
  } catch(error){
    throw new Error(`Failed to insert new project data ${error}`)
  }
}

export async function deleteProject(userId, projectId){
  try{
    const result = await deleteProjectData(userId, projectId)
    return result;
  } catch(error){
    throw new Error(`Failed to delete project ${error}`)
  }
}

export async function getUserProjects(userId){
  try{
    const userData = await searchUserById(userId);
    return userData.projects;
  } catch(error) {
    throw new Error(error)
  }
}

export async function getProjectData(projectId){
  try{
    const projectData = await searchProjectById(projectId);
    return projectData;
  } catch (error){
    throw new Error(error.message)
  }
}
