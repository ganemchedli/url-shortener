// __tests__/controllers/urlController.test.js
import request from "supertest";
import app from "../../app.js";
import isValidUrl from "../../utils/validateUrl.js";
import generateUniqueId from "../../utils/generateUniqueId.js";
import mongoose from "mongoose";

// 1) Mock the actual Mongoose model file
//    We'll provide a custom implementation below
jest.mock("../../models/UrlSchema.js", () => {
  const mockSave = jest.fn();
  const MockUrl = jest.fn(function () {
    return {
      save: mockSave,
    };
  });

  // Attach a static method findOne to the constructor
  MockUrl.findOne = jest.fn();

  return {
    __esModule: true,
    default: MockUrl,
  };
});

// 2) Mock utility functions
jest.mock("../../utils/validateUrl.js");
jest.mock("../../utils/generateUniqueId.js");

// 3) Optionally mock mongoose.connect so it won't do a real DB connection
jest.mock("mongoose", () => {
  const actualMongoose = jest.requireActual("mongoose");
  return {
    ...actualMongoose,
    connect: jest.fn().mockResolvedValue(true),
    connection: { close: jest.fn() },
  };
});

// Import the mocked model AFTER the jest.mock call above
import Url from "../../models/UrlSchema.js";

describe("POST /shorten", () => {
  let mockFindOne;
  let mockSave;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFindOne = Url.findOne;
    mockSave = Url.mock.results[0]?.value?.save;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should return 400 for an invalid URL", async () => {
    isValidUrl.mockReturnValue(false);

    const response = await request(app)
      .post("/shorten")
      .send({ longUrl: "invalid-url" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid URL" });
    expect(isValidUrl).toHaveBeenCalledWith("invalid-url");
  });

  it("should return existing short URL if it already exists", async () => {
    isValidUrl.mockReturnValue(true);

    const mockUrlDoc = {
      urlId: "abc123",
      longUrl: "https://example.com",
      clicks: 0,
    };
    mockFindOne.mockResolvedValue(mockUrlDoc);

    const response = await request(app)
      .post("/shorten")
      .send({ longUrl: "https://example.com" });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      shortUrl: "http://localhost:5173/abc123",
      clicks: 0,
      urlId: "abc123",
    });
    expect(mockFindOne).toHaveBeenCalledWith({
      longUrl: "https://example.com",
    });
  });

  it("should create a new short URL if it doesn't exist", async () => {
    isValidUrl.mockReturnValue(true);
    mockFindOne.mockResolvedValue(null);

    generateUniqueId.mockResolvedValue("xyz789");

    Url.mockImplementationOnce(() => {
      return {
        save: jest.fn().mockResolvedValue({
          longUrl: "https://newexample.com",
          urlId: "xyz789",
          clicks: 0,
        }),
      };
    });

    const response = await request(app)
      .post("/shorten")
      .send({ longUrl: "https://newexample.com" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      shortUrl: "http://localhost:5173/xyz789",
      urlId: "xyz789",
      clicks: 0,
    });
    expect(generateUniqueId).toHaveBeenCalled();
    expect(mockFindOne).toHaveBeenCalledWith({
      longUrl: "https://newexample.com",
    });

    expect(Url).toHaveBeenCalledTimes(1);
    const newUrlInstance = Url.mock.results[0].value;
    expect(newUrlInstance.save).toHaveBeenCalled();
  });

  it("should return 500 if there is a server error", async () => {
    isValidUrl.mockReturnValue(true);
    mockFindOne.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .post("/shorten")
      .send({ longUrl: "https://example.com" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Server error" });
  });
});
