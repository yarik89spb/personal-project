import { Comment } from "./interfaces";

export async function fetchComments(projectId: string | undefined){
  try{
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/project-comments?projectId=${projectId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const commentsData = await response.json();
      return commentsData.data as Comment[];
    } catch(error){
      console.error(`Failed to get comments. ${error}`)
    }
  }