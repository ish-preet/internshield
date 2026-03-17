import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface AIAnalysisResult {
  riskScore: number;
  analysis: string;
  redFlags: string[];
  recommendations: string;
  riskLevel: 'Safe' | 'Suspicious' | 'Scam';
}

export const analyzeScamReport = async (companyName: string, role: string, description: string): Promise<AIAnalysisResult> => {
  const prompt = `Analyze this internship opportunity for potential scam patterns:
  Company: ${companyName}
  Role: ${role}
  Description: ${description}
  
  Provide a detailed analysis including a risk score (0-100), red flags identified, and recommendations for the student.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskScore: { type: Type.NUMBER },
          analysis: { type: Type.STRING },
          redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendations: { type: Type.STRING },
          riskLevel: { type: Type.STRING, enum: ["Safe", "Suspicious", "Scam"] }
        },
        required: ["riskScore", "analysis", "redFlags", "recommendations", "riskLevel"]
      }
    }
  });

  return JSON.parse(response.text);
};
