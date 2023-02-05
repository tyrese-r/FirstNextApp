import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { collection, doc, getDoc, getDocs, getFirestore, limit, query, serverTimestamp, where } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBKsfqxohXeMsrx8ZcXVoK7R6gfzbyqgEc",
  authDomain: "next-firebase-app-a872b.firebaseapp.com",
  projectId: "next-firebase-app-a872b",
  storageBucket: "next-firebase-app-a872b.appspot.com",
  messagingSenderId: "1092237387322",
  appId: "1:1092237387322:web:e9abbdc448c0c35c0c7703"
};

export const app = initializeApp(firebaseConfig)

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app)

export const googleAuthProvider = new GoogleAuthProvider();

export async function getUserWithUsername(username) {
  const usersRef = collection(db, 'users');
  const queryDoc = query(usersRef, where('username', '==', username), limit(1))

  const userDoc = (await getDocs(queryDoc)).docs[0]
  return userDoc;
}

export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  }
}

