import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from './authContext';

const UserAdoptionRequests = () => {
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null); // Almacena la solicitud seleccionada para eliminar
  const navigate = useNavigate();
  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    const fetchAdoptionRequests = async () => {
      try {
        const response = await fetchWithAuth('http://localhost:8000/api/adoption-request/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAdoptionRequests(data);
        } else {
          console.error('Error al obtener las solicitudes de adopción');
        }
      } catch (error) {
        console.error('Error en la consulta de las solicitudes de adopción:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdoptionRequests();
  }, [fetchWithAuth]);

  const handleEditRequest = (requestId, petId) => {
    navigate(`/user/my-adoption-requests/${requestId}/${petId}`);
  };

  const handleDeleteRequest = async () => {
    if (!requestToDelete) return;
    try {
      const response = await fetchWithAuth(
        `http://localhost:8000/api/adoption-request/${requestToDelete.id}/`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        setAdoptionRequests((prev) =>
          prev.filter((request) => request.id !== requestToDelete.id)
        );
        setShowModal(false);
      } else {
        console.error('Error al eliminar la solicitud');
      }
    } catch (error) {
      console.error('Error en la eliminación de la solicitud:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const pendingRequests = adoptionRequests.filter((request) => request.status === 'pendiente');
  const approvedRequests = adoptionRequests.filter((request) => request.status === 'aprobada');
  const rejectedRequests = adoptionRequests.filter((request) => request.status === 'rechazada');

  const renderRequests = (requests, title) => (
    <Col md={4}>
      <h3 className="text-center mb-4">{title}</h3>
      {requests.length === 0 ? (
        <p className="text-center">No hay solicitudes en esta categoría.</p>
      ) : (
        <Row className="g-4">
          {requests.map((request) => (
            <Col key={request.id} sm={12}>
              <Card style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', height: '100%' }}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <Card.Title>Mascota: {request.pet_name} / ID: {request.pet}</Card.Title>
                      <Card.Text>
                        <strong>Estado:</strong> {request.status}
                      </Card.Text>
                      <Card.Text>
                        <strong>Fecha de Solicitud:</strong> {new Date(request.date_submitted).toLocaleDateString()}
                      </Card.Text>
                    </div>
                      <div
                      style={{ cursor: 'pointer', color: 'red', fontSize: '1.2rem' }}
                      onClick={() => {
                        setRequestToDelete(request);
                        setShowModal(true);
                      }}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </div>

                  </div>
                  {request.status === 'pendiente' && (
                    <div className="d-flex justify-content-center">
                      <Button
                          variant="primary"
                          onClick={() => handleEditRequest(request.id, request.pet)}
                          style={{ width: '50%', marginTop: '15px' }}
                      >
                          Modificar Solicitud
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Col>
  );

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Mis Solicitudes de Adopción</h2>
      <Row>
        {renderRequests(pendingRequests, 'Pendientes')}
        {renderRequests(approvedRequests, 'Aceptadas')}
        {renderRequests(rejectedRequests, 'Rechazadas')}
      </Row>
      
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar esta solicitud de adopción?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteRequest}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserAdoptionRequests;
