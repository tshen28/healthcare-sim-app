import { db } from "@/src/services/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

export interface SimulationData {
  title: string;
  description: string;
  assignedTo: string;
  locked: boolean;
  files?: string[];
  images?: string[];
  updatedAt: string;
}

export const getAdminSimulations = async (userId: string) => {
  const simsRef = collection(db, "simulations");
  const q = query(simsRef, where("assignedTo", "array-contains", userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Update simulation details
export const updateSimulation = async (
  simId: string,
  data: Partial<SimulationData>,
) => {
  const simRef = doc(db, "simulations", simId);
  await updateDoc(simRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
};

// Toggle lock/unlock simulation
export const toggleSimulationLock = async (simId: string, locked: boolean) => {
  const simRef = doc(db, "simulations", simId);
  const simDoc = await getDoc(simRef);

  if (simDoc.exists()) {
    await updateDoc(simRef, {
      locked,
      updatedAt: new Date().toISOString(),
    });
  } else {
    // Document doesn't exist, create it with minimal data
    await setDoc(simRef, {
      locked,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
  }
};

// Create or update simulation
export const saveSimulation = async (simId: string, data: SimulationData) => {
  const simRef = doc(db, "simulations", simId);
  await setDoc(simRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
};

// Get simulation by ID
export const getSimulation = async (simId: string) => {
  const simRef = doc(db, "simulations", simId);
  const simDoc = await getDoc(simRef);
  if (simDoc.exists()) {
    return { id: simDoc.id, ...simDoc.data() };
  }
  return null;
};

// Add file URL to simulation
export const addFileToSimulation = async (simId: string, fileUrl: string) => {
  const sim = (await getSimulation(simId)) as any;
  const files = (sim?.files as string[]) || [];
  await updateSimulation(simId, {
    files: [...files, fileUrl],
  });
};

// Add image URL to simulation
export const addImageToSimulation = async (simId: string, imageUrl: string) => {
  const sim = (await getSimulation(simId)) as any;
  const images = (sim?.images as string[]) || [];
  await updateSimulation(simId, {
    images: [...images, imageUrl],
  });
};

// Subscribe to all simulations with real-time updates
export const subscribeToSimulations = (
  callback: (simulations: any[]) => void,
) => {
  const simsRef = collection(db, "simulations");

  return onSnapshot(
    simsRef,
    (snapshot) => {
      console.log(
        "Firestore snapshot received:",
        snapshot.docs.length,
        "documents",
      );
      const sims = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Parsed simulations:", sims);
      callback(sims);
    },
    (error) => {
      console.error("Firestore listener error:", error);
    },
  );
};
