import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmbedFrame } from "@/components/EmbedFrame";
import { buildEmbedUrl, getOrderedBases } from "@/lib/embedUtils";

// Embed configuration
const EMBED_PATH = '/triad/embed/wallet';
const EMBED_VERSION = '2025-12-30-01';

interface WalletDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletDrawer({ isOpen, onClose }: WalletDrawerProps) {
  if (!isOpen) return null;

  const bases = getOrderedBases();
  const primaryBase = bases[0] || 'https://dev-beta.aigentz.me';
  const embedUrl = buildEmbedUrl(primaryBase, EMBED_PATH, {}, EMBED_VERSION);
  const fallbackBases = bases.slice(1);

  return (
    <>
      {/* Backdrop - click to close */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Right-anchored floating panel — no background, sized to iframe content */}
      <div
        ref={iframeContainerRef}
        className={`fixed top-0 right-[46px] z-50 h-[calc(100vh-100px)] mt-[88px] overflow-hidden transition-[width] duration-300 ease-out ${wide ? 'w-[516px] md:w-[32.25rem]' : 'w-[356px] md:w-[22.25rem]'}`}
      >
        {/* Floating close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-3 right-3 z-[60] text-muted-foreground hover:text-foreground bg-background/60 backdrop-blur-sm hover:bg-accent/50"
        >
          <X className="h-5 w-5" />
        </Button>

        <EmbedFrame
          src={embedUrl}
          title="KNYT SmartWallet"
          className="w-full h-full"
          fallbackBases={fallbackBases}
          showProbeOnLoad={true}
        />
      </div>
    </>
  );
}
