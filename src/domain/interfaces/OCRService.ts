export interface OCRService {
  extractText(imagePath: string): Promise<string>;
}