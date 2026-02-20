import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmbedFrame } from "@/components/EmbedFrame";
import { buildEmbedUrl, getOrderedBases } from "@/lib/embedUtils";

// Embed configuration
const EMBED_PATH = '/triad/embed/codex';
const EMBED_VERSION = '2025-12-30-01';
const EMBED_PARAMS = {
  tab: 'scrolls',
  theme: 'dark',
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
        />
      </div>
    </>
  );
}
