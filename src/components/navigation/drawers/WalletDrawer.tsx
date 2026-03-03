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
      {/* Transparent backdrop - click to close */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Wallet panel - snug fit, no extra background */}
      <div className="fixed top-[88px] right-[80px] z-50 w-[420px] max-w-[calc(100vw-100px)] h-[calc(100vh-100px)] max-h-[calc(100vh-100px)] rounded-lg overflow-hidden shadow-2xl border border-border/30">
        {/* Close button overlaid on iframe */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-2 right-2 z-[60] text-muted-foreground hover:text-foreground bg-background/60 backdrop-blur-sm hover:bg-accent/50 rounded-full h-7 w-7"
        >
          <X className="h-4 w-4" />
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
