import { useContext } from "react";
import { AuthContext } from '../context/AuthContext';


export default function HostProfile(){
  const { userId, userEmail, userName } = useContext(AuthContext);
  return (
    <>
    <h3>Hi, {userName}</h3>
    <h2>Your projects:</h2>
    <div>
      <div>Test project</div>
      <button type='button'>Run</button>
    </div>
    
    </>
  )
}