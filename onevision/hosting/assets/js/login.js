import { signInWithEmail, signUpWithEmail, sendPasswordReset, signInWithGoogle } from './auth.js';
import { showToast } from './ui.js';

const loginForm = document.getElementById('login-form');
const googleBtn = document.getElementById('google');

if (loginForm) {
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
}

if (googleBtn) {
  googleBtn.addEventListener('click', async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      showToast(err.message, 'danger');
    }
  });
}

// Sign Up form handler
const signupForm = document.getElementById('signup-form');
if (signupForm) {
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
      signupForm.reset();
      window.location.href = 'index.html';
    } catch (err) {
      showToast(err.message, 'danger');
    }
  });
}

// Reset Password form handler
const resetForm = document.getElementById('reset-form');
if (resetForm) {
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
      resetForm.reset();
      window.location.href = 'index.html';
    } catch (err) {
      showToast(err.message, 'danger');
    }
  });
}
