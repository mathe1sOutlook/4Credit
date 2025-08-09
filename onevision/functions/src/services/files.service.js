import { storage } from '../config.js';

/**
 * Download file from Storage.
 * @param {string} filePath gs://bucket/path
 * @returns {Promise<{buffer:Buffer, metadata:Object}>}
 */
export async function readFile(filePath) {
  const [bucket, ...parts] = filePath.replace('gs://', '').split('/');
  const file = storage.bucket(bucket).file(parts.join('/'));
  const [buffer] = await file.download();
  const [metadata] = await file.getMetadata();
  return { buffer, metadata };
}
