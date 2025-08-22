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
    const sev = r.severity ? `<span class="chip ${r.severity === 'critical' ? 'neg' : 'pos'}">${r.severity}</span>` : '';
    card.innerHTML = `
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <h6 class="brand-font m-0 with-icon"><i class="bi bi-file-earmark-text"></i> ${r.type} ${sev}</h6>
          <small class="text-muted">${date.toLocaleString()}</small>
        </div>
        <p class="mb-0">${r.summary ?? ''}</p>
      </div>`;
    container.appendChild(card);
  });
}
