// __tests__/e2e/generateQrCode.e2e.test.js
import request from "supertest";
import mongoose from "mongoose";
import app from "../../app.js";

describe("GET /qrcode/:urlId (generateQrCode) E2E", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  }, 10000);

  afterAll(async () => {
    await mongoose.connection.close();
  }, 10000);

  it("should generate a QR code for an existing short URL", async () => {
    const Url = (await import("../../models/UrlSchema.js")).default;
    await Url.create({
      urlId: "qr123",
      longUrl: "https://example-qr.com",
      clicks: 0,
    });

    const response = await request(app).get("/qr/qr123");
    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("url");

    expect(response.body.url).toMatch(/^data:image\/png;base64,/);

    // Cleanup
    await Url.deleteMany({ urlId: "qr123" });
  });

  it("should return 404 if urlId does not exist", async () => {
    const response = await request(app).get("/qr/nonexistent");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "URL not found" });
  });

  it("should return 500 if there is a server error", async () => {
    // Assume the database is disconnected
    await mongoose.connection.close();
    const response = await request(app).get("/qr/anyId");
    expect(response.status).toBe(500);
  });
});
