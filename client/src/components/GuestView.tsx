import { useState, useEffect, ChangeEvent } from 'react';
import { useSocket, sendMessage, sendUserAnswer, useCommandListener } from '../utils/websocket';
import EventScreen from './EventScreen';
import ChatComments from './ChatComments';
import AlwaysScrollToBottom from './AlwaysScrollToBottom';
import './GuestView.css'
import { Option, Question, Answer } from '../utils/interfaces.ts';

function GuestView() {
  let userComments = [
    {author: 'John', content:'Hi'},
    {author:'Amy', content:'Wow'}, 
    {author:'Bot', content:'Greeting'}
  ];

  const [commentsArray, setComments] =  useState(userComments);
  const [userMessageInput, setUserMessageInput] = useState('');
  const [currentScreen, setCurrentScreen] = useState<Question>({
    id: 0,
    title: 'placeholder',
    content: 'Please, stand by...',
    options: []
  });
  const [isHidden, setIsHidden] = useState(true);


  const socket = useSocket('http://localhost:3000/'); 

  function addMessageToChat(){
    let commentsArrayUpdated = [...commentsArray]
    commentsArrayUpdated.push({
      author: 'user', 
      content:userMessageInput
    });
    const commentObj = {
      userName: 'user',
      questionId: currentScreen.id,
      text: userMessageInput
    }; 
    setComments(commentsArrayUpdated);
    setUserMessageInput('');
    sendMessage(socket, 'viewerMessage', commentObj);
  }

  function storeUserMessageInput(e: ChangeEvent<HTMLInputElement>){
    setUserMessageInput(e.target.value);
  }

  function sendUserAnswerToServer(answer:Option){
    sendUserAnswer(socket, 'userAnswer', {
      id: currentScreen.id, 
      title: currentScreen.title,
      userAnswer: answer});
  }

  /* Commands from host */

  useCommandListener(socket, 'changeScreen', (passedData: object) => {
    const questionData = passedData as Question;
    setCurrentScreen(questionData);
  });

  useCommandListener(socket, 'stopBroadcasting', () => {
    setIsHidden(true);
  });

  useCommandListener(socket, 'startBroadcasting', () => {
    setIsHidden(false);
  });
  

  return (
      <div className='container' id='chat-container'>
        <div className={isHidden? 'd-none': 'none'}>
          <EventScreen question={currentScreen} onOptionClick={sendUserAnswerToServer}/>
        </div>
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