import { useState, ChangeEvent } from 'react';
import { 
  useSocket, 
  sendMessage, 
  sendUserAnswer, 
  useCommandListener,
  sendUserEmoji, 
  useMessageListener} from '../utils/websocket';
import EventScreen from './EventScreen';
import ChatComments from './ChatComments';
import './GuestView.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { EventPayload, Option, Question, Comment } from '../utils/interfaces.ts';
import { useParams } from 'react-router-dom';
import standBy from '/public/stand-by.jpg';

function GuestView() {
  let userComments = [
    {userName:'Bot', text:'請大家盡量留言和回答問題', questionId: 11} 
  ];
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    throw new Error('Project ID is required');
  }

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
  // const [nickname, setNickname] = useState('Viewer')
  const [userNicknameInput, setUserNicknameInput] = useState('Viewer')

  const socket = useSocket(`${import.meta.env.VITE_API_BASE_URL}`, projectId);
  //const socket = useSocket(''); 

  function addMessageToChat(){
    if(userMessageInput.length > 0){
      const commentObj: Comment = {
        userName: userNicknameInput,
        questionId: currentScreen.id,
        text: userMessageInput
      }; 
      setUserMessageInput('');
      sendMessage(socket, 'viewerMessage', {
        roomId: projectId, 
        passedData: commentObj});
      }
    }

  useMessageListener(socket, 'viewerMessage', (message: Comment) => {
    setComments((prevComments) => [...prevComments, {
      userName: message.userName, 
      text: message.text, 
      questionId: message.questionId }]);
  });

  function storeUserMessageInput(e: ChangeEvent<HTMLInputElement>){
    setUserMessageInput(e.target.value);
  }

  function storeUserNicknameInput(e: ChangeEvent<HTMLInputElement>){
    setUserNicknameInput(e.target.value);
  }

  function sendUserAnswerToServer(answer:Option){
    const eventPayload = {
      roomId: projectId,
      passedData: {
        id: currentScreen.id, 
        title: currentScreen.title,
        userAnswer: answer}
    } as EventPayload
    sendUserAnswer(socket, 'userAnswer', eventPayload);
  }

  const handleEmojiClick = (emoji: string) => {
    const eventPayload = {
      roomId: projectId,
      passedData: emoji
    }
    sendUserEmoji(socket, 'userEmoji', eventPayload)
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
        <div id='stand-by' className={isHidden ? 'none' : 'd-none'}>
          <div className="tv-box">
            <img src={standBy} className="centered-image" />
          </div>
        </div>
        <div className='card'>
          <h3 className='card-header chat'>Chat:</h3>
          <div className='card-body' style={{ height: '400px', maxHeight: '400px', overflowY: 'auto' }} id='comments-container'>
            <ChatComments comments={commentsArray}/>
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
              <div className='user-nickname-input'>
                <input
                  type='text'
                  placeholder="Choose nickname"
                  className='nickname-input'
                  value={userNicknameInput}
                  onChange={(event) => storeUserNicknameInput(event)}
                /> 
              </div>
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