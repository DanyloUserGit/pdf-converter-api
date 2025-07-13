import unzipper from "unzipper";
import path from "path";
import * as fsp from "fs/promises";
import * as fs from "fs";
import puppeteer from "puppeteer";

async function extractEpubToTempDir(epubPath: string, tempDir: string) {
  await fsp.mkdir(tempDir, { recursive: true });

  return new Promise<void>((resolve, reject) => {
    const stream = fs.createReadStream(epubPath).pipe(unzipper.Parse());

    stream.on("entry", (entry: any) => {
      const filePath = path.join(tempDir, entry.path);
      if (entry.type === "File") {
        entry.pipe(fs.createWriteStream(filePath));
      } else {
        entry.autodrain();
      }
    });

    stream.on("close", () => resolve());
    stream.on("error", (err) => reject(err));
  });
}

async function getHtmlContent(tempDir: string): Promise<string> {
  const files = await fsp.readdir(tempDir);
  const htmlFiles = files.filter(
    (f) => f.endsWith(".html") || f.endsWith(".xhtml")
  );
  let combinedHtml = "";
  for (const file of htmlFiles) {
    const content = await fsp.readFile(path.join(tempDir, file), "utf-8");
    combinedHtml += content;
  }
  return combinedHtml;
}

export async function convertEpub(
  filePath: string
): Promise<Uint8Array<ArrayBufferLike>> {
  const tempDir = "./temp_epub";

  await extractEpubToTempDir(filePath, tempDir);

  const htmlContent = await getHtmlContent(tempDir);

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({ format: "A4" });
  await browser.close();

  await fsp.rm(tempDir, { recursive: true, force: true });

  return pdfBuffer;
}
