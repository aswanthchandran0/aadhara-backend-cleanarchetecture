import { Router } from "express";
import { uploadController } from "../controllers/UploadController";
import { ProcessAadhaarImages } from "../../application/use-cases/ProcessAadhaarImages";
import { TesseractOCRService } from "../../infrastructure/ocr/extractText";
import { SharpImagePreprocessor } from "../../infrastructure/preprocessing/Preprocess";
import { AIParser } from "../../infrastructure/parser/AIParser";

const router = Router();
const useCase = new ProcessAadhaarImages({
  ocrService: new TesseractOCRService(),
  preprocessor: new SharpImagePreprocessor(),
  parser: new AIParser(),
});

router.post("/", uploadController(useCase));
export default router;
