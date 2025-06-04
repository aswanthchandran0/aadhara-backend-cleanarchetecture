import { AadhaarData } from "../../domain/entities/AadhaarData";
import { AadhaarParser } from "../../domain/interfaces/AadhaarParser";
import { CohereClient } from "cohere-ai";

export class AIParser implements AadhaarParser {
  private cohere = new CohereClient({ token:'PNicKVwzD7NVLQZmqqrlHBwsZ7Goy6mgmsSrVK6H' });

  async parse(text1: string, text2: string): Promise<AadhaarData> {
    const prompt = `
    You are an OCR post-processing AI that receives two text inputs (front and back of Aadhaar). 
    Your job is to extract this format strictly in JSON:
    
    {
      "name": "",
      "dob": "",
      "gender": "",
      "aadhaarNumber": "",
      "address": ""
    }
    
    Text 1:
    ${text1}
    
    Text 2:
    ${text2}
    
    Only reply with JSON. Do not include any explanation.
    `;


    const response = await this.cohere.generate({
      model: "command-r-plus",
      prompt: prompt,
      maxTokens: 300,
      temperature: 0,
    });

    const json = JSON.parse(response.generations[0].text.trim());
    return json;
  }
}