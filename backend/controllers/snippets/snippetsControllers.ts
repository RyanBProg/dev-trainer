import { Request, Response } from "express";
import { handleControllerError } from "../../utils/handleControllerError";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../../zod/envSchema";
import { generateSnippetPrompt } from "./utils";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite",
  generationConfig: {
    temperature: 0.1,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  },
});

export const getGenerateSnippet = async (req: Request, res: Response) => {
  try {
    const { userInput, language } = req.body;
    if (!userInput || !language) {
      res.status(400).json({ message: "No user input included in request" });
      return;
    }

    const prompt = generateSnippetPrompt(userInput, language);

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.status(200).json({
      request: userInput,
      query: response,
      success: true,
      message: "Reply generated successfully",
    });
  } catch (error) {
    handleControllerError(error, res, "getGenerateSnippet");
  }
};
