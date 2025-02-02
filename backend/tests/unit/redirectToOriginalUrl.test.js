import request from "supertest";
import app from "../../app.js";
import Url from "../../models/UrlSchema.js";

jest.mock("../../models/UrlSchema.js");

describe("GET /:urlId", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should redirect to the original URL if it exists", async () => {
    const mockUrl = {
      longUrl: "https://example.com",
      urlId: "abc123",
      clicks: 0,
    };
    Url.findOneAndUpdate.mockResolvedValue(mockUrl);

    const response = await request(app).get("/abc123");

    expect(response.status).toBe(200);
    expect(response.body).toBe("https://example.com");
    expect(Url.findOneAndUpdate).toHaveBeenCalledWith(
      { urlId: "abc123" },
      { $inc: { clicks: 1 } },
      { new: true }
    );
  });

  it("should return 404 if the URL does not exist", async () => {
    Url.findOneAndUpdate.mockResolvedValue(null);

    const response = await request(app).get("/nonexistent");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "URL not found" });
  });

  it("should return 500 if there is a server error", async () => {
    Url.findOneAndUpdate.mockRejectedValue(new Error("Database error"));

    const response = await request(app).get("/abc123");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Server error" });
  });
});
