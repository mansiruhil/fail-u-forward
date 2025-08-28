import { NextRequest, NextResponse } from "next/server";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseApp } from "@/lib/firebase"; // Make sure this path is correct

const db = getFirestore(firebaseApp);

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();

    if (!username || typeof username !== "string" || username.trim() === "") {
      return NextResponse.json({ valid: false, error: "Invalid username" }, { status: 400 });
    }

    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);

    const userExists = querySnapshot.docs.some(
      (doc) => doc.data().username === username
    );

    return NextResponse.json({ valid: !userExists });
  } catch (error) {
    console.error("Username check error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
