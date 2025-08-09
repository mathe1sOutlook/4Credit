import { auth } from './firebase.init.js';
import { ensureCustomer, addUpload, listReports } from './firestore.service.js';
import { uploadFile } from './storage.service.js';
import { watchProgress } from './realtime.service.js';
import { isValidCNPJ, isAllowedFile } from './validators.js';
import { renderReports } from './reports.view.js';
import { showToast, setLoading } from './ui.js';
import { signOutUser } from './auth.js';

const cnpjInput = document.getElementById('cnpj');
const processBtn = document.getElementById('process-btn');
const progressBar = document.getElementById('progress-bar');
const reportContainer = document.getElementById('reports');
const fileInputs = {
  VADU: document.getElementById('file-vadu'),
  SERASA: document.getElementById('file-serasa'),
  SCR: document.getElementById('file-scr')
};

let currentCNPJ = '';
let pending = {};

cnpjInput.addEventListener('input', () => {
  const val = cnpjInput.value.replace(/\D/g, '');
  if (isValidCNPJ(val)) {
    currentCNPJ = val;
    ensureCustomer(val, auth.currentUser.uid).catch(e => showToast(e.message, 'danger'));
  } else {
    currentCNPJ = '';
  }
  updateProcessBtn();
});

Object.entries(fileInputs).forEach(([type, input]) => {
  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;
    const check = isAllowedFile(file, { maxMB: 20, types: ['pdf', 'csv', 'xlsx'] });
    if (!check.ok) {
      showToast(check.error, 'danger');
      input.value = '';
      return;
    }
    pending[type] = file;
    updateProcessBtn();
  });
});

function updateProcessBtn() {
  processBtn.disabled = !(currentCNPJ && Object.keys(pending).length);
}

processBtn.addEventListener('click', async () => {
  try {
    setLoading(processBtn, true);
    const uid = auth.currentUser.uid;
    const cnpj = currentCNPJ;
    for (const [type, file] of Object.entries(pending)) {
      const meta = await uploadFile(uid, cnpj, type, file);
      const uploadId = await addUpload(cnpj, { ...meta, type, status: 'uploaded' }, uid);
      watchProgress(uid, cnpj, uploadId, snap => {
        if (snap) {
          progressBar.style.width = snap.percent + '%';
          progressBar.classList.add('fade-in');
        }
      });
      const token = await auth.currentUser.getIdToken();
      const res = await fetch('/api/process-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ cnpj, uploadId })
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error.message);
    }
    pending = {};
    Object.values(fileInputs).forEach(i => (i.value = ''));
    await loadReports();
    showToast('Processamento concluído', 'success');
  } catch (err) {
    showToast(err.message, 'danger');
  } finally {
    setLoading(processBtn, false);
    progressBar.style.width = '0%';
    progressBar.classList.remove('fade-in');
    updateProcessBtn();
  }
});

async function loadReports() {
  if (!currentCNPJ) return;
  const reports = await listReports(currentCNPJ);
  renderReports(reportContainer, reports);
  Array.from(reportContainer.children).forEach(el => el.classList.add('fade-in'));
}

document.getElementById('logout').addEventListener('click', () => signOutUser());

window.addEventListener('load', loadReports);
