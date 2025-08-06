import { NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin';

export async function POST(req: NextRequest) {
  try {
    // Verify user authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    await admin.auth().verifyIdToken(idToken);

    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Upload to Cloudinary using server-side credentials
    const cloudinaryData = new FormData();
    cloudinaryData.append('file', image);
    cloudinaryData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET!);

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: cloudinaryData,
      }
    );

    if (!cloudinaryResponse.ok) {
      throw new Error('Failed to upload to Cloudinary');
    }

    const cloudinaryJson = await cloudinaryResponse.json();

    return NextResponse.json({
      success: true,
      url: cloudinaryJson.secure_url,
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
