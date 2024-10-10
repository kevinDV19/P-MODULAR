import Footer from './componentes/Footer'
import Header from './componentes/Header'
import AdoptionForm from './componentes/AdoptionForm';
  
function Main() {
    return (
      <div className="d-flex flex-column min-vh-100">
        <div className="flex-fill">
          <Header />
          <AdoptionForm />
        </div>
      <Footer />
      </div>
    );
  }
    
  export default Main;