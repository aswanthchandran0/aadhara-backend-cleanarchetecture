import { Request, Response } from "express";
import { ProcessAadhaarImages } from "../../application/use-cases/ProcessAadhaarImages";

export const uploadController = (useCase: ProcessAadhaarImages) => async (req: Request, res: Response) => {
  try {
    const { image1, image2 } = req.files as any;
    const buffer1 = image1.data;
    const buffer2 = image2.data;

    const result = await useCase.execute(buffer1, buffer2);
    res.json({ success: true, aadhaarInfo: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal error" });
  }
};