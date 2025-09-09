import { AadhaarData } from "../../domain/entities/AadhaarData";
import { AadhaarParser } from "../../domain/interfaces/AadhaarParser";
import { CohereClient } from "cohere-ai";

export class AIParser implements AadhaarParser {
  private cohere = new CohereClient({ token:'PNicKVwzD7NVLQZmqqrlHBwsZ7Goy6mgmsSrVK6H' });

  async parse(text1: string, text2: string): Promise<AadhaarData> {
   
    const prompt = `
You are an OCR post-processing AI. 
You will receive two text inputs (front and back of an Aadhaar card). 

Your task:
- Extract the following fields ONLY: name, dob, gender, aadhaarNumber, address.  
- If a field is not found, set its value to null.  
- Do not guess, do not write "Not mentioned", "N/A", or "".  
- Output must be a valid, minified JSON object (no extra text, no explanation).  

Format strictly:

{
  "name": null,
  "dob": null,
  "gender": null,
  "aadhaarNumber": null,
  "address": null
}

Text 1:
${text1}

Text 2:
${text2}
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