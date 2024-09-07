import Footer from './componentes/Footer'
import Header from './componentes/Header'
import { Link } from 'react-router-dom';

function HeroSection() {
    return (
      <header
        className="hero-section d-flex align-items-center"
        style={{
          backgroundColor: '#e5d1f0',
          height: 'auto',
          padding: '50px 0',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-md-6 text-center text-md-start mb-4 mb-md-0">
              <img
                src="/logo512.png"
                alt="Logo"
                className="mb-3 img-fluid"
                style={{ maxWidth: '150px' }}
              />
              <p className="lead" style={{ color: '#333333', fontWeight: '500' }}>
                El lugar perfecto donde las mascotas encuentran un hogar, y tu encuentras un compañero fiel que te hará crear recuerdos inolvidables.
              </p>
              <div className="mt-3">
                <a
                  href="/adoptions"
                  className="btn btn-primary btn-lg me-3 mb-2 shadow"
                  style={{
                    backgroundColor: '#b97fed',
                    border: 'none',
                    lineHeight: '1.1'
                  }}
                >
                  Adopciones
                </a>
                <a
                  href="/register"
                  className="btn btn-lg mb-2 shadow"
                  style={{
                    backgroundColor: '#eef2f6',
                    color: '#000',
                    lineHeight: '1.1' 
                  }}
                >
                  Regístrate
                </a>
              </div>
            </div>
            <div className="col-12 col-md-6 text-center">
              <img
                src="/Mascotas.png"
                alt="Mascotas"
                className="img-fluid"
                style={{ maxWidth: '100%', height: 'auto' }} 
              />
            </div>
          </div>
        </div>
      </header>
    );
  }

function AdoptionSection () {
  return (
    <section className="container my-5">
      <h2 className="text-center mb-4">¿Quieres adoptar una mascota?</h2>
      <div className="row justify-content-center">
        <div className="col-md-4 mb-4">
          <Link to="/search?tipo=perro" className="d-block text-decoration-none">
            <div className="card border-light shadow">
              <img
                src="/Mascotas.png"
                alt="Perro"
                className="card-img-top"
                style={{ borderRadius: '0.25rem' }}
              />
              <div className="card-body text-center">
                <h5 className="card-title">Perros</h5>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-4 mb-4">
          <Link to="/search?tipo=gato" className="d-block text-decoration-none">
            <div className="card border-light shadow">
              <img
                src="/Mascotas.png"
                alt="Gato"
                className="card-img-top"
                style={{ borderRadius: '0.25rem' }}
              />
              <div className="card-body text-center">
                <h5 className="card-title">Gatos</h5>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-4 mb-4">
          <Link to="/search?tipo=otros" className="d-block text-decoration-none">
            <div className="card border-light shadow">
              <img
                src="/Mascotas.png"
                alt="Otros"
                className="card-img-top"
                style={{ borderRadius: '0.25rem' }}
              />
              <div className="card-body text-center">
                <h5 className="card-title">Otros</h5>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
  
function Main() {
    return (
      <div>
        <Header />
        <HeroSection />
        <AdoptionSection />
        <Footer />
      </div>
    );
  }
    
  export default Main;