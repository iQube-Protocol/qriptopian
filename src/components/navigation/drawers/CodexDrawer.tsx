import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmbedFrame } from "@/components/EmbedFrame";
import { buildEmbedUrl, getOrderedBases } from "@/lib/embedUtils";

// Embed configuration
const EMBED_PATH = '/triad/embed/codex';
const EMBED_VERSION = '2025-12-30-01';
const EMBED_PARAMS = {
  tab: 'scrolls',
  theme: 'light',
  density: 'wide',
};

interface CodexDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CodexDrawer({ isOpen, onClose }: CodexDrawerProps) {
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
        className={`fixed inset-0 md:right-[80px] md:top-[88px] md:left-auto md:h-[calc(100vh-88px)] md:w-[calc(100vw-160px)] bg-background/95 md:bg-background/80 backdrop-blur-xl md:border-l border-border/30 shadow-[0_0_60px_rgba(0,0,0,0.5)] z-50 overflow-hidden flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex-shrink-0 border-b border-border/30 bg-background/60 backdrop-blur-sm">
          <div className="p-4 md:p-6 flex items-center justify-between gap-2 md:gap-4">
            <div className="flex-shrink min-w-0">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1 truncate">KNYT Codex</h2>
              <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Scrolls, Characters, Lore & more</p>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="flex-shrink-0 text-muted-foreground hover:text-foreground hover:bg-accent/50"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Iframe Content with EmbedFrame */}
        <EmbedFrame
          src={embedUrl}
          title="KNYT Codex"
          className="flex-1 overflow-hidden"
          style={{ minHeight: 480 }}
          fallbackBases={fallbackBases}
          showProbeOnLoad={true}
        />
      </div>
    </>
  );
}
