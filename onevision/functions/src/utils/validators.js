import { BadRequestError } from './errors.js';

export function validateCNPJ(cnpj) {
  const digits = (cnpj || '').replace(/\D/g, '');
  if (digits.length !== 14) throw new BadRequestError('invalid-cnpj');
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
  if (digits !== base + digit1 + digit2) throw new BadRequestError('invalid-cnpj');
}

export function validateUploadId(id) {
  if (!id || typeof id !== 'string') throw new BadRequestError('invalid-upload');
}

export function validateType(type) {
  const allowed = ['VADU', 'SERASA', 'SCR'];
  if (!allowed.includes(type)) throw new BadRequestError('invalid-type');
}
