import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseApp } from "@/lib/firebase";

// For merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// For checking username availability in Firestore
const db = getFirestore(firebaseApp);

export async function checkUsername(username: string) {
  if (!username || username.trim() === "") return false;

  const usersRef = collection(db, "users");
  const querySnapshot = await getDocs(usersRef);

  const user = querySnapshot.docs.find(doc => doc.data().username === username);
  return !user; // true if not found => available
}
