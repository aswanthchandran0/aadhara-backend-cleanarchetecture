import { OCRService } from "../../domain/interfaces/OCRService";
import { ImagePreprocessor } from "../../domain/interfaces/ImagePreprocessor";
import { AadhaarParser } from "../../domain/interfaces/AadhaarParser";
import { AadhaarData } from "../../domain/entities/AadhaarData";
import fs from "fs-extra";
import path from "path";



interface Dependencies {
  ocrService: OCRService;
  preprocessor: ImagePreprocessor;
  parser: AadhaarParser;
}


export class ProcessAadhaarImages {
  constructor(private readonly deps: Dependencies) {}

  async execute(image1: Buffer, image2: Buffer): Promise<AadhaarData> {
    const tempDir = path.join(__dirname, "../../../temp");
    await fs.ensureDir(tempDir);

    const paths = {
      original1: path.join(tempDir, "original1.png"),
      preprocessed1: path.join(tempDir, "preprocessed1.png"),
      original2: path.join(tempDir, "original2.png"),
      preprocessed2: path.join(tempDir, "preprocessed2.png"),
    };

    await fs.writeFile(paths.original1, image1);
    await fs.writeFile(paths.original2, image2);
    await this.deps.preprocessor.preprocess(paths.original1, paths.preprocessed1);
    await this.deps.preprocessor.preprocess(paths.original2, paths.preprocessed2);

    const text1 = await this.deps.ocrService.extractText(paths.preprocessed1);
    const text2 = await this.deps.ocrService.extractText(paths.preprocessed2);

    const result = await this.deps.parser.parse(text1, text2);
    await fs.remove(tempDir);
    return result;
  }
}