import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Carousel, Button, Container, Row, Col, Accordion } from 'react-bootstrap';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from './authContext';

function PetDetails() {
  const { id } = useParams(); 
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const navigate = useNavigate();
  const {isAuthenticated, fetchWithAuth } = useAuth();

  useEffect(() => {
    const fetchPetDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/api/pet/${id}`);
        if (!response.ok) {
          throw new Error('Error al cargar los detalles de la mascota.');
        }
        const data = await response.json();
        if (data) {
          setPet(data);
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
  }, [id]);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    
    if(pet && pet.owner === Number(userId)){
      setIsOwner(true);
    }

    if (pet && isOwner) {
      const fetchAdoptionRequests = async () => {
        try {
          const response = await fetchWithAuth(`http://localhost:8000/api/pet/${id}/adoption-requests/`);
          if (!response.ok) {
            throw new Error('Error al cargar las solicitudes de adopción.');
          }
          const requestsData = await response.json();

          const filteredRequests = requestsData.filter(request => request.status !== 'rechazada');
          setAdoptionRequests(filteredRequests);
        } catch (error) {
          console.error('Error al cargar las solicitudes de adopción:', error);
        }
      };
      fetchAdoptionRequests();
    }
  }, [fetchWithAuth, isOwner, pet, id]);

  const handleLoginRedirect = () => {
    sessionStorage.setItem('redirectAfterLogin', `/pet/${id}`);
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
              <img className="d-block w-100" src={pet.imagen} alt={pet.nombre} style={{borderRadius: '40px', width: '100%', height: '450px', objectFit: 'cover'}}/>
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
            {isAuthenticated && isOwner ? (
              <Accordion className="mt-4 shadow bg-transparent rounded">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>  
                    <span className="fw-bold">Solicitudes de Adopción</span> 
                  </Accordion.Header>
                  <Accordion.Body>
                    {adoptionRequests.length > 0 ? (
                      adoptionRequests.map(request => (
                        <div key={request.id} className="d-flex align-items-center p-3 border-bottom">
                          <img 
                            src={request.user_photo || "/default-profile.png"} 
                            alt={request.user_name} 
                            width="50" 
                            height="50" 
                            className="rounded-circle border" 
                          />
                          <div className="ms-3 flex-grow-1">
                            <h6 className="mb-1">{request.user_name}</h6>
                            <small className="text-muted">
                              Solicitado el {new Date(request.date_submitted).toLocaleDateString()}
                            </small>
                          </div>
                          <Link 
                            to={`/pet/adoption-request/${request.id}`} 
                            className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center ms-2 "
                            style={{ height: "32px", width: "100px" }}
                          >
                            Ver Solicitud
                          </Link>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted py-3">
                        <p className="mb-0">No hay solicitudes de adopción para esta mascota.</p>
                      </div>
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            ) : (
                <>
                  <h5>¿Te gustaría adoptar a {pet.nombre}?</h5>
                  {isAuthenticated ? (
                    <Link to={`/pet/adoption/${pet.id}`} className="btn btn-success">
                      Solicitar Adopción
                    </Link>
                  ) : (
                    <Button variant="primary" className="w-30 py-1 mt-3" onClick={handleLoginRedirect}>Inicia sesión aquí</Button>
                  )}
                </>
              )
            }
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default PetDetails;
