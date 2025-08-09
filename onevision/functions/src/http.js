import { onRequest } from 'firebase-functions/v2/https';
import admin from 'firebase-admin';
import { OPENAI_API_KEY } from './config.js';
import { processFile } from './services/process.service.js';
import { AuthError, BadRequestError, handleError } from './utils/errors.js';
import { validateCNPJ, validateUploadId } from './utils/validators.js';

/**
 * HTTP entrypoint for Cloud Functions.
 */
export const api = onRequest({ cors: true, secrets: [OPENAI_API_KEY] }, async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    if (req.path === '/api/process-file' && req.method === 'POST') {
      const authHeader = req.get('Authorization') || '';
      if (!authHeader.startsWith('Bearer ')) {
        throw new AuthError('missing-token');
      }
      const idToken = authHeader.split('Bearer ')[1];
      const decoded = await admin.auth().verifyIdToken(idToken);

      const { cnpj, uploadId } = req.body || {};
      validateCNPJ(cnpj);
      validateUploadId(uploadId);

      const data = await processFile({ cnpj, uploadId, uid: decoded.uid });
      res.json({ ok: true, data });
      return;
    }
    throw new BadRequestError('not-found');
  } catch (err) {
    const { status, code, message } = handleError(err);
    res.status(status).json({ ok: false, error: { code, message } });
  }
});
