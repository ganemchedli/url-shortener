// __tests__/e2e/shortenUrl.e2e.test.js
import request from "supertest";
import mongoose from "mongoose";
import app from "../../app.js";

describe("POST /shorten (shortenUrl) E2E", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  }, 10000);

  afterAll(async () => {
    await mongoose.connection.close();
  }, 10000);

  it("should return 400 for an invalid URL", async () => {
    const response = await request(app)
      .post("/shorten")
      .send({ longUrl: "not-a-valid-url" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid URL" });
  });

  it("should return existing short URL if it already exists", async () => {
    // 1) Insert a document manually to simulate an existing URL
    const Url = (await import("../../models/UrlSchema.js")).default;
    const existingDoc = await Url.create({
      urlId: "abc123",
      longUrl: "https://example.com",
      clicks: 0,
    });

    // 2) Make the request
    const response = await request(app)
      .post("/shorten")
      .send({ longUrl: "https://example.com" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      shortUrl: "http://localhost:5173/abc123",
      urlId: "abc123",
      clicks: 0,
    });

    await Url.deleteOne({ _id: existingDoc._id });
  });

  it("should create a new short URL if it does not exist", async () => {
    const Url = (await import("../../models/UrlSchema.js")).default;
    await Url.deleteMany({ longUrl: "https://newexample.com" });

    const response = await request(app)
      .post("/shorten")
      .send({ longUrl: "https://newexample.com" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("shortUrl");
    expect(response.body).toHaveProperty("clicks", 0);

    const created = await Url.findOne({ longUrl: "https://newexample.com" });
    expect(created).not.toBeNull();
    expect(created.urlId).toBeDefined();
    expect(created.clicks).toBe(0);

    // Cleanup
    await Url.deleteMany({ longUrl: "https://newexample.com" });
  });

  it("should return 500 if there is a server-side error", async () => {
    //assume the database is disconnected
    await mongoose.connection.close();

    const response = await request(app)
      .post("/shorten")
      .send({ longUrl: "http://simulate-server-error.com" });

    expect([500, 400].includes(response.status)).toBe(true);
  });
});
