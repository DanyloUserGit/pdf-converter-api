import express from "express";
import multer from "multer";
import { detectFileType } from "./utils/detectFileType";
import { convertToPDF } from "./converters/index";
import path from "path";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");

  try {
    const filePath = path.resolve(req.file.path);
    const fileType = await detectFileType(filePath, req.file.originalname);

    if (!fileType) throw new Error("Error in file type detection");
    const outputBuffer = await convertToPDF(filePath, fileType);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="converted.pdf"',
    });
    res.send(outputBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send("Conversion failed");
  } finally {
    fs.unlinkSync(req.file.path);
  }
});
router.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

export default router;
