import { Fragment, useState, useRef, useEffect} from 'react';
import { useSocket, useMessageListener, sendCommand, useAnswerListener } from '../utils/websocket';
import EventScreen from './EventScreen';
import ChatComments from './ChatComments';
import AlwaysScrollToBottom from './AlwaysScrollToBottom';
import { Option, Question, Comment } from '../utils/interfaces.ts';
import './HostView.css';

function HostView(){
  let userComments = [
    {author: 'John', content:'Hi'},
    {author:'Amy', content:'Wow'}, 
    {author:'Bot', content:'Greeting'}
  ];

  const [projectData, setProjectData] = useState({
    projectName: 'Missing',
    projectId: null,
    questions:[]});
  const [questionIndex, setQuestionIndex] =  useState(0);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [commentsArray, setComments] =  useState(userComments);
  const [answersArray, setAnswers] =  useState([]);
  const socket = useSocket('http://localhost:3000/');

  /* Project data rendering and broadcasting */

  useEffect(() => {
    async function fetchData(){
      try{
        const response = await fetch('http://localhost:3000/api/project-data?id=666aacea11816fd400f2f734')
        const newProjectData = await response.json();
        setIsLoadingQuestions(false);
        setProjectData(newProjectData.data);
      } catch(error){
        console.error(`Failed to get project data. ${error}`)
        setIsLoadingQuestions(false);
      }
    }
    fetchData();
  }, [])

  function handleQuestionIndexChange(isForward = true){
    const maxIndex = projectData.questions.length - 1;
    if (isForward){
      const newIndex = questionIndex + 1;
      if (newIndex <= maxIndex) {
        setQuestionIndex(newIndex);
      }else {
        setQuestionIndex(0);
      }
    }else{
      const newIndex = questionIndex - 1;
      if (newIndex > 0){
        setQuestionIndex(newIndex);
      }else {
        setQuestionIndex(maxIndex);
      }
    }
  }

  function changeScreen(){
    sendCommand(socket, 'changeScreen', projectData.questions[questionIndex])
  }

  useEffect(() => { 
    changeScreen();
  }, [questionIndex]);

  function handleBroadcastingState(isBroadcasting = false){
    if(isBroadcasting){
      sendCommand(socket, 'startBroadcasting', {data:null})
      changeScreen()
    }else{
      sendCommand(socket, 'stopBroadcasting', {data:null})
    }
  }


  /* Receiving viewers' comments and reactions */

  useMessageListener(socket, 'viewerMessage', (message) => {
    addMessageToChat({ author: 'user', content: message });
  });

  function addMessageToChat(comment: Comment){
    setComments((prevComments) => [...prevComments, comment]);
  }

  // useAnswerListener(socket, 'userAnswer', (userAnswer:Option) => {
  //   setAnswers([...answersArray, userAnswer]);
  // });

  // function storeAnswers(userAnswer){
  //   const questionId = projectData[questionIndex].id;
  //   sendAnswerBatch({questionId, userAnswers });
  // }

  // // Store user answers' batch: every 10 answers
  // useEffect(() => {
  //   if(userAnswers.length % 10 === 0){
  //     storeAnswers();
  //   }
  // }, [userAnswers]);
  
  return (
    <div className='container'> 
      <div className='row'>
        <div className='col-md-6'>
          <div className='card'> 
            <h3 className='card-header' >User comments:</h3>
            <div className='card-body' style={{ height: '300px', maxHeight: '300px', overflowY: 'auto' }}>
              <AlwaysScrollToBottom>
                <ChatComments comments={commentsArray}/>
              </AlwaysScrollToBottom>
            </div>
          </div>
        </div>
        <div className='col-md-6'>
        {isLoadingQuestions === false && (
            <EventScreen
              question={projectData.questions[questionIndex]}
              onOptionClick={() => {
                return;
              }}
            />
          )}
        </div>
      </div>
      <button type='button' onClick={()=>handleQuestionIndexChange()}>Prev</button>
      <button type='button' onClick={()=>handleBroadcastingState(true)}>Start</button>
      <button type='button' onClick={()=>handleBroadcastingState(false)}>Stop</button>
      <button type='button' onClick={()=>handleQuestionIndexChange()}>Next</button>
    </div> 
  )
}

export default HostView
