import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API with your key
const API_KEY = process.env.NEXT_PUBLIC_API_KEY as string;
const genAI = new GoogleGenerativeAI(API_KEY);

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { text } = await req.json();
    console.log("Received Text:", text);

    // Prepare the prompt for the AI
    const prompt = `You are consoling this user and giving good advice to motivate them. Provide a reply of 20 words. 
    User: ${text}`;

    // Use the generative AI model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    // Extract the response
    const response = await result.response.text();
    console.log("Gemini API Response:", response);

    // Return the response to the client
    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error while calling Gemini API:", error);
    return NextResponse.json(
      { error: "Failed to process the request" },
      { status: 500 }
    );
  }
}
