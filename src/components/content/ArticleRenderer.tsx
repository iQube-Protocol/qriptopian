import React, { useState } from 'react';
import { Markdown } from '@/lib/markdown';
import { FileText, BookOpen, ExternalLink } from 'lucide-react';

interface ArticleRendererProps {
  content: string;
  title?: string;
  excerpt?: string;
  duration?: string;
  pdfUrl?: string;
  onClose?: () => void;
}

/**
 * ArticleRenderer - Full-screen article modal with Markdown + HTML support
 *
 * Supports:
 * - Standard Markdown (headings, lists, quotes, code, etc.)
 * - Raw HTML tables, links, and other allowed elements
 * - XSS sanitization for security
 * - Optional PDF companion document via in-app PDF viewer
 * - Qriptopian themed styling (cyan/purple gradients)
 *
 * See docs/QRIPTOPIAN_STYLE_GUIDE.md for design details
 * See src/lib/markdown.tsx for the allowlist configuration
 */
export const ArticleRenderer: React.FC<ArticleRendererProps> = ({
  content,
  title,
  excerpt,
  duration,
  pdfUrl,
  onClose,
}) => {
  const [view, setView] = useState<'article' | 'pdf'>('article');
  const hasPdf = !!pdfUrl;
  const hasArticle = !!content?.trim();

  // If no article content but a PDF exists, default to PDF view
  React.useEffect(() => {
    if (!hasArticle && hasPdf) setView('pdf');
  }, [hasArticle, hasPdf]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="bg-gray-900/95 backdrop-blur-sm rounded-lg max-w-4xl w-full shadow-2xl border border-gray-800">
          {/* Header */}
          <div className="border-b border-gray-800 p-4 sm:p-6">
            {title && (
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {title}
              </h2>
            )}
            {excerpt && (
              <p className="text-gray-400 text-sm mb-2">
                {excerpt}
              </p>
            )}
            {duration && (
              <span className="text-xs text-qripto-cyan">
                {duration}
              </span>
            )}

            {/* View toggle — only shown when both modes are available */}
            {hasPdf && hasArticle && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setView('article')}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors border ${
                    view === 'article'
                      ? 'bg-qripto-cyan/20 text-qripto-cyan border-qripto-cyan/40'
                      : 'bg-transparent text-gray-300 border-gray-700 hover:bg-gray-800'
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  Read Article
                </button>
                <button
                  onClick={() => setView('pdf')}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors border ${
                    view === 'pdf'
                      ? 'bg-qripto-cyan/20 text-qripto-cyan border-qripto-cyan/40'
                      : 'bg-transparent text-gray-300 border-gray-700 hover:bg-gray-800'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Read PDF
                </button>
              </div>
            )}
          </div>

          {/* Content Area */}
          {view === 'pdf' && hasPdf ? (
            <div className="p-2 sm:p-3">
              <div className="w-full h-[70vh] sm:h-[75vh] rounded-md overflow-hidden border border-gray-800 bg-black">
                <object
                  data={`${getInlinePdfUrl(pdfUrl!)}#toolbar=1&navpanes=0&view=FitH`}
                  type="application/pdf"
                  className="w-full h-full"
                  aria-label={title ? `${title} (PDF)` : 'PDF document'}
                >
                  <iframe
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(getInlinePdfUrl(pdfUrl!))}&embedded=true`}
                    title={title ? `${title} (PDF)` : 'PDF document'}
                    className="w-full h-full"
                  />
                </object>
              </div>
              <div className="px-2 py-2 flex justify-end">
                <a
                  href={getInlinePdfUrl(pdfUrl!)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-qripto-cyan hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  Open PDF in new tab
                </a>
              </div>
            </div>
          ) : (
            <div
              className="p-4 sm:p-6 max-h-[60vh] sm:max-h-[65vh] overflow-y-auto article-content"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              <Markdown>{content}</Markdown>
            </div>
          )}

          {/* Close Button */}
          <div className="border-t border-gray-800 p-4 flex justify-end">
            <button
              onClick={() => {
                if (onClose) onClose();
                const event = new CustomEvent('closeArticle');
                window.dispatchEvent(event);
              }}
              className="px-6 py-2 bg-qripto-cyan/10 hover:bg-qripto-cyan/20 text-qripto-cyan rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
