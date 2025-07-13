import fileTypeFromBuffer from "file-type";
import fs from "fs/promises";

export async function detectFileType(filePath: string): Promise<string | null> {
  const buffer = await fs.readFile(filePath);
  const type = await fileTypeFromBuffer.fromBuffer(buffer);
  if (!type) return null;

  if (["pdf"].includes(type.ext)) return "pdf";

  if (
    [
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
      "ots",
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
    ].includes(type.ext)
  )
    return "office";

  if (
    [
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
    ].includes(type.ext)
  )
    return "image";

  if (type.ext === "epub") return "epub";

  return null;
}
