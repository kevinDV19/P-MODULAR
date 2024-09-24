import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './LoginPage';
import Signup from './RegisterPage';
import Main from './MainPage';
import PetSearch from './PetSearchPage';
import PetDetails from './PetDetailsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/Search" element={<PetSearch />} />
          <Route path="/pets/:id" element={<PetDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
