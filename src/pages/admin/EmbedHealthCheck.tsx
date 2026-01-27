import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, AlertCircle, Loader2, Copy, Check, ExternalLink } from 'lucide-react';
import { 
  buildEmbedUrl, 
  getOrderedBases, 
  probeEmbedUrl, 
  type ProbeResult 
} from '@/lib/embedUtils';
import { useToast } from '@/hooks/use-toast';

interface EndpointConfig {
  name: string;
  path: string;
  params: Record<string, string>;
  version: string;
}

const ENDPOINTS: EndpointConfig[] = [
  { 
    name: 'Wallet Embed', 
    path: '/triad/embed/wallet', 
    params: {}, 
    version: '2025-12-30-01' 
  },
  { 
    name: 'Codex Embed', 
    path: '/triad/embed/codex', 
    params: { tab: 'scrolls', theme: 'light', density: 'wide' }, 
    version: '2025-12-30-01' 
  },
  { 
    name: 'Admin Codex Embed', 
    path: '/triad/embed/admin/codex', 
    params: {}, 
    version: '2025-12-30-01' 
  },
];

interface EndpointStatus extends EndpointConfig {
  url: string;
  status: 'pending' | 'checking' | 'success' | 'error' | 'warning';
  probeResult: ProbeResult | null;
}

export default function EmbedHealthCheck() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [endpoints, setEndpoints] = useState<EndpointStatus[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [copied, setCopied] = useState(false);

  const bases = getOrderedBases();
  const primaryBase = bases[0] || 'https://dev-beta.aigentz.me';

  // Initialize endpoints
  useEffect(() => {
    setEndpoints(
      ENDPOINTS.map(e => ({
        ...e,
        url: buildEmbedUrl(primaryBase, e.path, e.params, e.version),
        status: 'pending' as const,
        probeResult: null,
      }))
    );
  }, [primaryBase]);

  const checkEndpoint = async (endpoint: EndpointStatus): Promise<EndpointStatus> => {
    const result = await probeEmbedUrl(endpoint.url);
    
    let status: EndpointStatus['status'] = 'error';
    if (result.status === 200 && result.iframeCompatible) {
      status = 'success';
    } else if (result.status === 200 && !result.iframeCompatible) {
      status = 'warning';
    } else if (result.error) {
      status = 'error';
    }

    return {
      ...endpoint,
      status,
      probeResult: result,
    };
  };

  const runHealthCheck = useCallback(async () => {
    setIsChecking(true);
    
    // Set all to checking
    setEndpoints(prev => prev.map(e => ({ ...e, status: 'checking' as const, probeResult: null })));
    
    // Check all endpoints in parallel using the probe
    const currentEndpoints = ENDPOINTS.map(e => ({
      ...e,
      url: buildEmbedUrl(primaryBase, e.path, e.params, e.version),
      status: 'checking' as const,
      probeResult: null,
    }));

    const results = await Promise.all(currentEndpoints.map(checkEndpoint));
    
    setEndpoints(results);
    setLastChecked(new Date());
    setIsChecking(false);
  }, [primaryBase]);

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

  const getStatusBadge = (status: EndpointStatus['status'], httpStatus?: number) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">200 OK</Badge>;
      case 'error':
        return <Badge variant="destructive">{httpStatus || 'Error'}</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600">Restricted</Badge>;
      case 'checking':
        return <Badge variant="secondary">Probing...</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const generateDebugReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      primaryBase,
      configuredBases: bases,
      endpoints: endpoints.map(e => ({
        name: e.name,
        url: e.url,
        status: e.status,
        httpStatus: e.probeResult?.status,
        statusText: e.probeResult?.statusText,
        headers: e.probeResult?.headers,
        iframeCompatible: e.probeResult?.iframeCompatible,
        error: e.probeResult?.error,
        snippet: e.probeResult?.snippet,
      })),
    };
    return JSON.stringify(report, null, 2);
  };

  const handleCopyReport = async () => {
    try {
      await navigator.clipboard.writeText(generateDebugReport());
      setCopied(true);
      toast({
        title: 'Debug report copied',
        description: 'Share this with ops to help diagnose upstream issues.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Failed to copy',
        description: 'Please try again.',
        variant: 'destructive',
      });
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
                Server-side probe for AigentiQ embed routes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleCopyReport} disabled={isChecking}>
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? 'Copied!' : 'Copy Debug Report'}
            </Button>
            <Button onClick={runHealthCheck} disabled={isChecking}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
              {isChecking ? 'Probing...' : 'Run Probe'}
            </Button>
          </div>
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
              <span className="text-sm text-muted-foreground">Primary Base</span>
              <code className="text-sm bg-muted px-2 py-1 rounded">{primaryBase}</code>
            </div>
            {bases.length > 1 && (
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Fallback Bases</span>
                <div className="flex gap-1 flex-wrap justify-end">
                  {bases.slice(1).map((b, i) => (
                    <code key={i} className="text-xs bg-muted px-2 py-1 rounded">{b}</code>
                  ))}
                </div>
              </div>
            )}
            {lastChecked && (
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Last Probed</span>
                <span className="text-sm">{lastChecked.toLocaleTimeString()}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Endpoint Status Cards */}
        <div className="grid gap-4">
          {endpoints.map((endpoint) => (
            <Card key={endpoint.path}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(endpoint.status)}
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{endpoint.name}</h3>
                        {getStatusBadge(endpoint.status, endpoint.probeResult?.status)}
                      </div>
                      <p className="text-sm text-muted-foreground font-mono break-all">
                        {endpoint.url}
                      </p>
                      
                      {endpoint.probeResult && (
                        <div className="bg-muted rounded-lg p-3 space-y-2 text-xs mt-3">
                          {endpoint.probeResult.error && (
                            <div className="text-destructive font-medium">
                              {endpoint.probeResult.error}
                            </div>
                          )}
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-muted-foreground">Status:</span>{' '}
                              <span className="font-medium">
                                {endpoint.probeResult.status} {endpoint.probeResult.statusText}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Iframe OK:</span>{' '}
                              <span className={endpoint.probeResult.iframeCompatible ? 'text-green-500' : 'text-destructive'}>
                                {endpoint.probeResult.iframeCompatible ? 'Yes' : 'No'}
                              </span>
                            </div>
                          </div>
                          
                          {endpoint.probeResult.headers.xFrameOptions && (
                            <div>
                              <span className="text-muted-foreground">X-Frame-Options:</span>{' '}
                              <code className="bg-background px-1 rounded">
                                {endpoint.probeResult.headers.xFrameOptions}
                              </code>
                            </div>
                          )}
                          
                          {endpoint.probeResult.headers.csp && (
                            <div>
                              <span className="text-muted-foreground">CSP:</span>{' '}
                              <code className="bg-background px-1 rounded text-xs break-all">
                                {endpoint.probeResult.headers.csp}
                              </code>
                            </div>
                          )}
                          
                          {endpoint.probeResult.snippet && (
                            <div className="pt-2 border-t border-border/50">
                              <span className="text-muted-foreground block mb-1">Response snippet:</span>
                              <pre className="bg-background p-2 rounded text-xs whitespace-pre-wrap break-words max-h-32 overflow-auto">
                                {endpoint.probeResult.snippet}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(endpoint.url, '_blank')}
                    title="Open in new tab"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
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
              Live test of each embed URL. Compare with probe results above.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {endpoints.map((endpoint) => (
              <div key={`iframe-${endpoint.path}`} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{endpoint.name}</span>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(endpoint.status, endpoint.probeResult?.status)}
                    <Badge variant="outline" className="font-mono text-xs">
                      {endpoint.path}
                    </Badge>
                  </div>
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
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <div>
              <p className="font-medium text-foreground">If endpoints return 500:</p>
              <ul className="list-disc list-inside space-y-1 ml-2 mt-1">
                <li>The AigentiQ server has an internal error on these routes</li>
                <li>Check AigentiQ deployment logs for crashes or missing env vars</li>
                <li>Verify the embed routes exist and are deployed</li>
                <li>Use the "Copy Debug Report" button to share diagnostics with ops</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground">If endpoints return 403/404:</p>
              <ul className="list-disc list-inside space-y-1 ml-2 mt-1">
                <li>Routes may have been renamed or removed</li>
                <li>Check if authentication/middleware is blocking requests</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground">If "Iframe OK" is No:</p>
              <ul className="list-disc list-inside space-y-1 ml-2 mt-1">
                <li>Check X-Frame-Options header (should not be DENY or SAMEORIGIN)</li>
                <li>Check CSP frame-ancestors directive</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
