// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Import the Realtime Database SDK

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCT_LcF3bvXyqov3POs24uaD00XQTRW2bc",
  authDomain: "triviaextension-df2e3.firebaseapp.com",
  projectId: "triviaextension-df2e3",
  storageBucket: "triviaextension-df2e3.firebasestorage.app",
  messagingSenderId: "562654381363",
  appId: "1:562654381363:web:ef2094fa3c8de36c59aa46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const db = getDatabase(app);  // Get the Firebase Realtime Database instance

// Export the db object to be used in other parts of your app
export { db };
