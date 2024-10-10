import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdoptionForm() {
  const { id } = useParams();
  const [message, setMessage] = useState('');
  const [pet, setPet] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    ocupacion: '',
    colonia: '',
    codigo_postal: '',
    municipio: '',
    telefono_celular: '',
    experienciaMascotas: '',
    otrasMascotas: '',
    espacioAdecuado: '',
    responsableCuidado: '',
    horasSolas: '',
    experienciaEspecifica: '',
    dispuestoGastos: ''
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('http://localhost:8000/api/user/profile/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          const profileData = await response.json();
          setFormData({
            nombre: profileData.nombre || '',
            apellidos: profileData.apellidos || '',
            correo: profileData.correo || '',
            ocupacion: profileData.ocupacion || '',
            colonia: profileData.colonia || '',
            codigo_postal: profileData.codigo_postal || '',
            municipio: profileData.municipio || '',
            telefono_celular: profileData.telefono_celular || '',
            experienciaMascotas: '',
            otrasMascotas: '',
            espacioAdecuado: '',
            responsableCuidado: '',
            horasSolas: '',
            experienciaEspecifica: '',
            dispuestoGastos: ''
          });
        } else {
          console.error('Error al obtener el perfil del usuario');
        }
      } catch (error) {
        console.error('Error al obtener los datos del perfil del usuario:', error);
      }
    };
  
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchPetDetails = async () => {
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
      }
    };
  fetchPetDetails();
  }, [id]);

  const createAdoptionRequest = async () => {
    const token = localStorage.getItem('accessToken');
    setError(null); 
    setSuccess(null); 

    try {
      const response = await fetch('http://localhost:8000/api/adoption-request/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          pet: id,  
          message: message,
          ...formData, 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Detalles del error:', errorData);
        throw new Error(errorData.detail || 'Error al enviar la solicitud de adopción');
      }

      const data = await response.json();
      console.log('Solicitud creada exitosamente', data);
      setSuccess('¡Solicitud enviada exitosamente!');
    } catch (error) {
      console.error('Error al crear la solicitud:', error.message);
      setError(error.message); 
    }
  };

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('accessToken');
      
      const { nombre, apellidos, correo, ...profileData } = formData;
  
      const profileResponse = await fetch('http://localhost:8000/api/user/profile/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData)
      });
  
      if (!profileResponse.ok) {
        console.error('Error al actualizar el perfil');
        return;
      }
      await createAdoptionRequest(); 
    } catch (error) {
      console.error('Error durante el envío del formulario:', error);
    }
  };

  if (!pet){
    return null;
  }

  return (
    <div className="container mt-5 mb-5 rounded border" style={{ maxWidth: '800px' }}>
      <div className="row">
        <div className="col-lg-4 col-md-12 mb-4 text-center">
          <div className="pet-details">
            <img src={pet.imagen} alt={pet.nombre} className="img-fluid rounded mt-3" style={{ maxWidth: '100%' }} />
            <p className="mt-3 fs-3 fw-bold">{pet.nombre}</p>
          </div>
        </div>
        <div className="col-lg-8 col-md-12 shadow rounded border-left">
          <p className="mt-3 text-center fw-bold fs-2"> Solicitud de Adopción </p>
          <form onSubmit={handleSubmit} className="container custom-form mb-5">
          <p className="mt-3 fs-4 fw-bold">Información de contacto</p>
            <div className="col-12 mb-3">
              <label className="form-label">Nombre:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ingrese su nombre(s)" 
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">Apellidos:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ingrese sus apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">Correo:</label>
              <input
                type="email"
                className="form-control"
                placeholder="Ingrese su correo electrónico"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">Ocupación:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ingrese su ocupación"
                name="ocupacion"
                value={formData.ocupacion}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">Colonia:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ingrese su colonia"
                name="colonia"
                value={formData.colonia}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">Código Postal:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ingrese su código postal"
                name="codigo_postal"
                value={formData.codigo_postal}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">Municipio:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ingrese su municipio"
                name="municipio"
                value={formData.municipio}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">Teléfono Celular:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ingrese su número de 10 dígitos"
                name="telefono_celular"
                value={formData.telefono_celular}
                onChange={handleChange}
                required
              />
            </div>
            <p className="mt-3 fs-4 fw-bold">Preguntas para evaluar al candidato</p>
            <div className="col-12 mb-3">
              <label className="form-label">¿Ha tenido mascotas anteriormente?</label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="experienciaMascotas"
                    value="Sí"
                    onChange={handleChange}
                    required
                  />
                  <label className="form-check-label">Sí</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="experienciaMascotas"
                    value="No"
                    onChange={handleChange}
                    required
                  />
                  <label className="form-check-label">No</label>
                </div>
              </div>
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">¿Tiene otras mascotas en casa actualmente?</label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="otrasMascotas"
                    value="Sí, perros"
                    onChange={handleChange}
                    required
                  />
                  <label className="form-check-label">Sí, perros</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="otrasMascotas"
                    value="Sí, gatos"
                    onChange={handleChange}
                    required
                  />
                  <label className="form-check-label">Sí, gatos</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="otrasMascotas"
                    value="Sí, otros animales"
                    onChange={handleChange}
                    required
                  />
                  <label className="form-check-label">Sí, otros animales</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="otrasMascotas"
                    value="No"
                    onChange={handleChange}
                    required
                  />
                  <label className="form-check-label">No</label>
                </div>
              </div>
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">¿Tiene espacio adecuado en casa para una mascota?</label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="espacioAdecuado"
                    value="Sí"
                    onChange={handleChange}
                    required
                  />
                  <label className="form-check-label">Sí</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="espacioAdecuado"
                    value="No"
                    onChange={handleChange}
                    required
                  />
                  <label className="form-check-label">No</label>
                </div>
              </div>
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">¿Quién será el responsable principal del cuidado de la mascota?</label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="responsableCuidado"
                    value="Yo"
                    onChange={handleChange}
                    required
                  />
                  <label className="form-check-label">Yo</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="responsableCuidado"
                    value="Mi pareja"
                    onChange={handleChange}
                    required
                  />
                  <label className="form-check-label">Mi pareja</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="responsableCuidado"
                    value="Mis hijos"
                    onChange={handleChange}
                    required
                  />
                  <label className="form-check-label">Mis hijos</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="responsableCuidado"
                    value="Otra persona"
                    onChange={handleChange}
                    required
                  />
                  <label className="form-check-label">Otra persona</label>
                </div>
              </div>
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">¿Cuántas horas al día estará sola la mascota?</label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="horasSolas"
                    value="Menos de 4 horas"
                    onChange={handleChange}
                    required
                  />
                  <label className="form-check-label">Menos de 4 horas</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="horasSolas"
                    value="Entre 4 y 8 horas"
                    onChange={handleChange}
                    required
                  />
                  <label className="form-check-label">Entre 4 y 8 horas</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="horasSolas"
                    value="Más de 8 horas"
                    onChange={handleChange}
                    required
                  />
                  <label className="form-check-label">Más de 8 horas</label>
                </div>
              </div>
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">¿Tiene experiencia con esta raza o tipo de mascota?</label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="experienciaEspecifica"
                    value="Sí"
                    onChange={handleChange}
                    required
                  />
                  <label className="form-check-label">Sí</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="experienciaEspecifica"
                    value="No"
                    onChange={handleChange}
                    required
                  />
                  <label className="form-check-label">No</label>
                </div>
              </div>
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">¿Está dispuesto a cubrir los gastos de atención veterinaria y alimentación?</label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="dispuestoGastos"
                    value="Sí"
                    onChange={handleChange}
                    required
                  />
                  <label className="form-check-label">Sí</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="dispuestoGastos"
                    value="No"
                    onChange={handleChange}
                    required
                  />
                  <label className="form-check-label">No</label>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="customMessage">Mensaje (opcional):</label>
              <textarea
                id="customMessage"
                placeholder="Deja un mensaje al dueño de la mascota, si así lo deseas"
                className="form-control mt-2 mb-4"
                rows="4"
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">Enviar solicitud</button>
            </div>
            {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}
            {success && <div className="alert alert-success mt-3" role="alert">{success}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdoptionForm;
