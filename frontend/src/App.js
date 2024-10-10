import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './LoginPage';
import Signup from './RegisterPage';
import Main from './MainPage';
import PetSearch from './PetSearchPage';
import PetDetails from './PetDetailsPage';
import Adoption from './AdoptionFormPage';
import UserAdoptionRequests from './componentes/UserAdoptionRequests';

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
          <Route path="/adoption/:id" element={<Adoption />} />
          <Route path="/my-adoption-requests" element={<UserAdoptionRequests />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
