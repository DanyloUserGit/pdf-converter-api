import { PDFDocument } from "pdf-lib";
import fs from "fs/promises";

export async function convertImage(filePath: string): Promise<Buffer> {
  // Читаємо файл у буфер
  const imageBuffer = await fs.readFile(filePath);

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  // Спроба вбудувати PNG, якщо не вийшло - JPG
  const image = await pdfDoc.embedPng(imageBuffer).catch(async () => {
    return await pdfDoc.embedJpg(imageBuffer);
  });

  const { width, height } = image.scale(1);
  page.setSize(width, height);
  page.drawImage(image, {
    x: 0,
    y: 0,
    width,
    height,
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
