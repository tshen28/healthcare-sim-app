import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBpVyo-9_47zr0_k17RVfQH-l-OMOZN0RY",
  authDomain: "healthcare-sim-d2cce.firebaseapp.com",
  projectId: "healthcare-sim-d2cce",
  storageBucket: "healthcare-sim-d2cce.firebasestorage.app",
  messagingSenderId: "880223810176",
  appId: "1:880223810176:web:9cc000cfcc44a483dfec65",
  measurementId: "G-9J4JPWN38N"
};

const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);