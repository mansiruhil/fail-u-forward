import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseApp } from "@/lib/firebase"; 

const db = getFirestore(firebaseApp);

export async function checkUsername(username: string) {
    if(username === "") return false;
    
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);

    const user = querySnapshot.docs.find(doc => doc.data().username === username);

    if(user) return false;
    return true;
}
