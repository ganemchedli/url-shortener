import axios from "axios";

const API_BASE_URL = "https://url-backend-shortener.vercel.app";

export const shortenUrl = async (longUrl) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/shorten`, { longUrl });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || "Something went wrong" };
  }
};

export const getOriginalUrl = async (urlId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${urlId}`);
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || "URL not found" };
  }
};

export const generateQrCode = async (urlId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/qr/${urlId}`);
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || "QR Code not found" };
  }
};
