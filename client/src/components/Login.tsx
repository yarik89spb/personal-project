import { useContext, useState, ChangeEvent } from "react"
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext"
import './Login.css'


export default function Login(){
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [hasAccount, setHasAccount] = useState(true);
  const [email, setEmail] = useState('host@mail.com');
  const [password, setPassword] = useState('ilovetaiwan');
  
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: email,
          userPassword: password
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
      navigate(`/profile/${userData.userId}`);
    } catch(error: any) {
      console.error('Login error:', error);
      setError(error.message as string)
    }
  }

  return (
    <div className='login-container'>
      <h4>Login</h4>
      <form onSubmit={handleLogin} className="login-form">
        {error && <p> {error} </p>}
        <input
          type='text'
          placeholder='E-mail'
          name='userEmail'
          className="form-control mb-2 credentials"
          value={email}
          onChange={handleEmailChange}
        />
        <input
          type='password'
          placeholder='Password'
          name='userPassword'
          className="form-control mb-2 credentials"
          value={password}
          onChange={handlePasswordChange}
        />
        <button type='submit' className="btn btn-primary btn-block submit-credentials"> Login </button>
      </form>
      <div className="text-center mt-3">
        <button
        type='button'
        className="btn btn-link create-account"
        onClick={showRegistrationForm}>
          Create account
        </button>
      </div>
      {!hasAccount &&
        <form className="register-form" onSubmit={handleRegistration}>
          <input
            type='text'
            placeholder='E-mail'
            name='userEmail'
            className="form-control mb-2 credentials"
            required
          />
          <input
            type='text'
            placeholder='Username'
            name='userName'
            className="form-control mb-2 credentials"
          />
          <input
            type='text'
            placeholder='Company name'
            name='userCompany'
            className="form-control mb-2 credentials"
          />
          <input
            type='password'
            placeholder='Password'
            name='userPassword'
            className="form-control mb-2 credentials"
            required
          />
          <button type='submit' className="btn btn-primary btn-block submit-credentials"> Register </button>
        </form>
      }
    </div>
  )
}