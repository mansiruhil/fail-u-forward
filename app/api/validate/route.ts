import { NextRequest, NextResponse } from "next/server";
import { validateText } from "@/services/validation";

// Reusable response formatter
function response(data: any = null, error: string | null = null, status = 200) {
    return NextResponse.json({ success: !error, data, error }, { status });
}

export async function POST(req: NextRequest) {
    try {
        const { text } = await req.json();
        console.log("Received Text:", text);

        const result = await validateText(text);
        return response({ result });
    } catch (error) {
        console.error("Validation API Error:", error);
        // Default allow if request parsing or validation fails
        return response(
            { result: "1" },
            "Validation failed, defaulting to allow",
            500
        );
    }
}
