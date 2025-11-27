import { useState, useEffect } from 'react';
import { ExternalLink, X, Globe, Maximize2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface WebsiteMetadata {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon?: string;
}

interface WebsiteViewerProps {
  url: string;
  title?: string;
  onClose: () => void;
}

// Extract domain from URL for display
function getDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

// Generate favicon URL from domain
function getFaviconUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
  } catch {
    return '';
  }
}

// Open website in a styled popup window
function openPopupWindow(url: string, title?: string): Window | null {
  const width = Math.min(1200, window.screen.width * 0.85);
  const height = Math.min(800, window.screen.height * 0.85);
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;
  
  const features = [
    `width=${width}`,
    `height=${height}`,
    `left=${left}`,
    `top=${top}`,
    'menubar=no',
    'toolbar=yes',
    'location=yes',
    'status=yes',
    'resizable=yes',
    'scrollbars=yes'
  ].join(',');
  
  return window.open(url, title || 'External Website', features);
}

export function WebsiteViewer({ url, title, onClose }: WebsiteViewerProps) {
  const [metadata, setMetadata] = useState<WebsiteMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const domain = getDomain(url);
  const faviconUrl = getFaviconUrl(url);

  useEffect(() => {
    // Set basic metadata from props and URL
    setMetadata({
      title: title || domain,
      description: `Visit ${domain} to view this content`,
      siteName: domain,
      favicon: faviconUrl
    });
    setLoading(false);
  }, [url, title, domain, faviconUrl]);

  const handleOpenPopup = () => {
    const popup = openPopupWindow(url, metadata?.title);
    if (!popup || popup.closed) {
      // Popup was blocked, fall back to new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleOpenNewTab = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[9999] p-4 sm:p-8">
      <div className="relative w-full max-w-lg bg-background rounded-2xl overflow-hidden border border-border shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black border border-white/20 hover:border-cyan-400 flex items-center justify-center text-white hover:text-cyan-400 transition-all hover:scale-110"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Preview Card Content */}
        <div className="p-6 space-y-6">
          {/* Image Preview Area */}
          <div className="relative aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-xl overflow-hidden border border-border/50">
            {loading ? (
              <Skeleton className="w-full h-full" />
            ) : metadata?.image && !imageError ? (
              <img
                src={metadata.image}
                alt={metadata.title || 'Website preview'}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8">
                <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  {faviconUrl ? (
                    <img 
                      src={faviconUrl} 
                      alt={domain}
                      className="w-10 h-10"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <Globe className={`w-10 h-10 text-cyan-400 ${faviconUrl ? 'hidden' : ''}`} />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  External website preview
                </p>
              </div>
            )}
            
            {/* Domain Badge */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-black/80 backdrop-blur-sm rounded-full border border-white/10">
              {faviconUrl && (
                <img 
                  src={faviconUrl} 
                  alt="" 
                  className="w-4 h-4"
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
              )}
              <span className="text-xs text-white/80 font-medium">{domain}</span>
            </div>
          </div>

          {/* Metadata Info */}
          <div className="space-y-2">
            {loading ? (
              <>
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-foreground line-clamp-2">
                  {metadata?.title || title || domain}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {metadata?.description || `Visit ${domain} to view this content`}
                </p>
                <p className="text-xs text-muted-foreground/70 truncate">
                  {url}
                </p>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleOpenPopup}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Maximize2 className="h-5 w-5" />
              Open in Popup
            </button>
            <button
              onClick={handleOpenNewTab}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-muted hover:bg-muted/80 border border-border hover:border-cyan-500/50 text-foreground font-medium rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ExternalLink className="h-5 w-5" />
              New Tab
            </button>
          </div>

          {/* Info Note */}
          <p className="text-xs text-center text-muted-foreground/60">
            External websites open in a separate window for security
          </p>
        </div>
      </div>
    </div>
  );
}
