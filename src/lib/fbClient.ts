import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

/** Клиентский Firebase (только Auth для входа через Google). */
const app = initializeApp({
  apiKey: "AIzaSyAX2az15_r4IwgKZX3_omhrhwqRe27gu8Q",
  authDomain: "animee-1d7de.firebaseapp.com",
  projectId: "animee-1d7de",
  storageBucket: "animee-1d7de.firebasestorage.app",
  messagingSenderId: "499659545480",
  appId: "1:499659545480:web:ab71296f48d7a918c6783d",
});

export const auth = getAuth(app);
