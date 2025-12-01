import { useState } from 'react';
import { ExternalLink, X } from 'lucide-react';

interface WebsiteViewerProps {
  url: string;
  title?: string;
  onClose: () => void;
}

export function WebsiteViewer({ url, title, onClose }: WebsiteViewerProps) {
  const [iframeError, setIframeError] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleIframeError = () => {
    setIframeError(true);
    setLoading(false);
  };

  const handleIframeLoad = () => {
    setLoading(false);
  };

  const openInNewTab = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[9999] p-4 sm:p-8">
      <div className="relative w-full h-full max-w-7xl max-h-[90vh] bg-background rounded-lg overflow-hidden border border-border">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-background to-background/80 backdrop-blur-sm border-b border-border z-10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <ExternalLink className="h-5 w-5 text-cyan-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              {title && (
                <h3 className="text-lg font-semibold text-foreground truncate">{title}</h3>
              )}
              <p className="text-sm text-muted-foreground truncate">{url}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={openInNewTab}
              className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500 rounded-lg text-cyan-400 text-sm font-medium transition-all flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open in New Tab
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-black/50 hover:bg-black border border-white/20 hover:border-cyan-400 flex items-center justify-center text-white hover:text-cyan-400 transition-all hover:scale-110"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full h-full pt-20">
          {loading && !iframeError && (
            <div className="absolute inset-0 flex items-center justify-center bg-background">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading website...</p>
              </div>
            </div>
          )}

          {iframeError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background">
              <div className="text-center max-w-md p-8">
                <ExternalLink className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Unable to Embed Website
                </h3>
                <p className="text-muted-foreground mb-6">
                  This website cannot be displayed in an iframe. Click the button below to open it in a new tab.
                </p>
                <button
                  onClick={openInNewTab}
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
                >
                  <ExternalLink className="h-5 w-5" />
                  Open Website
                </button>
              </div>
            </div>
          ) : (
            <iframe
              src={url}
              className="w-full h-full border-0"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
              referrerPolicy="no-referrer"
              onError={handleIframeError}
              onLoad={handleIframeLoad}
              title={title || 'External Website'}
            />
          )}
        </div>
      </div>
    </div>
  );
}
