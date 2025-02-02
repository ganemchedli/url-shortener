import {
  shortenUrlService,
  redirectToOriginalUrlService,
  generateQrCodeService,
} from "../services/urlServices.js";

export const shortenUrl = async (req, res) => {
  try {
    const { longUrl } = req.body;
    const result = await shortenUrlService(longUrl);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "Invalid URL") {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: "Server error" });
  }
};

export const redirectToOriginalUrl = async (req, res) => {
  try {
    const { urlId } = req.params;
    const longUrl = await redirectToOriginalUrlService(urlId);
    return res.status(200).json(longUrl);
  } catch (error) {
    if (error.message === "URL not found") {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: "Server error" });
  }
};

export const generateQrCode = async (req, res) => {
  try {
    const { urlId } = req.params;
    const qrDataUrl = await generateQrCodeService(urlId);
    return res.status(200).json({ url: qrDataUrl });
  } catch (error) {
    if (error.message === "URL not found") {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: "Server error" });
  }
};
