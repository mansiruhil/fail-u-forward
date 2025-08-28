import { NextRequest, NextResponse } from "next/server";
import { getPostById, addCommentToPost } from "@/services/posts";
import { getAuth } from "firebase-admin/auth";
const auth = getAuth();

// Standardized response helper
function response(data: any = null, error: string | null = null, status = 200) {
    return NextResponse.json({ success: !error, data, error }, { status });
}

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return response(null, "Unauthorized", 401);
        }

        const idToken = authHeader.split("Bearer ")[1];
        const decodedToken = await auth.verifyIdToken(idToken);
        const uid = decodedToken.uid;

        const { text } = await req.json();

        const postExists = await getPostById(params.id);
        if (!postExists) {
            return response(null, "Post not found", 404);
        }

        const updatedComments = await addCommentToPost(params.id, {
            userId: uid,
            text,
        });
        return response({ id: params.id, comments: updatedComments });
    } catch (err) {
        console.error("Error posting comment:", err);
        return response(null, "Unauthorized", 401);
    }
}

export const runtime = "nodejs";
