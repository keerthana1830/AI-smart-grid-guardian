
import { GoogleGenAI, Type } from "@google/genai";
import { GridEvent } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getAIAnalysis = async (events: GridEvent[]) => {
  const model = "gemini-2.5-flash";

  const simplifiedEvents = events.map(({ type, lightId, timestamp }) => ({
    type,
    lightId,
    time: timestamp.toISOString(),
  }));

  const prompt = `
    Analyze the following smart grid event log data. The data represents faults and subsequent clearances for a set of lights.
    
    Data:
    ${JSON.stringify(simplifiedEvents, null, 2)}
    
    Based on this data, provide a concise analysis. Identify which lights are failing most frequently, any potential patterns (like faults happening in quick succession), and provide actionable recommendations for a system operator. Present the analysis in a structured JSON format. The report title should be encouraging and gamified.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reportTitle: {
              type: Type.STRING,
              description: 'A gamified and encouraging title for the report.'
            },
            summary: {
              type: Type.STRING,
              description: 'A brief, one-paragraph summary of the grid\'s performance.'
            },
            patterns: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'A list of key patterns observed in the data.'
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'A list of actionable recommendations for the operator.'
            },
          },
          required: ["reportTitle", "summary", "patterns", "recommendations"],
        },
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to retrieve analysis from Gemini API.");
  }
};
