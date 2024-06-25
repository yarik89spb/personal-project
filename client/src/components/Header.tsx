import './Header.css';

export default function Header(){


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
                <a className="nav-link" href="#">Main page</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">User profile</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}