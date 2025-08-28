import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { incrementShare } from "@/services/posts";

function response(data: any = null, error: string | null = null, status = 200) {
    return NextResponse.json({ success: !error, data, error }, { status });
}
const auth = getAuth();

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer "))
            return response(null, "Unauthorized", 401);

        const idToken = authHeader.split("Bearer ")[1];
        await auth.verifyIdToken(idToken); // just validate user, no need to store UID

        const result = await incrementShare(params.id);
        if (result.error) return response(null, result.error, result.status);

        return response(result);
    } catch (err) {
        console.error("Error incrementing shares:", err);
        return response(null, "Unauthorized", 401);
    }
}

export const runtime = "nodejs";
