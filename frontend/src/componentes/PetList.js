import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function PetList({ pets }) {
  return (
    <div className="container my-5">
      <div className="row">
        {pets.map(pet => (
          <div className="col-md-4 mb-4" key={pet.id}>
            <Card className="shadow">
              <Card.Img 
                variant="top" 
                src={pet.imagen} 
                style={{ width: "100%", height: "280px", objectFit: "cover" }} 
              />
              <Card.Body>
                <Card.Title>{pet.nombre}</Card.Title>
                <Card.Text>{pet.edad} ● {pet.sexo}</Card.Text>
                <Card.Text>{pet.ubicacion}</Card.Text>
                <Link to={`/pet/${pet.id}`} className="btn btn-primary">
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