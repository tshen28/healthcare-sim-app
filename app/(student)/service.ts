import { db } from "@/src/services/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export const getStudentSimulations = async (userId: string) => {
    const simsRef = collection(db, "simulations");
    const q = query(simsRef, where("assignedTo", "array-contains", userId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}