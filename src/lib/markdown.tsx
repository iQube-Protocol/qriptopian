/**
 * Markdown renderer with HTML support and XSS sanitization
 * 
 * Supports:
 * - Raw HTML tables (thead/tbody/tr/th/td)
 * - Links with proper security attrs
 * - GFM (GitHub Flavored Markdown)
 * - Code blocks, lists, quotes, etc.
 * 
 * Configurable allowlist for tags/attrs - extend as needed
 */

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

// Configurable allowlist - editors can extend this
export const ALLOWED_SCHEMA = {
  strip: ['script', 'style', 'iframe', 'form', 'input', 'button'],
  tagNames: [
    // Text formatting
    'p', 'br', 'hr',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'strong', 'b', 'em', 'i', 'u', 's', 'del', 'ins', 'mark', 'sub', 'sup',
    // Links and media
    'a', 'img',
    // Lists
    'ul', 'ol', 'li',
    // Quotes and code
    'blockquote', 'pre', 'code',
    // Tables
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
    // Semantic
    'div', 'span', 'section', 'article', 'aside', 'header', 'footer', 'main', 'nav',
    // Definition lists
    'dl', 'dt', 'dd',
    // Figures
    'figure', 'figcaption',
  ],
  attributes: {
    '*': ['className', 'class', 'id'],
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    th: ['colspan', 'rowspan', 'align', 'valign', 'scope'],
    td: ['colspan', 'rowspan', 'align', 'valign'],
    col: ['span', 'width'],
    table: ['border', 'cellpadding', 'cellspacing'],
    code: ['className', 'class'], // For syntax highlighting
  },
  protocols: {
    href: ['http', 'https', 'mailto', 'tel'],
    src: ['http', 'https', 'data'],
  },
};

interface MarkdownProps {
  children: string;
  className?: string;
}

/**
 * Secure Markdown renderer with HTML support
 * 
 * Usage:
 * <Markdown>{content}</Markdown>
 * 
 * or
 * 
 * <Markdown className="prose">{content}</Markdown>
 */
export function Markdown({ children, className = '' }: MarkdownProps) {
  return (
    <ReactMarkdown
      className={className}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        rehypeRaw,
        [rehypeSanitize, ALLOWED_SCHEMA]
      ]}
      components={{
        // Force external links to open in new tab with security attrs
        a({ node, children, href, ...props }) {
          const hrefStr = String(href || '');
          const isExternal = /^https?:\/\//i.test(hrefStr);
          return (
            <a
              href={hrefStr}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer nofollow' : undefined}
              className="text-qripto-cyan hover:text-qripto-cyan/80 underline underline-offset-2 transition-colors"
              {...props}
            >
              {children}
            </a>
          );
        },
        // Custom table styling matching Qriptopian theme
        table({ node, children, ...props }) {
          return (
            <div className="overflow-x-auto my-6">
              <table 
                className="w-full border-collapse border border-qripto-cyan/20 text-sm"
                {...props}
              >
                {children}
              </table>
            </div>
          );
        },
        thead({ node, children, ...props }) {
          return (
            <thead 
              className="bg-qripto-cyan/10 text-white"
              {...props}
            >
              {children}
            </thead>
          );
        },
        th({ node, children, ...props }) {
          return (
            <th 
              className="border border-qripto-cyan/20 px-3 py-2 text-left font-semibold text-qripto-cyan"
              {...props}
            >
              {children}
            </th>
          );
        },
        td({ node, children, ...props }) {
          return (
            <td 
              className="border border-qripto-cyan/20 px-3 py-2 text-gray-300"
              {...props}
            >
              {children}
            </td>
          );
        },
        tr({ node, children, ...props }) {
          return (
            <tr 
              className="even:bg-qripto-purple/5 hover:bg-qripto-cyan/5 transition-colors"
              {...props}
            >
              {children}
            </tr>
          );
        },
        // Headings with Qriptopian gradient styling
        h1({ node, children, ...props }) {
          return (
            <h1 
              className="font-bold text-2xl mt-8 mb-4 px-4 py-3 rounded-r-lg bg-gradient-to-r from-qripto-cyan/20 to-qripto-purple/20 border-l-4 border-qripto-cyan text-white"
              {...props}
            >
              {children}
            </h1>
          );
        },
        h2({ node, children, ...props }) {
          return (
            <h2 
              className="font-bold text-xl mt-8 mb-4 px-4 py-3 rounded-r-lg bg-gradient-to-r from-qripto-cyan/20 to-qripto-purple/20 border-l-4 border-qripto-cyan text-white"
              {...props}
            >
              {children}
            </h2>
          );
        },
        h3({ node, children, ...props }) {
          return (
            <h3 
              className="font-bold text-lg mt-6 mb-3 px-3 py-2 rounded-r-lg bg-gradient-to-r from-qripto-cyan/20 to-qripto-purple/20 border-l-4 border-qripto-cyan text-white"
              {...props}
            >
              {children}
            </h3>
          );
        },
        h4({ node, children, ...props }) {
          return (
            <h4 
              className="font-bold text-base mt-6 mb-3 text-qripto-cyan"
              {...props}
            >
              {children}
            </h4>
          );
        },
        // Paragraphs
        p({ node, children, ...props }) {
          return (
            <p 
              className="text-gray-300 mb-4 leading-relaxed"
              {...props}
            >
              {children}
            </p>
          );
        },
        // Lists
        ul({ node, children, ...props }) {
          return (
            <ul 
              className="space-y-2 ml-4 my-6 list-none"
              {...props}
            >
              {children}
            </ul>
          );
        },
        ol({ node, children, ...props }) {
          return (
            <ol 
              className="space-y-3 ml-4 my-6 list-none counter-reset-item"
              {...props}
            >
              {children}
            </ol>
          );
        },
        li({ node, children, ...props }) {
          return (
            <li 
              className="flex items-start text-gray-300"
              {...props}
            >
              <span className="text-qripto-cyan mr-3 mt-0.5 flex-shrink-0">•</span>
              <span>{children}</span>
            </li>
          );
        },
        // Blockquotes
        blockquote({ node, children, ...props }) {
          return (
            <blockquote 
              className="border-l-4 border-qripto-purple/30 pl-4 py-2 my-6 bg-qripto-purple/5 italic text-gray-300"
              {...props}
            >
              {children}
            </blockquote>
          );
        },
        // Code blocks
        pre({ node, children, ...props }) {
          return (
            <pre 
              className="bg-black/50 border border-qripto-cyan/20 rounded-lg p-4 overflow-x-auto my-6"
              {...props}
            >
              {children}
            </pre>
          );
        },
        code({ node, className, children, ...props }) {
          const isInline = !className;
          return isInline ? (
            <code 
              className="px-1.5 py-0.5 rounded bg-qripto-cyan/10 text-qripto-cyan text-sm font-mono"
              {...props}
            >
              {children}
            </code>
          ) : (
            <code 
              className="text-gray-300 text-sm font-mono"
              {...props}
            >
              {children}
            </code>
          );
        },
        // Bold/strong - use cyan highlight like ArticleRenderer
        strong({ node, children, ...props }) {
          return (
            <strong 
              className="font-medium px-1 rounded bg-qripto-cyan/10 text-qripto-cyan"
              {...props}
            >
              {children}
            </strong>
          );
        },
        // Horizontal rule
        hr({ node, ...props }) {
          return (
            <hr 
              className="my-8 border-qripto-cyan/20"
              {...props}
            />
          );
        },
        // Images
        img({ node, src, alt, ...props }) {
          return (
            <img 
              src={src}
              alt={alt || ''}
              loading="lazy"
              className="max-w-full h-auto rounded-lg my-4"
              {...props}
            />
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}

export default Markdown;
