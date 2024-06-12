import { Fragment, useState, useRef, useEffect} from 'react';
import { useSocket, useMessageListener, sendCommand } from '../utils/websocket';
import EventScreen from './EventScreen';

function HostView(){
  let userComments = [
    {author: 'John', content:'Hi'},
    {author:'Amy', content:'Wow'}, 
    {author:'Bot', content:'Greeting'}
  ];

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
  const socket = useSocket('http://localhost:3000/');
  
  useMessageListener(socket, 'viewerMessage', (message) => {
    addMessageToChat({ author: 'user', content: message });
  });

  

  interface Comment {
    author: string;
    content: string;
  }

  function renderComments(comments: Comment[]){
    return (
      <ul className='list-group list-group-numbered"'>
      {comments.map((comment, index) => (
        <li key={index} className='list-group-item d-flex justify-content-between align-items-start'>
          <div>{comment.author}</div>
          <div>{comment.content}</div>
        </li>
      ))}
    </ul>
    )
  }

  function addMessageToChat(comment: Comment){
    setComments((prevComments) => [...prevComments, comment]);
  }

  function changeScreen(){
    sendCommand(socket, 'changeScreen', testQuestion)
  }

  useEffect(() => { 
    renderComments(commentsArray);
  }, [commentsArray]);
  
  return (
    <div className='container'> 
      <div className='row'>
        <div className='col-md-6'> 
          <div className='container-sm' id='comments-container'>
            <h3>User comments:</h3>
            {renderComments(commentsArray)}
          </div>
        </div>
        <div className='col-md-6'>
          <EventScreen question={testQuestion}/>
        </div>
      </div>
      <button type='button' onClick={()=>changeScreen()}>Start</button>
    </div>
  )
}

export default HostView
