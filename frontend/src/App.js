import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login';
import Signup from './SignUp';
import Main from './Main';
import SearchPetPage from './SearchPetPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/Search" element={<SearchPetPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
