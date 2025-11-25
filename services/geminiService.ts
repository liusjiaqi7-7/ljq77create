import { GoogleGenAI, Type } from "@google/genai";
import { CodeValidationResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const VALIDATION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    correct: { type: Type.BOOLEAN, description: "Whether the code solves the mission objective correctly." },
    feedback: { type: Type.STRING, description: "Constructive feedback or congratulations. Keep it brief and in character (System AI)." },
    output: { type: Type.STRING, description: "The simulated output of the code execution." }
  },
  required: ["correct", "feedback", "output"]
};

export const validatePythonCode = async (
  code: string, 
  objective: string,
  topic: string
): Promise<CodeValidationResult> => {
  try {
    const prompt = `
      Act as a strict Python interpreter and Tutor AI.
      Topic: ${topic}
      Mission Objective: ${objective}
      
      User Code:
      ${code}
      
      Analyze the user's code. 
      1. Does it run without syntax errors?
      2. Does it fulfill the specific Mission Objective?
      3. Simulate the output.
      
      Return the result in JSON format.
      If incorrect, provide a helpful hint in the feedback.
      If correct, provide a "System Restored" style success message.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: VALIDATION_SCHEMA,
        temperature: 0.1 // Low temperature for consistent logic checking
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result as CodeValidationResult;

  } catch (error) {
    console.error("Gemini Validation Error:", error);
    return {
      correct: false,
      feedback: "SYSTEM ERROR: Connection to Neural Core unstable. Please retry validation.",
      output: "Error: Connection Timeout"
    };
  }
};

export const getAIHint = async (code: string, objective: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `The user is stuck on a Python coding task.
      Objective: ${objective}
      Current Code: ${code}
      
      Provide a short, cryptic but helpful hint in the style of a cyberpunk AI system. Max 20 words.`,
    });
    return response.text || "Hint unavailable.";
  } catch (e) {
    return "System offline. Consult manual.";
  }
};