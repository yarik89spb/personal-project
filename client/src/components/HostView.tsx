import { Fragment, useState, useRef, useEffect} from 'react';
import io, { Socket } from 'socket.io-client';

function HostView(){
  let userComments = [
    {author: 'John', content:'Hi'},
    {author:'Amy', content:'Wow'}, 
    {author:'Bot', content:'Greeting'}
  ];

  const [commentsArray, setComments] =  useState(userComments);
  const socket = useRef<Socket>();
  
  useEffect(() => {
    socket.current = io('http://localhost:3000/');
    socket.current.on('connect', () => {
      console.log('Connected to WebSocket server!');
    });

    socket.current.on('testMessage', (message)=>{
      console.log(message)
      addMessageToChat({author:'user', content: message});
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };

  }, []);

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

  useEffect(() => { 
    renderComments(commentsArray);
  }, [commentsArray]);
  
  return (
    <>
      <div className='container-sm' id='comments-container'>
        <h3>User comments:</h3>
        {renderComments(commentsArray)}
      </div>
    </>
  )
}

export default HostView
