import { Comment } from "./interfaces";

export async function fetchProjectData(jwt: string, projectId: string | undefined){
  try{
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/project/project-data?projectId=${projectId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwt}`,
      },
    })
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
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/event-status/project-comments?projectId=${projectId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const commentsData = await response.json();
      return commentsData.data as Comment[];
    } catch(error){
      console.error(`Failed to get comments. ${error}`)
    }
  }

export async function fetchViewers(projectId: string | undefined){
  try{
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/event-status/project-viewers?projectId=${projectId}`)
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
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/event-status/broadcasting?projectId=${projectId}`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const onlineStatus = await response.json();
    return onlineStatus;
  } catch(error){
    console.error(`Failed to get online status ${error}`)
  }
}

export async function changeOnlineStatus(jwt:string, projectId: string | undefined, isOnline: boolean | string){
  try{
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/event-status/toggle-broadcasting?projectId=${projectId}&broadcasting=${isOnline}`, {
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

  export async function deleteProject(jwt: string, userId: string | undefined, projectId: string){
    try{
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/project/delete-project?projectId=${projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify({
          userId
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch(error){
      console.error(`Failed to delete project ${error}`)
    }
  }