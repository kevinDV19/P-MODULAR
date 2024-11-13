import React, { useState, useEffect } from "react";
import { Card, Button, Form, Row, Col, Container, Modal } from "react-bootstrap";
import { useAuth } from './authContext';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const [userData, setUserData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { fetchWithAuth } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const response = await fetchWithAuth("/api/user/profile/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        console.error("Error al cargar perfil:", response.statusText);
      }
    } catch (error) {
      console.error("Error al cargar perfil:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleEditToggle = () => setEditMode(!editMode);

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleSave = async () => {
    try {
      let fotoPerfilUrl = userData.foto_perfil;
      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);
        formData.append("image_type", "usuarios");
        
        if (userData.foto_perfil) {
          formData.append("previous_image_url", userData.foto_perfil);
        }

        const uploadResponse = await fetchWithAuth("/api/upload-image/", {
          method: "POST",
          body: formData
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          fotoPerfilUrl = uploadData.image_url;
        } else {
          console.error("Error al subir imagen:", uploadResponse.statusText);
          return;
        }
      }

      const profileData = {
        ocupacion: userData.ocupacion,
        colonia: userData.colonia,
        codigo_postal: userData.codigo_postal,
        municipio: userData.municipio,
        telefono_celular: userData.telefono_celular,
        foto_perfil: fotoPerfilUrl  
      };

      const response = await fetchWithAuth("/api/user/profile/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setEditMode(false);
        fetchUserProfile();
      } else {
        console.error("Error al actualizar perfil:", response.statusText);
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
    }
  };

  const handleDeleteClick = (petId) => {
    setPetToDelete(petId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetchWithAuth(`/api/pet/delete/${petToDelete}/`, {
        method: "DELETE",
      });
      if (response.ok) {
        setUserData(prevData => ({
          ...prevData,
          publicaciones: prevData.publicaciones.filter(pet => pet.id !== petToDelete),
        }));
        setShowDeleteModal(false);
      } else {
        console.error("Error al eliminar publicación:", response.statusText);
      }
    } catch (error) {
      console.error("Error al eliminar publicación:", error);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4 shadow-sm" style={{ borderRadius: "15px" }}>
            <Card.Body>
              <div className="d-flex align-items-center mb-4" style={{ display: "flex", justifyContent: "flex-start", gap: "10px" }}>
                <img
                  src={userData.foto_perfil || "/default-profile.png"}
                  alt="Foto de perfil"
                  className="rounded-circle shadow"
                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                />
                <div className="ml-4">
                  <h3 className="mb-0">{userData.nombre} {userData.apellidos}</h3>
                  <p className="text-muted mb-0">Email: {userData.correo}</p>
                  <p className="text-muted mb-0">Username: {userData.username}</p>
                </div>
              </div>
              <Form>
                {editMode && (
                  <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label className="fw-bold">Cambiar Foto de Perfil</Form.Label>
                    <Form.Control type="file" onChange={handleImageChange} />
                  </Form.Group>
                )}
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="ocupacion">
                      <Form.Label className="fw-bold">Ocupación</Form.Label>
                      <Form.Control
                        type="text"
                        value={userData.ocupacion || ""}
                        disabled={!editMode}
                        onChange={(e) =>
                          setUserData({ ...userData, ocupacion: e.target.value })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="telefono_celular">
                      <Form.Label className="fw-bold">Teléfono Celular</Form.Label>
                      <Form.Control
                        type="text"
                        value={userData.telefono_celular || ""}
                        disabled={!editMode}
                        onChange={(e) =>
                          setUserData({ ...userData, telefono_celular: e.target.value })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="colonia">
                      <Form.Label className="fw-bold">Colonia</Form.Label>
                      <Form.Control
                        type="text"
                        value={userData.colonia || ""}
                        disabled={!editMode}
                        onChange={(e) =>
                          setUserData({ ...userData, colonia: e.target.value })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="municipio">
                      <Form.Label className="fw-bold">Municipio</Form.Label>
                      <Form.Control
                        type="text"
                        value={userData.municipio || ""}
                        disabled={!editMode}
                        onChange={(e) =>
                          setUserData({ ...userData, municipio: e.target.value })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="codigo_postal">
                      <Form.Label className="fw-bold">C.P.</Form.Label>
                      <Form.Control
                        type="text"
                        value={userData.codigo_postal || ""}
                        disabled={!editMode}
                        onChange={(e) =>
                          setUserData({ ...userData, codigo_postal: e.target.value })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
              <div className="text-right mt-3" style={{ display: "flex", justifyContent: "flex-start", gap: "10px" }}>
                <Button variant="outline-secondary" onClick={handleEditToggle}>
                  {editMode ? "Cancelar" : "Editar Perfil"}
                </Button>
                {editMode && (
                  <Button variant="success" onClick={handleSave}>
                    Guardar Cambios
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <hr className="my-5" />

      <h4 className="text-center mb-4">Mis Publicaciones de Mascotas</h4>
      <Row>
        {userData.publicaciones && userData.publicaciones.map((pet) => (
          <Col key={pet.id} md={6}>
            <Card className="mb-3 shadow-sm d-flex flex-row align-items-center p-3" style={{ borderRadius: "10px" }}>
              <div style={{ width: "90px", height: "90px", overflow: "hidden", borderRadius: "50%", marginRight: "20px" }}>
                <Card.Img
                  variant="top"
                  src={pet.imagen || "default-pet.png"}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div className="flex-grow-1">
                <Card.Title className="mb-1">{pet.nombre}</Card.Title>
              </div>
                <div className="d-flex gap-3 align-items-center">
                <Link to={`/pet/${pet.id}`}>
                  <i className="fas fa-eye text-primary fa-lg" style={{ cursor: "pointer" }} title="Ver"></i>
                </Link>
                <Link to={`/pet/edit/${pet.id}`}>
                  <i className="fas fa-edit text-warning fa-lg" style={{ cursor: "pointer" }} title="Editar"></i>
                </Link>
                <span onClick={() => handleDeleteClick(pet.id)} style={{ cursor: "pointer" }}>
                  <i className="fas fa-trash-alt text-danger fa-lg" title="Eliminar"></i>
                </span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas eliminar esta publicación?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserProfile;
