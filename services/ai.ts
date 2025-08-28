import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY as string;

if (!API_KEY) {
    throw new Error("Missing NEXT_PUBLIC_API_KEY for GoogleGenerativeAI");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateMotivation(text: string): Promise<string> {
    if (!text || typeof text !== "string" || text.trim() === "") {
        throw new Error("Invalid input text");
    }

    const prompt = `You are consoling this user and giving good advice to motivate them.
  Provide a reply of 20 words.
  User: ${text}`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    return result.response.text();
}
