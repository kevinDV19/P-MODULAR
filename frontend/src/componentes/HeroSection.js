function HeroSection() {
    return (
      <header
        className="hero-section d-flex align-items-center shadow"
        style={{
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
                src="/logo.png"
                alt="logo"
                className="img-fluid"
                style={{ maxWidth: '100%', height: 'auto' }} 
              />
              <p className="lead" style={{ color: '#333333', fontWeight: '500' }}>
                El lugar perfecto donde las mascotas encuentran un hogar, y tu encuentras un compañero fiel que te hará crear recuerdos inolvidables.
              </p>
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

export default HeroSection;