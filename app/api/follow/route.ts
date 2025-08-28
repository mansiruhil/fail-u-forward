import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase-admin/auth';
import { firebaseApp, db } from '@/lib/firebase';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function POST(request: NextRequest) {
  try {
    const { targetUserId, action } = await request.json();
    
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    
    const auth = getAuth();
    let decodedToken;
    
    try {
      decodedToken = await auth.verifyIdToken(token);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const currentUserId = decodedToken.uid;

    if (currentUserId === targetUserId) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
    }

    // Check if target user exists
    const targetUserDoc = doc(db, 'users', targetUserId);
    const targetUserSnap = await getDoc(targetUserDoc);
    
    if (!targetUserSnap.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const currentUserDoc = doc(db, 'users', currentUserId);

    if (action === 'follow') {
      // Add targetUserId to current user's following list
      await updateDoc(currentUserDoc, {
        following: arrayUnion(targetUserId)
      });
      
      // Add currentUserId to target user's followers list
      await updateDoc(targetUserDoc, {
        followers: arrayUnion(currentUserId)
      });
    } else if (action === 'unfollow') {
      // Remove targetUserId from current user's following list
      await updateDoc(currentUserDoc, {
        following: arrayRemove(targetUserId)
      });
      
      // Remove currentUserId from target user's followers list
      await updateDoc(targetUserDoc, {
        followers: arrayRemove(currentUserId)
      });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true, action });
  } catch (error) {
    console.error('Follow/unfollow error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}