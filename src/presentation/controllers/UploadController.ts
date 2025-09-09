import { Request, Response } from "express";
import { ProcessAadhaarImages } from "../../application/use-cases/ProcessAadhaarImages";
import { validateAadhaarData } from "../../utils/validators/validateAadhaarData";

export const uploadController = (useCase: ProcessAadhaarImages) => async (req: Request, res: Response) => {
  try {
    const { image1, image2 } = req.files as any;
    console.log("request reached")
    const buffer1 = image1.data;
    const buffer2 = image2.data;
    const result = await useCase.execute(buffer1, buffer2);
    console.log("result",result)

    const validation = validateAadhaarData(result)
    if(!validation.isValid){
      console.log(
        'validation failed',validation
      )
       res.status(400).json({sucess:false, message: validation.error})
       return
    }

    res.json({ success: true, aadhaarInfo: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal error" });
  }
};