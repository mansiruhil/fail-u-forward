import { NextRequest, NextResponse } from "next/server";
import { editPostContent } from "@/services/posts";

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
        if (!authHeader?.startsWith("Bearer "))
            return response(null, "Unauthorized", 401);

        const idToken = authHeader.split("Bearer ")[1];
        const decodedToken = await auth.verifyIdToken(idToken);
        const uid = decodedToken.uid;

        const { content } = await req.json();
        const result = await editPostContent(params.id, uid, content);

        if (result.error) return response(null, result.error, result.status);
        return response(result);
    } catch (err) {
        console.error("Error editing post:", err);
        return response(null, "Unauthorized", 401);
    }
}

export const runtime = "nodejs";
