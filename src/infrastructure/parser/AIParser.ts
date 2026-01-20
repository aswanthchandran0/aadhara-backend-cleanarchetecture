import { AadhaarData } from "../../domain/entities/AadhaarData";
import { AadhaarParser } from "../../domain/interfaces/AadhaarParser";
import { CohereClient } from "cohere-ai";

type CohereChatResponse = {
  text?: string;
  message?: string | Array<{ type: string; text?: string }>;
  generations?: Array<{ text: string }>;
};

export class AIParser implements AadhaarParser {
  private cohere = new CohereClient({ 
    token: 'PNicKVwzD7NVLQZmqqrlHBwsZ7Goy6mgmsSrVK6H' 
  });

  async parse(text1: string, text2: string): Promise<AadhaarData> {
   
    const prompt = `You are an OCR post-processing AI. 
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
${text2}`;

    try {
      // Type assertion to handle Cohere API response
      const response = await this.cohere.chat({
        model: "command-r-plus",
        message: prompt,
        temperature: 0,
      }) as unknown as CohereChatResponse;

      // Extract response text with multiple fallbacks
      let responseText = "";
      
      if (response.text) {
        responseText = response.text;
      } else if (typeof response.message === 'string') {
        responseText = response.message;
      } else if (Array.isArray(response.message)) {
        for (const item of response.message) {
          if (item.type === 'text' && item.text) {
            responseText = item.text;
            break;
          }
        }
      } else if (response.generations && response.generations.length > 0) {
        responseText = response.generations[0].text;
      }
      
      if (!responseText) {
        throw new Error("No text response from Cohere API");
      }
      
      // Clean the response
      responseText = responseText.trim();
      const cleanText = responseText.replace(/```json|```/g, '').trim();
      
      // Parse JSON and convert to AadhaarData
      const parsed = JSON.parse(cleanText);
      
      return {
        name: parsed.name || undefined,
        dob: parsed.dob || undefined,
        gender: parsed.gender || undefined,
        aadhaarNumber: parsed.aadhaarNumber || undefined,
        address: parsed.address || undefined
      };
      
    } catch (error) {
      console.error("Cohere API Error:", error);
      
      return {
        name: undefined,
        dob: undefined,
        gender: undefined,
        aadhaarNumber: undefined,
        address: undefined
      };
    }
  }
}