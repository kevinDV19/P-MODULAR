import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from './authContext';
import LoadingSpinner from './LoadingSpinner';

function AdoptionRequestDetails() {
  const { id } = useParams(); 
  const [adoptionRequest, setAdoptionRequest] = useState(null);
  const { fetchWithAuth } = useAuth();
  const [status, setStatus] = useState('Pendiente');

  useEffect(() => {
    const fetchAdoptionRequest = async () => {
      try {
        const response = await fetchWithAuth(`http://localhost:8000/api/adoption-request/${id}/`);
        if (!response.ok) throw new Error('Error al cargar la solicitud de adopción');
        const data = await response.json();
        setAdoptionRequest(data);
        setStatus(data.status);
      } catch (error) {
        console.error('Error al obtener la solicitud de adopción:', error);
      }
    };

    fetchAdoptionRequest();
  }, [id, fetchWithAuth]);

  const handleAccept = async () => {
    try {
      const response = await fetchWithAuth(`http://localhost:8000/api/adoption-request/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'aceptar' }),
      });
      if (response.ok) setStatus('Aceptada');
      else throw new Error('No se pudo aceptar la solicitud');
    } catch (error) {
      console.error('Error al aceptar la solicitud:', error);
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetchWithAuth(`http://localhost:8000/api/adoption-request/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'rechazar' }),
      });
      if (response.ok) setStatus('Rechazada');
      else throw new Error('No se pudo rechazar la solicitud');
    } catch (error) {
      console.error('Error al rechazar la solicitud:', error);
    }
  };

  if (!adoptionRequest){
    return <LoadingSpinner />
  }

  const formData = adoptionRequest.form_data;

  return (
    <div className="container mt-5 mb-5">
      <div className="card border-primary shadow-sm mx-auto" style={{ maxWidth: '800px' }}>
        <div className="card-header text-center bg-primary text-white">
          <h3>Detalles de la Solicitud de Adopción</h3>
        </div>
        <div className="card-body">
          <h5 className="card-title">Información Personal</h5>
          <ul className="list-group list-group-flush mb-4">
            <li className="list-group-item"><strong>Nombre:</strong> {formData.nombre}</li>
            <li className="list-group-item"><strong>Apellidos:</strong> {formData.apellidos}</li>
            <li className="list-group-item"><strong>Correo:</strong> {formData.correo}</li>
            <li className="list-group-item"><strong>Ocupación:</strong> {formData.ocupacion}</li>
            <li className="list-group-item"><strong>Colonia:</strong> {formData.colonia}</li>
            <li className="list-group-item"><strong>Código Postal:</strong> {formData.codigo_postal}</li>
            <li className="list-group-item"><strong>Municipio:</strong> {formData.municipio}</li>
            <li className="list-group-item"><strong>Teléfono Celular:</strong> {formData.telefono_celular}</li>
          </ul>

          <h5 className="card-title">Respuestas del Formulario</h5>
          <ul className="list-group list-group-flush mb-4">
            <li className="list-group-item"><strong>¿Ha tenido mascotas anteriormente?</strong> {formData.experienciaMascotas}</li>
            <li className="list-group-item"><strong>¿Tiene otras mascotas en casa actualmente?</strong> {formData.otrasMascotas}</li>
            <li className="list-group-item"><strong>¿Tiene espacio adecuado en casa para una mascota?</strong> {formData.espacioAdecuado}</li>
            <li className="list-group-item"><strong>¿Quién será el responsable principal del cuidado de la mascota?</strong> {formData.responsableCuidado}</li>
            <li className="list-group-item"><strong>¿Cuántas horas pasará sola la mascota?</strong> {formData.horasSolas}</li>
            <li className="list-group-item"><strong>¿Tiene experiencia específica con la especie o raza de esta mascota?</strong> {formData.experienciaEspecifica}</li>
            <li className="list-group-item"><strong>¿Está dispuesto a cubrir los gastos de la mascota?</strong> {formData.dispuestoGastos}</li>
          </ul>

          <div className="mt-4 text-center">
            <p className="fw-bold">Estado de la solicitud: <span className={`badge ${status === 'pendiente' ? 'bg-warning' : status === 'Aceptada' ? 'bg-success' : 'bg-danger'}`}>{status}</span></p>
            {status === 'pendiente' && (
              <div className="d-flex justify-content-center gap-3">
                <button onClick={handleAccept} className="btn btn-success">Aceptar</button>
                <button onClick={handleReject} className="btn btn-danger">Rechazar</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdoptionRequestDetails;
