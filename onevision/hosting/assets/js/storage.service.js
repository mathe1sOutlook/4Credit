import { storage } from './firebase.init.js';
import { ref, uploadBytes } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js';
import { sanitizeFileName } from './validators.js';

export async function uploadFile(uid, cnpj, type, file) {
  const date = new Date().toISOString().slice(0, 10);
  const name = sanitizeFileName(file.name);
  const path = `uploads/${uid}/${cnpj}/${type}/${date}/${name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return {
    filePath: `gs://${storageRef.bucket}/${path}`,
    fileName: name,
    size: file.size
  };
}
