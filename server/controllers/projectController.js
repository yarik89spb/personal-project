import { insertProjectData, searchUserById } from '../models/queries.js'



export async function addNewProject(projectData){
  try{
    const projectId = await insertProjectData(projectData)
    return projectId;
  } catch(error){
    throw new Error(`Failed to insert new project data ${error}`)
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
