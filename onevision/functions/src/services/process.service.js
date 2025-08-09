import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { db, rtdb } from '../config.js';
import { uploadDoc } from '../models/firestore.models.js';
import { readFile } from './files.service.js';
import { analyzeFileBuffer } from './openai.service.js';
import { saveReport } from './reports.service.js';
import { logInfo, logError } from '../utils/logger.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
import { validateType } from '../utils/validators.js';

function progressRef(uid, cnpj, uploadId) {
  return rtdb.ref(`/progress/${uid}/${cnpj}/${uploadId}`);
}

async function setProgress(uid, cnpj, uploadId, percent, stage) {
  await progressRef(uid, cnpj, uploadId).set({ percent, stage, updatedAt: Date.now() });
}

/**
 * Pipeline de processamento de arquivos.
 * @param {{cnpj:string, uploadId:string, uid:string}} params
 */
export async function processFile({ cnpj, uploadId, uid }) {
  const uploadRef = db.doc(uploadDoc(cnpj, uploadId));
  const snap = await uploadRef.get();
  if (!snap.exists) throw new NotFoundError('upload-not-found');
  const upload = snap.data();
  if (upload.createdBy !== uid) throw new BadRequestError('not-owner');
  validateType(upload.type);

  await uploadRef.update({ status: 'processing', errorMessage: FieldValue.delete() });
  await setProgress(uid, cnpj, uploadId, 0, 'starting');

  try {
    const { buffer, metadata } = await readFile(upload.filePath);
    await setProgress(uid, cnpj, uploadId, 25, 'downloaded');

    const analysis = await analyzeFileBuffer(buffer, { type: upload.type, cnpj, mime: metadata.contentType, name: upload.fileName });
    await setProgress(uid, cnpj, uploadId, 75, 'analyzed');

    const reportId = db.collection('_').doc().id;
    await saveReport(cnpj, reportId, {
      relatedUploadId: uploadId,
      summary: analysis.summary,
      type: upload.type,
      status: 'ready'
    });

    await uploadRef.update({ status: 'processed', updatedAt: Timestamp.now() });
    await setProgress(uid, cnpj, uploadId, 100, 'complete');
    logInfo('process_complete', { cnpj, uploadId, reportId });
    return { reportId };
  } catch (err) {
    await uploadRef.update({ status: 'error', errorMessage: err.message, updatedAt: Timestamp.now() });
    await setProgress(uid, cnpj, uploadId, 100, 'error');
    logError('process_error', err, { cnpj, uploadId });
    throw err;
  }
}
