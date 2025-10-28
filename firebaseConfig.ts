// Import the functions you need from the SDKs you need
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALBnlDRly-1uKbKe5GGLrXKy0TDc0BtyQ",
  authDomain: "movieflix-7c201.firebaseapp.com",
  projectId: "movieflix-7c201",
  storageBucket: "movieflix-7c201.firebasestorage.app",
  messagingSenderId: "367831309119",
  appId: "1:367831309119:web:990fdcb78277e31013118a",
  measurementId: "G-84LXH7Y2GF"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});