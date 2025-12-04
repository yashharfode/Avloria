// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyBajIBwDFjFgPPUEWP2DGfoLbNkmAjZSTI",
  authDomain: "avaloria-33e60.firebaseapp.com",
  projectId: "avaloria-33e60",
  storageBucket: "avaloria-33e60.appspot.com",
  messagingSenderId: "288615711345",
  appId: "1:288615711345:web:8a7882c7587f3802b011d0",
  measurementId: "G-RR1VGJB0TK"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
