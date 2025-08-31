import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

function getGenAI() {
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
        throw new Error("Missing GEMINI_API_KEY for GoogleGenerativeAI");
    }
    if (!genAI) {
        genAI = new GoogleGenerativeAI(API_KEY);
    }
    return genAI;
}

export async function generateMotivation(text: string): Promise<string> {
    if (!text || typeof text !== "string" || text.trim() === "") {
        throw new Error("Invalid input text");
    }

    const prompt = `You are consoling this user and giving good advice to motivate them.
Provide a reply of 20 words.
User: ${text}`;

    const model = getGenAI().getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    return result.response.text();
}
