export function showToast(message, type = 'info') {
  const toastEl = document.createElement('div');
  toastEl.className = `toast align-items-center text-bg-${type} border-0 fade`;
  toastEl.setAttribute('role', 'alert');
  toastEl.innerHTML = `<div class="d-flex"><div class="toast-body">${message}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
  document.body.appendChild(toastEl);
  const toast = new bootstrap.Toast(toastEl, {
    animation: true,
    autohide: true,
    delay: 3000
  });
  toast.show();
  toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}
const ERROR_MESSAGES = {
  'auth/user-not-found': 'Usuário não encontrado',
  'auth/wrong-password': 'Senha incorreta',
  'auth/email-already-in-use': 'E-mail já cadastrado',
  'auth/weak-password': 'Senha muito fraca',
  'auth/invalid-email': 'E-mail inválido',
  'auth/too-many-requests': 'Muitas tentativas, tente novamente mais tarde',
  'auth/invalid-verification-code': 'Código MFA inválido',
  'auth/invalid-mfa-code': 'Código MFA inválido'
};

export function handleError(err) {
  const message = ERROR_MESSAGES[err?.code] || err?.message || 'Erro desconhecido';
  showToast(message, 'danger');
}

export function setDisabled(el, state) {
  el.disabled = state;
  el.style.cursor = state ? 'not-allowed' : '';
  el.style.opacity = state ? '0.6' : '';
}

export function setLoading(btn, loading) {
  if (loading) {
    setDisabled(btn, true);
    btn.dataset.originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
  } else {
    setDisabled(btn, false);
    if (btn.dataset.originalText) btn.innerHTML = btn.dataset.originalText;
  }
}
