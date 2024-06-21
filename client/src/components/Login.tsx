import { useContext } from "react"
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext"


export default function Login(){
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login();
    navigate('/host');
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Username'
        />
        <input
          type='password'
          placeholder='Password'
        />
        <button type='submit'> Login </button>
      </form>
    </div>
  )
}