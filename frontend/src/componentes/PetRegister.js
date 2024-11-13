import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Row, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useAuth } from './authContext';

const PetForm = () => {
  const { id } = useParams(); 
  const isEditMode = Boolean(id); 
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    imagen: null,
    size: '',
    sexo: '',
    tipo: '',
    ubicacion: '',
    edad: '',
  });
  const [error, setError] = useState(null);
  const [previousImage, setPreviousImage] = useState('');
  const [success, setSuccess] = useState(null);
  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    if (isEditMode) {
      fetchWithAuth(`http://localhost:8000/api/pet/${id}/`)
        .then((response) => response.json())
        .then((data) => {
          setFormData({
            nombre: data.nombre,
            descripcion: data.descripcion,
            imagen: null, 
            size: data.size,
            sexo: data.sexo,
            tipo: data.tipo,
            ubicacion: data.ubicacion,
            edad: data.edad,
          });

          setPreviousImage(data.imagen);

        })
        .catch(() => setError('Error al cargar los datos de la mascota.'));
    }
  }, [id, isEditMode, fetchWithAuth]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      let imageUrl = formData.imagen;
      if (formData.imagen) {
        const imageFormData = new FormData();
        imageFormData.append('image', formData.imagen);
        imageFormData.append('image_type', 'mascotas');
        imageFormData.append("previous_image_url", previousImage);

        const uploadResponse = await fetchWithAuth('http://localhost:8000/api/upload-image/', {
          method: 'POST',
          body: imageFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Error al subir la imagen');
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.image_url;
      }

      const petData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        imagen: imageUrl, 
        size: formData.size,
        sexo: formData.sexo,
        tipo: formData.tipo,
        ubicacion: formData.ubicacion,
        edad: formData.edad,
      };

      const endpoint = isEditMode
        ? `http://localhost:8000/api/pet/edit/${id}/`
        : 'http://localhost:8000/api/pet/register/';
      const method = isEditMode ? 'PUT' : 'POST';

      const petResponse = await fetchWithAuth(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(petData),
      });

      if (petResponse.ok) {
        setSuccess(isEditMode ? '¡Mascota actualizada exitosamente!' : '¡Mascota registrada exitosamente!');
        if (!isEditMode) {
          setFormData({
            nombre: '',
            descripcion: '',
            imagen: null,
            size: '',
            sexo: '',
            tipo: '',
            ubicacion: '',
            edad: '',
          });
        }
      } else {
        setError('Error al registrar la mascota. Por favor, verifica los datos.');
      }
    } catch (err) {
      setError('Error en el servidor. Intenta nuevamente más tarde.');
    }
    console.log(formData);
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">{isEditMode ? 'Editar Mascota' : 'Registrar Nueva Mascota'}</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit} className="container shadow rounded border">
        <Row className="mb-3">
          <Col md={6} className="mt-3 fw-bold">
            <Form.Group controlId="nombre">
              <Form.Label>Nombre de la Mascota</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6} className="mt-3 fw-bold">
            <Form.Group controlId="size">
              <Form.Label>Tamaño</Form.Label>
              <Form.Select
                name="size"
                value={formData.size}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione el tamaño</option>
                <option value="Pequeño">Pequeño</option>
                <option value="Mediano">Mediano</option>
                <option value="Grande">Grande</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3 fw-bold">
          <Col md={6}>
            <Form.Group controlId="sexo">
              <Form.Label>Sexo</Form.Label>
              <Form.Select
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione el sexo</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="tipo">
              <Form.Label>Tipo de Animal</Form.Label>
              <Form.Select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione el tipo</option>
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                <option value="Otro">Otros</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3 fw-bold">
          <Col md={6}>
            <Form.Group controlId="edad">
              <Form.Label>Edad</Form.Label>
              <Form.Select
                name="edad"
                value={formData.edad}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione la edad</option>
                <option value="Cachorro">Cachorro</option>
                <option value="Adulto">Adulto</option>
                <option value="Senior">Senior</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="ubicacion">
              <Form.Label>Ubicación</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la ubicación"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3 fw-bold" controlId="descripcion">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Ingrese una descripción"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3 fw-bold" controlId="imagen">
          <Form.Label>Subir Imagen</Form.Label>
          <Form.Control
            type="file"
            name="imagen"
            onChange={handleChange}
            required={!isEditMode} 
          />
        </Form.Group>

        <div className="d-flex justify-content-center">
          <Button variant="primary" type="submit" className="w-20 mb-3">
            {isEditMode ? 'Guardar Cambios' : 'Registrar Mascota'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PetForm;
