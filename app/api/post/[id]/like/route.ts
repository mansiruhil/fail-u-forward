import { NextRequest, NextResponse } from "next/server";
import { toggleLike } from "@/services/posts";
import { getAuth } from "firebase-admin/auth";
const auth = getAuth();

function response(data: any = null, error: string | null = null, status = 200) {
    return NextResponse.json({ success: !error, data, error }, { status });
}

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer "))
            return response(null, "Unauthorized", 401);

        const idToken = authHeader.split("Bearer ")[1];
        const decodedToken = await auth.verifyIdToken(idToken);
        const uid = decodedToken.uid;

        const updatedPost = await toggleLike(params.id, uid);
        if (!updatedPost) return response(null, "Post not found", 404);

        return response(updatedPost);
    } catch (err) {
        console.error("Error toggling like:", err);
        return response(null, "Unauthorized", 401);
    }
}

export const runtime = "nodejs";
