import { AadhaarData } from "../../domain/entities/AadhaarData";


export const validateAadhaarData = (result:AadhaarData): { isValid: boolean; error?: string }=>{
    const frontFields: (keyof AadhaarData)[] = ['name', 'dob', 'gender', 'aadhaarNumber'];
   const isFrontInvalid = frontFields.some(
    (field) =>
        !result[field] || 
     result[field].trim() === '' ||
      (field === 'gender' && result[field] === 'Male/Female'),
   )

   const isBackInvalid = !result.address || result.address.trim() === '';

    if (isFrontInvalid && isBackInvalid) {
    return { isValid: false, error: 'Invalid Aadhaar card front and back pages. Please upload clear images.' };
  } else if (isFrontInvalid) {
    return { isValid: false, error: 'Invalid Aadhaar card front page. Please upload a clear image.' };
  } else if (isBackInvalid) {
    return { isValid: false, error: 'Invalid Aadhaar card back page. Please upload a clear image.' };
  }

  return { isValid: true };

}