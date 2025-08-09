export function isValidCNPJ(cnpj) {
  const digits = (cnpj || '').replace(/\D/g, '');
  if (digits.length !== 14) return false;
  const calc = base => {
    let factor = base.length - 7;
    let sum = 0;
    for (let i = 0; i < base.length; i++) {
      sum += base[i] * factor--;
      if (factor < 2) factor = 9;
    }
    const result = sum % 11;
    return result < 2 ? 0 : 11 - result;
  };
  const base = digits.substring(0, 12);
  const digit1 = calc(base);
  const digit2 = calc(base + digit1);
  return digits === base + digit1 + digit2;
}

export function isAllowedFile(file, { maxMB = 20, types = [] }) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (!types.includes(ext)) return { ok: false, error: 'Extensão não permitida.' };
  if (file.size > maxMB * 1024 * 1024) return { ok: false, error: `Arquivo maior que ${maxMB}MB` };
  return { ok: true };
}

export function sanitizeFileName(name) {
  return name.replace(/[^a-z0-9_.-]/gi, '_');
}

export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let num = bytes;
  while (num >= 1024 && i < units.length - 1) {
    num /= 1024;
    i++;
  }
  return `${num.toFixed(2)} ${units[i]}`;
}
