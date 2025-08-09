export function logInfo(event, details = {}) {
  console.log(JSON.stringify({ level: 'INFO', event, details }));
}

export function logError(event, error, details = {}) {
  console.error(JSON.stringify({ level: 'ERROR', event, message: error.message, details }));
}
