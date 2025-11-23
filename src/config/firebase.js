// Firebase configuration (Frontend - for future use like storage)
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBhQXblcEKZokVrUAh3OduFoWiuOLvqBQ4",
    authDomain: "driverai-90d7b.firebaseapp.com",
    projectId: "driverai-90d7b",
    storageBucket: "driverai-90d7b.firebasestorage.app",
    messagingSenderId: "231135167080",
    appId: "1:231135167080:web:580027d2f981ca3b07b1dd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;