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

  const testProject = {
    projectName: 'Test project',
    questions:[
      {
        id: 1,
        content: '晚餐要吃什麽',
        options: [
          {text:'麥當勞', isCorrect: true},
          {text:'便利商店', isCorrect: false},
          {text:'意麵', isCorrect: false},
          {text:'炒飯', isCorrect: false}
        ]
      }, 
      {
        id: 2,
        content: '最棒的程式語言',
        options: [
          {text:'JavaScript', isCorrect: false},
          {text:'C++', isCorrect: false},
          {text:'Python', isCorrect: true},
          {text:'中文', isCorrect: false}
        ]
      },
      {
        id: 3,
        content: '最偉大的詩人',
        options: [
          {text:'李白', isCorrect: false},
          {text:'毛主席', isCorrect: true},
          {text:'周杰倫', isCorrect: false},
          {text:'蘇軾', isCorrect: false}
        ]
      }
    ]
  }

  const testQuestion = {
    content: '最棒的程式語言',
    options: [
      {text:'JavaScript', isCorrect: false},
      {text:'C++', isCorrect: false},
      {text:'Python', isCorrect: true},
      {text:'中文', isCorrect: false}
    ]
  }

  const [commentsArray, setComments] =  useState(userComments);
  const [questionIndex, setQuestionIndex] =  useState(0);
  const socket = useSocket('http://localhost:3000/');
  
  useMessageListener(socket, 'viewerMessage', (message) => {
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
    sendCommand(socket, 'changeScreen', testProject.questions[questionIndex])
  }

  function handleQuestionIndexChange(isForward = true){
    const maxIndex = testProject.questions.length - 1;
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

  // useEffect(() => { 
  //   renderComments(commentsArray);
  // }, [questionIndex]);
  
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
          <EventScreen question={testProject.questions[questionIndex]}/>
        </div>
      </div>
      <button type='button' onClick={()=>handleQuestionIndexChange()}>Prev</button>
      <button type='button' onClick={()=>changeScreen()}>Start</button>
      <button type='button' onClick={()=>handleQuestionIndexChange()}>Next</button>
    </div> 
  )
}

export default HostView
