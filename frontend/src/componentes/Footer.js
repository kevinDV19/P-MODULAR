function Footer() {
  return (
    <footer className="bg-dark text-light py-3">
      <div className="container text-center">
        <p className="mb-0">© 2024 PetFinder. All rights reserved.</p>
        <p>
          <a href="/privacy" className="text-light">Privacy Policy</a> | 
          <a href="/terms" className="text-light"> Terms of Service</a>
        </p>
        <p>Contact us at <a href="mailto:contact@petfinder.com" className="text-light">contact@petfinder.com</a></p>
      </div>
    </footer>
  );
}

export default Footer;
  