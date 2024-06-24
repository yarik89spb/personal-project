import { useContext } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';


export default function HostProfile(){
  const navigate = useNavigate();
  const { userId } = useParams();
  const { userEmail, userName } = useContext(AuthContext);

  function handleEventStart(){
    navigate('/host')
  }

  return (
    <>
      <h3>Hi, {userName}</h3>
      <h2>Your projects:</h2>
      <div>
        <div>Test project</div>
        <button type='button' onClick={handleEventStart}>Run</button>
      </div>
    </>
  )
}