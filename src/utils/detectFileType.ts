import fileTypeFromBuffer from "file-type";
import fs from "fs/promises";
import path from "path";
export async function detectFileType(
  filePath: string,
  originalName: string
): Promise<string | null> {
  const buffer = await fs.readFile(filePath);
  const type = await fileTypeFromBuffer.fromBuffer(buffer);

  let ext: string | undefined = type?.ext;

  if (!ext) {
    ext = path.extname(originalName).replace(".", "").toLowerCase();
    console.log("Fallback extension from originalName:", ext);
  } else {
    console.log("Detected via buffer:", ext);
  }

  if (!ext) return null;

  const officeTypes = [
    "doc",
    "docx",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
    "odp",
    "odt",
    "ods",
    "ott",
    "ots",
    "sxw",
    "sxi",
    "sdw",
    "sda",
    "sdd",
    "fodt",
    "fodp",
    "fodg",
    "rtf",
    "txt",
    "xml",
    "html",
    "xhtml",
    "csv",
    "dbf",
    "dif",
    "slk",
    "stc",
    "sdc",
    "pxl",
    "uot",
    "wps",
    "pdb",
    "psw",
    "bib",
    "ltx",
  ];

  if (["pdf"].includes(ext)) return "pdf";
  if (officeTypes.includes(ext)) return "office";

  const imageTypes = [
    "png",
    "jpeg",
    "jpg",
    "gif",
    "bmp",
    "emf",
    "eps",
    "pbm",
    "pgm",
    "ppm",
    "ras",
    "svg",
    "tiff",
    "tif",
    "wmf",
    "xpm",
    "met",
    "pct",
    "svm",
    "swf",
  ];

  if (imageTypes.includes(ext)) return "image";

  if (ext === "epub") return "epub";

  return null;
}
