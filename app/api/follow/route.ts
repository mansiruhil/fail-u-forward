import { NextRequest, NextResponse } from "next/server";
import { handleFollowAction } from "@/services/follow";

// Reusable response helper
function response(data: any = null, error: string | null = null, status = 200) {
    return NextResponse.json({ success: !error, data, error }, { status });
}

export async function POST(request: NextRequest) {
    try {
        const { targetUserId, action } = await request.json();

        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return response(null, "Unauthorized", 401);
        }

        const token = authHeader.split("Bearer ")[1];
        const result = await handleFollowAction(token, targetUserId, action);

        return response(result);
    } catch (error) {
        console.error("Follow/unfollow error:", error);
        return response(null, "Internal server error", 500);
    }
}
