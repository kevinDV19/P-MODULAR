import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Carousel, Button, Container, Row, Col } from 'react-bootstrap';
import LoadingSpinner from './LoadingSpinner';

function PetDetails() {
  const { id } = useParams(); 
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPetDetails = async () => {
      setLoading(true);
      try {
        const cachedPet = sessionStorage.getItem(`pet_${id}`);
        
        if (cachedPet) {
          setPet(JSON.parse(cachedPet));
        } else {
          const response = await fetch(`http://localhost:8000/api/pets/${id}`);
          if (!response.ok) {
            throw new Error('Error al cargar los detalles de la mascota.');
          }
          const data = await response.json();
          if (data) {
            setPet(data);
            sessionStorage.setItem(`pet_${id}`, JSON.stringify(data));
          }
        }
      } catch (error) {
        console.error('Error al cargar los detalles de la mascota:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPetDetails();
    } else {
      setLoading(false);
    }

    // Comprobar si el usuario está autenticado
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    if (auth) {
      setIsAuthenticated(true);
    }
  }, [id]);

  const handleLoginRedirect = () => {
    // Guardar la URL actual antes de redirigir al login
    sessionStorage.setItem('redirectAfterLogin', `/pets/${id}`);
    navigate('/login');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!pet) {
    return (
      <div className="alert alert-danger text-center mt-4">
        <p>No se encontraron detalles para esta mascota.</p>
      </div>
    );
  }

  return (
    <Container className="my-5">
      <Row>
        <Col md={6}>
          <Carousel>
            <Carousel.Item>
              <img className="d-block w-100" src={pet.imagen} alt={pet.nombre} style={{borderRadius: '40px'}}/>
            </Carousel.Item>
          </Carousel>
        </Col>
        <Col md={6}>
          <div className="d-flex flex-column justify-content-between h-100">
            <div>
              <h1 className="display-4 mb-3 fw-bold">Hola, soy <span className="text-primary fw-bold">{pet.nombre}</span></h1>
              <div className="mb-4 p-3 shadow bg-transparent rounded border">
                <Row className="mb-2">
                  <Col xs={4}><strong>Sexo:</strong></Col>
                  <Col xs={8}>{pet.sexo}</Col>
                </Row>
                <hr />
                <Row className="mb-2">
                  <Col xs={4}><strong>Tamaño:</strong></Col>
                  <Col xs={8}>{pet.size}</Col>
                </Row>
                <hr />
                <Row className="mb-2">
                  <Col xs={4}><strong>Edad:</strong></Col>
                  <Col xs={8}>{pet.edad}</Col>
                </Row>
                <hr />
                <Row className="mb-2">
                  <Col xs={4}><strong>Ubicación:</strong></Col>
                  <Col xs={8}>{pet.ubicacion}</Col>
                </Row>
              </div>
              <div className="p-3 shadow bg-transparent rounded border">
                <h5 className="mb-3">Descripción</h5>
                <p>{pet.descripcion}</p>
              </div>
            </div>

            <div className="mt-4">
              <h5>¿Te gustaría adoptar a {pet.nombre}?</h5>
              {isAuthenticated ? (
                <Button variant="primary" className="w-30 py-1 mt-3">Solicitar adopción</Button>
              ) : (
                <Button variant="primary" className="w-30 py-1 mt-3" onClick={handleLoginRedirect}>Inicia sesión aquí</Button>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default PetDetails;
