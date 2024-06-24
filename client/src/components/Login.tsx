import { useContext, useState } from "react"
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext"


export default function Login(){
  const { login, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/user/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: e.target.userEmail.value,
          userPassword: e.target.userPassword.value,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(`${errorData.text}`);
      }
      const data = await response.json();
      const { userJWT } = data;
      login(userJWT);
      navigate('/profile');
    } catch(error) {
      console.error('Login error:', error);
      setError(error.message)
    }
  }

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/');
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        {error && <p> {error} </p>}
        <input
          type='text'
          placeholder='E-mail'
          name='userEmail'
        />
        <input
          type='password'
          placeholder='Password'
          name='userPassword'
          
        />
        <button type='submit'> Login </button>
      </form>
    </div>
  )
}