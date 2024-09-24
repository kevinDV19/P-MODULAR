import './SearchBar.css'; 
import { Alert } from 'react-bootstrap';
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

function SearchBar({ setPets }) {
  const location = useLocation(); 
  const navigate = useNavigate(); 
  const searchParams = new URLSearchParams(location.search); 
  const tipoInicial = searchParams.get('tipo') || '';

  const [filters, setFilters] = useState({
    tipo: tipoInicial,
    size: searchParams.get('size') || '',
    sexo: searchParams.get('sexo') || '',
    ubicacion: searchParams.get('ubicacion') || '',
    edad: searchParams.get('edad') || '',
  });

  const [error, setError] = useState(null);
  const [noResults, setNoResults] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const [activeFilters, setActiveFilters] = useState(false);

  const handleSearch = useCallback(() => {
    const fetchPets = async () => {
      setLoading(true);
      
      try {
        const queryParams = new URLSearchParams(filters).toString();
        const cachedResults = sessionStorage.getItem(queryParams);
  
        if (cachedResults) {
          const parsedResults = JSON.parse(cachedResults);
          setPets(parsedResults);
  
          if (parsedResults.length === 0) {
            setNoResults(true);
          } else {
            setNoResults(false);
          }
        } else {
          const response = await fetch('http://localhost:8000/api/search/?' + queryParams);
          if (!response.ok) {
            throw new Error('Error al cargar las mascotas.');
          }
          const data = await response.json();
  
          if (data.length === 0) {
            setNoResults(true); 
          } else {
            setNoResults(false); 
          }
  
          setPets(data);
          sessionStorage.setItem(queryParams, JSON.stringify(data)); 
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPets();
  }, [filters, setPets]);
  

  useEffect(() => {
    if (filters.tipo) {
      handleSearch();
    }
  }, [filters.tipo]); 

  useEffect(() => {
      const queryParams = new URLSearchParams(filters).toString();
      navigate(`?${queryParams}`);
  }, [filters, navigate]);

  useEffect(() => {
    if (activeFilters) {
      handleSearch();
      setActiveFilters(false);
    }
  }, [activeFilters]); 

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleClearFilters = () => {
    setFilters({
      ...filters, 
      size: '',
      sexo: '',
      ubicacion: '',
      edad: '',
    }); 
    setActiveFilters(true);
  };


  return (
    <div className="container my-4">
      <div className="search-bar-container p-3">
        <form className="row g-2 align-items-center justify-content-center" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
          <div className="col-12 col-md-auto">
            <select name="size" className="form-select" value={filters.size} onChange={handleFilterChange}>
              <option value="">Tamaño</option>
              <option value="pequeño">Pequeño</option>
              <option value="mediano">Mediano</option>
              <option value="grande">Grande</option>
            </select>
          </div>

          <div className="col-12 col-md-auto">
            <select name="sexo" className="form-select" value={filters.sexo} onChange={handleFilterChange}>
              <option value="">Sexo</option>
              <option value="macho">Macho</option>
              <option value="hembra">Hembra</option>
            </select>
          </div>

          <div className="col-12 col-md-auto">
            <select name="ubicacion" className="form-select" value={filters.ubicacion} onChange={handleFilterChange}>
              <option value="">Ubicación</option>
              <option value="Guadalajara, Jalisco">Guadalajara, Jalisco</option>
              <option value="ciudad2">Ciudad 2</option>
            </select>
          </div>

          <div className="col-12 col-md-auto">
            <select name="edad" className="form-select" value={filters.edad} onChange={handleFilterChange}>
              <option value="">Edad</option>
              <option value="cachorro">Cachorro</option>
              <option value="adulto">Adulto</option>
              <option value="senior">Senior</option>
            </select>
          </div>

          <div className="col-12 col-md-auto">
            <button type="submit" className="btn btn-primary w-100 w-md-auto">
              Buscar
            </button>
          </div>

          <div className="col-12 col-md-auto">
            <button type="button" className="btn btn-secondary w-100 w-md-auto" onClick={handleClearFilters}>
              Borrar Filtros
            </button>
          </div>
        </form>
      </div>

      {loading && <LoadingSpinner />}

      {noResults && !loading && (
        <Alert variant="warning" className="text-center mt-4">
          <h4>No se encontraron mascotas con los filtros seleccionados</h4>
          <p>Intenta modificar los filtros o presiona el botón de "Borrar filtros" para ver todas las mascotas disponibles.</p>
        </Alert>
      )}

      {error && !loading && (
        <div className="alert alert-danger text-center">
          <p>{error}</p>
        </div>
      )}

    </div>
  );
}

export default SearchBar;
