import { AadhaarData } from "../../domain/entities/AadhaarData";
import { AadhaarParser } from "../../domain/interfaces/AadhaarParser";
import { CohereClient } from "cohere-ai";

export class AIParser implements AadhaarParser {
  private cohere = new CohereClient({ 
    token: 'PNicKVwzD7NVLQZmqqrlHBwsZ7Goy6mgmsSrVK6H' 
  });

  async parse(text1: string, text2: string): Promise<AadhaarData> {
   
    const prompt = `You are an OCR post-processing AI specialized in extracting Indian Aadhaar card information. 
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

Text 1 (Front):
${text1}

Text 2 (Back):
${text2}`;

    try {
      // Use 'command' model which is currently available
      const response = await this.cohere.chat({
        model: "command", // Changed from 'command-r-plus' to 'command'
        message: prompt,
        temperature: 0.1, // Slightly increased for better results
      });

      // Extract response text
      let responseText = "";
      
      // Type guard to handle different response formats
      const responseAny = response as any;
      
      if (responseAny.text) {
        responseText = responseAny.text;
      } else if (responseAny.message) {
        if (typeof responseAny.message === 'string') {
          responseText = responseAny.message;
        } else if (Array.isArray(responseAny.message)) {
          for (const item of responseAny.message) {
            if (item.type === 'text' && item.text) {
              responseText = item.text;
              break;
            }
          }
        }
      } else if (responseAny.generations && responseAny.generations.length > 0) {
        responseText = responseAny.generations[0].text;
      }
      
      if (!responseText) {
        console.warn("No text in Cohere response:", response);
        throw new Error("No text response from Cohere API");
      }
      
      // Clean the response
      responseText = responseText.trim();
      console.log("Raw Cohere response:", responseText);
      
      // Remove JSON code blocks if present
      let cleanText = responseText.replace(/```json\s*|\s*```|```/g, '').trim();
      
      // Sometimes the response might have extra text before/after JSON
      const jsonMatch = cleanText.match(/\{.*\}/s);
      if (jsonMatch) {
        cleanText = jsonMatch[0];
      }
      
      console.log("Cleaned text for JSON parsing:", cleanText);
      
      // Parse JSON
      const parsed = JSON.parse(cleanText);
      
      // Convert to AadhaarData format
      return {
        name: parsed.name || undefined,
        dob: parsed.dob || undefined,
        gender: parsed.gender || undefined,
        aadhaarNumber: parsed.aadhaarNumber || undefined,
        address: parsed.address || undefined
      };
      
    } catch (error) {
      console.error("Cohere API Error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      
      // Return empty data on failure
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