import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseApp } from "@/lib/firebase";

const db = getFirestore(firebaseApp);

export async function checkUsernameAvailability(
    username: string
): Promise<boolean> {
    if (!username || typeof username !== "string" || username.trim() === "") {
        throw new Error("Invalid username");
    }

    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);

    return !querySnapshot.docs.some((doc) => doc.data().username === username);
}
