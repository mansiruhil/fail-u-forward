import {
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { db } from "@/lib/firebase";

// Ensure Firebase Admin is initialized once
if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
    });
}

export async function handleFollowAction(
    token: string,
    targetUserId: string,
    action: string
) {
    const auth = getAuth();

    // 🔐 Verify Firebase ID token
    const decodedToken = await auth.verifyIdToken(token).catch(() => {
        throw new Error("Invalid token");
    });
    const currentUserId = decodedToken.uid;

    if (currentUserId === targetUserId) {
        throw new Error("Cannot follow yourself");
    }

    // 🔍 Ensure target user exists
    const targetUserDoc = doc(db, "users", targetUserId);
    const targetUserSnap = await getDoc(targetUserDoc);
    if (!targetUserSnap.exists()) {
        throw new Error("User not found");
    }

    const currentUserDoc = doc(db, "users", currentUserId);

    if (action === "follow") {
        await updateDoc(currentUserDoc, {
            following: arrayUnion(targetUserId),
        });
        await updateDoc(targetUserDoc, {
            followers: arrayUnion(currentUserId),
        });
    } else if (action === "unfollow") {
        await updateDoc(currentUserDoc, {
            following: arrayRemove(targetUserId),
        });
        await updateDoc(targetUserDoc, {
            followers: arrayRemove(currentUserId),
        });
    } else {
        throw new Error("Invalid action");
    }

    return { action, currentUserId, targetUserId };
}
