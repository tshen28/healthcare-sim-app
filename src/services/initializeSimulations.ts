import { simulations } from "@/src/data/simulations";
import { db } from "@/src/services/firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

export const initializeSimulations = async () => {
  try {
    const simsRef = collection(db, "simulations");

    for (const sim of simulations) {
      const simDocRef = doc(simsRef, sim.id);
      const simDoc = await getDoc(simDocRef);

      const simData = {
        title: sim.title,
        description: sim.description,
        locked: sim.locked,
        assignedTo: sim.assignedTo || "all",
        cbc: sim.cbc || "",
        cmp: sim.cmp || "",
        ekg: sim.ekg || "",
        xr: sim.xr || "",
        ct: sim.ct || "",
        bloodGas: sim.bloodGas || "",
        ultrasound: sim.ultrasound || "",
        files: [],
        images: [],
        updatedAt: new Date().toISOString(),
      };

      // Create if doesn't exist, or update if assignedTo is missing
      if (!simDoc.exists()) {
        await setDoc(simDocRef, {
          ...simData,
          createdAt: new Date().toISOString(),
        });
        console.log(`✅ Created simulation: ${sim.title}`);
      } else if (!simDoc.data()?.assignedTo) {
        // Update existing document if it's missing assignedTo
        await setDoc(simDocRef, simData, { merge: true });
        console.log(`✅ Updated simulation: ${sim.title} (added assignedTo)`);
      }
    }

    console.log("✅ All simulations initialized in Firestore");
  } catch (error) {
    console.error("❌ Error initializing simulations:", error);
  }
};
