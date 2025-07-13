import { exec } from "child_process";
import path from "path";
import { promisify } from "util";
import { promises as fsPromises } from "fs";
import crypto from "crypto";

const execAsync = promisify(exec);

export async function convertOffice(filePath: string): Promise<Buffer> {
  const inputExt = path.extname(filePath);
  const outputDir = path.dirname(filePath);
  const tempOutputName = crypto.randomUUID() + ".pdf";
  const tempOutputPath = path.join(outputDir, tempOutputName);

  try {
    // Запускаємо конвертацію з вказаним ім'ям файлу виводу
    await execAsync(
      `libreoffice --headless --convert-to pdf --outdir "${outputDir}" "${filePath}"`
    );

    // Пошук файлу з новим ім'ям (LibreOffice генерує зазвичай з ім'ям input, тому тут треба або перейменувати після конвертації, або читати за input)
    const fileNameWithoutExt = path.basename(filePath, path.extname(filePath));
    const outputFilePath = path.join(outputDir, `${fileNameWithoutExt}.pdf`);

    // Читаємо PDF у Buffer
    const buffer = await fsPromises.readFile(outputFilePath);

    // Видаляємо створений PDF
    await fsPromises.unlink(outputFilePath);

    return buffer;
  } catch (error) {
    console.error("LibreOffice conversion failed:", error);
    throw new Error("Office to PDF conversion failed");
  }
}
