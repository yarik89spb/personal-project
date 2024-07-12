import { useNavigate } from "react-router-dom";
import './NotFound.css'

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className='container not-found'>
      <h3 className="error-404"> 404 </h3>
      <p className="page-not-found"> 該網頁不存在... </p>
      <button className="btn back-main-page" onClick={()=>navigate('/')}>Main page</button>
    </div>
  )
}

export default NotFound;