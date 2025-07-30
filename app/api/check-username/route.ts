import { NextResponse } from "next/server";
import { checkUsername } from "@/lib/db/queries"; // instead of utils

export async function POST(req: Request) {
  try {
    const { username } = await req.json();
    const isAvailable = await checkUsername(username);
    return NextResponse.json({ available: isAvailable });
  } catch (err) {
    console.error("Username check failed:", err);
    return NextResponse.json({ available: false }, { status: 500 });
  }
}
