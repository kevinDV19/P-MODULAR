import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { GoogleLogin, googleLogout } from '@react-oauth/google'; 

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

      if (!response.ok) {
        throw new Error('Datos Incorrectos');
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      navigate('/');
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
  
      if (!res.ok) {
        throw new Error('Error al procesar la solicitud');
      }
  
      const data = await res.json();
  
      if (res.ok) {
        localStorage.setItem('username', data.username);
        navigate('/');
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
    }
  };
  

  const handleGoogleFailure = (error) => {
    console.error('Google Sign-in Error:', error);
  };

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

          {/* Botón de Google Login */}
          <div className="text-center mt-3">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
            />
          </div>

          <div className="text-center mt-3">
            <p>¿Eres nuevo? <Link to="/SignUp">Regístrate aquí</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
