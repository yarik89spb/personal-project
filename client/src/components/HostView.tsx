import { Fragment, useState, useRef, useEffect} from 'react';
import { useSocket, useMessageListener, sendCommand } from '../utils/websocket';
import EventScreen from './EventScreen';
import ChatComments from './ChatComments';
import AlwaysScrollToBottom from './AlwaysScrollToBottom';
import './HostView.css';

function HostView(){
  let userComments = [
    {author: 'John', content:'Hi'},
    {author:'Amy', content:'Wow'}, 
    {author:'Bot', content:'Greeting'}
  ];

  const [projectData, setProjectData] = useState(null);
  const [commentsArray, setComments] =  useState(userComments);
  const [questionIndex, setQuestionIndex] =  useState(0);
  const socket = useSocket('http://localhost:3000/');

  useEffect(() => {
    async function fetchData(){
      try{
        const response = await fetch('http://localhost:3000/api/project-data')
        setProjectData(response.json());
      } catch(error){
        console.error(`Failed to get project data. ${error}`)
      }
    }
    fetchData();
  })
  
  useMessageListener(socket, 'viewerMessage', (message) => {
    addMessageToChat({ author: 'user', content: message });
  });

  useMessageListener(socket, 'userAnswer', (message) => {
    addMessageToChat({ author: 'user', content: message });
  });

  interface Comment {
    author: string;
    content: string;
  }

  function addMessageToChat(comment: Comment){
    setComments((prevComments) => [...prevComments, comment]);
  }

  function changeScreen(){
    sendCommand(socket, 'changeScreen', projectData.questions[questionIndex])
  }

  function handleBroadcastingState(isBroadcasting = false){
    if(isBroadcasting){
      sendCommand(socket, 'startBroadcasting', {data:null})
      changeScreen()
    }else{
      sendCommand(socket, 'stopBroadcasting', {data:null})
    }
  }

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

  useEffect(() => { 
    changeScreen();
  }, [questionIndex]);
  
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
          <EventScreen question={projectData.questions[questionIndex]} onOptionClick={()=>{return}}/>
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
