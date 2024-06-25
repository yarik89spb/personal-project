import { useContext, useState } from "react"
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext"


export default function Login(){
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [hasAccount, setHasAccount] = useState(true);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      userEmail: { value: string };
      userPassword: { value: string };
    };
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: target.userEmail.value,
          userPassword: target.userPassword.value,
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
    } catch(error: any) {
      console.error('Login error:', error);
      setError(error.message as string)
    }
  }

  // const handleLogout = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   logout();
  //   navigate('/');
  // }

  function showRegistrationForm(){
    setHasAccount(!hasAccount)
  }

  const handleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      userEmail: { value: string };
      userName: { value: string };
      userCompany: { value: string };
      userPassword: { value: string };
    };
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: target.userEmail.value,
          userName: target.userName.value,
          userCompany: target.userCompany.value,
          userPassword: target.userPassword.value,
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
    } catch(error: any) {
      console.error('Login error:', error);
      setError(error.message as string)
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