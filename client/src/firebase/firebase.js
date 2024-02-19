// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAyU2PpTlsLWBdcWQcEIjoUj3zLeWOJxMU",
  authDomain: "feedback-org-f46b9.firebaseapp.com",
  projectId: "feedback-org-f46b9",
  storageBucket: "feedback-org-f46b9.appspot.com",
  messagingSenderId: "759888812002",
  appId: "1:759888812002:web:a91b555f37320f254f4bbb",
  measurementId: "G-9G1F3QG65D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const analytics = getAnalytics(app);

export { db }