import { sanitizePlainText } from '../utils/text.js';

const skipSanitizeFields = new Set(['content', 'password', 'token']);

function sanitizeValue(value, key = '') {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item, key));
  }

  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([entryKey, entryValue]) => [
        entryKey,
        sanitizeValue(entryValue, entryKey)
      ])
    );
  }

  if (typeof value === 'string' && !skipSanitizeFields.has(key)) {
    return sanitizePlainText(value);
  }

  return value;
}

export function sanitizeRequest(req, _res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeValue(req.query);
  }
  next();
}
