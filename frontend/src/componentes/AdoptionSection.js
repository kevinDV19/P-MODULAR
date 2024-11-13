import { Link } from 'react-router-dom';

function AdoptionSection() {
  return (
    <section className="container my-5">
      <p className="text-center mb-4 fs-2 fw-bold">¿Quieres adoptar una mascota?</p>
      <div className="row justify-content-center">
        <div className="col-md-4 mb-4">
          <Link to="/pet/search?tipo=Perro" className="d-block text-decoration-none">
            <div className="card border-light shadow" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <img
                src="/perros.png"
                alt="Perro"
                style={{ width: '100%', height: '250px', objectFit: 'contain' }}
              />
              <div className="card-body text-center" style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <h5 className="card-title">Perros</h5>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-4 mb-4">
          <Link to="/pet/search?tipo=gato" className="d-block text-decoration-none">
            <div className="card border-light shadow" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <img
                src="/gatos.png"
                alt="Gato"
                style={{ width: '100%', height: '250px', objectFit: 'contain' }}
              />
              <div className="card-body text-center" style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <h5 className="card-title">Gatos</h5>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-4 mb-4">
          <Link to="/pet/search?tipo=otros" className="d-block text-decoration-none">
            <div className="card border-light shadow" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <img
                src="/otros.png"
                alt="Otros"
                style={{ width: '100%', height: '250px', objectFit: 'contain' }}
              />
              <div className="card-body text-center" style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <h5 className="card-title">Otros</h5>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default AdoptionSection;
