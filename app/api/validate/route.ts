import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY as string;
const genAI = new GoogleGenerativeAI(API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    console.log("Received Text:", text);

    const prompt=`Evaluate the statement below and figure out if it is sad or not .send 0 if Not sad else send 1 and the statement is ${text}. return as 1 or 0 only. no other text`
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    const response = await result.response.text();
    console.log("API Response:", response);

    return NextResponse.json({ result: response.trim() });
  } catch (error) {
    console.error("API Call Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
