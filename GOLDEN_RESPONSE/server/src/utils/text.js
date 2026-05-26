import slugify from 'slugify';
import sanitizeHtml from 'sanitize-html';

export function toSlug(value) {
  return slugify(value || 'post', {
    lower: true,
    strict: true,
    trim: true
  });
}

export function normalizeTags(tags = []) {
  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [...new Set(tags.map((tag) => String(tag).trim()).filter(Boolean))];
}

export function estimateReadingTime(markdown = '') {
  const words = String(markdown).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function sanitizePlainText(value) {
  return sanitizeHtml(String(value || ''), {
    allowedTags: [],
    allowedAttributes: {}
  }).trim();
}

export function sanitizeMarkdown(value) {
  return sanitizeHtml(String(value || ''), {
    allowedTags: [
      'a',
      'blockquote',
      'br',
      'code',
      'em',
      'h1',
      'h2',
      'h3',
      'hr',
      'img',
      'li',
      'ol',
      'p',
      'pre',
      'strong',
      'ul'
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'title']
    },
    allowedSchemes: ['http', 'https', 'mailto', 'data']
  }).trim();
}
