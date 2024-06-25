import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';


export default function HostProfile(){
  const navigate = useNavigate();
  const { userId } = useParams();
  const { userEmail, userName} = useContext(AuthContext);
  const [projectsArray, setProjectsArray] = useState([]);

  function renderProjectsList(){
    return (
      projectsArray.map((projectObj)=>{
        return (
          <div 
            className='project-container'
            key={projectObj.projectId}>
            <h4>{projectObj.projectName}</h4>
            <p>{projectObj.description}</p>
            <button 
            type='button'
            onClick={()=>handleEventStart(projectObj.projectId)}>
              Start 
            </button>
            <button 
            type='button'
            onClick={()=>handleStatsClick(projectObj.projectId)}>
              Summary 
            </button>
          </div>
          )
      })
    )
  }

  useEffect(()=>{
    async function fetchProjectsList(){
      try{
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user-projects?userId=${userId}`)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const projectsData = await response.json();
        setProjectsArray(projectsData.data);
      } catch(error){
        console.error(`Failed to get project data. ${error}`)
      }
    }
    fetchProjectsList();
    if(projectsArray && projectsArray.length > 0){
      renderProjectsList();
    }
  }, [])


  function handleEventStart(projectId){
    navigate(`/host/${projectId}`)
  }

  function handleStatsClick(projectId){
    navigate(`/stats/${projectId}`)
  }

  return (
    <>
      <h3>Hi, {userName}</h3>
      <h2>Your projects:</h2>
      <div>
        {renderProjectsList()}
      </div>
    </>
  )
}