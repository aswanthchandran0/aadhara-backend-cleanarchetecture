import { AadhaarData } from "../entities/AadhaarData";

export interface AadhaarParser {
  parse(text1: string, text2: string): Promise<AadhaarData>;
}
