import { SetorRisco, TipoAcao } from '../models/cedente.model.js';

export const ParecerResultado = Object.freeze({
  OK: 'OK',
  ProtestoFIDC: 'ProtestoFIDC',
  AcaoFIDC: 'AcaoFIDC',
  RJRecente: 'RJRecente',
  FaturamentoMinimo: 'FaturamentoMinimo',
  SetorAltoRisco: 'SetorAltoRisco',
  LiminarAtiva: 'LiminarAtiva',
  SocioNoSetorFinanceiro: 'SocioNoSetorFinanceiro'
});

/**
 * Verifica se existem protestos envolvendo FIDC.
 * @param {object} cedente
 * @param {object[]} historico
 * @returns {boolean}
 */
export function HasProtestoFIDC(cedente, historico = []) {
  const all = [cedente, ...historico];
  return all.some(c => (c.protestos || []).some(p => /fidc/i.test(p.credor || '')));
}

/**
 * Verifica se existem ações judiciais com envolvimento de FIDC.
 * @param {object} cedente
 * @param {object[]} historico
 * @returns {boolean}
 */
export function HasAcaoFIDC(cedente, historico = []) {
  const all = [cedente, ...historico];
  return all.some(c => (c.acoesJudiciais || []).some(a => /fidc/i.test(a.numero || a.tipo || '')));
}

/**
 * Verifica se há recuperação judicial recente (últimos 5 anos).
 * @param {object} cedente
 * @param {object[]} historico
 * @returns {boolean}
 */
export function HasRJRecente(cedente, historico = []) {
  const limite = Date.now() - 5 * 365 * 24 * 60 * 60 * 1000;
  const all = [cedente, ...historico];
  return all.some(c =>
    (c.acoesJudiciais || []).some(a => {
      const data = a.data ? new Date(a.data).getTime() : 0;
      const isRJ = a.tipo === TipoAcao.FALIMENTAR || /recupera.c..o judicial/i.test(a.numero || '');
      return isRJ && data >= limite;
    })
  );
}

/**
 * Verifica se o faturamento mínimo exigido foi atingido.
 * @param {object} cedente
 * @param {number} minimo
 * @returns {boolean}
 */
export function IsFaturamentoMinimo(cedente, minimo = 500000) {
  const valores = (cedente.faturamentos || []).map(f => f.valor || 0);
  return valores.some(v => v >= minimo);
}

/**
 * Verifica se o cedente pertence a um setor de alto risco.
 * @param {object} cedente
 * @returns {boolean}
 */
export function IsSetorAltoRisco(cedente) {
  return cedente.setorRisco === SetorRisco.ALTO;
}

/**
 * Verifica existência de liminar ativa.
 * @param {object} cedente
 * @param {object[]} historico
 * @returns {boolean}
 */
export function HasLiminarAtiva(cedente, historico = []) {
  const all = [cedente, ...historico];
  return all.some(c => (c.acoesJudiciais || []).some(a => /liminar/i.test(a.numero || '')));
}

/**
 * Verifica se algum sócio possui empresa no setor financeiro.
 * @param {object} cedente
 * @param {object[]} historico
 * @returns {boolean}
 */
export function SocioNoSetorFinanceiro(cedente, historico = []) {
  return historico.some(c => /financeir/i.test(c.cnae || ''));
}

/**
 * Avalia se existe corte automático para o cedente.
 * @param {object} cedente
 * @param {object[]} historicoSocios
 * @returns {ParecerResultado}
 */
export function IsCorteAutomatico(cedente, historicoSocios = []) {
  if (HasProtestoFIDC(cedente, historicoSocios)) return ParecerResultado.ProtestoFIDC;
  if (HasAcaoFIDC(cedente, historicoSocios)) return ParecerResultado.AcaoFIDC;
  if (HasRJRecente(cedente, historicoSocios)) return ParecerResultado.RJRecente;
  if (!IsFaturamentoMinimo(cedente)) return ParecerResultado.FaturamentoMinimo;
  if (IsSetorAltoRisco(cedente)) return ParecerResultado.SetorAltoRisco;
  if (HasLiminarAtiva(cedente, historicoSocios)) return ParecerResultado.LiminarAtiva;
  if (SocioNoSetorFinanceiro(cedente, historicoSocios)) return ParecerResultado.SocioNoSetorFinanceiro;
  return ParecerResultado.OK;
}
