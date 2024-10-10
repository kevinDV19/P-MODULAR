import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserAdoptionRequests = () => {
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdoptionRequests = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await fetch('http://localhost:8000/api/adoption-request/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
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
  }, []);

  const handleEditRequest = (requestId) => {
    navigate(`/adoption-requests/edit/${requestId}`);
  };

  if (loading) {
    return <p>Cargando solicitudes...</p>;
  }

  return (
    <div>
      <h2>Mis Solicitudes de Adopción</h2>
      {adoptionRequests.length === 0 ? (
        <p>No has realizado ninguna solicitud de adopción aún.</p>
      ) : (
        <ul>
          {adoptionRequests.map(request => (
            <li key={request.id}>
              <p><strong>Mascota:</strong> {request.pet}</p>
              <p><strong>Estado:</strong> {request.status}</p>
              <p><strong>Fecha de Solicitud:</strong> {new Date(request.date_submitted).toLocaleDateString()}</p>
              <p><strong>Form:</strong> {request.message}</p>
              {request.status === 'Pendiente' && (
                <button onClick={() => handleEditRequest(request.id)}>Modificar Solicitud</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserAdoptionRequests;
