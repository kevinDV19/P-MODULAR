import PetDetails from "./componentes/PetDetails";
import Header from "./componentes/Header";
import Footer from "./componentes/Footer";

function Details() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="flex-fill">
        <Header />
        <PetDetails />
      </div>
    <Footer />
    </div>
  );
}

export default Details;