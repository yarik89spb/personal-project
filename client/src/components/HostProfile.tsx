import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ProjectObject } from '../utils/interfaces'
import ProjectConstructor from './ProjectConstructor';
import { deleteProject } from '../utils/fetchFunctions'
import './HostProfile.css';
import { useCookies } from 'react-cookie';


export default function HostProfile(){
  const navigate = useNavigate();
  const { userId } = useParams();
  const { userName} = useContext(AuthContext);
  const [projectsArray, setProjectsArray] = useState<ProjectObject[]>([]);
  const [showConstructor, setShowConstructor] = useState(false);
  const [cookies]  = useCookies(['jwt']);

  async function handleDeleteProject(e: any, projectId: string){
    e.preventDefault();
    await deleteProject(cookies.jwt, userId, projectId);
    const newProjectArray = projectsArray.filter(project => project.projectId !== projectId);
    setProjectsArray(newProjectArray);
  }
    

  function renderProjectsList(){
    if(!projectsArray || projectsArray.length === 0){
      return <h4>No events found... Maybe add one?</h4>
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
            className="btn btn-primary mr-2 project-control"
            onClick={()=>handleEventStart(projectObj.projectId)}>
              Start 
            </button> 
            <button 
            type='button'
            className="btn btn-secondary project-control"
            onClick={()=>handlePreviewClick(projectObj.projectId)}>
              Details  
            </button>
            <button 
            type='button'
            className="btn btn-secondary project-control"
            onClick={()=>handleStatsClick(projectObj.projectId)}>
              Summary 
            </button>
            <button 
            type='button'
            className="btn btn-danger project-control"
            onClick={(e)=> handleDeleteProject(e, projectObj.projectId)}>
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
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/project/user-projects?userId=${userId}`)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const projectsData = await response.json();
        setProjectsArray(projectsData.data);
      } catch(error){
        console.error(`Failed to get project data. ${error}`);
      }
    }
    fetchProjectsList();
    if(projectsArray && projectsArray.length > 0){
      renderProjectsList();
    }
  }, [userId])

  

  function handlePreviewClick(projectId: string){
    navigate(`/preview/${projectId}`);
  }

  function handleEventStart(projectId: string){
    navigate(`/host/${projectId}`);
  }

  function handleStatsClick(projectId: string){
    navigate(`/stats/${projectId}`);
  }

  return (
    <div className="host-profile-container">
      <h3 className='welcome-username'>Hi, {userName}!</h3>
      <h2 className='username-projects-title'>Your events:</h2>
      <div>
        {renderProjectsList()}
      </div>
      <div className='project-list-footer'>
        <button 
        type='button'
        className="btn btn-info create-project"
        onClick={()=>{setShowConstructor(!showConstructor)}}>
          Create event
        </button>
      </div>
      <div>
        {showConstructor && <ProjectConstructor/>}
      </div>
    </div>
  )
}