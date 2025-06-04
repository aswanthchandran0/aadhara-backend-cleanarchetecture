import express from "express";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import cors from "cors";
import uploadRoutes from "./presentation/routes/UploadRoutes";
import morgan from "morgan";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://aadhara-frontend.vercel.app",
    "https://aadhara-frontend-khaz4n7uj-aswanths-projects-d5a5a20b.vercel.app",
    "https://aadhara-frontend-git-main-aswanths-projects-d5a5a20b.vercel.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

app.use(morgan("dev"));
app.use(express.json());
app.use(fileUpload());
app.use("/api/upload", uploadRoutes);

app.listen(PORT, () => console.log("Server running on port", PORT));
