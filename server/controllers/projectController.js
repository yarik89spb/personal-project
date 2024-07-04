import { insertProjectData, searchUserById, searchProjectById, deleteProjectData } from '../models/queries.js'

export async function addNewProject(projectData){
  try{
    const projectId = await insertProjectData(projectData)
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
