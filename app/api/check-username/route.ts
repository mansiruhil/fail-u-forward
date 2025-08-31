import { NextRequest, NextResponse } from "next/server";
import { checkUsernameAvailability } from "@/services/username";

export async function POST(req: NextRequest) {
    try {
        const { username } = await req.json();

        const isAvailable = await checkUsernameAvailability(username);

        return NextResponse.json({
            success: true,
            data: { valid: isAvailable },
            error: null,
        });
    } catch (error: any) {
        console.error("Username check error:", error.message);

        return NextResponse.json(
            {
                success: false,
                data: null,
                error: error.message || "Internal server error",
            },
            { status: error.message === "Invalid username" ? 400 : 500 }
        );
    }
}
