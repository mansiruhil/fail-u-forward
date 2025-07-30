import { NextRequest, NextResponse } from "next/server";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseApp } from "@/lib/firebase";

const db = getFirestore(firebaseApp);

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();

    if (!username || username.trim() === "") {
      return NextResponse.json({ valid: false, error: "Username is empty" }, { status: 400 });
    }

    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);

    const user = querySnapshot.docs.find(
      (doc) => doc.data().username === username
    );

    const isAvailable = !user;

    return NextResponse.json({ valid: isAvailable });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
