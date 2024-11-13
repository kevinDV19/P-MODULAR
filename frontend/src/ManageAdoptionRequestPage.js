import AdoptionRequestDetails from "./componentes/ManageAdoptionRequest";
import Header from "./componentes/Header";
import Footer from "./componentes/Footer";

function ManageAdoptionRequestPage() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="flex-fill">
        <Header />
        <AdoptionRequestDetails />
      </div>
    <Footer />
    </div>
  );
}

export default ManageAdoptionRequestPage;