import { OCRService } from "../../domain/interfaces/OCRService";
import { createWorker } from "tesseract.js";

export class TesseractOCRService implements OCRService {
  async extractText(imagePath: string): Promise<string> {
    const worker = await createWorker("eng");
    const {
      data: { text },
    } = await worker.recognize(imagePath);
    await worker.terminate();
    return text;
  }
}