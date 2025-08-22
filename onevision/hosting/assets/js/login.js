import { signInWithEmail, signUpWithEmail, sendPasswordReset, signInWithGoogle } from './auth.js';
import { showToast, setLoading, handleError } from './ui.js';

const loginForm = document.getElementById('login-form');
const googleBtn = document.getElementById('google');
const azureBtn = document.getElementById('azure');
const requestAccess = document.getElementById('request-access');

if (loginForm) {
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = loginForm.querySelector('button[type="submit"]');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
      setLoading(btn, true);
      await signInWithEmail(email, password);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(btn, false);
    }
  });
}

if (googleBtn) {
  googleBtn.addEventListener('click', async () => {
    try {
      setLoading(googleBtn, true);
      await signInWithGoogle();
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(googleBtn, false);
    }
  });
}

if (azureBtn) {
  azureBtn.addEventListener('click', () => {
    showToast('Integração Azure AD em breve', 'info');
  });
}

if (requestAccess) {
  requestAccess.addEventListener('click', e => {
    e.preventDefault();
    window.location.href = 'signup.html';
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
    const btn = signupForm.querySelector('button[type="submit"]');
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    try {
      setLoading(btn, true);
      await signUpWithEmail(email, password);
      showToast('Conta criada', 'success');
      signupForm.reset();
      window.location.href = 'index.html';
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(btn, false);
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
    const btn = resetForm.querySelector('button[type="submit"]');
    const email = document.getElementById('reset-email').value;
    try {
      setLoading(btn, true);
      await sendPasswordReset(email);
      showToast('E-mail enviado', 'success');
      resetForm.reset();
      window.location.href = 'index.html';
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(btn, false);
    }
  });
}
