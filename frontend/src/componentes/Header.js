import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const storedUsername = localStorage.getItem('username');
    
    if (isAuthenticated && storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    localStorage.setItem('isAuthenticated', 'false');
    navigate('/'); 
  };

  return (
    <Navbar expand="lg" className="bg-transparent shadow">
      <div className="container">
        <Link className="navbar-brand" to="/" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
          <img
            src="/logo-header.png"
            alt="logo"
            className="img-fluid"
            style={{ maxWidth: '200px', height: 'auto' }}
          />
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {isAuthenticated ? (
              <NavDropdown
                title={<span style={{ fontSize: '1.15rem', fontWeight: 'bold' }}>Hola, {username}</span>}
                id="basic-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/profile" className="d-flex align-items-center">
                  <FaUser className="me-2" /> Mi Perfil
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout} className="d-flex align-items-center">
                  <FaSignOutAlt className="me-2" /> Salir
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Item>
                  <Link className="nav-link" to="/login">
                    <Button variant="outline-primary">Login</Button>
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link className="nav-link" to="/register">
                    <Button variant="primary">Sign Up</Button>
                  </Link>
                </Nav.Item>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}

export default Header;