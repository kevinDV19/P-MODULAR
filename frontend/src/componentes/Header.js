import { Link } from 'react-router-dom';

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-transparent shadow">
      <div className="container">
        <Link className="navbar-brand" to="/" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
          Adógtame
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                <button className="btn btn-outline-primary">
                  Login
                </button>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/signup">
                <button className="btn btn-primary">
                  Sign Up
                </button>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;