import { NextRequest, NextResponse } from "next/server";
import { toggleReaction } from "@/services/posts";
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

        const { reactionType } = await req.json();
        const result = await toggleReaction(params.id, uid, reactionType);

        if (result.error) return response(null, result.error, result.status);
        const updatedPost = result.post;

        return response({
            id: params.id,
            likes: updatedPost?.likes || 0,
            likedBy: updatedPost?.likedBy || [],
            dislikes: updatedPost?.dislikes || 0,
            dislikedBy: updatedPost?.dislikedBy || [],
            reactions: updatedPost?.reactions || {},
        });
    } catch (err) {
        console.error("Error updating reaction:", err);
        return response(null, "Failed to update reaction", 500);
    }
}

export const runtime = "nodejs";
