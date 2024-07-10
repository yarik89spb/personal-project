import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '/public/project-logo-no-bg.png';
import './Welcome.css';

export default function WelcomePage(){
  const { isLogined, userId, userEmail, userName } = useContext(AuthContext);
  const [isViewer, setIsViewer] = useState(false);
  const navigate = useNavigate();


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

  function joinEventWindow(){
    return (
      <div className='join-room'>
        <div className='join input-group'>
          <input type='text' placeholder='Event ID or Link' className='join input'/>
          <button type='button' className='join button'>Join</button>
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
      <h3>Getting started</h3>
        <div className='row welcome-options'>
          <div className='col-md-6 mb-3'>
            <div className='box p-3 d-flex flex-column align-items-center justify-content-center'>
              <button type='button'
              className='btn btn-primary mb-2'
              onClick={handleHostClick}>I AM HOST</button>
              <div className='welcome selection-text'>創建一個活動並向觀眾直播。需要登入</div>
            </div>
          </div>
          <div className='col-md-6 mb-3'>
            <div className='box p-3 d-flex flex-column align-items-center justify-content-center'>
              <button type='button'
              className='btn btn-primary mb-2'
              onClick={handleViewerClick}>I AM VIEWER </button>
              <div className='welcome selection-text'>立即加入由主持人組織的活動</div>
            </div>
          </div>
      </div>
      {isViewer &&  joinEventWindow()}
    </div>
  )
}