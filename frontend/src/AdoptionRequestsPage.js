import Footer from './componentes/Footer'
import Header from './componentes/Header'
import AdoptionRequests from './componentes/AdoptionRequests';
  
function AdoptionRequestsPage() {
    return (
      <div className="d-flex flex-column min-vh-100">
        <div className="flex-fill">
          <Header />
          <AdoptionRequests />
        </div>
      <Footer />
      </div>
    );
  }
    
  export default AdoptionRequestsPage;