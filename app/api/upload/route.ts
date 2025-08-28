import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import axios from 'axios';


interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  resource_type: string;
  [key: string]: any;
}


// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}


export async function POST(req: NextRequest) {
  console.log('Upload request received');
 
  try {
    // Verify user authentication if provided (optional)
    const authHeader = req.headers.get('authorization');
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const idToken = authHeader.split('Bearer ')[1];
      try {
        console.log('Verifying ID token...');
        await admin.auth().verifyIdToken(idToken);
        console.log('ID token verified successfully');
      } catch (authError) {
        console.error('Invalid auth token, proceeding unauthenticated:', authError);
      }
    }


    // Accept multipart/form-data (FormData) or JSON with base64
    const contentType = req.headers.get('content-type') || '';
    let fileBuffer: Buffer;
    let detectedMimeType: string;
    if (contentType.includes('multipart/form-data')) {
      console.log('Parsing multipart/form-data...');
      const form = await req.formData();
      const file = form.get('file') as unknown as File | null;
      if (!file) {
        console.error('No file found in form-data');
        return NextResponse.json({
          error: 'No file provided',
          message: 'Please attach a file field named "file"'
        }, { status: 400 });
      }
      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
      detectedMimeType = (file as any).type || 'image/png';
    } else {
      console.log('Parsing JSON body...');
      const body = await req.json().catch(() => null);
      const imageData = body?.image as string | undefined;
      if (!imageData) {
        console.error('No image data found in the request');
        return NextResponse.json({
          error: 'No image data provided',
          message: 'Please provide an image via multipart/form-data or base64 JSON'
        }, { status: 400 });
      }
      const matches = imageData.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        console.error('Invalid base64 image data');
        return NextResponse.json({
          error: 'Invalid image format',
          message: 'Please provide a valid base64 encoded image'
        }, { status: 400 });
      }
      fileBuffer = Buffer.from(matches[2], 'base64');
      detectedMimeType = matches[1];
    }
    const fileExtension = detectedMimeType.split('/')[1] || 'png';
    const fileName = `uploads/${Date.now()}.${fileExtension}`;


    // Cloudinary configuration
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;


    if (!cloudName || !uploadPreset || !apiKey || !apiSecret) {
      console.error('Cloudinary configuration is missing in environment variables.');
      return NextResponse.json(
        {
          error: 'Server configuration error',
          message: 'Cloudinary configuration is missing.'
        },
        { status: 500 }
      );
    }
     
    console.log('Using Cloudinary with config:', {
      cloudName,
      uploadPreset
    });


    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (fileBuffer.length > maxSize) {
      console.error('File too large:', fileBuffer.length, 'bytes');
      return NextResponse.json({
        error: 'File too large',
        message: 'Maximum file size is 5MB'
      }, { status: 400 });
    }


    // Validate file type from MIME type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(detectedMimeType)) {
      console.error('Invalid file type:', detectedMimeType);
      return NextResponse.json({
        error: 'Invalid file type',
        message: 'Only JPG, PNG, GIF, and WebP images are allowed'
      }, { status: 400 });
    }


    try {
      console.log('Uploading to Cloudinary...');
     
      const base64Data = fileBuffer.toString('base64');
      const dataUrl = `data:${detectedMimeType};base64,${base64Data}`;
     
      // Create form data for Cloudinary
      const formData = new FormData();
      formData.append('file', dataUrl);
      formData.append('upload_preset', uploadPreset);
     
      // Upload to Cloudinary
      const response = await axios.post<CloudinaryResponse>(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );


      const cloudinaryResult = response.data;
     
      if (!cloudinaryResult.secure_url) {
        throw new Error('No secure URL returned from Cloudinary');
      }
     
      console.log('Cloudinary upload successful:', {
        url: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id,
        format: cloudinaryResult.format,
        bytes: cloudinaryResult.bytes
      });


      // Return the URL and additional metadata
      return NextResponse.json({
        url: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id,
        format: cloudinaryResult.format,
        bytes: cloudinaryResult.bytes,
        resourceType: cloudinaryResult.resource_type || 'image'
      });
    } catch (cloudinaryError) {
      console.error('Error uploading to Cloudinary:', cloudinaryError);
      throw new Error(
        cloudinaryError instanceof Error
          ? cloudinaryError.message
          : 'Failed to upload file to Cloudinary'
      );
    }
  } catch (error) {
    console.error('Error in upload API:', error);
    return NextResponse.json(
      {
        error: 'Failed to upload file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
