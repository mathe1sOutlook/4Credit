# OneVision • 4Credit

Aplicação de análise de arquivos financeiros utilizando Firebase Hosting + Functions.

## Arquitetura
```
Hosting (HTML/JS) <---> Functions HTTPS (/api/*)
           |                |
           v                v
      Firestore        Storage
           |                |
      Realtime DB  (progresso)
```

## Pré-requisitos
- Node.js 20+
- Firebase CLI

## Setup
1. `firebase init` (Hosting, Functions, Firestore, Storage, Realtime).
2. Copie `hosting/assets/js/config.example.js` para `hosting/assets/js/config.js` e preencha o `firebaseConfig`.
3. Instale dependências das functions:
   ```bash
   cd functions && npm install
   ```
4. Crie o segredo `OPENAI_API_KEY`:
   ```bash
   gcloud secrets create OPENAI_API_KEY --replication-policy="automatic"
   gcloud secrets versions add OPENAI_API_KEY --data-file=<(echo -n "sua-chave")
   ```
5. Vincule o segredo à function:
   ```bash
   firebase functions:secrets:set OPENAI_API_KEY
   ```

### Emuladores
```bash
npm run dev
```

### Deploy
```bash
npm run deploy
```

## Fluxo de desenvolvimento
Front-end em HTML + JS modular (ESModules). Backend em Cloud Functions Node 20.

## Modelo de dados (Firestore)
```
/users/{uid}
  email, displayName, createdAt

/customers/{cnpj}
  ownerUid, createdAt, updatedAt

/customers/{cnpj}/uploads/{uploadId}
  type, filePath, fileName, size, status, errorMessage?, createdAt, createdBy

/customers/{cnpj}/reports/{reportId}
  relatedUploadId, summary, generatedAt, type, status, errorMessage?
```

## Storage
`uploads/{uid}/{cnpj}/{type}/{yyyy-mm-dd}/{originalFileName}`

## Realtime Database
`/progress/{uid}/{cnpj}/{uploadId}` → `{ percent, stage, updatedAt }`

## Regras de segurança
### Firestore
```rules_version = '2';
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
```

### Storage
```rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{uid}/{cnpj}/{type}/{date}/{file} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

### Realtime Database
```{
  "rules": {
    "progress": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

## Endpoints
### `POST /api/process-file`
Body:
```json
{ "cnpj": "string", "uploadId": "string" }
```
Headers: `Authorization: Bearer <ID_TOKEN>`
Resposta:
```json
{ "ok": true, "data": { "reportId": "..." } }
```

## Padrões de código
- Modulação ESModules.
- Erros padronizados `{ code, message }`.
- Logs via `utils/logger.js`.

## Roadmap
- Integrar OpenAI real.
- Parsing de VADU/SERASA/SCR.
- Exportar relatórios em PDF/CSV.
- Versionamento de relatórios.

## Troubleshooting
- **CORS**: habilitado no handler.
- **Auth**: verifique se o ID token é enviado.
- **Emuladores**: execute `npm run dev` na raiz.

## Licença
MIT
