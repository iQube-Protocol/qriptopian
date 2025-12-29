import React from 'react';
import { Markdown } from '@/lib/markdown';

interface ArticleRendererProps {
  content: string;
  title?: string;
  excerpt?: string;
  duration?: string;
  onClose?: () => void;
}

/**
 * ArticleRenderer - Full-screen article modal with Markdown + HTML support
 * 
 * Supports:
 * - Standard Markdown (headings, lists, quotes, code, etc.)
 * - Raw HTML tables, links, and other allowed elements
 * - XSS sanitization for security
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
  onClose 
}) => {
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
          </div>

          {/* Article Content with Markdown + HTML support */}
          <div 
            className="p-4 sm:p-6 max-h-[60vh] sm:max-h-[65vh] overflow-y-auto article-content"
            style={{ 
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}
          >
            <Markdown>{content}</Markdown>
          </div>

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
