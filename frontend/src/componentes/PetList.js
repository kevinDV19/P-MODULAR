import { Card, Button} from 'react-bootstrap';

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
                <Button variant="primary">View Details</Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PetList;