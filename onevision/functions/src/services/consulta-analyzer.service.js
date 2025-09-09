export class ConsultaAnalyzer {
  /**
   * Analisa consultas de crédito calculando média mensal,
   * variação mês a mês e top segmentos.
   * @param {Array<{data:string|Date, fonte:string}>} consultas
   * @returns {{mediaMensal:number, variacaoMoM:number, topSegmentos:Array<{segmento:string, quantidade:number}>, AlertasEEN:string[]}}
   */
  static analyze(consultas = []) {
    const monthly = {};
    const segmentos = {};
    for (const c of consultas) {
      if (!c || !c.data) continue;
      const d = new Date(c.data);
      if (isNaN(d)) continue;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthly[key] = (monthly[key] || 0) + 1;
      const seg = c.fonte || 'DESCONHECIDO';
      segmentos[seg] = (segmentos[seg] || 0) + 1;
    }
    const months = Object.keys(monthly).sort();
    const totalConsultas = Object.values(monthly).reduce((a, b) => a + b, 0);
    const mediaMensal = months.length ? totalConsultas / months.length : 0;

    let variacaoMoM = 0;
    if (months.length >= 2) {
      const last = monthly[months[months.length - 1]];
      const prev = monthly[months[months.length - 2]];
      if (prev > 0) {
        variacaoMoM = ((last - prev) / prev) * 100;
      } else if (last > 0) {
        variacaoMoM = 100;
      }
    }

    const topSegmentos = Object.entries(segmentos)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([segmento, quantidade]) => ({ segmento, quantidade }));

    const AlertasEEN = DetectarAlertasConsultas({ consultas, variacaoMoM });

    return { mediaMensal, variacaoMoM, topSegmentos, AlertasEEN };
  }
}

/**
 * Detecta alertas baseados nas consultas analisadas.
 * @param {{consultas:Array<{data:string|Date, fonte:string}>, variacaoMoM:number}} params
 * @returns {string[]}
 */
export function DetectarAlertasConsultas({ consultas = [], variacaoMoM = 0 } = {}) {
  const alertas = [];
  const fidcCount = consultas.filter(c => /fidc/i.test(c.fonte || '')).length;
  if (fidcCount > 10) alertas.push('ConsultasFIDC>10');
  if (variacaoMoM > 50) alertas.push('AumentoMoM>50%');
  return alertas;
}
