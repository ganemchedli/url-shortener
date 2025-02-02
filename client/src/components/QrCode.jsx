import { memo, useEffect, useState, useMemo } from "react";
import { generateQrCode } from "../api/api";
import { Spinner, Card } from "react-bootstrap";


const QrCode = ({ urlId }) => {
  const [qrCode, setQrCode] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!urlId) {
      setError("Invalid URL ID.");
      setLoading(false);
      return;
    }

    generateQrCode(urlId)
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setQrCode(data.url);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load QR code.");
        setLoading(false);
      });
  }, [urlId]);

  const renderContent = useMemo(() => {
    if (loading) {
      return <Spinner animation="border" variant="primary" className="mt-2" />;
    }

    if (error) {
      return <p className="text-danger">{error}</p>;
    }

    if (qrCode) {
      return (
        <div className="text-center">
          <img
            src={qrCode}
            alt="QR Code"
            width="150px"
            className="border rounded mt-2"
          />
        </div>
      );
    }

    return null;
  }, [loading, error, qrCode]);

  return (
    <Card className="p-3 mt-3 shadow-sm text-center">
      <h5 className="fw-bold">QR Code</h5>
      {renderContent}
    </Card>
  );
}




export default memo(QrCode);
