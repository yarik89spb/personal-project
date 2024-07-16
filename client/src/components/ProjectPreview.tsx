import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { fetchProjectData } from '../utils/fetchFunctions';
import EventScreen from './EventScreen';
import { AuthContext } from '../context/AuthContext';
import './ProjectPreview.css';

const ProjectPreview = () => {
  const { userId } = useContext(AuthContext);
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState({
    projectName: 'Missing',
    projectId: null,
    description: '',
    questions:[],
    keyWordsEng: ['none'],
    keyWordsCn: ['none']});
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

  function keyWords(keywords: string[]){
    if(keywords){
      return (
        <div className='key-words-list'>
          {keywords.map((kword, index)=>{
            return <div className='project-key-word badge badge-secondary m-1'
            key={index}> {kword} </div>
          })}
        </div>
        )
    }
  }


  useEffect(() => {
    async function fetchData(){
      const newProjectData = await fetchProjectData(projectId);
      setProjectData(newProjectData);
      setIsLoadingQuestions(false);
    }
    fetchData();
    
  }, [projectId])

  function handleBackClick(){
    navigate(`/profile/${userId}`)
  }

  function handleEventStart(){
    navigate(`/host/${projectId}`)
  }
  
  function handleStatsClick(){
    navigate(`/stats/${projectId}`)
  }

  return (
  <div className="container">
    <h2> Project '{projectData.projectName}' Details</h2>
    <button className='btn btn-primary mr-2 back' onClick={() => handleBackClick()}> Back to Profile</button>
    <button type='button' className="btn btn-primary mr-2" onClick={()=>handleEventStart()}> Start </button> 
    <button type='button' className="btn btn-secondary" onClick={()=>handleStatsClick()}> Summary </button>
    <div className='project-information'>
      <div className='element'> Description: '{projectData.description}' </div>
      <div className='element'> Total questions: {projectData.questions.length}</div>
      <div className='element key-words title'>Keywords:</div>
      <div className='english key-words-container'>{keyWords(projectData.keyWordsEng)}</div>
      <div className='element key-words title'> 關鍵詞:</div>
      <div className='chinese key-words-container'>{keyWords(projectData.keyWordsCn)}</div>
    </div>
    <div className='project-preview container'>
      {isLoadingQuestions === false && (
        projectData.questions.map((question) =>
          <EventScreen question={question} onOptionClick={() => {return;}}/>
      )
      )
      }
    </div>
    
  </div>)
}

export default ProjectPreview;