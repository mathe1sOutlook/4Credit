import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../config.js';

/**
 * Analyze a file buffer with OpenAI.
 * Currently returns a mock summary if key is missing.
 * @param {Buffer} buffer
 * @param {{type:string, cnpj:string, mime:string, name:string}} meta
 * @returns {Promise<{summary: string}>}
 */
export async function analyzeFileBuffer(buffer, meta) {
  const key = OPENAI_API_KEY.value();
  if (!key) {
    return { summary: 'OpenAI key not set. Mock analysis.' };
  }
  // const client = new OpenAI({ apiKey: key });
  // Real call should go here using client and buffer.
  return { summary: `Mock summary for ${meta.type}` };
}
