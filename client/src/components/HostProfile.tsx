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
  }, [userId])


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