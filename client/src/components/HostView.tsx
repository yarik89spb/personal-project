import { Fragment, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

function HostView(){
  let userComments = [
    {author: 'John', content:'Hi'},
    {author:'Amy', content:'Wow'}, 
    {author:'Bot', content:'Greeting'}
  ];
  
  return (
    <>
      <div className='container-sm' id='comments-container'>
        <h3>User comments:</h3>
        <ul className='list-group list-group-numbered"'>
          {userComments.map((comment, index) => (
            <li key={index} className='list-group-item d-flex justify-content-between align-items-start'>
              <div>{comment.author}</div>
              <div>{comment.content}</div>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default HostView
