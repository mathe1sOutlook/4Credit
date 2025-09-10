import { SituacaoCadastral } from '../models/cedente.model.js';
import { IQCCalculator } from './iqc.service.js';
import { IsCorteAutomatico, ParecerResultado } from './parecer.service.js';
import { ConsultaAnalyzer } from './consulta-analyzer.service.js';

/**
 * Classifica um cedente aplicando regras de corte, cálculo de IQC e geração de alertas.
 * @param {string} cnpj
 * @param {object} dados
 * @returns {{cnpj:string, situacaoCadastral:string|null, corte:string|null, iqc:object|null, consultas:object|null, alertas:string[]}}
 */
export function ClassificarCedente(cnpj, dados = {}) {
  const result = {
    cnpj,
    situacaoCadastral: dados.situacaoCadastral || null,
    corte: null,
    iqc: null,
    consultas: null,
    alertas: []
  };

  // Pré-validação da situação cadastral
  if (dados.situacaoCadastral && dados.situacaoCadastral !== SituacaoCadastral.ATIVA) {
    result.corte = 'SituacaoCadastral';
    return result;
  }

  // Corte automático (curto-circuito)
  const corte = IsCorteAutomatico(dados, dados.historicoSocios || []);
  result.corte = corte;
  if (corte !== ParecerResultado.OK) {
    return result;
  }

  // Cálculo do IQC
  const iqc = IQCCalculator.Calculate(dados);
  result.iqc = iqc;

  // Geração de alertas
  const consultas = ConsultaAnalyzer.analyze(dados.consultasCredito || []);
  result.consultas = consultas;
  if (consultas.AlertasEEN && consultas.AlertasEEN.length) {
    result.alertas.push(...consultas.AlertasEEN);
  }
  if (iqc.alteracoesSuspeitas) {
    result.alertas.push('AlteracoesSuspeitas');
  }

  return result;
}
