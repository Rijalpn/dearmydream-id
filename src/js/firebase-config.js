/**
 * FIREBASE INITIALIZATION & FIRESTORE EXPORTS
 * Project: dearmydream-id-2026
 */

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  deleteDoc, 
  doc, 
  updateDoc, 
  increment,
  serverTimestamp 
} from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyB5XHBxL1v0k14GGDydN6Cj6pcye3Rbh2w",
  authDomain: "dearmydream-id-2026.firebaseapp.com",
  projectId: "dearmydream-id-2026",
  storageBucket: "dearmydream-id-2026.firebasestorage.app",
  messagingSenderId: "131871709272",
  appId: "1:131871709272:web:9a5688543dbbfe8122d22d"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  deleteDoc, 
  doc, 
  updateDoc, 
  increment,
  serverTimestamp 
};
