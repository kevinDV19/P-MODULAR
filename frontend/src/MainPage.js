import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './componentes/Header'
import SearchBar from './componentes/SearchBar'
import Footer from './componentes/Footer'
import PetList from './componentes/PetList'

function HeroSection() {
  return (
    <header 
      className="hero-section d-flex align-items-center text-center text-light" 
      style={{
        backgroundColor: '#5dade2',
        //backgroundImage: `url('/kokie.jpg')`, 
        height: '300px', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}
    >
      <div className="container">
        <h1 className="display-4">Find Your Perfect Pet</h1>
        <p className="lead">Browse through a wide selection of pets ready for adoption.</p>
      </div>
    </header>
  );
}

function MainPage() {

  const [pets, setPets] = useState([]);

  useEffect(() => {
    // Llama a tu API para obtener los datos iniciales, si es necesario
    fetch('http://localhost:8000/api/pets/')
    .then(response => response.json())
    .then(data => setPets(data))
    .catch(error => console.error('Error fetching pets:', error));
  }, []);

  return (
    <div>
      <Header />
      <HeroSection />
      <SearchBar setPets={setPets} />
      <PetList pets={pets} /> {/* Asegúrate de pasar 'pets' como prop a PetList */}
      <Footer />
    </div>
  );
}
  
export default MainPage;