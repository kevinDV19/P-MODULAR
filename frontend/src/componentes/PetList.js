import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function PetList({ pets }) {
  return (
    <div className="container my-5">
      <div className="row">
        {pets.map(pet => (
          <div className="col-md-4 mb-4" key={pet.id}>
            <Card>
              <Card.Img variant="top" src={pet.imagen} />
              <Card.Body>
                <Card.Title>{pet.nombre}</Card.Title>
                <Card.Text>{pet.edad} ● {pet.sexo}</Card.Text>
                <Card.Text>{pet.ubicacion}</Card.Text>
                <Link to={`/pets/${pet.id}`} className="btn btn-primary">
                  Ver detalles
                </Link>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PetList;