import { formatBytes } from './validators.js';

export function renderReports(container, reports) {
  container.innerHTML = '';
  if (!reports || reports.length === 0) {
    container.innerHTML = '<p class="text-muted">Nenhum relatório ainda.</p>';
    return;
  }
  reports.forEach(r => {
    const card = document.createElement('div');
    card.className = 'card card-elevated mb-2';
    const date = r.generatedAt?.toDate ? r.generatedAt.toDate() : new Date(r.generatedAt);
    card.innerHTML = `
      <div class="card-body">
        <div class="d-flex justify-content-between">
          <h6 class="brand-font">${r.type}</h6>
          <small>${date.toLocaleString()}</small>
        </div>
        <p>${r.summary}</p>
      </div>`;
    container.appendChild(card);
  });
}
