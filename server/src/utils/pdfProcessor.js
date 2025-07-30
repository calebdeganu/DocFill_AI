import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import fs from 'fs/promises';

export async function processPdf(filePath) {
  const data = await fs.readFile(filePath);
  const uint8Array = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
  const loadingTask = getDocument(uint8Array);
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(1);
  const annotations = await page.getAnnotations();
  const fields = annotations.filter(a => a.fieldName).map(a => ({
    label: a.fieldName,
    value: '',
    type: a.fieldType || 'text'
  }));
  return fields;
}