// src/components/EmbedFrame.tsx
// Reusable iframe component with probe-based error detection and fallback

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, ExternalLink, AlertTriangle, Loader2, Activity } from 'lucide-react';
import { 
  probeEmbedUrl, 
  withCacheBust, 
  type ProbeResult 
} from '@/lib/embedUtils';

interface EmbedFrameProps {
  src: string;
  title: string;
  className?: string;
  style?: React.CSSProperties;
  allow?: string;
  loading?: 'lazy' | 'eager';
  onProbeResult?: (result: ProbeResult) => void;
  showProbeOnLoad?: boolean;
  fallbackBases?: string[];
  iframeId?: string;
}

type LoadState = 'probing' | 'loading' | 'ready' | 'error' | 'blocked';

export function EmbedFrame({
  src,
  title,
  className = '',
  style,
  allow = 'clipboard-write; fullscreen; autoplay',
  loading = 'lazy',
  onProbeResult,
  showProbeOnLoad = true,
  fallbackBases = [],
  iframeId,
}: EmbedFrameProps) {
  const [loadState, setLoadState] = useState<LoadState>(showProbeOnLoad ? 'probing' : 'loading');
  const [probeResult, setProbeResult] = useState<ProbeResult | null>(null);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);

  const runProbe = useCallback(async (urlToProbe: string) => {
    setLoadState('probing');
    setProbeResult(null);

    const result = await probeEmbedUrl(urlToProbe);
    setProbeResult(result);
    onProbeResult?.(result);

    if (result.status === 200 && result.iframeCompatible) {
      setCurrentSrc(withCacheBust(urlToProbe));
      setLoadState('loading');
    } else if (result.status === 200 && !result.iframeCompatible) {
      // Server is up but blocks iframe embedding (X-Frame-Options / CSP)
      setCurrentSrc(urlToProbe);
      setLoadState('blocked');
    } else if (fallbackBases.length > 0 && retryCount < fallbackBases.length) {
      // Try fallback base
      const nextBase = fallbackBases[retryCount];
      const path = new URL(urlToProbe).pathname + new URL(urlToProbe).search;
      const fallbackUrl = nextBase + path;
      setRetryCount(prev => prev + 1);
      runProbe(fallbackUrl);
    } else {
      setLoadState('error');
    }
  }, [fallbackBases, onProbeResult, retryCount]);

  useEffect(() => {
    if (showProbeOnLoad) {
      runProbe(src);
    } else {
      setCurrentSrc(withCacheBust(src));
      setLoadState('loading');
    }
  }, [src, showProbeOnLoad]);

  const handleRetry = () => {
    setRetryCount(0);
    runProbe(src);
  };

  const handleOpenInNewTab = () => {
    window.open(currentSrc, '_blank', 'noopener,noreferrer');
  };

  const handleOpenHealthCheck = () => {
    window.open('/admin/embed-health', '_blank');
  };

  const handleIframeLoad = () => {
    setLoadState('ready');
  };

  const handleIframeError = () => {
    setLoadState('blocked');
  };

  // Probing state
  if (loadState === 'probing') {
    return (
      <div className={`flex items-center justify-center bg-muted/30 ${className}`} style={style}>
        <div className="text-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Checking embed availability...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (loadState === 'error' && probeResult) {
    return (
      <div className={`flex items-center justify-center bg-muted/30 ${className}`} style={style}>
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Service Temporarily Unavailable</h3>
                <p className="text-sm text-muted-foreground">
                  The {title} embed is not responding correctly.
                </p>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={probeResult.status >= 500 ? 'destructive' : 'secondary'}>
                  {probeResult.status} {probeResult.statusText}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Endpoint</span>
                <span className="font-mono text-foreground truncate max-w-[200px]">
                  {new URL(probeResult.url).pathname}
                </span>
              </div>
              {probeResult.error && (
                <div className="pt-2 border-t border-border/50">
                  <span className="text-destructive">{probeResult.error}</span>
                </div>
              )}
              {probeResult.snippet && (
                <div className="pt-2 border-t border-border/50">
                  <p className="text-muted-foreground whitespace-pre-wrap break-words">
                    {probeResult.snippet.slice(0, 150)}...
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={handleRetry}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
              <Button size="sm" variant="outline" onClick={handleOpenInNewTab}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
              <Button size="sm" variant="ghost" onClick={handleOpenHealthCheck}>
                <Activity className="h-4 w-4 mr-2" />
                Health Check
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Blocked by X-Frame-Options / CSP
  if (loadState === 'blocked') {
    return (
      <div className={`flex items-center justify-center bg-muted/30 ${className}`} style={style}>
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Browser Blocked Embedding</h3>
                <p className="text-sm text-muted-foreground">
                  The {title} page cannot be displayed inside this app due to the host's security policy. Open it in a new tab instead.
                </p>
              </div>
            </div>
            <Button size="sm" onClick={() => window.open(currentSrc, '_blank', 'noopener,noreferrer')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open {title} in New Tab
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading / Ready state - show iframe
  return (
    <div className={`relative ${className}`} style={style}>
      {loadState === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30 z-10">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
      <iframe
        id={iframeId}
        src={currentSrc}
        title={title}
        className="w-full h-full border-none"
        allow={allow}
        loading={loading}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
      />
    </div>
  );
}
