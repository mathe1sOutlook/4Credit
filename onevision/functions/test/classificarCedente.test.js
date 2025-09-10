import test from 'node:test';
import assert from 'node:assert/strict';
import { ClassificarCedente } from '../src/services/classificacao.service.js';
import { ParecerResultado } from '../src/services/parecer.service.js';
import { SituacaoCadastral, SetorRisco } from '../src/models/cedente.model.js';
import { Parecer } from '../src/models/iqc.model.js';

// Scenario: automatic cut
test('corta cedente com protesto FIDC', () => {
  const cedente = {
    situacaoCadastral: SituacaoCadastral.ATIVA,
    protestos: [{ credor: 'FIDC Alpha', valor: 1000 }]
  };
  const res = ClassificarCedente('00000000000100', cedente);
  assert.equal(res.corte, ParecerResultado.ProtestoFIDC);
  assert.equal(res.iqc, null);
});

// Scenario: favorable IQC
test('retorna IQC favoravel', () => {
  const cedente = {
    situacaoCadastral: SituacaoCadastral.ATIVA,
    faturamentos: [{ valor: 2000000 }],
    idade: 10,
    setorRisco: SetorRisco.BAIXO,
    pontualidade: { indice: 90 }
  };
  const res = ClassificarCedente('00000000000200', cedente);
  assert.equal(res.corte, ParecerResultado.OK);
  assert.ok(res.iqc);
  assert.equal(res.iqc.parecer, Parecer.FAVORAVEL);
});

// Scenario: unfavorable IQC
test('retorna IQC desfavoravel', () => {
  const cedente = {
    situacaoCadastral: SituacaoCadastral.ATIVA,
    faturamentos: [{ valor: 500000 }],
    protestos: [{ credor: 'Banco XYZ', valor: 300000 }],
    endividamentoFiscal: 500000
  };
  const res = ClassificarCedente('00000000000300', cedente);
  assert.equal(res.corte, ParecerResultado.OK);
  assert.ok(res.iqc.score < 0);
  assert.equal(res.iqc.parecer, Parecer.DESFAVORAVEL);
});

// Scenario: alerts generation
test('gera alertas de consultas e alteracoes suspeitas', () => {
  const consultas = Array.from({ length: 11 }).map((_, i) => ({
    data: new Date(2023, i, 1).toISOString(),
    fonte: 'FIDC ' + i
  }));
  const cedente = {
    situacaoCadastral: SituacaoCadastral.ATIVA,
    consultasCredito: consultas,
    faturamentos: [{ valor: 1000000 }],
    protestos: [{ credor: 'Banco X', valor: 1000, data: '2023-01-10' }],
    alteracoesCadastrais: [{ data: '2023-01-20', descricao: 'Mudança' }]
  };
  const res = ClassificarCedente('00000000000400', cedente);
  assert.equal(res.corte, ParecerResultado.OK);
  assert.ok(res.alertas.includes('ConsultasFIDC>10'));
  assert.ok(res.alertas.includes('AlteracoesSuspeitas'));
});
