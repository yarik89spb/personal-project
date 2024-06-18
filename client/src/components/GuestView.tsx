import { useState, ChangeEvent } from 'react';
import { 
  useSocket, 
  sendMessage, 
  sendUserAnswer, 
  useCommandListener,
  sendUserEmoji } from '../utils/websocket';
import EventScreen from './EventScreen';
import ChatComments from './ChatComments';
import AlwaysScrollToBottom from './AlwaysScrollToBottom';
import './GuestView.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { Option, Question, Comment } from '../utils/interfaces.ts';

function GuestView() {
  let userComments = [
    {userName: 'John', text:'Hi', questionId: 11},
    {userName:'Amy', text:'Wow', questionId: 11}, 
    {userName:'Bot', text:'Greeting', questionId: 11}
  ];

  const [commentsArray, setComments] =  useState<Comment[]>(userComments);
  const [userMessageInput, setUserMessageInput] = useState('');
  const [currentScreen, setCurrentScreen] = useState<Question>({
    id: 0,
    title: 'placeholder',
    content: 'Please, stand by...',
    options: []
  });
  const [isHidden, setIsHidden] = useState(true);
  const [selectedEmoji, setSelectedEmoji] = useState("");


  const socket = useSocket('http://localhost:3000/'); 

  function addMessageToChat(){
    let commentsArrayUpdated = [...commentsArray]
    commentsArrayUpdated.push({
      userName: 'user', 
      text: userMessageInput,
      questionId: currentScreen.id
    });
    const commentObj: Comment = {
      userName: 'user',
      questionId: currentScreen.id,
      text: userMessageInput
    }; 
    setComments(commentsArrayUpdated);
    setUserMessageInput('');
    console.log(commentObj)
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

  const handleEmojiClick = (emoji: string) => {
    sendUserEmoji(socket, 'userEmoji', emoji)
    setSelectedEmoji(emoji);
  };

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
          <h3 className='card-header chat'>Chat:</h3>
          <div className='card-body' style={{ height: '400px', maxHeight: '400px', overflowY: 'auto' }} id='comments-container'>
            <AlwaysScrollToBottom>
              <ChatComments comments={commentsArray}/>
            </AlwaysScrollToBottom>
          </div>

          
          <div className='card-footer chat'>
            <div className='reaction-buttons'>
              <button className={`reaction-button ${selectedEmoji=== 'heart' ? 'selected' : ''}`} onClick={() => handleEmojiClick('heart')}>
                <FontAwesomeIcon icon={faHeart} />
              </button>
              <button className={`reaction-button ${selectedEmoji === 'like' ? 'selected' : ''}`} onClick={() => handleEmojiClick('like')}>
                <FontAwesomeIcon icon={faThumbsUp} />
              </button>
              <button className={`reaction-button ${selectedEmoji === 'dislike' ? 'selected' : ''}`} onClick={() => handleEmojiClick('dislike')}>
                <FontAwesomeIcon icon={faThumbsDown} />
              </button>
              {/* Add more reaction buttons as needed */}
            </div>             

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