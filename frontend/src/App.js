import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './LoginPage';
import Signup from './RegisterPage';
import Main from './MainPage';
import PetSearch from './PetSearchPage';
import PetDetails from './PetDetailsPage';
import AdoptionFormPage from './AdoptionFormPage';
import AdoptionRequestsPage from './AdoptionRequestsPage';
import PrivateRoute from './componentes/PrivateRoute';
import PetRegisterPage from './PetRegisterPage';
import UserProfilePage from './UserProfilePage';
import { AuthProvider } from './componentes/authContext';
import ManageAdoptionRequestPage from './ManageAdoptionRequestPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route
              path="/user/my-adoption-requests"
              element={
                <PrivateRoute>
                  <AdoptionRequestsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/pet/adoption/:id"
              element={
                <PrivateRoute>
                  <AdoptionFormPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/pet/register"
              element={
                <PrivateRoute>
                  <PetRegisterPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/pet/edit/:id"
              element={
                <PrivateRoute>
                  <PetRegisterPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/profile"
              element={
                <PrivateRoute>
                  <UserProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/pet/adoption-request/:id"
              element={
                <PrivateRoute>
                  <ManageAdoptionRequestPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/my-adoption-requests/:requestId/:id"
              element={
                <PrivateRoute>
                  <AdoptionFormPage />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/pet/search" element={<PetSearch />} />
            <Route path="/pet/:id" element={<PetDetails />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
