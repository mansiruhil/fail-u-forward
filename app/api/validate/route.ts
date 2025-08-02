import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Use a different env variable for Google API key
const API_KEY =process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string;

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    console.log("Received Text:", text);

    // If no API key is configured, just allow all posts
    if (!API_KEY || API_KEY.startsWith('http')) {
      console.log("No valid Google API key configured, allowing post");
      return NextResponse.json({ result: "1" });
    }

    const prompt=`Evaluate the statement below and figure out if it is sad or not .send 0 if Not sad else send 1 and the statement is ${text}. return as 1 or 0 only. no other text`
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    const response = await result.response.text();
    console.log("API Response:", response);

    return NextResponse.json({ result: response.trim() });
  } catch (error) {
    console.error("API Call Error:", error);
    // If validation fails, allow the post anyway
    console.log("Validation failed, allowing post");
    return NextResponse.json({ result: "1" });
  }
}
