# VisionOne • 4Credit

Aplicação de análise de arquivos financeiros (VADU, SERASA, SCR) com **Firebase Hosting + Functions** e UI alinhada ao **guia de design VisionOne**.

---

## Sumário
- [Arquitetura](#arquitetura)
- [Tecnologias & Pastas](#tecnologias--pastas)
- [Setup & Execução](#setup--execução)
- [Design System (UX/UI VisionOne)](#design-system-uxui-visionone)
- [Implementação no repositório (checklist)](#implementação-no-repositório-checklist)
- [Modelo de Dados & Armazenamento](#modelo-de-dados--armazenamento)
- [Regras de Segurança](#regras-de-segurança)
- [Endpoints](#endpoints)
- [Padrões de Código](#padrões-de-código)
- [Roadmap](#roadmap)
- [Troubleshooting](#troubleshooting)
- [Licença](#licença)

---

## Arquitetura

Hosting (HTML/JS) <---> Functions HTTPS (/api/*)
| |
v v
Firestore Storage
| |
Realtime DB (progresso)

ruby
Copiar
Editar

As páginas principais já existem:
- Login (`index.html`), Signup, Reset e Manifesto, com Bootstrap e assets próprios. :contentReference[oaicite:0]{index=0} :contentReference[oaicite:1]{index=1} :contentReference[oaicite:2]{index=2} :contentReference[oaicite:3]{index=3}  
- App autenticado (`app.html`) com sidebar de upload, barra de progresso e listagem de relatórios. :contentReference[oaicite:4]{index=4}

---

## Tecnologias & Pastas

- **Front-end**: HTML + ESModules, Bootstrap 5, Bootstrap Icons. Paleta e utilitários centralizados em `assets/css/theme.css`, overrides em `assets/css/bootstrap.custom.css`, estilos de login e app em `assets/css/login.css` e `assets/css/app.css`. :contentReference[oaicite:5]{index=5} :contentReference[oaicite:6]{index=6} :contentReference[oaicite:7]{index=7} :contentReference[oaicite:8]{index=8}  
- **Auth/DB/Storage/RTDB**: módulos em `assets/js` (auth/init, Firestore/Storage/Realtime, validações, UI). :contentReference[oaicite:9]{index=9} :contentReference[oaicite:10]{index=10} :contentReference[oaicite:11]{index=11} :contentReference[oaicite:12]{index=12} :contentReference[oaicite:13]{index=13} :contentReference[oaicite:14]{index=14} :contentReference[oaicite:15]{index=15}  
- **Lógica do App**: uploads, progresso, chamada ao endpoint e renderização de relatórios em `main.js` + `reports.view.js`. :contentReference[oaicite:16]{index=16} :contentReference[oaicite:17]{index=17}

Estrutura resumida:
hosting/
index.html, app.html, signup.html, reset.html, manifesto.html
assets/
css/ theme.css, bootstrap.custom.css, login.css, app.css
js/ firebase.init.js, auth.js, main.js, login.js, ui.js, ...
img/ visionone.(png|svg)

yaml
Copiar
Editar

---

## Setup & Execução

Pré-requisitos:
- Node.js 20+
- Firebase CLI

1) `firebase init` (Hosting, Functions, Firestore, Storage, Realtime).  
2) Copie `hosting/assets/js/config.example.js` para `hosting/assets/js/config.js` e preencha `firebaseConfig`. :contentReference[oaicite:18]{index=18}  
3) Instale dependências das functions:
```bash
cd functions && npm install
Crie o segredo OPENAI_API_KEY:

bash
Copiar
Editar
gcloud secrets create OPENAI_API_KEY --replication-policy="automatic"
gcloud secrets versions add OPENAI_API_KEY --data-file=<(echo -n "sua-chave")
firebase functions:secrets:set OPENAI_API_KEY
Emuladores

bash
Copiar
Editar
npm run dev
Deploy

bash
Copiar
Editar
npm run deploy
Design System (UX/UI VisionOne)
Princípios
Foco em comportamento sob contingência, não só score/rating.

Entrega via Relatórios N1 e RN1 como metodologia replicável.

Objetivo: antecipar risco unindo comportamento, histórico e contexto.

Público-alvo: bancos, FIDCs, securitizadoras e empresas que vendem a prazo.

Ética: crédito mais justo, inteligente e previsível + LGPD/Confidencial visíveis.

Design tokens (extraídos da marca)
Primary 900 #032052 (navegação/background forte)

Primary 600 #29507E (CTA/links ativos)

Neutral 500 #8592A2 (texto secundário)

Neutral 200 #D6D9DD (bordas/superfícies)

Risk-pos #12B76A (positivo) · Risk-neg #E11D48 (crítico)

Onde aplicar

assets/css/theme.css: defina as variáveis no :root (paleta, radius 12px, utilitários .with-icon, .card-elevated, foco visível). theme

assets/css/bootstrap.custom.css: mapeie --bs-* para os tokens (bg, text, primary, border). bootstrap.custom

Tipografia
Inter (ou IBM Plex Sans). Títulos 700; corpo 400/500; steps 32/24/18/16/14. (Já importado em theme.css.) theme

Espaçamento & Forma
Grid: 12 col (desktop), 6 (tablet), 4 (mobile). Gutters 24/16/12.

Raio: 12px; sombras suaves; borda 1px Neutral 200.

Acessibilidade
Contraste mínimo 4.5:1; foco visível; navegação por teclado. (:focus/:focus-visible já tratados em theme.css.) theme

IA de navegação (arquitetura da informação)
Acesso: Login → MFA/SSO → seleção de empresa → Dashboard.

Shell: Sidebar (ícones + rótulos) + Topbar (busca, ambiente, perfil).

Módulos: Dashboard · Consulta de Empresa · Relatórios (N1/RN1) · Alertas & Decisões · Regras/Integrações · Admin & LGPD.

Páginas — Padrões
1) Login (split 60/40)
Esq.: arte mínima com logo; Dir.: formulário (E-mail, Senha, campo MFA opcional), SSO Google/Azure, “Solicitar acesso”, “Esqueci a senha”, badge “Confidencial • LGPD”. Base de layout já existe no index.html + login.css. index login

2) Shell (App)
app.html com navbar branca, sidebar de ações e progresso (já implementados). app app

3) Dashboard (visão executiva)
Hero “Visão N1 — comportamento sob contingência”; KPIs; gráficos e tabela de casos; chips de explicabilidade.

4) Consulta de Empresa (Perfil N1)
Tabs: Resumo · Comportamento · Histórico · Eventos · RN1 · Decidir. Justificativa obrigatória na decisão e audit trail.

5) Viewer de Relatórios (N1/RN1)
Visualização PDF/HTML, sumário, watermark “Confidencial”, exportar/compartilhar/versões.

6) Alertas & Decisões · 7) Regras & Integrações · 8) Admin & LGPD
Filas, playbooks, simulação de regras, conectores e centro de consentimento.

Microcopy (exemplos)

Login: “Entre para ver comportamento, histórico e contexto de crédito.”

Dashboard: “Decisão com evidência comportamental — não achismo.”

RN1: “Relatório replicável, pronto para escalar.”

Implementação no repositório (checklist)
Tokens & Bootstrap

Ajustar :root em assets/css/theme.css com a paleta VisionOne e utilitários (.with-icon, .card-elevated, foco). theme

Mapear --bs-* em assets/css/bootstrap.custom.css para usar os tokens. bootstrap.custom

Login (index.html / login.css / login.js)

Manter grid hero+card e aplicar branding/cores; incluir campo MFA (UI); botões de SSO; badge LGPD (rodapé). index login login

App Shell (app.html / app.css)

Navbar com logo VisionOne e área de perfil; sidebar com navegação (Início, Empresas, Relatórios, Alertas, Regras, Integrações, Admin); manter bloco de CNPJ + uploads + progresso (usado por main.js). app app main

Relatórios (reports.view.js)

Cards .card-elevated já existem; opcional: chips de severidade (.chip.pos/.chip.neg) se r.severity vier do backend. reports.view

Brand assets

Padronizar assets/img/visionone.(png|svg) e usar em Login/App/Manifesto. Hoje alguns pontos usam ./thumbnail.png — alinhar para o novo asset. index app manifesto

Importante: não alterar fluxos de autenticação ou processamento já implementados em auth.js, login.js, main.js, firebase.init.js, etc. auth login main firebase.init

Modelo de Dados & Armazenamento
Firestore

bash
Copiar
Editar
/users/{uid}                      email, displayName, createdAt
/customers/{cnpj}                 ownerUid, createdAt, updatedAt
/customers/{cnpj}/uploads/{id}    type, filePath, fileName, size, status, errorMessage?, createdAt, createdBy
/customers/{cnpj}/reports/{id}    relatedUploadId, summary, generatedAt, type, status, errorMessage?
Storage
uploads/{uid}/{cnpj}/{type}/{yyyy-mm-dd}/{originalFileName} (vide storage.service.js). storage.service

Realtime Database
/progress/{uid}/{cnpj}/{uploadId} → { percent, stage, updatedAt } (vide realtime.service.js). realtime.service

Regras de Segurança
Firestore

rules_version
Copiar
Editar
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /customers/{cnpj} {
      allow read, write: if request.auth != null && request.resource.data.ownerUid == request.auth.uid;
      match /uploads/{uploadId} {
        allow read, write: if request.auth != null && resource.data.createdBy == request.auth.uid;
      }
      match /reports/{reportId} {
        allow read, write: if request.auth != null && get(/databases/$(database)/documents/customers/$(cnpj)).data.ownerUid == request.auth.uid;
      }
    }
  }
}
Storage

rules_version
Copiar
Editar
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{uid}/{cnpj}/{type}/{date}/{file} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
Realtime Database

json
Copiar
Editar
{
  "rules": {
    "progress": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
Endpoints
POST /api/process-file
Body

json
Copiar
Editar
{ "cnpj": "string", "uploadId": "string" }
Headers: Authorization: Bearer <ID_TOKEN>
Resposta

json
Copiar
Editar
{ "ok": true, "data": { "reportId": "..." } }
Padrões de Código
ESModules no front.

Erros { code, message }.

ui.js fornece toasts e loading (spinner) reaproveitados em login.js e main.js. ui login main

Roadmap
Integrar OpenAI real (Functions).

Parsing de VADU/SERASA/SCR.

Exportar relatórios em PDF/CSV.

Versionamento de relatórios.

Dashboard/Consulta de Empresa (gráficos + tabs) conforme Design System.

Troubleshooting
CORS: habilitar no handler HTTPS.

Auth: garantir envio do ID token.

Emuladores: npm run dev na raiz.

Config: copiar config.example.js para config.js com credenciais do Firebase. config.example

Licença
MIT

markdown
Copiar
Editar

Se quiser, eu já transformo esse README em um arquivo no repositório e também gero um `docs/VISIONONE-UX.md` separado (idêntico à seção de **Design System**) para orientar futuras tarefas.





Perguntar ao ChatGPT
