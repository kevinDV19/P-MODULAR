import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google'; 
import { useAuth } from './componentes/authContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { fetchWithAuth, login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const data = await response.json();

        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        localStorage.setItem('username', username);

        const profileResponse = await fetchWithAuth('http://localhost:8000/api/user/profile/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          localStorage.setItem('first_name', profileData.nombre);
          localStorage.setItem('user_id', profileData.user);
          login(profileData.nombre);
        } else {
          console.error('Error al obtener el perfil del usuario');
        }
    
        const redirectTo = sessionStorage.getItem('redirectAfterLogin');

        if (redirectTo) {
          sessionStorage.removeItem('redirectAfterLogin');
          navigate(redirectTo);
        } else {
          navigate('/');
        }
      } else{
        throw new Error('Datos Incorrectos');
      }
    } catch (error) {
      setError(error.message);
    }
  };
  
  const handleGoogleSuccess = async (response) => {
    const token = response.credential; 
    try {
      const res = await fetch('http://localhost:8000/api/google/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
  
      if (res.ok) {
        const data = await res.json();

        localStorage.setItem('accessToken', data.access);  
        localStorage.setItem('refreshToken', data.refresh);
        localStorage.setItem('username', data.username);
        localStorage.setItem('first_name', data.first_name);
        localStorage.setItem('user_id', data.user_id);
        login(data.first_name);

        const redirectTo = sessionStorage.getItem('redirectAfterLogin');

        if (redirectTo) {
          sessionStorage.removeItem('redirectAfterLogin');  
          navigate(redirectTo); 
        } else {
          navigate('/');
        }
      } else{
        throw new Error('Error al procesar la solicitud');
      } 
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Google Sign-in Error:', error);
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000); 

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card border-light shadow p-4" style={{ maxWidth: '350px', width: '100%' }}>
        <div className="card-body">
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary">Login</button>
            </div>
          </form>
          <div className="text-center mt-3">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
            />
          </div>

          <div className="text-center mt-3">
            <p>¿Eres nuevo? <Link to="/register">Regístrate aquí</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
