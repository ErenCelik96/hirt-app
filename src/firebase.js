import "firebase/database";
import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";
import firebase from 'firebase'
require('firebase/auth')


const firebaseConfig = firebase.initializeApp({
    apiKey: "AIzaSyBOMt4KRGhpHIYePvhLiNBF3AFmE2lGVNg",
    authDomain: "hirt-app.firebaseapp.com",
    databaseURL: "https://hirt-app-default-rtdb.firebaseio.com",
    projectId: "hirt-app",
    storageBucket: "hirt-app.appspot.com",
    messagingSenderId: "871397672788",
    appId: "1:871397672788:web:d7755670720a6d65c5aac1",
    measurementId: "G-DCS51XJFBK"
  });
export default firebaseConfig;

// const db = firebaseApp.firestore();
export const db = firebaseConfig.database();
export const auth = firebaseConfig.auth();
export const provider = new firebase.auth.GoogleAuthProvider();