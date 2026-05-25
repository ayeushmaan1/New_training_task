import { useMemo } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

marked.use({
  breaks: true,
  gfm: true
});

export default function MarkdownPreview({ content, className = '' }) {
  const html = useMemo(() => DOMPurify.sanitize(marked.parse(content || '')), [content]);

  return <article className={`prose-content ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
