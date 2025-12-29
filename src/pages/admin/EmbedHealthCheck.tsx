import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { 
  TRIAD_EMBED_BASE, 
  WALLET_EMBED_URL, 
  CODEX_EMBED_URL, 
  ADMIN_CODEX_EMBED_URL 
} from '@/config/embed';

interface EndpointStatus {
  url: string;
  name: string;
  status: 'pending' | 'checking' | 'success' | 'error' | 'warning';
  httpStatus?: number;
  xFrameOptions?: string | null;
  csp?: string | null;
  message?: string;
  iframeCompatible?: boolean;
}

const ENDPOINTS: { name: string; url: string }[] = [
  { name: 'Wallet Embed', url: WALLET_EMBED_URL },
  { name: 'Codex Embed', url: CODEX_EMBED_URL },
  { name: 'Admin Codex Embed', url: ADMIN_CODEX_EMBED_URL },
];

export default function EmbedHealthCheck() {
  const navigate = useNavigate();
  const [endpoints, setEndpoints] = useState<EndpointStatus[]>(
    ENDPOINTS.map(e => ({ ...e, status: 'pending' as const }))
  );
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkEndpoint = async (endpoint: { name: string; url: string }): Promise<EndpointStatus> => {
    try {
      // Use a HEAD request first to check headers without loading full content
      // Note: Due to CORS, we may not be able to read response headers from the browser
      // So we also attempt a fetch with mode: 'no-cors' to at least verify reachability
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      let httpStatus: number | undefined;
      let xFrameOptions: string | null = null;
      let csp: string | null = null;
      let iframeCompatible = true;
      let message = '';

      try {
        // Try a regular fetch first (will fail on CORS but gives us info)
        const response = await fetch(endpoint.url, {
          method: 'HEAD',
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        httpStatus = response.status;
        
        // Try to read headers (may be restricted by CORS)
        xFrameOptions = response.headers.get('X-Frame-Options');
        csp = response.headers.get('Content-Security-Policy');
        
        // Check iframe compatibility
        if (xFrameOptions) {
          const xfo = xFrameOptions.toLowerCase();
          if (xfo === 'deny' || xfo === 'sameorigin') {
            iframeCompatible = false;
            message = `X-Frame-Options: ${xFrameOptions} blocks embedding`;
          }
        }
        
        if (csp) {
          const frameAncestors = csp.match(/frame-ancestors\s+([^;]+)/i);
          if (frameAncestors) {
            const ancestors = frameAncestors[1].toLowerCase();
            if (ancestors === "'none'" || ancestors === "'self'") {
              iframeCompatible = false;
              message = `CSP frame-ancestors blocks embedding: ${frameAncestors[1]}`;
            } else {
              message = `CSP frame-ancestors: ${frameAncestors[1]}`;
            }
          }
        }

        if (iframeCompatible && !message) {
          message = 'Endpoint reachable, no blocking headers detected';
        }

        return {
          ...endpoint,
          status: iframeCompatible ? 'success' : 'error',
          httpStatus,
          xFrameOptions,
          csp: csp ? (csp.length > 100 ? csp.substring(0, 100) + '...' : csp) : null,
          message,
          iframeCompatible,
        };
      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        // CORS error is expected - try no-cors to check reachability
        if (fetchError instanceof TypeError && fetchError.message.includes('CORS')) {
          try {
            const noCorsResponse = await fetch(endpoint.url, {
              method: 'HEAD',
              mode: 'no-cors',
            });
            
            // no-cors returns opaque response, status is always 0
            return {
              ...endpoint,
              status: 'warning',
              httpStatus: undefined,
              xFrameOptions: null,
              csp: null,
              message: 'Endpoint reachable (CORS blocks header inspection). Load test below to verify iframe compatibility.',
              iframeCompatible: undefined, // Unknown due to CORS
            };
          } catch {
            throw new Error('Endpoint unreachable');
          }
        }
        
        throw fetchError;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        ...endpoint,
        status: 'error',
        message: `Failed to reach endpoint: ${message}`,
        iframeCompatible: false,
      };
    }
  };

  const runHealthCheck = async () => {
    setIsChecking(true);
    
    // Set all to checking
    setEndpoints(prev => prev.map(e => ({ ...e, status: 'checking' as const })));
    
    // Check all endpoints in parallel
    const results = await Promise.all(ENDPOINTS.map(checkEndpoint));
    
    setEndpoints(results);
    setLastChecked(new Date());
    setIsChecking(false);
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  const getStatusIcon = (status: EndpointStatus['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'checking':
        return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: EndpointStatus['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">Compatible</Badge>;
      case 'error':
        return <Badge variant="destructive">Blocked</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600">Unknown</Badge>;
      case 'checking':
        return <Badge variant="secondary">Checking...</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Embed Health Check</h1>
              <p className="text-sm text-muted-foreground">
                Test AigentiQ embed routes for iframe compatibility
              </p>
            </div>
          </div>
          <Button onClick={runHealthCheck} disabled={isChecking}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Checking...' : 'Run Check'}
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Config Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground">TRIAD_EMBED_BASE</span>
              <code className="text-sm bg-muted px-2 py-1 rounded">{TRIAD_EMBED_BASE}</code>
            </div>
            {lastChecked && (
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Last Checked</span>
                <span className="text-sm">{lastChecked.toLocaleTimeString()}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Endpoint Status Cards */}
        <div className="grid gap-4">
          {endpoints.map((endpoint) => (
            <Card key={endpoint.url}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(endpoint.status)}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{endpoint.name}</h3>
                        {getStatusBadge(endpoint.status)}
                      </div>
                      <p className="text-sm text-muted-foreground font-mono break-all">
                        {endpoint.url}
                      </p>
                      {endpoint.message && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {endpoint.message}
                        </p>
                      )}
                      {endpoint.httpStatus && (
                        <p className="text-xs text-muted-foreground">
                          HTTP Status: {endpoint.httpStatus}
                        </p>
                      )}
                      {endpoint.xFrameOptions && (
                        <p className="text-xs text-muted-foreground">
                          X-Frame-Options: <code className="bg-muted px-1 rounded">{endpoint.xFrameOptions}</code>
                        </p>
                      )}
                      {endpoint.csp && (
                        <p className="text-xs text-muted-foreground">
                          CSP: <code className="bg-muted px-1 rounded text-xs">{endpoint.csp}</code>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Iframe Load Test */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Iframe Load Test</CardTitle>
            <p className="text-sm text-muted-foreground">
              Live test of each embed URL in an actual iframe. If you see content, it works!
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {ENDPOINTS.map((endpoint) => (
              <div key={endpoint.url} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{endpoint.name}</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {endpoint.url.replace(TRIAD_EMBED_BASE, '')}
                  </Badge>
                </div>
                <div className="border border-border rounded-lg overflow-hidden bg-muted/30" style={{ height: 120 }}>
                  <iframe
                    src={endpoint.url}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title={`Test: ${endpoint.name}`}
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Troubleshooting</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p><strong>If endpoints show "Blocked":</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Check that the AigentiQ app is not sending <code>X-Frame-Options: SAMEORIGIN</code></li>
              <li>Ensure CSP <code>frame-ancestors</code> includes this Lovable domain</li>
              <li>Verify the embed routes exist on the target server</li>
            </ul>
            <p className="mt-4"><strong>If endpoints show "Unknown":</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>CORS prevents reading response headers from the browser</li>
              <li>Check the iframe load test section to see if content actually loads</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
