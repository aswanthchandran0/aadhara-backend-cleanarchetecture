import { AadhaarData } from "../../domain/entities/AadhaarData";
import { AadhaarParser } from "../../domain/interfaces/AadhaarParser";
import { CohereClient } from "cohere-ai";

export class AIParser implements AadhaarParser {
  private cohere = new CohereClient({ token: process.env.COHERE_API_KEY! });

  async parse(text1: string, text2: string): Promise<AadhaarData> {
    const prompt = `You are an OCR AI that receives front and back Aadhaar text. Extract this:
      {\"name\":\"\",\"dob\":\"\",\"gender\":\"\",\"aadhaarNumber\":\"\",\"address\":\"\"}`;

    const response = await this.cohere.generate({
      model: "command-r-plus",
      prompt: `${prompt}\nText1: ${text1}\nText2: ${text2}`,
      maxTokens: 300,
      temperature: 0,
    });

    const json = JSON.parse(response.generations[0].text.trim());
    return json;
  }
}