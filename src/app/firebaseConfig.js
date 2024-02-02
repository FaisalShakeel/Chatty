// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_mRMYQTMIK5SFv5SzkLDLvF6Wj32jMLI",
  authDomain: "chatty-f7de1.firebaseapp.com",
  projectId: "chatty-f7de1",
  storageBucket: "chatty-f7de1.appspot.com",
  messagingSenderId: "1064751128865",
  appId: "1:1064751128865:web:b5d7face00a3753f679e60",
  measurementId: "G-94C4H0GHNV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app)
export  default storage
