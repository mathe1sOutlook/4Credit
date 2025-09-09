export const RiscoClassificacao = Object.freeze({
  BAIXO: 'BAIXO',
  MEDIO: 'MEDIO',
  ALTO: 'ALTO'
});

export const Parecer = Object.freeze({
  FAVORAVEL: 'FAVORAVEL',
  DESFAVORAVEL: 'DESFAVORAVEL'
});

export class IQCComponent {
  constructor({ descricao = '', valor = 0 } = {}) {
    this.descricao = descricao;
    this.valor = valor;
  }
}

export class IQCResult {
  constructor({
    score = 0,
    componentes = [],
    risco = RiscoClassificacao.MEDIO,
    parecer = Parecer.FAVORAVEL,
    percentuaisProtestos = null,
    alteracoesSuspeitas = false
  } = {}) {
    this.score = score;
    this.componentes = componentes;
    this.risco = risco;
    this.parecer = parecer;
    this.percentuaisProtestos = percentuaisProtestos;
    this.alteracoesSuspeitas = alteracoesSuspeitas;
  }
}
