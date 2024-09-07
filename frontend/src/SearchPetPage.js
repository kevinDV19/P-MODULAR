import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './componentes/Header'
import SearchBar from './componentes/SearchBar'
import Footer from './componentes/Footer'
import PetList from './componentes/PetList'

function SearchPetPage() {

  const [pets, setPets] = useState([]);

  return (
    <div className="d-flex flex-column min-vh-100">
       <div className="flex-fill">
          <Header />
          <SearchBar setPets={setPets} />
          <PetList pets={pets} />
        </div>
        <Footer />
    </div>
  );
}
  
export default SearchPetPage;