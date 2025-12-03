import { GoogleGenAI } from "@google/genai";
import { JobListing } from "../types";

// Note: In a real app, this key comes from process.env.API_KEY
// For this demo, we assume the environment is set up correctly.
// We will instantiate the client inside the function to ensure the key is present.

export const analyzeMatch = async (job: JobListing, studentProfile: string): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
       console.warn("API Key not found. Returning mock response.");
       return "APIキーが設定されていないため、AIマッチングを実行できませんでした。";
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      You are an expert career consultant for software engineers.
      Analyze the compatibility between the following student profile and the job listing.
      
      Job Title: ${job.title}
      Required Skills: ${job.requiredSkills.join(', ')}
      Job Description: ${job.description}
      
      Student Profile Summary: ${studentProfile}
      
      Provide a short, encouraging summary (max 80 words) in Japanese about why this student might be a good fit, or what they should focus on. 
      Do not use markdown formatting. Be polite and professional.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "マッチング分析を生成できませんでした。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI分析中にエラーが発生しました。後ほど再度お試しください。";
  }
};