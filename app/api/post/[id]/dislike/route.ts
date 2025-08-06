import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

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

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const postRef = db.collection('posts').doc(params.id);
    const postDoc = await postRef.get();
    
    if (!postDoc.exists) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const post = postDoc.data();
    const likedBy = post?.likedBy || [];
    const dislikedBy = post?.dislikedBy || [];
    const hasLiked = likedBy.includes(uid);
    const hasDisliked = dislikedBy.includes(uid);

    const reactions = post?.reactions || {};
    const updatedReactions = { ...reactions };

    // Remove user from all emoji reactions
    for (const [key, reaction] of Object.entries(updatedReactions)) {
      const r = reaction as { count: number; users: string[] };
      if (r.users.includes(uid)) {
        updatedReactions[key] = {
          count: Math.max(r.count - 1, 0),
          users: r.users.filter((userId: string) => userId !== uid),
        };
      }
    }


    let newLikedBy, newDislikedBy, newLikes, newDislikes;

    if (hasDisliked) {
      newDislikedBy = dislikedBy.filter((id: string) => id !== uid);
      newDislikes = Math.max((post?.dislikes || 0) - 1, 0);
      newLikedBy = likedBy;
      newLikes = post?.likes || 0;
    } else {
      newDislikedBy = [...dislikedBy, uid];
      newDislikes = (post?.dislikes || 0) + 1;
      if (hasLiked) {
        newLikedBy = likedBy.filter((id: string) => id !== uid);
        newLikes = Math.max((post?.likes || 0) - 1, 0);
      } else {
        newLikedBy = likedBy;
        newLikes = post?.likes || 0;
      }
    }

    await postRef.update({
      likes: newLikes,
      likedBy: newLikedBy,
      dislikes: newDislikes,
      dislikedBy: newDislikedBy,
      reactions: updatedReactions, 
    });

    return NextResponse.json({
      id: params.id,
      likes: newLikes,
      likedBy: newLikedBy,
      dislikes: newDislikes,
      dislikedBy: newDislikedBy,
      reactions: updatedReactions
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export const runtime = 'nodejs';