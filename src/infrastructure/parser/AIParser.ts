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
      // Use a currently available model
      const response = await this.cohere.chat({
        model: "command-r-plus-08-2024", // Updated to available model
        message: prompt,
        temperature: 0.1,
      });

      // Extract response text - using proper TypeScript approach
      let responseText = "";
      
      // Check the response structure properly
      console.log("Full Cohere response:", JSON.stringify(response, null, 2));
      
      // Method 1: Check if response has text directly (older API format)
      if ('text' in response && response.text) {
        responseText = response.text;
      } 
      // Method 2: Check for content array in newer API format
      else if ('message' in response) {
        const responseAny = response as any;
        if (responseAny.message && responseAny.message.content) {
          const contents = responseAny.message.content;
          if (Array.isArray(contents)) {
            for (const content of contents) {
              if (content.type === 'text' && content.text) {
                responseText = content.text;
                break;
              }
            }
          } else if (typeof contents === 'string') {
            responseText = contents;
          }
        }
      }
      // Method 3: Fallback to checking generations for older formats
      else if ('generations' in response) {
        const responseAny = response as any;
        if (Array.isArray(responseAny.generations) && responseAny.generations.length > 0) {
          if (responseAny.generations[0].text) {
            responseText = responseAny.generations[0].text;
          }
        }
      }
      
      if (!responseText) {
        console.warn("No text found in Cohere response structure. Full response:", response);
        // Try a different approach - stringify and look for JSON
        const responseStr = JSON.stringify(response);
        const jsonMatch = responseStr.match(/{"name":.*"address":.*?}/s);
        if (jsonMatch) {
          responseText = jsonMatch[0];
        } else {
          throw new Error("No text response from Cohere API");
        }
      }
      
      // Clean the response
      responseText = responseText.trim();
      console.log("Raw Cohere response text:", responseText);
      
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