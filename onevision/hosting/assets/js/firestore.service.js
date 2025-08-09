import { db } from './firebase.init.js';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

export async function ensureCustomer(cnpj, uid) {
  const ref = doc(db, 'customers', cnpj);
  const snap = await getDoc(ref);
  if (snap.exists() && snap.data().ownerUid !== uid) {
    throw new Error('CNPJ já registrado por outro usuário.');
  }
  if (snap.exists()) {
    await updateDoc(ref, { updatedAt: serverTimestamp() });
  } else {
    await setDoc(ref, { ownerUid: uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  }
}

export async function addUpload(cnpj, upload, uid) {
  const col = collection(db, 'customers', cnpj, 'uploads');
  const ref = doc(col);
  await setDoc(ref, { ...upload, createdAt: serverTimestamp(), createdBy: uid });
  return ref.id;
}

export async function listReports(cnpj, type) {
  const col = collection(db, 'customers', cnpj, 'reports');
  let q = query(col);
  if (type) q = query(col, where('type', '==', type));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => ({ id: d.id, ...d.data() }));
}
