import { useNavigate } from 'react-router-dom';

export default function WelcomePage(){
  const navigate = useNavigate();


  const handleHostClick = () => {
    navigate('/host');
  }

  const handleViewerClick = () => {
    navigate('/guest')
  }

  return (
    <div>
      <h2>Welcome to Porko</h2>
      <div>Getting started:</div>
      <div className='box'>
        <button type='button' onClick={handleHostClick}>I am host</button>
        <div>創建一個活動並向觀眾直播。需要登入</div>
      </div>
      <div className='box'>
        <button type='button' onClick={handleViewerClick}>I am viewer</button>
        <div>立即加入由主持人組織的活動</div>
      </div>
    </div>
  )
}