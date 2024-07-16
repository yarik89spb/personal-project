import { useState, useEffect } from 'react';
import { useSocket, useMessageListener, sendCommand, useAnswerListener, useEmojiListener, useRoomListener, useNicknameListener } from '../utils/websocket';
import { useParams } from 'react-router-dom';
import EventScreen from './EventScreen';
import ChatComments from './ChatComments';
import ViewerList from './ViewerList.tsx';
import ConfirmationModal from './ConfirmationModal.tsx';
import { Option,  Comment, Emoji, Viewer } from '../utils/interfaces.ts';
import { fetchComments, fetchViewers, changeOnlineStatus, isOnline, fetchProjectData } from '../utils/fetchFunctions.ts';
import { useCookies } from 'react-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HostView.css';
import CopyLink from './CopyLink.tsx';
import ReactionButtons from './ReactionButtons.tsx';
import TypingText from './TypingText.tsx';

function HostView(){
  let userComments = [
    {userName:'Bot', text:'請大家盡量留言和回答問題', questionId: 11}
  ];

  const { projectId } = useParams<{ projectId: string }>();
  const [cookies]  = useCookies(['jwt'])
  if (!projectId) {
    throw new Error('Project ID is required');
  }

  const [online, setOnline] = useState(false);
  const [tickerText, setTickerText] = useState('Meeting is offline. Click「START」to go online');
  const [showModal, setShowModal] = useState(false);
  const [hostPanel, setHostPanel] = useState('comments');
  const [projectData, setProjectData] = useState({
    projectName: 'Missing',
    projectId: null,
    description: String,
    questions:[],
    keyWordsEng: [String],
    keyWordsCn: [String]});
  const [questionIndex, setQuestionIndex] =  useState(0);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [viewersArray, setViewers] = useState<Viewer[]>([]);
  const [commentsArray, setComments] =  useState<Comment[]>(userComments);
  const [answersArray, setAnswers] =  useState<Option[]>([]);
  const [hostId, setHostId ] = useState<string | null>(null);
  const socket = useSocket(`${import.meta.env.VITE_API_BASE_URL}`, projectId, 'HOST');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  /* Project data rendering and broadcasting */

  useEffect(() => {
    async function fetchData(){
      try{
        const currentOnlineStatus = await isOnline(projectId);
        setOnline(currentOnlineStatus.isBroadcasting)
        if(currentOnlineStatus.isBroadcasting){
          setTickerText(`Meeting is online。Click「Share Screen」to show the question`)
        }
        const newProjectData = await fetchProjectData(projectId);
        setIsLoadingQuestions(false);
        setProjectData(newProjectData);
        const commentsData = await fetchComments(projectId) as Comment[];
        setComments(commentsData);
      } catch(error){
        console.error(`Failed to fetch piece of data. ${error}`)
        setIsLoadingQuestions(false);
      } finally{
        const viewersData = await fetchViewers(projectId);
        setHostId(viewersData.hostId);
        setViewers(viewersData.data);
        console.log('Data loading has finished...')
      }
    }
    fetchData();
    
  }, [])

  async function toggleOnline(status: boolean){
    const jwt = cookies.jwt;
    const currentOnlineStatus = await changeOnlineStatus(jwt, projectId, status);
    if(currentOnlineStatus === true){
      setOnline(true)
      setTickerText(`Meeting is online。Click「Share Screen」to show the question`)
      console.log(`You're on the air! Now everyone can join ${projectData.projectName}`);
    } else if(currentOnlineStatus === false) {
      setOnline(false)
      setTickerText(`Meeting is offline. Click「START」to go online`)
      console.log(`${projectData.projectName} is offline`);
    }
  }

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
  }, [questionIndex]);

  const toggleView = (event: any) => {
    const newPanel= event.target.getAttribute('data-view');
    setHostPanel(newPanel);
  };

  function handleBroadcastingState(){
    if(!isBroadcasting){
      sendCommand(socket, 'startBroadcasting', {
        roomId: projectId,
        passedData: projectData.questions[questionIndex]})
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
    if(isBroadcasting){
      setTimeout(() => {
        sendCommand(socket, 'getCurrentQuestion', {
          roomId: projectId,
          passedData: projectData.questions[questionIndex]
        })
      } , 2000) 
    }
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
        <div>Answers submitted:&nbsp;</div>
        <div>{answersArray.length}</div>
      </div>
    )
  }
  return (
    <div className='container'>
      <div className='upper-bar'>
        {/* <button className='btn btn-primary mr-2 back' onClick={() => handleBackClick()}> Back to Profile</button> */}
        {online? <div className='container toggle-online'> 
          <button className='btn toggle-online stop'
            onClick={() => setShowModal(true)}>STOP</button>
          <ConfirmationModal
            show={showModal}
            onConfirm={() => {toggleOnline(false); setShowModal(false)}}
            onCancel={() => setShowModal(false)}
            message="Are you sure you want to stop event?"
          />
          <div className='magic-dust'></div>
        </div> 
        : 
        <div className='container toggle-online'> 
          <button className='btn toggle-online start'
          onClick={() => setShowModal(true)}>START</button>
          <ConfirmationModal
            show={showModal}
            onConfirm={() => {toggleOnline(true); setShowModal(false)}}
            onCancel={() => setShowModal(false)}
            message="Are you sure you want to start event?"
          /> 
        </div>}
        <div className='hint-container'>
          <TypingText text={tickerText}/> 
        </div>
      </div> 
      <CopyLink link={`/guest/${projectId}`}/> 
      <div className='row'>
      <div className='col-md-6'>
          <div className='sharing-status row'>
            {isBroadcasting ? <div className='col-md-2 status-content show-questions'> Viewers CAN see the questions </div> :
            <div className='col-md-2 status-content hide-questions'> Viewers can NOT see the questions </div> }
            
          </div>
          <div className={`host-event-screen ${isBroadcasting?'sharing-screen-border' : ''}`}>
            {isLoadingQuestions === false && (
                <EventScreen
                  question={projectData.questions[questionIndex]}
                  onOptionClick={() => {
                    return;
                  }}
                />
              )
            }
            < ReactionButtons handleEmojiClick={handleEmojiClick} selectedEmoji={selectedEmoji}/>
            {renderAnswers()}
          </div>
        <div className="d-flex justify-content-center btn-group-bar">
          <div className="btn-group" role="group" aria-label="Control Buttons">
            <button type="button" className="btn btn-primary btn-lg mx-2 flow-control-button" onClick={() => handleQuestionIndexChange(false)}>
              &lt;
            </button>
            {!isBroadcasting ? <button type="button" className="btn btn-success btn-lg mx-2 flow-control-button" onClick={() => handleBroadcastingState()}>
              Show Questions
            </button>
            :
            <button type="button" className="btn btn-danger btn-lg mx-2 flow-control-button" onClick={() => handleBroadcastingState()}>
            Hide Questions
            </button>}
            <button type="button" className="btn btn-primary btn-lg mx-2 flow-control-button" onClick={() => handleQuestionIndexChange(true)}>
              &gt;
            </button>
          </div>
        </div>
        </div>
        <div className='col-md-6'>
            {hostPanel === 'comments' ? (
              <div className='card host-panel' > 
                <h3 className='card-header' >User comments:</h3>
                <ChatComments comments={commentsArray}/>
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
            <div>
          </div>
        </div>
      </div>
    </div> 
  )
}

export default HostView
