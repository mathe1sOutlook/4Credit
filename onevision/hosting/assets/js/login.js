import { signInWithEmail, signUpWithEmail, sendPasswordReset, signInWithGoogle } from './auth.js';
import { showToast } from './ui.js';

const loginForm = document.getElementById('login-form');
const googleBtn = document.getElementById('google');
const signupLink = document.getElementById('signup');
const resetLink = document.getElementById('reset');

const signupModal = new bootstrap.Modal(document.getElementById('signupModal'));
const resetModal = new bootstrap.Modal(document.getElementById('resetModal'));

loginForm.addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    await signInWithEmail(email, password);
  } catch (err) {
    showToast(err.message, 'danger');
  }
});

googleBtn.addEventListener('click', async () => {
  try {
    await signInWithGoogle();
  } catch (err) {
    showToast(err.message, 'danger');
  }
});

signupLink.addEventListener('click', e => {
  e.preventDefault();
  signupModal.show();
});

resetLink.addEventListener('click', e => {
  e.preventDefault();
  resetModal.show();
});

// Sign Up form handler
const signupForm = document.getElementById('signup-form');
signupForm.addEventListener('submit', async e => {
  e.preventDefault();
  if (!signupForm.checkValidity()) {
    signupForm.reportValidity();
    return;
  }
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  try {
    await signUpWithEmail(email, password);
    showToast('Conta criada', 'success');
    signupModal.hide();
    signupForm.reset();
  } catch (err) {
    showToast(err.message, 'danger');
  }
});

// Reset Password form handler
const resetForm = document.getElementById('reset-form');
resetForm.addEventListener('submit', async e => {
  e.preventDefault();
  if (!resetForm.checkValidity()) {
    resetForm.reportValidity();
    return;
  }
  const email = document.getElementById('reset-email').value;
  try {
    await sendPasswordReset(email);
    showToast('E-mail enviado', 'success');
    resetModal.hide();
    resetForm.reset();
  } catch (err) {
    showToast(err.message, 'danger');
  }
});
