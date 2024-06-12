import { useState, useEffect, ChangeEvent } from 'react';
import { useSocket, sendMessage, useCommandListener } from '../utils/websocket';
import EventScreen from './EventScreen';
import ChatComments from './ChatComments';
import AlwaysScrollToBottom from './AlwaysScrollToBottom';
import './GuestView.css'

function GuestView() {
  let userComments = [
    {author: 'John', content:'Hi'},
    {author:'Amy', content:'Wow'}, 
    {author:'Bot', content:'Greeting'}
  ];

  const [commentsArray, setComments] =  useState(userComments);
  const [userMessageInput, setUserMessageInput] = useState('');
  const [currentScreen, setCurrentScreen] = useState<Question>({
    content: 'Please, stand by...',
    options: []
  });


  const socket = useSocket('http://localhost:3000/'); 

  function addMessageToChat(){
    let commentsArrayUpdated = [...commentsArray]
    commentsArrayUpdated.push({
      author: 'user', 
      content:userMessageInput
    });
    setComments(commentsArrayUpdated);
    setUserMessageInput('');
    sendMessage(socket, userMessageInput);
  }

  interface Option{
    // 一個選擇
    text: string;
    isCorrect: boolean;
  }
  
  interface Question{
    // 題目的問題
    content: string;
    options: Option[];
  }

  useCommandListener(socket, 'changeScreen', (passedData: object) => {
    const questionData = passedData as Question;
    setCurrentScreen(questionData);
  });

  function storeUserMessageInput(e: ChangeEvent<HTMLInputElement>){
    setUserMessageInput(e.target.value);
  }

  return (
      <div className='container' id='chat-container'>
        <EventScreen question={currentScreen} />
        <div className='card'>
          <h3 className='card-header'>Chat:</h3>
          <div className='card-body' style={{ height: '400px', maxHeight: '400px', overflowY: 'auto' }} id='comments-container'>
            <AlwaysScrollToBottom>
              <ChatComments comments={commentsArray}/>
            </AlwaysScrollToBottom>
          </div>
          <div className='card-footer'>
            <div id='messenger' className='input-group'>
              <input
                type='text'
                placeholder="...Type your message"
                className='form-control'
                value={userMessageInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    addMessageToChat();
                  }}
                onChange={(event) => storeUserMessageInput(event)}
              />
              <button
                type='button'
                className='btn btn-primary'
                onClick={()=>addMessageToChat()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
    </div>
  );
}

export default GuestView;