export const userDoc = uid => `users/${uid}`;
export const customerDoc = cnpj => `customers/${cnpj}`;
export const uploadDoc = (cnpj, uploadId) => `customers/${cnpj}/uploads/${uploadId}`;
export const reportDoc = (cnpj, reportId) => `customers/${cnpj}/reports/${reportId}`;
