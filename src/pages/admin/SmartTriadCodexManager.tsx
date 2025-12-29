import { useNavigate } from 'react-router-dom';
import { useIsAdminAA } from '@/hooks/useIsAdminAA';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const TRIAD_BASE = process.env.NEXT_PUBLIC_TRIAD_EMBED_BASE || "https://theqriptopian.netlify.app";

export default function SmartTriadCodexManager() {
  const navigate = useNavigate();
  const { isAdmin, loading } = useIsAdminAA();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Card className="p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You need administrator privileges to access this area.
          </p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">SmartTriad Codex Manager</h1>
            <p className="text-sm text-muted-foreground">Manage episodes, covers, Autonomys uploads & more</p>
          </div>
        </div>
      </div>

      {/* Iframe Content */}
      <div className="flex-1 overflow-hidden">
        <iframe
          src={`${TRIAD_BASE}/triad/admin/codex`}
          style={{ width: "100%", height: "100%", border: "none" }}
          allow="clipboard-write; fullscreen; autoplay"
          title="SmartTriad Codex Manager"
        />
      </div>
    </div>
  );
}
