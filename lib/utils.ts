import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseApp } from "@/lib/firebase";

// Tailwind class merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Check username availability
const db = getFirestore(firebaseApp);

export async function checkUsername(username: string) {
  if (!username) return false;

  const usersRef = collection(db, "users");
  const querySnapshot = await getDocs(usersRef);

  const user = querySnapshot.docs.find(doc => doc.data().username === username);
  return !user;
}
