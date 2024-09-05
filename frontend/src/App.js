import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login';
import Signup from './SignUp';
import MainPage from './MainPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/SignUp" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
