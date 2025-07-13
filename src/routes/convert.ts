import express, { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import mammoth from "mammoth";
import path from "path";

const router = express.Router();
const upload = multer({ dest: path.join(__dirname, "../../uploads") });

router.post(
  "/docx-to-html",
  upload.single("file"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const filePath = req.file.path;

    try {
      const result = await mammoth.convertToHtml({ path: filePath });
      fs.unlinkSync(filePath);

      return res.status(200).json({
        html: result.value,
        messages: result.messages,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: "Conversion failed", detail: error.message });
    }
  }
);

export default router;
/**
 * @swagger
 * /convert:
 *   post:
 *     summary: Convert files between formats
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - targetFormat
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               targetFormat:
 *                 type: string
 *     responses:
 *       200:
 *         description: Converted file download info
 */
