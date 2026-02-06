
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateRomanticLetter = async () => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `You are a world-class romantic poet. Write an incredibly sweet, heartfelt, and unique Valentine's note from "me" to "you". 
    Focus on themes of destiny, joy, and companionship. Keep it under 80 words and make it feel very personal even without names.`,
    config: {
      thinkingConfig: { thinkingBudget: 4000 },
      temperature: 1.0,
    }
  });
  return response.text;
};
