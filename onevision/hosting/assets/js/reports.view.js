import { formatBytes } from './validators.js';

export function renderReports(container, reports) {
  container.innerHTML = '';
  if (!reports || reports.length === 0) {
    container.innerHTML = '<p class="text-muted">Nenhum relatório ainda.</p>';
    return;
  }
  reports.forEach(r => {
    const card = document.createElement('div');
    card.className = 'card mb-2';
    const date = r.generatedAt?.toDate ? r.generatedAt.toDate() : new Date(r.generatedAt);
    card.innerHTML = `<div class="card-body"><h5 class="card-title">${r.type} - ${date.toLocaleString()}</h5><p class="card-text">${r.summary}</p></div>`;
    container.appendChild(card);
  });
}
