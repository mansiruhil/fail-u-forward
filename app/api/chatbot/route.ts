import { NextRequest, NextResponse } from "next/server";
import { generateMotivation } from "@/services/ai";

export async function POST(req: NextRequest) {
    try {
        const { text } = await req.json();

        const aiResponse = await generateMotivation(text);

        return NextResponse.json({
            success: true,
            data: { response: aiResponse },
            error: null,
        });
    } catch (error: any) {
        console.error("Gemini API Error:", error.message);

        return NextResponse.json(
            {
                success: false,
                data: null,
                error: error.message || "Internal server error",
            },
            { status: error.message.includes("Invalid input") ? 400 : 500 }
        );
    }
}
