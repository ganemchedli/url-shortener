// __tests__/e2e/redirectToOriginalUrl.e2e.test.js
import request from "supertest";
import mongoose from "mongoose";
import app from "../../app.js";

describe("GET /:urlId (redirectToOriginalUrl) E2E", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  }, 10000);

  afterAll(async () => {
    await mongoose.connection.close();
  }, 10000);

  it("should respond with the original URL if urlId is found", async () => {
    const Url = (await import("../../models/UrlSchema.js")).default;
    const doc = await Url.create({
      urlId: "test123",
      longUrl: "https://sometest.com",
      clicks: 0,
    });

    // Make the GET request
    const response = await request(app).get("/test123");

    // The controller responds with JSON containing the longUrl
    expect(response.status).toBe(200);
    expect(response.body).toBe("https://sometest.com");

    // Check that it incremented clicks
    const updated = await Url.findOne({ urlId: "test123" });
    expect(updated.clicks).toBe(1);

    // Cleanup
    await Url.deleteOne({ _id: doc._id });
  });

  it("should return 404 if urlId does not exist", async () => {
    const response = await request(app).get("/nonexistent123");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "URL not found" });
  });

  it("should return 500 if there is a server error", async () => {
    // assume that the database is disconnected
    await mongoose.connection.close();
    const response = await request(app).get("/anyId");
    expect(response.status).toBe(500);
  });
});
