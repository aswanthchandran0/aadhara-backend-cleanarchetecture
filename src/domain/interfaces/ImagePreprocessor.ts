export interface ImagePreprocessor {
  preprocess(inputPath: string, outputPath: string): Promise<void>;
}