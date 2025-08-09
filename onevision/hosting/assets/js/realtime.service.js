import { rtdb } from './firebase.init.js';
import { ref, onValue, set } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js';

export function watchProgress(uid, cnpj, uploadId, cb) {
  const r = ref(rtdb, `/progress/${uid}/${cnpj}/${uploadId}`);
  return onValue(r, snap => cb(snap.val()));
}

export function setProgress(uid, cnpj, uploadId, data) {
  return set(ref(rtdb, `/progress/${uid}/${cnpj}/${uploadId}`), {
    ...data,
    updatedAt: Date.now()
  });
}
