import { Comment } from "./interfaces";

export async function fetchProjectData(projectId: string | undefined){
  try{
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/project-data?projectId=${projectId}`)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const newProjectData = await response.json();
        return newProjectData.data
  }
  catch(error){
    console.error(`Failed to get project data. ${error}`)
  }
}

export async function fetchComments(projectId: string | undefined){
  try{
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/project-comments?projectId=${projectId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const commentsData = await response.json();
      console.log(commentsData)
      return commentsData.data as Comment[];
    } catch(error){
      console.error(`Failed to get comments. ${error}`)
    }
  }

export async function fetchViewers(projectId: string | undefined){
  try{
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/project-viewers?projectId=${projectId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const viewersData = await response.json();
      return viewersData;
    } catch(error){
      console.error(`Failed to get viewers ${error}`)
    }
  }

export async function isOnline(projectId: string | undefined){
  try{
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/broadcasting?projectId=${projectId}`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const onlineStatus = await response.json();
    return onlineStatus.isBroadcasting;
  } catch(error){
    console.error(`Failed to get online status ${error}`)
  }
}

export async function changeOnlineStatus(jwt:string, projectId: string | undefined, isOnline: boolean | string){
  try{
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/toggle-broadcasting?projectId=${projectId}&broadcasting=${isOnline}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwt}`,
        },
      })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const onlineStatus = await response.json();
      return onlineStatus.isBroadcasting;
    } catch(error){
      console.error(`Failed to toggle project visibility ${error}`)
    }
  }