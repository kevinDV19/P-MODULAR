import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PetList from './PetList';
import Login from './login';
import Signup from './SignUp';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<PetList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/SignUp" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
