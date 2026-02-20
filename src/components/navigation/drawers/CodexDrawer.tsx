import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmbedFrame } from "@/components/EmbedFrame";
import { buildEmbedUrl, getOrderedBases } from "@/lib/embedUtils";
import { supabase } from "@/integrations/supabase/client";

// Embed configuration
const EMBED_PATH = '/triad/embed/codex';
const EMBED_VERSION = '2025-12-30-01';
const EMBED_PARAMS = {
  tab: 'scrolls',
  theme: 'dark',
  density: 'wide',
};

const CODEX_ORIGIN = 'https://dev-beta.aigentz.me';
const IFRAME_ID = 'knyt-codex-iframe';

interface CodexDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CodexDrawer({ isOpen, onClose }: CodexDrawerProps) {
  // PostMessage auth handshake with the Codex iframe
  useEffect(() => {
    if (!isOpen) return;

    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== CODEX_ORIGIN) return;

      if (event.data?.type === 'aa-auth-context-ready-v1') {
        const iframe = document.getElementById(IFRAME_ID) as HTMLIFrameElement | null;
        if (!iframe?.contentWindow) return;

        // Gather auth context from Supabase session + persona
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Look up the active persona
        const savedPersonaId = localStorage.getItem('activePersonaId');
        let personaId: string | null = savedPersonaId;

        if (!personaId) {
          const { data: personas } = await supabase
            .from('persona')
            .select('id')
            .limit(1);
          personaId = personas?.[0]?.id ?? null;
        }

        iframe.contentWindow.postMessage(
          {
            type: 'aa-auth-context-v1',
            personaId: personaId,
            authProfileId: user.id, // fallback-resolve supported
          },
          CODEX_ORIGIN
        );
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isOpen]);

  if (!isOpen) return null;

  const bases = getOrderedBases();
  const primaryBase = bases[0] || 'https://dev-beta.aigentz.me';
  const embedUrl = buildEmbedUrl(primaryBase, EMBED_PATH, EMBED_PARAMS, EMBED_VERSION);
  const fallbackBases = bases.slice(1);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed inset-0 bg-background z-50 overflow-hidden flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
      {/* Close button overlay */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-3 right-3 z-[60] bg-background/70 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:bg-background/90 rounded-full shadow-lg"
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Iframe Content with EmbedFrame */}
        <EmbedFrame
          src={embedUrl}
          title="KNYT Codex"
          className="flex-1 overflow-hidden"
          style={{ minHeight: 480 }}
          fallbackBases={fallbackBases}
          showProbeOnLoad={true}
          iframeId={IFRAME_ID}
        />
      </div>
    </>
  );
}
