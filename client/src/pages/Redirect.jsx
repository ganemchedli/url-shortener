import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOriginalUrl } from "../api/api";
import { Container, Spinner, Alert } from "react-bootstrap";

const Redirect = () => {
  const { urlId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!urlId) {
      setError("Invalid URL ID.");
      setLoading(false);
      return;
    }

    console.log("Fetching Original URL for ID:", urlId);

    getOriginalUrl(urlId)
      .then(data => {
        console.log("Redirect API Response:", data);
        if (!data || data.error) {
          setError("URL not found.");
          setLoading(false);
        } else {
          window.location.href = data.longUrl || data;
        }
      })
      .catch(err => {
        console.error("Redirect API Error:", err);
        setError("Server error. Please try again later.");
        setLoading(false);
      });
  }, [urlId]);

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center min-vh-100">
      {loading ? (
        <>
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Redirecting...</p>
        </>
      ) : (
        <Alert variant="danger">{error}</Alert>
      )}
    </Container>
  );
};

export default Redirect;
