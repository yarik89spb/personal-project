import { useState, useEffect } from 'react';
import { useSocket, useMessageListener, sendCommand, useAnswerListener, useEmojiListener, useRoomListener, useNicknameListener } from '../utils/websocket';
import { useParams } from 'react-router-dom';
import EventScreen from './EventScreen';
import ChatComments from './ChatComments';
import ViewerList from './ViewerList.tsx';
import { Option,  Comment, Emoji, Viewer } from '../utils/interfaces.ts';
import { fetchComments, fetchViewers } from '../utils/fetchFunctions.ts';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HostView.css';
import CopyLink from './CopyLink.tsx';
import ReactionButtons from './ReactionButtons.tsx';

function HostView(){
  let userComments = [
    {userName:'Bot', text:'請大家盡量留言和回答問題', questionId: 11}
  ];

  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    throw new Error('Project ID is required');
  }

  const [hostPanel, setHostPanel] = useState('comments');
  const [projectData, setProjectData] = useState({
    projectName: 'Missing',
    projectId: null,
    questions:[]});
  const [questionIndex, setQuestionIndex] =  useState(0);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [viewersArray, setViewers] = useState<Viewer[]>([]);
  const [commentsArray, setComments] =  useState<Comment[]>(userComments);
  const [answersArray, setAnswers] =  useState<Option[]>([]);
  const [hostId, setHostId ] = useState<string | null>(null);
  const socket = useSocket(`${import.meta.env.VITE_API_BASE_URL}`, projectId, 'HOST');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("");
  /* Project data rendering and broadcasting */

  useEffect(() => {
    async function fetchData(){
      try{
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/project-data?projectId=${projectId}`)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const newProjectData = await response.json();
        setIsLoadingQuestions(false);
        setProjectData(newProjectData.data);
        const viewersData = await fetchViewers(projectId);
        setHostId(viewersData.hostId);
        setViewers(viewersData.data);
        const commentsData = await fetchComments(projectId) as Comment[];
        setComments(commentsData);
      } catch(error){
        console.error(`Failed to get project data. ${error}`)
        setIsLoadingQuestions(false);
      } finally{
        console.log('Data loading has finished...')
      }
    }
    fetchData();
    
  }, [])

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

  function changeScreen(){
    sendCommand(socket, 'changeScreen', {
      roomId: projectId,
      passedData: projectData.questions[questionIndex]
    })
  }

  useEffect(() => {
    if(isBroadcasting){
      changeScreen();
    }
    setAnswers([]);
    console.log(hostId)
  }, [questionIndex]);

  const toggleView = (event: any) => {
    const newPanel= event.target.getAttribute('data-view');
    setHostPanel(newPanel);
  };

  function handleBroadcastingState(){
    if(!isBroadcasting){
      sendCommand(socket, 'startBroadcasting', {
        roomId: projectId,
        passedData:{}})
      changeScreen()
      setIsBroadcasting(true);
    }else{
      sendCommand(socket, 'stopBroadcasting', {
        roomId: projectId,
        passedData:{}})
      setIsBroadcasting(false);
    }
  }


  /* Receiving viewers' comments and reactions */

  function addViewerToList(viewer: Viewer){
    setViewers((currentViewers) => [...currentViewers, viewer]);
  }

  function removeViewerFromList(id:string){
    setViewers((currentViewers) => [...currentViewers.filter((v) => {
      return v.id != id})]);
  }

  useEffect(() => {
    console.log(viewersArray)
    console.log(hostId)
  }, [viewersArray])

  useRoomListener(socket, 'joinRoom', (viewer: Viewer) => {
    console.log(`User ${viewer.userName} joined the room`)
    if(hostId===null){
      setHostId(viewer.id);
    }
    addViewerToList(viewer)});

  useNicknameListener(socket, 'userNameChange', (usernameData) => {
    removeViewerFromList(usernameData.id)
    addViewerToList({
      id: usernameData.id,
      userName: usernameData.newUsername,
      isBot: false
    })
    console.log(`User ${usernameData.oldUsername} changed username to ${usernameData.newUsername}`)
  });

  useRoomListener(socket, 'leaveRoom', (viewer: Viewer) => {
    console.log(`User ${viewer.userName} left the room`)
    removeViewerFromList(viewer.id)});

  useMessageListener(socket, 'viewerMessage', (message: Comment) => {
    addMessageToChat({
      userName: message.userName, 
      text: message.text, 
      questionId: message.questionId });
  });

  function addMessageToChat(comment: Comment){
    setComments((prevComments) => [...prevComments, comment]);
  }

  useAnswerListener(socket, 'userAnswer', (userAnswer:Option) => {
    setAnswers((prevAnswers) => [...prevAnswers, userAnswer]);
    renderAnswers();
  });

  const handleEmojiClick = (emoji: string) => {
    setSelectedEmoji(emoji);
    setTimeout(() => setSelectedEmoji(''), 1000); // Reset the selected emoji after animation
  };

  useEmojiListener(socket, 'userEmoji', (emojiData:Emoji) => {
    handleEmojiClick(emojiData.type);
    setTimeout(() => setSelectedEmoji(''), 1000);
  });

  function renderAnswers(){
    return(
      <div className='answer-counter'>
        <div>Answers submitted</div>
        <div>{answersArray.length}</div>
      </div>
    )
  }
  return (
    <div className='container'> 
      <CopyLink link={`/guest/${projectId}`}/>
      <div className='row'>
        <div className='col-md-6'>
  
            {hostPanel === 'comments' ? (
              <div className='card host-panel' > 
                <h3 className='card-header' >User comments:</h3>
                <div className='card-body' style={{ height: '300px', maxHeight: '300px', overflowY: 'auto' }}>
                  <ChatComments comments={commentsArray}/>
                </div>
              </div>
            ) : (
              <div className='card host-panel' > 
                <h3 className='card-header' >Viewers:</h3>
                <div className='card-body' style={{ height: '300px', maxHeight: '300px', overflowY: 'auto' }}>
                  <ViewerList viewers={viewersArray} hostId={hostId}/>
                </div>
              </div>
            )}
            <button type='button'
            className='btn host-panel-toggle' 
            data-view='comments' 
            onClick={toggleView}
            >Comments</button>
            <button type='button'
            className='btn host-panel-toggle'  
            data-view='viewers' 
            onClick={toggleView}
            >Viewers</button>
        </div>
        <div className='col-md-6'>
          <div className='event-screen'>
            {isLoadingQuestions === false && (
                <EventScreen
                  question={projectData.questions[questionIndex]}
                  onOptionClick={() => {
                    return;
                  }}
                />
              )
            }
          </div>
          <div>
            {renderAnswers()}
          </div>
          < ReactionButtons handleEmojiClick={handleEmojiClick} selectedEmoji={selectedEmoji}/>
        </div>
      </div>
      <div className="d-flex justify-content-center">
      <div className="btn-group" role="group" aria-label="Control Buttons">
        <button type="button" className="btn btn-primary btn-lg mx-2" onClick={() => handleQuestionIndexChange(false)}>
          &lt;
        </button>
        <button type="button" className="btn btn-success btn-lg mx-2" onClick={() => handleBroadcastingState()}>
          Start
        </button>
        <button type="button" className="btn btn-danger btn-lg mx-2" onClick={() => handleBroadcastingState()}>
          Stop
        </button>
        <button type="button" className="btn btn-primary btn-lg mx-2" onClick={() => handleQuestionIndexChange(true)}>
          &gt;
        </button>
      </div>
    </div>
    </div> 
  )
}

export default HostView
