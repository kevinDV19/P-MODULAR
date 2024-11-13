import Footer from './componentes/Footer'
import Header from './componentes/Header'
import PetRegister from './componentes/PetRegister';
  
function PetRegisterPage() {
    return (
      <div className="d-flex flex-column min-vh-100">
        <div className="flex-fill">
          <Header />
          <PetRegister />
        </div>
      <Footer />
      </div>
    );
  }
    
  export default PetRegisterPage;