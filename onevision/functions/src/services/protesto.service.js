import { TipoCredor } from '../models/cedente.model.js';
import { CREDOR_ALIASES } from '../utils/credor.aliases.js';

/**
 * Classifica o tipo de credor de um protesto.
 * @param {object} p Protesto
 * @returns {TipoCredor}
 */
export function classificarProtesto(p = {}) {
  const nome = (p.credor || '').toLowerCase();

  // FIDC, securitizadora e factoring tratadas como instituições financeiras
  for (const padrao of CREDOR_ALIASES.FIDC) {
    if (padrao.test(nome)) return TipoCredor.FIDC;
  }
  for (const padrao of CREDOR_ALIASES.SECURITIZADORA) {
    if (padrao.test(nome)) return TipoCredor.SECURITIZADORA;
  }
  for (const padrao of CREDOR_ALIASES.FACTORING) {
    if (padrao.test(nome)) return TipoCredor.FACTORING;
  }

  if (/banco/i.test(nome)) return TipoCredor.BANCO;

  // Heurística simples para PJ: termos comuns em razões sociais
  if (/(ltda|s\/a|s\.a|me|epp|eireli|associa[çc][aã]o|cooperativa)/i.test(p.credor || '')) {
    return TipoCredor.PESSOA_JURIDICA;
  }

  return TipoCredor.PESSOA_FISICA;
}
