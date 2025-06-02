import { ImagePreprocessor } from "../../domain/interfaces/ImagePreprocessor";
import sharp from "sharp";

export class SharpImagePreprocessor implements ImagePreprocessor {
  async preprocess(inputPath: string, outputPath: string): Promise<void> {
    await sharp(inputPath).grayscale().normalize().toFile(outputPath);
  }
}