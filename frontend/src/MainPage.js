import Footer from './componentes/Footer'
import Header from './componentes/Header'
import HeroSection from './componentes/HeroSection'
import AdoptionSection from './componentes/AdoptionSection';
  
function Main() {
    return (
      <div className="d-flex flex-column min-vh-100">
        <div className="flex-fill">
          <Header />
          <HeroSection />
          <AdoptionSection />
        </div>
      <Footer />
      </div>
    );
  }
    
  export default Main;