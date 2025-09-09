export const SituacaoCadastral = Object.freeze({
  ATIVA: 'ATIVA',
  SUSPENSA: 'SUSPENSA',
  INAPTA: 'INAPTA',
  BAIXADA: 'BAIXADA'
});

export const TipoAcao = Object.freeze({
  CIVIL: 'CIVIL',
  TRABALHISTA: 'TRABALHISTA',
  FALIMENTAR: 'FALIMENTAR',
  OUTROS: 'OUTROS'
});

export const FonteFaturamento = Object.freeze({
  DECLARADO: 'DECLARADO',
  PRESUMIDO: 'PRESUMIDO',
  ESTIMADO: 'ESTIMADO'
});

export const TipoProtesto = Object.freeze({
  CHEQUE: 'CHEQUE',
  DUPLICATA: 'DUPLICATA',
  TITULO: 'TITULO',
  OUTRO: 'OUTRO'
});

export const TipoCredor = Object.freeze({
  PESSOA_FISICA: 'PESSOA_FISICA',
  PESSOA_JURIDICA: 'PESSOA_JURIDICA',
  BANCO: 'BANCO'
});

export const SetorRisco = Object.freeze({
  BAIXO: 'BAIXO',
  MEDIO: 'MEDIO',
  ALTO: 'ALTO'
});

export const PorteEmpresa = Object.freeze({
  MEI: 'MEI',
  ME: 'ME',
  EPP: 'EPP',
  MEDIA: 'MEDIA',
  GRANDE: 'GRANDE'
});

export class Faturamento {
  constructor({ ano = null, fonte = FonteFaturamento.DECLARADO, valor = 0 } = {}) {
    this.ano = ano;
    this.fonte = fonte;
    this.valor = valor;
  }
  static fromJSON(json = {}) {
    return new Faturamento(json);
  }
  toJSON() {
    return { ano: this.ano, fonte: this.fonte, valor: this.valor };
  }
}

export class Protesto {
  constructor({
    tipo = TipoProtesto.OUTRO,
    credor = '',
    tipoCredor = TipoCredor.PESSOA_JURIDICA,
    valor = 0,
    data = null
  } = {}) {
    this.tipo = tipo;
    this.credor = credor;
    this.tipoCredor = tipoCredor;
    this.valor = valor;
    this.data = data ? new Date(data) : null;
  }
  static fromJSON(json = {}) {
    return new Protesto(json);
  }
  toJSON() {
    return {
      tipo: this.tipo,
      credor: this.credor,
      tipoCredor: this.tipoCredor,
      valor: this.valor,
      data: this.data ? this.data.toISOString() : null
    };
  }
}

export class AcaoJudicial {
  constructor({ numero = '', tipo = TipoAcao.OUTROS, valor = 0, data = null } = {}) {
    this.numero = numero;
    this.tipo = tipo;
    this.valor = valor;
    this.data = data ? new Date(data) : null;
  }
  static fromJSON(json = {}) {
    return new AcaoJudicial(json);
  }
  toJSON() {
    return {
      numero: this.numero,
      tipo: this.tipo,
      valor: this.valor,
      data: this.data ? this.data.toISOString() : null
    };
  }
}

export class ConsultaCredito {
  constructor({ data = null, fonte = '', score = null } = {}) {
    this.data = data ? new Date(data) : null;
    this.fonte = fonte;
    this.score = score;
  }
  static fromJSON(json = {}) {
    return new ConsultaCredito(json);
  }
  toJSON() {
    return {
      data: this.data ? this.data.toISOString() : null,
      fonte: this.fonte,
      score: this.score
    };
  }
}

export class Pontualidade {
  constructor({ indice = 0, descricao = '' } = {}) {
    this.indice = indice;
    this.descricao = descricao;
  }
  static fromJSON(json = {}) {
    return new Pontualidade(json);
  }
  toJSON() {
    return { indice: this.indice, descricao: this.descricao };
  }
}

export class Socio {
  constructor({ nome = '', documento = '', participacao = 0 } = {}) {
    this.nome = nome;
    this.documento = documento;
    this.participacao = participacao;
  }
  static fromJSON(json = {}) {
    return new Socio(json);
  }
  toJSON() {
    return {
      nome: this.nome,
      documento: this.documento,
      participacao: this.participacao
    };
  }
}

export class EmpresaRelacionada {
  constructor({ nome = '', cnpj = '', relacionamento = '' } = {}) {
    this.nome = nome;
    this.cnpj = cnpj;
    this.relacionamento = relacionamento;
  }
  static fromJSON(json = {}) {
    return new EmpresaRelacionada(json);
  }
  toJSON() {
    return {
      nome: this.nome,
      cnpj: this.cnpj,
      relacionamento: this.relacionamento
    };
  }
}

export class Cedente {
  constructor({
    cnpj = '',
    razaoSocial = '',
    nomeFantasia = '',
    endereco = {},
    cnae = '',
    capitalSocial = 0,
    porte = PorteEmpresa.ME,
    idade = 0,
    situacaoCadastral = SituacaoCadastral.ATIVA,
    setorRisco = SetorRisco.BAIXO,
    faturamentos = [],
    protestos = [],
    acoesJudiciais = [],
    consultasCredito = [],
    pontualidade = null,
    socios = [],
    empresasRelacionadas = []
  } = {}) {
    this.cnpj = cnpj;
    this.razaoSocial = razaoSocial;
    this.nomeFantasia = nomeFantasia;
    this.endereco = endereco;
    this.cnae = cnae;
    this.capitalSocial = capitalSocial;
    this.porte = porte;
    this.idade = idade;
    this.situacaoCadastral = situacaoCadastral;
    this.setorRisco = setorRisco;
    this.faturamentos = faturamentos;
    this.protestos = protestos;
    this.acoesJudiciais = acoesJudiciais;
    this.consultasCredito = consultasCredito;
    this.pontualidade = pontualidade;
    this.socios = socios;
    this.empresasRelacionadas = empresasRelacionadas;
  }

  static fromJSON(json = {}) {
    return new Cedente({
      ...json,
      faturamentos: (json.faturamentos || []).map(f => Faturamento.fromJSON(f)),
      protestos: (json.protestos || []).map(p => Protesto.fromJSON(p)),
      acoesJudiciais: (json.acoesJudiciais || []).map(a => AcaoJudicial.fromJSON(a)),
      consultasCredito: (json.consultasCredito || []).map(c => ConsultaCredito.fromJSON(c)),
      pontualidade: json.pontualidade ? Pontualidade.fromJSON(json.pontualidade) : null,
      socios: (json.socios || []).map(s => Socio.fromJSON(s)),
      empresasRelacionadas: (json.empresasRelacionadas || []).map(e => EmpresaRelacionada.fromJSON(e))
    });
  }

  toJSON() {
    return {
      cnpj: this.cnpj,
      razaoSocial: this.razaoSocial,
      nomeFantasia: this.nomeFantasia,
      endereco: this.endereco,
      cnae: this.cnae,
      capitalSocial: this.capitalSocial,
      porte: this.porte,
      idade: this.idade,
      situacaoCadastral: this.situacaoCadastral,
      setorRisco: this.setorRisco,
      faturamentos: this.faturamentos.map(f => f.toJSON()),
      protestos: this.protestos.map(p => p.toJSON()),
      acoesJudiciais: this.acoesJudiciais.map(a => a.toJSON()),
      consultasCredito: this.consultasCredito.map(c => c.toJSON()),
      pontualidade: this.pontualidade ? this.pontualidade.toJSON() : null,
      socios: this.socios.map(s => s.toJSON()),
      empresasRelacionadas: this.empresasRelacionadas.map(e => e.toJSON())
    };
  }
}

