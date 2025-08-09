import { auth } from './firebase.init.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

export const signInWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const signUpWithEmail = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const sendPasswordReset = email => sendPasswordResetEmail(auth, email);

export const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const signOutUser = () => signOut(auth);

export const watchAuthState = cb => onAuthStateChanged(auth, cb);

// Redirect user based on auth state
watchAuthState(user => {
  const path = window.location.pathname;
  if (user && path.endsWith('index.html')) window.location.href = '/app.html';
  if (!user && path.endsWith('app.html')) window.location.href = '/index.html';
});
