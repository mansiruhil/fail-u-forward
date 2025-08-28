import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { fetchPosts, createPost } from "@/services/posts";
import { getUserById } from "@/services/users";

// Initialize Firebase Admin
if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
}

const auth = getAuth();

// Standardized response helper
function response(data: any = null, error: string | null = null, status = 200) {
    return NextResponse.json({ success: !error, data, error }, { status });
}

// GET /api/posts
export async function GET() {
    try {
        const posts = await fetchPosts();
        return response(posts);
    } catch (err) {
        console.error("Error fetching posts:", err);
        return response(null, "Failed to fetch posts", 500);
    }
}

// POST /api/posts
export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return response(null, "Unauthorized", 401);
        }

        const idToken = authHeader.split("Bearer ")[1];
        const decodedToken = await auth.verifyIdToken(idToken);
        const uid = decodedToken.uid;

        const { content, imageUrl } = await req.json();

        // Validate content
        const baseUrl = process.env.API_KEY;
        const validateResponse = await fetch(`${baseUrl}/api/validate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: content }),
        });
        const { result: validationResult } = await validateResponse.json();

        if (validationResult !== "1") {
            return response(null, "Content not appropriate for posting", 400);
        }

        // Get user info
        const userData = await getUserById(uid);
        const userName =
            userData?.username || userData?.displayName || "Anonymous";

        await createPost(uid, content, imageUrl, userName);
        return response({ message: "Post created successfully" });
    } catch (err) {
        console.error("Error creating post:", err);
        return response(null, "Unauthorized", 401);
    }
}
