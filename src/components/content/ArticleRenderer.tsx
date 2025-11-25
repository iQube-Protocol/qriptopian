import React from 'react';

interface ArticleRendererProps {
  content: string;
  title?: string;
  excerpt?: string;
  duration?: string;
  onClose?: () => void;
}

type BlockType = 'h1' | 'h2' | 'h3' | 'ol' | 'ul' | 'quote' | 'code' | 'paragraph' | 'empty';

interface Block {
  type: BlockType;
  content: string;
  lines?: string[];
}

export const ArticleRenderer: React.FC<ArticleRendererProps> = ({ 
  content, 
  title, 
  excerpt, 
  duration,
  onClose 
}) => {
  const parseBlocks = (text: string): Block[] => {
    // Normalize line endings and split
    const normalizedText = text.replace(/\r\n/g, '\n');
    const lines = normalizedText.split('\n');
    
    const blocks: Block[] = [];
    let currentBlock: string[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Handle code blocks
      if (trimmed.startsWith('```')) {
        if (inCodeBlock) {
          // End code block
          blocks.push({
            type: 'code',
            content: codeBlockContent.join('\n')
          });
          codeBlockContent = [];
          inCodeBlock = false;
        } else {
          // Start code block
          if (currentBlock.length > 0) {
            blocks.push(...classifyAndSplitBlock(currentBlock));
            currentBlock = [];
          }
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        continue;
      }

      // Empty line - end current block
      if (trimmed === '') {
        if (currentBlock.length > 0) {
          blocks.push(...classifyAndSplitBlock(currentBlock));
          currentBlock = [];
        }
        continue;
      }

      // Add line to current block
      currentBlock.push(line);
    }

    // Handle remaining block
    if (currentBlock.length > 0) {
      blocks.push(...classifyAndSplitBlock(currentBlock));
    }

    return blocks;
  };

  const classifyAndSplitBlock = (lines: string[]): Block[] => {
    if (lines.length === 0) return [];

    const blocks: Block[] = [];
    let currentLines: string[] = [];
    let currentType: BlockType | null = null;

    for (const line of lines) {
      const trimmed = line.trim();
      const type = classifyLine(trimmed);

      // If type changes, save current block
      if (currentType !== null && type !== currentType) {
        blocks.push({
          type: currentType,
          content: currentLines.join('\n'),
          lines: currentLines
        });
        currentLines = [];
      }

      currentType = type;
      currentLines.push(line);
    }

    // Save final block
    if (currentLines.length > 0 && currentType) {
      blocks.push({
        type: currentType,
        content: currentLines.join('\n'),
        lines: currentLines
      });
    }

    return blocks;
  };

  const classifyLine = (line: string): BlockType => {
    if (line.startsWith('# ')) return 'h1';
    if (line.startsWith('## ')) return 'h2';
    if (line.startsWith('### ')) return 'h3';
    if (/^\d+\.\s/.test(line)) return 'ol';
    if (line.startsWith('* ') || line.startsWith('- ')) return 'ul';
    if (line.startsWith('> ')) return 'quote';
    if (line === '') return 'empty';
    return 'paragraph';
  };

  const processInlineFormatting = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    
    // Match **bold** or __bold__
    const boldRegex = /(\*\*|__)(.*?)\1/g;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      // Add highlighted key term
      parts.push(
        <span 
          key={match.index} 
          className="font-medium px-1 rounded bg-qripto-cyan/10 text-qripto-cyan"
        >
          {match[2]}
        </span>
      );
      
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  };

  const renderBlock = (block: Block, index: number): React.ReactNode => {
    switch (block.type) {
      case 'h1': {
        const text = block.content.replace(/^#\s*/, '');
        return (
          <h3 
            key={index} 
            className="font-bold text-lg mt-8 mb-4 px-4 py-3 rounded-r-lg bg-gradient-to-r from-qripto-cyan/20 to-qripto-purple/20 border-l-4 border-qripto-cyan text-white"
          >
            Understanding {text}
          </h3>
        );
      }

      case 'h2': {
        const text = block.content.replace(/^##\s*/, '');
        return (
          <h4 
            key={index} 
            className="font-bold text-base mt-8 mb-4 px-4 py-2 rounded-r-lg bg-gradient-to-r from-qripto-cyan/20 to-qripto-purple/20 border-l-4 border-qripto-cyan text-white"
          >
            Key info on {text}
          </h4>
        );
      }

      case 'h3': {
        const text = block.content.replace(/^###\s*/, '');
        return (
          <h5 
            key={index} 
            className="font-bold text-sm mt-6 mb-3 px-3 py-2 rounded-r-lg bg-gradient-to-r from-qripto-cyan/20 to-qripto-purple/20 border-l-4 border-qripto-cyan text-white"
          >
            About {text}
          </h5>
        );
      }

      case 'ol': {
        const items = block.lines || [];
        return (
          <ol key={index} className="space-y-3 ml-4 list-none my-6">
            {items.map((item, i) => {
              const text = item.trim().replace(/^\d+\.\s*/, '');
              return (
                <li key={i} className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-qripto-cyan/10 text-qripto-cyan text-sm font-medium mr-3 flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-gray-300 leading-relaxed">
                    {processInlineFormatting(text)}
                  </span>
                </li>
              );
            })}
          </ol>
        );
      }

      case 'ul': {
        const items = block.lines || [];
        return (
          <ul key={index} className="space-y-2 ml-4 my-6">
            {items.map((item, i) => {
              const text = item.trim().replace(/^[*-]\s*/, '');
              return (
                <li key={i} className="flex items-start">
                  <span className="text-qripto-cyan mr-3 mt-1 flex-shrink-0">•</span>
                  <span className="text-gray-300 leading-relaxed">
                    {processInlineFormatting(text)}
                  </span>
                </li>
              );
            })}
          </ul>
        );
      }

      case 'quote': {
        const text = block.content.replace(/^>\s*/gm, '');
        return (
          <blockquote 
            key={index} 
            className="border-l-4 border-qripto-purple/30 pl-4 py-2 my-6 bg-qripto-purple/5 italic text-gray-300"
          >
            {processInlineFormatting(text)}
          </blockquote>
        );
      }

      case 'code': {
        return (
          <pre 
            key={index} 
            className="bg-black/50 border border-qripto-cyan/20 rounded-lg p-4 overflow-x-auto my-6"
          >
            <code className="text-gray-300 text-sm font-mono">
              {block.content}
            </code>
          </pre>
        );
      }

      case 'paragraph': {
        const lines = block.lines || [block.content];
        const isSingleLine = lines.length === 1;
        
        if (isSingleLine) {
          // Emphasized single sentence
          return (
            <p 
              key={index} 
              className="text-gray-300 mb-4 text-lg font-medium leading-relaxed"
            >
              {processInlineFormatting(lines[0].trim())}
            </p>
          );
        } else {
          // Multi-line paragraph
          const fullText = lines.map(l => l.trim()).join(' ');
          return (
            <p 
              key={index} 
              className="text-gray-300 mb-4 leading-relaxed"
              style={{ lineHeight: '1.7' }}
            >
              {processInlineFormatting(fullText)}
            </p>
          );
        }
      }

      default:
        return null;
    }
  };

  const blocks = parseBlocks(content);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-900/95 backdrop-blur-sm rounded-lg max-w-3xl w-full shadow-2xl border border-gray-800">
          {/* Header */}
          <div className="border-b border-gray-800 p-6">
            {title && (
              <h2 className="text-2xl font-bold text-white mb-2">
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

          {/* Article Content */}
          <div 
            className="p-6 max-h-[70vh] overflow-y-auto"
            style={{ 
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}
          >
            {blocks.map((block, index) => renderBlock(block, index))}
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
