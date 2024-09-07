import './SearchBar.css'; 
import {Alert} from 'react-bootstrap';
import React, {useState}from 'react';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function SearchBar({ setPets }) {
  const location = useLocation(); 
  const searchParams = new URLSearchParams(location.search); 

  const tipoInicial = searchParams.get('tipo') || '';

  const [filters, setFilters] = useState({
    tipo: tipoInicial,
    size: '',
    sexo: '',
    ubicacion: '',
    edad: '',
  });

  const [error, setError] = useState(null);
  const [noResults, setNoResults] = useState(false); 
  const [activeFilters, setActiveFilters] = useState(false);

  useEffect(() => {
    if (filters.tipo) {
      handleSearch();
    }
  }, [filters.tipo]);

  useEffect(() => {
    if (activeFilters) {
      handleSearch();
      setActiveFilters(false);
    }
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name !== 'tipo') {
      setFilters({
        ...filters,
        [name]: value,
      });
    }
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

  const handleSearch = () => {
    const fetchPets = async () => {
      try {
        const queryParams = new URLSearchParams(filters).toString();
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
      } catch (error) {
        setError(error.message);
      }
    };

    fetchPets();
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

      {noResults && (
        <Alert variant="warning" className="text-center mt-4">
          <h4>No se encontraron mascotas con los filtros seleccionados</h4>
          <p>Intenta modificar los filtros o presiona el botón de "Borrar filtros" para ver todas las mascotas disponibles.</p>
        </Alert>
      )}

      {error && (
        <div className="alert alert-danger text-center">
          <p>{error}</p>
        </div>
      )}

    </div>
  );
}

export default SearchBar;
  