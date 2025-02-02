import Url from "../models/UrlSchema.js";
import isValidUrl from "../utils/validateUrl.js";
import generateUniqueId from "../utils/generateUniqueId.js";
import QRCode from "qrcode";

/**
 * Service to shorten a URL
 * @param {string} longUrl
 * @returns {object} { shortUrl, urlId, clicks }
 */
export const shortenUrlService = async (longUrl) => {
  if (!isValidUrl(longUrl)) {
    throw new Error("Invalid URL");
  }

  let url = await Url.findOne({ longUrl });
  if (url) {
    return {
      shortUrl: `${process.env.CLIENT_PORT}/${url.urlId}`,
      urlId: url.urlId,
      clicks: url.clicks,
    };
  }

  const urlId = await generateUniqueId();
  url = new Url({ longUrl, urlId, clicks: 0 });
  await url.save();

  return {
    shortUrl: `${process.env.CLIENT_PORT}/${urlId}`,
    urlId,
    clicks: 0,
  };
};

/**
 * Service to retrieve a URL by its ID and increment click count
 * @param {string} urlId
 * @returns {string} The original (long) URL
 */
export const redirectToOriginalUrlService = async (urlId) => {
  const url = await Url.findOneAndUpdate(
    { urlId },
    { $inc: { clicks: 1 } },
    { new: true }
  );

  if (!url) {
    throw new Error("URL not found");
  }

  return url.longUrl;
};

/**
 * Service to generate a QR code for a given short URL ID
 * @param {string} urlId
 * @returns {string} Data URL (Base64) of the QR code
 */
export const generateQrCodeService = async (urlId) => {
  const urlRecord = await Url.findOne({ urlId });
  if (!urlRecord) {
    throw new Error("URL not found");
  }

  const shortUrl = `${process.env.CLIENT_PORT}/${urlId}`;

  const qrDataUrl = await QRCode.toDataURL(shortUrl);
  return qrDataUrl;
};
