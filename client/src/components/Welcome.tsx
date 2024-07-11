import { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '/public/project-logo-no-bg.png';
import './Welcome.css';

export default function WelcomePage(){
  const { isLogined, userId, userEmail, userName } = useContext(AuthContext);
  const [isViewer, setIsViewer] = useState(false);
  const [eventLinkInput, setEventLinkInput] = useState('');
  const navigate = useNavigate();
  const eventIdRef = useRef<null | HTMLDivElement>(null)


  const handleHostClick = () => {
    console.log(isLogined, userId, userEmail, userName)
    if (isLogined && userId) {
      console.log(isLogined && userId)
      navigate(`/profile/${userId}`);
    } else {
      navigate('/login');
    }
  }

  const handleViewerClick = () => {
    setIsViewer(!isViewer);
  }

  useEffect(() => {
    scrollToBottom();
  }, [isViewer])

  const scrollToBottom = () => {
    eventIdRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  

  const joinRoom = () => {
    if(!eventLinkInput || eventLinkInput.length === 0){
      throw new Error('No event ID entered')
    }

    let eventId;
    if(eventLinkInput.indexOf('/') === -1){
      eventId = eventLinkInput.trim();
    } else {
      const splitItems = eventLinkInput.trim().split('/');
      // Handle case when viewer added / in the end of string
      eventId = splitItems[splitItems.length - 1] !== '' ? splitItems[splitItems.length - 1] : splitItems[splitItems.length - 2]
    }
    navigate(`/guest/${eventId}`)
  }

  function joinEventWindow(){
    return (
      <div className='join-room' ref={eventIdRef}>
        <div className='join input-group'>
          <input 
          type='text'
          onChange={(e)=>{setEventLinkInput(e.target.value)}}
          placeholder='Event ID or Link' 
          className='join input'/>
          <button 
          type='button'
          onClick={joinRoom} 
          className='join button'>Join</button>
        </div>
      </div>
    )
  }

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center">
      <div className='welcome-logo'>
        <img src={logo} alt="Project Logo"></img>
      </div>
      <h2>Welcome to Porko</h2>
      <p className='project-intro'>
        Porko 是一個活動舉辦平台，其目的是通過增加觀眾互動來輔助網路研討會、Workshop、測驗和各類其他會議
      </p>
      <h3>Getting started</h3>
        <div className='row welcome-options'>
          <div className='col-md-6 mb-3'>
            <div className='box p-3 d-flex flex-column align-items-center justify-content-center'>
              <button type='button'
              className='btn btn-primary mb-2 i-am'
              onClick={handleHostClick}>I AM HOST</button>
              <div className='welcome selection-text'>創建一個活動並向觀眾直播。需要登入</div>
            </div>
          </div>
          <div className='col-md-6 mb-3'>
            <div className='box p-3 d-flex flex-column align-items-center justify-content-center'>
              <button type='button'
              className='btn btn-primary mb-2 i-am'
              onClick={handleViewerClick}>I AM VIEWER </button>
              <div className='welcome selection-text'>立即加入由主持人組織的活動</div>
            </div>
          </div>
      </div>
      {isViewer &&  joinEventWindow()}
    </div>
  )
}