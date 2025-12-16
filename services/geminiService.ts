import { GoogleGenAI, Type } from "@google/genai";
import type { Question } from '../types';
import { Difficulty } from "../types";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const QUIZ_SIZE = 20;

export const generateQuizQuestions = async (difficulty: Difficulty): Promise<Question[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate ${QUIZ_SIZE} ${difficulty.toLowerCase()} general knowledge quiz questions. For each question, provide 4 multiple-choice options, with one being the correct answer. The correct answer must be one of the options. Also, provide a brief explanation for the correct answer.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: {
                type: Type.STRING,
                description: "The quiz question."
              },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "An array of 4 multiple-choice options."
              },
              correctAnswer: {
                type: Type.STRING,
                description: "The correct answer, which must exactly match one of the provided options."
              },
              explanation: {
                type: Type.STRING,
                description: "A brief explanation for why the correct answer is correct."
              }
            },
            required: ["question", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    const jsonText = response.text.trim();
    const questions = JSON.parse(jsonText);
    
    // Basic validation to ensure we got what we expected
    if (!Array.isArray(questions) || questions.length === 0 || !questions[0].question || !questions[0].explanation) {
        throw new Error("Invalid data format received from API.");
    }

    return questions as Question[];
  } catch (error) {
    console.error("Error generating quiz questions:", error);
    throw new Error("Failed to generate quiz questions. Please check your API key and try again.");
  }
};

export const getResultsExplanation = async (score: number, total: number): Promise<string> => {
    try {
        const prompt = `A user has completed a difficult general knowledge quiz. They scored ${score} out of ${total}. 
        Provide a brief, one-paragraph, encouraging, and insightful explanation of their performance. 
        If the score is low, be encouraging. If it's high, be congratulatory.
        Do not use markdown formatting.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error getting results explanation:", error);
        return "Could not load the performance explanation. Nevertheless, great job on completing the quiz!";
    }
};
