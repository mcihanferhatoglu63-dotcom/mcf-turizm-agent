import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDp8uZ-X5unkx9o1PP2OBskqRFrWo4mnME",
  authDomain: "mcf-turizm-agent.firebaseapp.com",
  projectId: "mcf-turizm-agent",
  storageBucket: "mcf-turizm-agent.firebasestorage.app",
  messagingSenderId: "997224307621",
  appId: "1:997224307621:web:357f5cb5c11cb04d22a64c",
  measurementId: "G-QKMSKMNQ26"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);