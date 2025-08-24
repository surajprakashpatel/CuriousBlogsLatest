import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAb-MRWVM2KvaVYDUrG4BIEosIMNQaAHZw",
  authDomain: "curious-blogs.firebaseapp.com",
  projectId: "curious-blogs",
  storageBucket: "curious-blogs.firebasestorage.app",
  messagingSenderId: "6290823055",
  appId: "1:6290823055:web:f07ba5d88fc96503a0ddfa",
  measurementId: "G-6DFHPRG1C1"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { db, auth, storage, analytics };