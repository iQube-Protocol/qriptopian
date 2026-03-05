import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmbedFrame } from "@/components/EmbedFrame";
import { buildEmbedUrl, getOrderedBases } from "@/lib/embedUtils";

// Embed configuration
const EMBED_PATH = '/triad/embed/wallet';
const EMBED_VERSION = '2025-12-30-01';
const EMBED_ORIGIN = 'https://dev-beta.aigentz.me';

interface WalletDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletDrawer({ isOpen, onClose }: WalletDrawerProps) {
  const [wide, setWide] = useState(false);

  // Listen for wallet-layout-change postMessage from the iframe
  useEffect(() => {
    if (!isOpen) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== EMBED_ORIGIN) return;
      if (event.data?.type !== 'wallet-layout-change') return;
      // Always enforce right anchor — ignore anchor field from message
      setWide(event.data.layout === 'wide');
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isOpen]);

  if (!isOpen) return null;

  const bases = getOrderedBases();
  const primaryBase = bases[0] || EMBED_ORIGIN;
  const embedUrl = buildEmbedUrl(primaryBase, EMBED_PATH, { bg: 'transparent' }, EMBED_VERSION);
  const fallbackBases = bases.slice(1);

  const widthPx = wide ? 516 : 356;

  return (
    <>
      {/* Right-pinned wrapper — flex justify-end ensures leftward expansion */}
      <div
        className="fixed z-50 flex justify-end"
        style={{
          top: 88,
          bottom: 0,
          right: 46,
          left: 'auto',
          height: 'calc(100vh - 100px)',
        }}
      >
        {/* Inner panel — width transitions leftward from fixed right edge */}
        <div
          className="h-full overflow-hidden transition-[width] duration-300 ease-out relative"
          style={{ width: widthPx, maxWidth: '100%' }}
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
      </div>
    </>
  );
}
