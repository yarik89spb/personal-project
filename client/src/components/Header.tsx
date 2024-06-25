import './Header.css';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from '../context/AuthContext';

export default function Header(){
  const {isLogined, userId} = useContext(AuthContext);
  const navigate = useNavigate();

  const handleNavClick = (page:string) => {
    if(page==='profile'){
      if(isLogined && userId){
        navigate(`/${page}/${userId}`)
      }else{
        navigate('/login')
      }
    }else{
      navigate(`/${page}`)
    }
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="#">
            <img src='/public/project-logo-no-bg.png' alt="Logo" className="nav-logo d-inline-block align-top mr-2" />
          </a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a className="nav-link" href="" onClick={()=>handleNavClick('')}>Main page</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href=""  onClick={()=>handleNavClick('profile')}>User profile</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}