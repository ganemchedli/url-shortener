import { useState } from "react";
import { shortenUrl } from "../api/api";
import { Form, Button, Spinner, InputGroup, Card } from "react-bootstrap";
import QrCode from "./QrCode";

const ShortenForm = () => {
  const [longUrl, setLongUrl] = useState("");
  const [shortenedData, setShortenedData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShortenedData(null);
    setLoading(true);
    setCopied(false);

    const data = await shortenUrl(longUrl);
    setLoading(false);

    if (data.error) {
      setError(data.error);
      return;
    }

    setShortenedData(data);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortenedData.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card className="p-4 shadow-lg border-0 rounded-4">
      <Card.Body>
        <h3 className="text-center mb-3">🔗 Shorten Your URL</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <InputGroup className="mb-3">
              <Form.Control
                type="url"
                placeholder="Enter your URL here..."
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                required
                className="p-2"
              />
              <Button type="submit" variant="primary">
                {loading ? <Spinner size="sm" animation="border" /> : "Shorten"}
              </Button>
            </InputGroup>
          </Form.Group>
        </Form>

        {error && <p className="text-danger text-center mt-2">{error}</p>}

        {shortenedData && (
          <div className="mt-4 p-3 bg-light rounded text-center shadow-sm">
            <h5 className="fw-bold">Your Shortened URL</h5>
            <div className="d-flex justify-content-center align-items-center">
              <a
                href={shortenedData.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-decoration-none fw-bold"
              >
                {shortenedData.shortUrl}
              </a>
              <Button
                variant="outline-secondary"
                size="sm"
                className="ms-2"
                onClick={handleCopy}
              >
                {copied ? "✔ Copied!" : "📋 Copy"}
              </Button>
            </div>

            <p className="mt-2">
              <strong>Clicks:</strong> {shortenedData.clicks}
            </p>

            <QrCode urlId={shortenedData.shortUrl.split("/").pop()} />
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ShortenForm;
