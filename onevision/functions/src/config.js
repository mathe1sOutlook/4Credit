import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { getDatabase } from 'firebase-admin/database';
import { defineSecret } from 'firebase-functions/params';

// Initialize Firebase Admin SDK
initializeApp();

export const db = getFirestore();
export const storage = getStorage();
export const rtdb = getDatabase();

// Secret for OpenAI API Key
export const OPENAI_API_KEY = defineSecret('OPENAI_API_KEY');
