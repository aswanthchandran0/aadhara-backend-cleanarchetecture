// --- Clean Architecture Breakdown for OCR-based Aadhaar Parsing App ---

// 📁 src/
// ├── domain/                        -> Domain Layer
// │   ├── entities/
// │   │   └── Aadhaar.ts             // Aadhaar entity interface
// │   └── services/
// │       └── AadhaarParser.ts       // Interface for parsing service
// ├── application/                   -> Application Layer
// │   ├── use-cases/
// │   │   └── ProcessAadhaar.ts      // Use case for processing Aadhaar
// │   └── dto/
// │       └── AadhaarDTO.ts          // Data Transfer Object definitions
// ├── infrastructure/                -> Infrastructure Layer
// │   ├── ai/
// │   │   └── CohereParser.ts        // Implements parser using AI
// │   ├── ocr/
// │   │   ├── Preprocess.ts          // Image preprocessing
// │   │   └── ExtractText.ts         // Text extraction using tesseract.js
// │   ├── file/
// │   │   └── TempStorage.ts         // Handles temp file storage
// │   └── utils/
// │       └── Validation.ts          // File validations
// ├── presentation/                  -> Presentation Layer
// │   ├── routes/
// │   │   └── uploadRoutes.ts        // Express routes
// │   ├── controllers/
// │   │   └── UploadController.ts    // Express controller
// │   └── server.ts                  // Express App entry
// └── shared/
//     ├── config/
//     │   └── index.ts               // env, constants
//     └── index.ts                   // Main entry point


// === Sample Implementations (abbreviated for clarity) ===
 