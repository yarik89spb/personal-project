import { useState, ChangeEvent, useEffect } from 'react';
import { 
  useSocket, 
  sendMessage, 
  sendUserAnswer, 
  useCommandListener,
  sendUserEmoji, 
  useMessageListener,
  reportUsernameChange,
  useRoomListener,
  useNicknameListener} from '../utils/websocket';
import EventScreen from './EventScreen';
import ChatComments from './ChatComments';
import './GuestView.css'
import { EventPayload, Option, Question, Comment, Emoji, Viewer } from '../utils/interfaces.ts';
import { fetchComments, fetchViewers } from '../utils/fetchFunctions.ts';
import { useParams } from 'react-router-dom';
import standBy from '/public/stand-by.jpg';
import { useCookies } from 'react-cookie';
import ReactionButtons from './ReactionButtons.tsx';
import ViewerList from './ViewerList.tsx';

function GuestView() {
  let userComments = [
    {userName:'Bot', text:'請大家盡量留言和回答問題', questionId: 11} 
  ];
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    throw new Error('Project ID is required');
  }

  const [hostId, setHostId ] = useState<string | null>(null);
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
  const [userNickname, setUserNickname] = useState('Viewer')
  const [userNicknameInput, setUserNicknameInput] = useState('Viewer');
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [viewersArray, setViewers] = useState<Viewer[]>([])
  const [cookies, setCookie]  = useCookies(['userNickname']); // , removeCookie]

  const socket = useSocket(`${import.meta.env.VITE_API_BASE_URL}`, projectId, userNickname);
  
  async function fetchData(){
    try{
        const viewersData = await fetchViewers(projectId);
        setHostId(viewersData.hostId);
        setViewers(viewersData.data);
        const commentsData = await fetchComments(projectId) as Comment[];;
        setComments(commentsData);
      } catch(error){
        console.error(`Failed to get comments. ${error}`)
      }
    }

  useEffect(()=>{
    fetchData().then(()=>{
      const selectedNickname = cookies.userNickname;
      if(selectedNickname){
        setUserNickname(selectedNickname);
        setUserNicknameInput(selectedNickname);
        const eventPayload = {
          roomId: projectId,
          passedData: {oldUsername: userNickname, newUsername: selectedNickname}
        };
        reportUsernameChange(socket, 'userNameChange', eventPayload);
      }
    })
  }, [])

  function addViewerToList(viewer: Viewer){
    setViewers((currentViewers) => [...currentViewers, viewer]);
  }

  function removeViewerFromList(id:string){
    setViewers((currentViewers) => [...currentViewers.filter((v) => {
      return v.id != id})]);
  }

  useRoomListener(socket, 'joinRoom', (viewer: Viewer) => {
    addViewerToList(viewer)});

  useRoomListener(socket, 'leaveRoom', (viewer: Viewer) => {
    removeViewerFromList(viewer.id)});
  

  function addMessageToChat(){
    if(userMessageInput.length > 0){
      const commentObj: Comment = {
        userName: userNickname,
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

  function UserNickname(){
    const nicknameLayout = (
      isEditingNickname ? 
        <div className='user-nickname-input'>
            <input
              type='text'
              placeholder="Choose nickname"
              className='nickname-input'
              value={userNicknameInput}
              onChange={(e) => setUserNicknameInput(e.target.value)}
            />
            <button type='button'
            className='btn btn-primary save-nickname'
            onClick={()=>{
              saveUserNickName()
              setIsEditingNickname(false)
            }}
            >
            Save
            </button> 
          </div>
          : 
          <div className='user-nickname-display'>
            <div className='user-nickname-text'> {userNickname} </div>
            <button type='button'
            className='btn btn-primary edit-nickname'
            onClick={()=>setIsEditingNickname(true)}
            >
            Edit
            </button>
          </div>
    )

    return (
      <div className='user-nickname input-group'>
        {nicknameLayout}
      </div>
    )
  }

  function storeUserMessageInput(e: ChangeEvent<HTMLInputElement>){
    setUserMessageInput(e.target.value);
  }

  function saveUserNickName(){
    setUserNickname(userNicknameInput);
    setCookie('userNickname', userNicknameInput, { path: `/guest/${projectId}` });
    const eventPayload = {
      roomId: projectId,
      passedData: {oldUsername: userNickname, newUsername: userNicknameInput}
    };
    if(userNickname !== userNicknameInput){
      reportUsernameChange(socket, 'userNameChange', eventPayload);
    }
  }

  useNicknameListener(socket, 'userNameChange', (usernameData) => {
    removeViewerFromList(usernameData.id)
    addViewerToList({
      id: usernameData.id,
      userName: usernameData.newUsername,
      isBot: false
    })
    console.log(`User ${usernameData.oldUsername} changed username to ${usernameData.newUsername}`)
  });

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

  const handleEmojiClick = (emoji: string, isPositive: boolean) => {
    const eventPayload = {
      roomId: projectId,
      passedData: {
        userName: userNicknameInput,
        questionId: currentScreen.id,
        type:emoji,
        isPositive} as Emoji
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

  useCommandListener(socket, 'getCurrentQuestion', (passedData: object) => {
    if(!currentScreen || currentScreen.id === 0){
      const questionData = passedData as Question;
      setCurrentScreen(questionData);
      setIsHidden(false);
    }
  });
  

  return (
      <div className='container' id='chat-container'>
        <button id="go-to-top">Go to bottom</button>
        <div className="tv-box">
          {isHidden?
          <div id='stand-by'>
            <img src={standBy} className="centered-image" />
          </div> 
          : 
          <EventScreen question={currentScreen} onOptionClick={sendUserAnswerToServer}/>
          }
        </div>

        <div className='card'>
          <h3 className='card-header chat'>Chat:</h3>
          <div className='card-body'>
          <div className='row'>
            <ChatComments comments={commentsArray} />
            <div className='col-4' id='viewers-container' style={{ height: '400px', maxHeight: '400px', overflowY: 'auto' }}>
              <ViewerList viewers={viewersArray} hostId={hostId}/>
            </div>
          </div>
        </div>
          <div className='card-footer chat'>
            < ReactionButtons handleEmojiClick={handleEmojiClick} selectedEmoji={selectedEmoji}/>
            {UserNickname()}

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