import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    
    const userDoc = doc(db, 'users', userId);
    const userSnap = await getDoc(userDoc);
    
    if (!userSnap.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userSnap.data();
    
    // Return public user data (exclude sensitive information)
    const publicUserData = {
      id: userId,
      username: userData.username,
      email: userData.email,
      bio: userData.bio,
      location: userData.location,
      profilepic: userData.profilepic,
      failedExperience: userData.failedExperience || [],
      misEducation: userData.misEducation || [],
      failureHighlights: userData.failureHighlights || [],
      followers: userData.followers || [],
      following: userData.following || [],
      followerCount: userData.followers?.length || 0,
      followingCount: userData.following?.length || 0
    };

    return NextResponse.json(publicUserData);
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}