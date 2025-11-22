// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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