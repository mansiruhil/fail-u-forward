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

export async function GET() {
  try {
    const postsSnapshot = await db.collection('posts').orderBy('timestamp', 'desc').get();
    const posts = postsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp)
      };
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const { content, imageUrl } = await req.json();

    // const baseUrl = process.env.NODE_ENV === 'production' ? `https://${process.env.VERCEL_URL}`: 'http://localhost:3000';
    const baseUrl = process.env.API_KEY;
    const validateResponse = await fetch(`${baseUrl}/api/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: content })
    });

    const { result: validationResult } = await validateResponse.json();

    if (validationResult !== "1") {
      return NextResponse.json({ error: "Content not appropriate for posting" }, { status: 400 });
    }

    const userDoc = await db.collection('users').doc(uid).get();
    const userData = userDoc.data();
    const userName = userData?.username || userData?.displayName || "Anonymous";

    // Updated post creation with reactions field
    await db.collection('posts').add({
      content,
      imageUrl: imageUrl || null,
      timestamp: new Date(),
      userId: uid,
      userName: userName,
      editableUntil: Date.now() + 10 * 60 * 1000,
      likes: 0,
      likedBy: [],
      dislikes: 0,
      dislikedBy: [],
      shares: 0,
      comments: [],
      // NEW: Initialize reactions
      reactions: {
        hit_hard: { count: 0, users: [] },
        sending_love: { count: 0, users: [] },
        deep_insight: { count: 0, users: [] },
        thank_you: { count: 0, users: [] },
        been_there: { count: 0, users: [] }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
