// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhylYksJW0ZXun9W_2BBUTWSpR0xr02pM",
  authDomain: "vendas-de-trabalho.firebaseapp.com",
  projectId: "vendas-de-trabalho",
  storageBucket: "vendas-de-trabalho.firebasestorage.app",
  messagingSenderId: "315909292221",
  appId: "1:315909292221:web:f52ab1cc05b0482e2477d4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { app, auth };
