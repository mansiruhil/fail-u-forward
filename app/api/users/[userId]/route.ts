// app/api/users/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserById } from "@/services/users";

function response(data: any = null, error: string | null = null, status = 200) {
    return NextResponse.json({ success: !error, data, error }, { status });
}

export async function GET(
    req: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const user = await getUserById(params.userId);

        if (!user) {
            return response(null, "User not found", 404);
        }

        return response(user);
    } catch (err) {
        console.error("Error fetching user:", err);
        return response(null, "Internal server error", 500);
    }
}
