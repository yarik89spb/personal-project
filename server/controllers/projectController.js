import { insertProjectData, searchUserById, searchProjectById } from '../models/queries.js'

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

export async function getProjectData(projectId){
  try{
    const projectData = await searchProjectById(projectId);
    return projectData;
  } catch (error){
    throw new Error(error.message)
  }
}
