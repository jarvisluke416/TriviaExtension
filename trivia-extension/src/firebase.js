// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Import the Realtime Database SDK

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "yourapikey",
  authDomain: "yourauthdomain",
  projectId: "yourprojectid",
  storageBucket: "yourstoragebucket",
  messagingSenderId: "yourmessaginesenderid",
  appId: "yourappid"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const db = getDatabase(app);  // Get the Firebase Realtime Database instance

// Export the db object to be used in other parts of your app
export { db };
