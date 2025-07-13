import { convertOffice } from "./office.converter";
import { convertImage } from "./image.converter";
import { convertHTML } from "./html.converter";
import { convertEpub } from "./epub.converter";

export async function convertToPDF(
  filePath: string,
  fileType: string
): Promise<any> {
  switch (fileType) {
    case "office":
      return convertOffice(filePath);
    case "image":
      return convertImage(filePath);
    case "epub":
      return convertEpub(filePath);
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}
