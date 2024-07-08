import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ProjectObject } from '../utils/interfaces'
import ProjectConstructor from './ProjectConstructor';
import './HostProfile.css';


export default function HostProfile(){
  const navigate = useNavigate();
  const { userId } = useParams();
  const { userName} = useContext(AuthContext);
  const [projectsArray, setProjectsArray] = useState([]);
  const [showConstructor, setShowConstructor] = useState(false);

  function renderProjectsList(){
    if(!projectsArray || projectsArray.length === 0){
      return <h4>No projects found... Maybe add one?</h4>
    }
    return (
      projectsArray.map((projectObj:  ProjectObject)=>{
        return (
          <div 
            className='project-container'
            key={projectObj.projectId}>
            <h4>{projectObj.projectName}</h4>
            <p>{projectObj.description}</p>
            <button 
            type='button'
            className="btn btn-primary mr-2"
            onClick={()=>handleEventStart(projectObj.projectId)}>
              Start 
            </button> 
            <button 
            type='button'
            className="btn btn-secondary"
            onClick={()=>handlePreviewClick(projectObj.projectId)}>
              Details  
            </button>
            <button 
            type='button'
            className="btn btn-secondary"
            onClick={()=>handleStatsClick(projectObj.projectId)}>
              Summary 
            </button>
            <button 
            type='button'
            className="btn btn-danger"
            onClick={()=>deleteProject(projectObj.projectId)}>
              Delete 
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
  }, [userId])

  async function deleteProject(projectId: string){
    try{
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/delete-project`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          projectId
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const projectsData = await response.json();
      setProjectsArray(projectsData.data);
    } catch(error){
      console.error(`Failed to delete project ${error}`)
    }
  }

  function handlePreviewClick(projectId: string){
    navigate(`/preview/${projectId}`)
  }

  function handleEventStart(projectId: string){
    navigate(`/host/${projectId}`)
  }

  function handleStatsClick(projectId: string){
    navigate(`/stats/${projectId}`)
  }

  return (
    <div className="host-profile-container">
      <h3 className='welcome-username'>Hi, {userName}!</h3>
      <h2 className='username-projects-title'>Your projects:</h2>
      <div>
        {renderProjectsList()}
      </div>
      <div>
        <button 
        type='button'
        className="btn btn-info create-project"
        onClick={()=>{setShowConstructor(!showConstructor)}}>
          Create project
        </button>
      </div>
      <div>
        {showConstructor && <ProjectConstructor/>}
      </div>
    </div>
  )
}