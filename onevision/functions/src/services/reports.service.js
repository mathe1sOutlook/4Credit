import { db } from '../config.js';
import { reportDoc } from '../models/firestore.models.js';
import { logInfo } from '../utils/logger.js';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * Persist report in Firestore.
 * @param {string} cnpj
 * @param {string} reportId
 * @param {{relatedUploadId:string, summary:string, status:string, errorMessage?:string}} payload
 */
export async function saveReport(cnpj, reportId, payload) {
  const ref = db.doc(reportDoc(cnpj, reportId));
  await ref.set({ ...payload, generatedAt: Timestamp.now() });
  logInfo('report_saved', { cnpj, reportId });
  const snap = await ref.get();
  return { id: reportId, ...snap.data() };
}
