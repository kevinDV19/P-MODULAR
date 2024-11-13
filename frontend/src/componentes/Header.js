import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Button, Badge, Dropdown } from 'react-bootstrap';
import { FaUser, FaSignOutAlt, FaBell, FaTimes } from 'react-icons/fa';
import { useAuth } from './authContext';

function Header() {
  const { isAuthenticated, userFirstName, logout, fetchWithAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetchWithAuth('http://localhost:8000/api/notifications/');
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error al cargar las notificaciones:', error);
      }
    };

    if (isAuthenticated) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [fetchWithAuth, isAuthenticated]);
  

  const handleLogout = () => {
    logout();
    if (location.pathname === '/') {
      window.location.reload();
    } else {
      navigate('/');
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetchWithAuth(`http://localhost:8000/api/notifications/${notificationId}/mark-as-read/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_read: true }),
      });

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId ? { ...notification, is_read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error al marcar la notificación como leída:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await fetchWithAuth(`http://localhost:8000/api/notifications/${notificationId}/delete/`, {
        method: 'DELETE',
      });

      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== notificationId)
      );
    } catch (error) {
      console.error('Error al eliminar la notificación:', error);
    }
  };

  const unreadNotifications = Array.isArray(notifications) ? notifications.filter((n) => !n.is_read) : [];
  const readNotifications = Array.isArray(notifications) ? notifications.filter((n) => n.is_read) : [];
  const unreadCount = unreadNotifications.length;

  return (
    <Navbar expand="lg" className="bg-transparent shadow">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
          <img
            src="/logo-header.png"
            alt="logo"
            className="img-fluid me-2"
            style={{ maxWidth: '200px', height: 'auto' }}
          />
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Item>
              <Nav.Link as={Link} to="/user/my-adoption-requests" className="text-uppercase fw-bold">
                Mis Solicitudes de Adopción
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/pet/register" className="text-uppercase fw-bold">
                Registrar Mascota
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Nav className="ms-auto">
            {isAuthenticated && (
            <Dropdown show={showDropdown} onToggle={() => setShowDropdown(!showDropdown)} align="end">
              <Dropdown.Toggle as="span" className="nav-link position-relative" role="button" style={{ cursor: 'pointer' }}>
                <FaBell style={{ fontSize: '1.5rem' }} />
                {unreadCount > 0 && (
                  <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                    {unreadCount}
                  </Badge>
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-end" style={{ minWidth: '300px' }}>
                <h6 className="dropdown-header">Notificaciones No Leídas</h6>
                {unreadNotifications.length === 0 && <span className="dropdown-item text-muted">Sin notificaciones</span>}
                {unreadNotifications.map((notification) => (
                  <Dropdown.Item
                    key={notification.id}
                    className="fw-bold"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="fw-bold">{notification.title} </div>
                    <div className="text-muted small">
                      {new Date(notification.date_sent).toLocaleString()}
                    </div>
                    <span className="d-flex justify-content-between align-items-center">
                      {notification.message}
                    </span>
                  </Dropdown.Item>
                ))}
                <Dropdown.Divider />
                <h6 className="dropdown-header">Notificaciones Leídas</h6>
                {readNotifications.length === 0 && <span className="dropdown-item text-muted">Sin notificaciones leídas</span>}
                {readNotifications.map((notification) => (
                  <Dropdown.Item key={notification.id}>
                    <div className="fw-bold">{notification.title}</div>
                    <div className="text-muted small">
                      {new Date(notification.date_sent).toLocaleString()}
                    </div>
                    <span className="d-flex justify-content-between align-items-center">
                      {notification.message}
                      <FaTimes
                        className="text-danger ms-2"
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      />
                    </span>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>               
            )}
            {isAuthenticated ? (
              <NavDropdown
                title={<span style={{ fontSize: '1.15rem', fontWeight: 'bold' }}>Hola, {userFirstName}</span>}
                id="basic-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/user/profile" className="d-flex align-items-center">
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
