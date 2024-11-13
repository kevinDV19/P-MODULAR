import Footer from './componentes/Footer'
import Header from './componentes/Header'
import UserProfile from './componentes/UserProfile';
  
function UserProfilePage() {
    return (
      <div className="d-flex flex-column min-vh-100">
        <div className="flex-fill">
          <Header />
          <UserProfile />
        </div>
      <Footer />
      </div>
    );
  }
    
  export default UserProfilePage;