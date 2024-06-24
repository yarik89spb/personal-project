import { useContext, useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext"


export default function Login(){
  const { login, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [hasAccount, setHasAccount] = useState(true);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/signin`, {
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
      const userData = data.user;
      login(userJWT, userData);
      navigate(`/profile/${userData.userId}`);
    } catch(error) {
      console.error('Login error:', error);
      setError(error.message)
    }
  }

  const handleLogout = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    logout();
    navigate('/');
  }

  function showRegistrationForm(){
    setHasAccount(!hasAccount)
  }

  const handleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: e.target.userEmail.value,
          userName: e.target.userName.value,
          userCompany: e.target.userCompany.value,
          userPassword: e.target.userPassword.value,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(`${errorData.text}`);
      }
      const data = await response.json();
      const { userJWT } = data;
      const userData = data.user;
      login(userJWT, userData);
      navigate('/profile');
    } catch(error) {
      console.error('Login error:', error);
      setError(error.message)
    }
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
      <div>
        <button
        type='button'
        onClick={showRegistrationForm}>
          Create account
        </button>
      </div>
      {!hasAccount && <div>
        <form onSubmit={handleRegistration}>
        <input
          type='text'
          placeholder='E-mail'
          name='userEmail'
          required
        />
        <input
          type='text'
          placeholder='Username'
          name='userName'
        />
        <input
          type='text'
          placeholder='Company name'
          name='userCompany'
          required
        />
        <input
          type='password'
          placeholder='Password'
          name='userPassword'
          required
        />
        <button type='submit'> Register </button>
        </form>
      </div>}
    </div>
  )
}