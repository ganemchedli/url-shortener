import ShortenForm from "../components/ShortenForm";
import { Container, Navbar } from "react-bootstrap";

const Home = () => {
  return (
    <>
      {/* 🔹 Navigation Bar */}
      <Navbar bg="dark" variant="dark" className="shadow-sm">
        <Container>
          <Navbar.Brand href="#">🔗 URL Shortener</Navbar.Brand>
        </Container>
      </Navbar>

      {/* 🔹 Centered Content */}
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="w-100" style={{ maxWidth: "500px" }}>
          <ShortenForm />
        </div>
      </Container>
    </>
  );
};

export default Home;
