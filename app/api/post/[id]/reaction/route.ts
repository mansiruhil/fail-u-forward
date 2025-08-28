// app/api/post/[id]/reaction/route.ts
import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

type ReactionData = { count: number; users: string[] };
type Reactions = {
  [key: string]: ReactionData;
};

const db = getFirestore();
const auth = getAuth();

const VALID_REACTIONS = [
  "hit_hard",
  "sending_love",
  "deep_insight",
  "thank_you",
  "been_there",
];

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

    const { reactionType } = await req.json();

    // Validate reaction type
    if (!VALID_REACTIONS.includes(reactionType)) {
      return NextResponse.json({ error: "Invalid reaction type" }, { status: 400 });
    }

    const postRef = db.collection("posts").doc(params.id);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const post = postDoc.data();
    const reactions = post?.reactions || {};
    const dislikedBy = post?.dislikedBy || [];

    const updatedReactions: Reactions = { ...reactions };

    if (!updatedReactions[reactionType]) {
      updatedReactions[reactionType] = { count: 0, users: [] };
    }

    const currentReaction = updatedReactions[reactionType];
    const hasReacted = currentReaction.users.includes(uid);

    // Remove user from all other reactions
    for (const [key, reaction] of Object.entries(updatedReactions)) {
      const r = reaction as ReactionData;
      if (key !== reactionType && r.users.includes(uid)) {
        updatedReactions[key] = {
          count: Math.max(r.count - 1, 0),
          users: r.users.filter((userId) => userId !== uid),
        };
      }
    }

    // Toggle the selected reaction 
    if (hasReacted) {
      // Remove reaction
      updatedReactions[reactionType] = {
        count: Math.max(currentReaction.count - 1, 0),
        users: currentReaction.users.filter((userId) => userId !== uid),
      };
    } else {
      // Add reaction
      updatedReactions[reactionType] = {
        count: currentReaction.count + 1,
        users: [...currentReaction.users, uid],
      };
    }

    // Remove user from dislikedBy if present
    let updatedDislikedBy = dislikedBy;
    if (dislikedBy.includes(uid)) {
      updatedDislikedBy = dislikedBy.filter((id: string) => id !== uid);
    }

    const updateData: any = {
      reactions: updatedReactions,
      dislikedBy: updatedDislikedBy,
      dislikes: updatedDislikedBy.length,
    };

    await postRef.update(updateData);

    const updatedDoc = await postRef.get();
    const updatedPost = updatedDoc.data();

    return NextResponse.json({
      id: params.id,
      likes: updatedPost?.likes || 0,
      likedBy: updatedPost?.likedBy || [],
      dislikes: updatedPost?.dislikes || 0,
      dislikedBy: updatedPost?.dislikedBy || [],
      reactions: updatedPost?.reactions || {},
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to update reaction" }, { status: 500 });
  }
}

export const runtime = "nodejs";
