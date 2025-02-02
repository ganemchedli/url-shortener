import express from "express";
import {
  shortenUrl,
  redirectToOriginalUrl,
  generateQrCode,
} from "../controllers/urlController.js";

const router = express.Router();

/**
 * @openapi
 * /shorten:
 *   post:
 *     summary: Create a shortened URL
 *     description: Takes a long URL in the request body and returns a shortened version
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Url'
 *     responses:
 *       200:
 *         description: Successfully shortened the URL
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Url'
 *       400:
 *         description: Invalid URL provided
 *       500:
 *         description: Server error
 */
router.post("/shorten", shortenUrl);

/**
 * @openapi
 * /qr/{urlId}:
 *   get:
 *     summary: Generate a QR code for a short URL
 *     description: Returns a QR code image (or a data URL) representing the short URL
 *     parameters:
 *       - in: path
 *         name: urlId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier for the short URL
 *     responses:
 *       200:
 *         description: QR code generated successfully
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Short URL not found
 *       500:
 *         description: Server error
 */
router.get("/qr/:urlId", generateQrCode);

/**
 * @openapi
 * /{urlId}:
 *   get:
 *     summary: Redirect to the original URL
 *     description: Finds the original URL by its short identifier and redirects the client
 *     parameters:
 *       - in: path
 *         name: urlId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier for the short URL
 *     responses:
 *       200:
 *         description: Redirect to the original URL
 *       404:
 *         description: Short URL not found
 *       500:
 *         description: Server error
 */
router.get("/:urlId", redirectToOriginalUrl);

/**
 * @openapi
 * /:
 *   get:
 *     summary: Health check or default route
 *     description: Returns a simple JSON success message
 *     responses:
 *       200:
 *         description: Success message
 */
router.get("/", (req, res) => {
  res.json({ message: "Success" });
});

// Error-handling middleware (not part of Swagger docs, but good to have) //todo move to middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

export default router;
