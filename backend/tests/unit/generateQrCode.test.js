import request from "supertest";
import app from "../../app.js";
import Url from "../../models/UrlSchema.js";
import QRCode from "qrcode";

jest.mock("../../models/UrlSchema.js");
jest.mock("qrcode");

describe("GET /qr/:urlId", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should generate a QR code for a valid URL", async () => {
    const mockUrl = { urlId: "abc123" };
    Url.findOne.mockResolvedValue(mockUrl);
    QRCode.toDataURL.mockResolvedValue("data:image/png;base64,...");

    const response = await request(app).get("/qr/abc123");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ url: "data:image/png;base64,..." });
    expect(QRCode.toDataURL).toHaveBeenCalledWith(
      "http://localhost:5173/abc123"
    );
  });

  it("should return 404 if the URL does not exist", async () => {
    Url.findOne.mockResolvedValue(null);

    const response = await request(app).get("/qr/nonexistent");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "URL not found" });
  });

  it("should return 500 if there is a server error", async () => {
    Url.findOne.mockRejectedValue(new Error("Database error"));

    const response = await request(app).get("/qr/abc123");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Server error" });
  });
});
