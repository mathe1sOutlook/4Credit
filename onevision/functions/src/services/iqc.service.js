import { IQCResult, IQCComponent, RiscoClassificacao, Parecer } from '../models/iqc.model.js';
import { FonteFaturamento, SetorRisco, TipoCredor, TipoAcao } from '../models/cedente.model.js';

export class IQCCalculator {
  /**
   * Calcula o IQC de um cedente.
   * @param {object} cedente
   * @returns {IQCResult}
   */
  static Calculate(cedente = {}) {
    const componentes = [];
    let score = 0;

    // --- Pontuações positivas ---
    // Faturamento informado ou estimado (nunca somar)
    const faturamentos = cedente.faturamentos || [];
    let faturamento = 0;
    const informados = faturamentos.filter(f => f.fonte === FonteFaturamento.DECLARADO);
    if (informados.length) {
      faturamento = Math.max(...informados.map(f => f.valor || 0));
    } else if (faturamentos.length) {
      faturamento = Math.max(...faturamentos.map(f => f.valor || 0));
    }
    if (faturamento >= 1000000) {
      score += 10;
      componentes.push(new IQCComponent({ descricao: 'Faturamento', valor: 10 }));
    } else if (faturamento > 0) {
      score += 5;
      componentes.push(new IQCComponent({ descricao: 'Faturamento', valor: 5 }));
    }

    // Protestos abaixo de R$100k
    const protestos = cedente.protestos || [];
    const totalProtestos = protestos.reduce((s, p) => s + (p.valor || 0), 0);
    if (totalProtestos < 100000 && totalProtestos > 0) {
      score += 5;
      componentes.push(new IQCComponent({ descricao: 'Protestos baixos', valor: 5 }));
    }

    // Idade
    if ((cedente.idade || 0) >= 5) {
      score += 5;
      componentes.push(new IQCComponent({ descricao: 'Tempo de atuação', valor: 5 }));
    }

    // Setor estratégico (considerado baixo risco)
    if (cedente.setorRisco === SetorRisco.BAIXO) {
      score += 5;
      componentes.push(new IQCComponent({ descricao: 'Setor estratégico', valor: 5 }));
    }

    // Bônus de pontualidade
    if (cedente.pontualidade && (cedente.pontualidade.indice || 0) >= 80) {
      score += 5;
      componentes.push(new IQCComponent({ descricao: 'Pontualidade', valor: 5 }));
    }

    // --- Penalizações graduadas ---
    const totalPublico = protestos
      .filter(p => p.tipoCredor === TipoCredor.BANCO || p.tipoCredor === TipoCredor.PESSOA_JURIDICA)
      .reduce((s, p) => s + (p.valor || 0), 0);
    const totalPrivado = protestos
      .filter(p => p.tipoCredor === TipoCredor.PESSOA_FISICA)
      .reduce((s, p) => s + (p.valor || 0), 0);

    const penalPublico = Math.floor(totalPublico / 50000) * 5;
    if (penalPublico > 0) {
      score -= penalPublico;
      componentes.push(new IQCComponent({ descricao: 'Protestos públicos', valor: -penalPublico }));
    }
    const penalPrivado = Math.floor(totalPrivado / 50000) * 3;
    if (penalPrivado > 0) {
      score -= penalPrivado;
      componentes.push(new IQCComponent({ descricao: 'Protestos privados', valor: -penalPrivado }));
    }

    const dividaFiscal = cedente.endividamentoFiscal || 0;
    const penalFiscal = Math.floor(dividaFiscal / 100000) * 5;
    if (penalFiscal > 0) {
      score -= penalFiscal;
      componentes.push(new IQCComponent({ descricao: 'Endividamento fiscal', valor: -penalFiscal }));
    }

    // --- Penalizações fixas ---
    const seisMeses = 6 * 30 * 24 * 60 * 60 * 1000;
    const agora = Date.now();
    if ((cedente.acoesJudiciais || []).some(a => {
      if (!a.data) return false;
      const data = new Date(a.data).getTime();
      const isRJ = a.tipo === TipoAcao.FALIMENTAR || /recupera.c..o judicial/i.test(a.numero || '');
      return isRJ && (agora - data) <= seisMeses;
    })) {
      score -= 10;
      componentes.push(new IQCComponent({ descricao: 'RJ <6m', valor: -10 }));
    }

    const hasFIDCProtest = protestos.some(p => /fidc/i.test(p.credor || ''));
    const hasFIDCAction = (cedente.acoesJudiciais || []).some(a => /fidc/i.test(a.numero || a.tipo || ''));
    if (hasFIDCProtest || hasFIDCAction) {
      score -= 15;
      componentes.push(new IQCComponent({ descricao: 'Anotação FIDC', valor: -15 }));
    }

    // --- Classificação final ---
    let risco;
    let parecer;
    if (score >= 20) {
      risco = RiscoClassificacao.BAIXO;
      parecer = Parecer.FAVORAVEL;
    } else if (score >= 0) {
      risco = RiscoClassificacao.MEDIO;
      parecer = Parecer.FAVORAVEL;
    } else {
      risco = RiscoClassificacao.ALTO;
      parecer = Parecer.DESFAVORAVEL;
    }

    return new IQCResult({ score, componentes, risco, parecer });
  }
}
