import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// firebase initialization
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();
const auth = getAuth();


export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const { text } = await req.json();

    const postRef = db.collection("posts").doc(params.id);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const post = postDoc.data();
    const comments = post?.comments || [];

    const newComment = {
      userId: uid,
      text,
      timestamp: Date.now(),
    };

    const newComments = [...comments, newComment];

    await postRef.update({
      comments: newComments,
    });

    return NextResponse.json({
      id: params.id,
      comments: newComments,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export const runtime = "nodejs";
