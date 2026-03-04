import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmbedFrame } from "@/components/EmbedFrame";
import { buildEmbedUrl, getOrderedBases } from "@/lib/embedUtils";

const EMBED_PATH = '/triad/embed/wallet';
const EMBED_VERSION = '2025-12-30-01';
const IFRAME_ID = 'knyt-wallet-iframe';

// Nav geometry (from QriptopianNav): right-[2px], w-11 (44px)
const NAV_RIGHT_PX = 2;
const NAV_WIDTH_PX = 44;
const PANEL_GAP_PX = 8;
const PANEL_RIGHT_PX = NAV_RIGHT_PX + NAV_WIDTH_PX + PANEL_GAP_PX;

interface WalletDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletDrawer({ isOpen, onClose }: WalletDrawerProps) {
  const [isWide, setIsWide] = useState(false);

  const bases = getOrderedBases();
  const primaryBase = bases[0] || 'https://dev-beta.aigentz.me';
  const embedUrl = buildEmbedUrl(primaryBase, EMBED_PATH, {}, EMBED_VERSION);
  const fallbackBases = bases.slice(1);

  const allowedOrigins = new Set(
    bases
      .map((base) => {
        try {
          return new URL(base).origin;
        } catch {
          return null;
        }
      })
      .filter((origin): origin is string => Boolean(origin))
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleMessage = (event: MessageEvent) => {
      const iframe = document.getElementById(IFRAME_ID) as HTMLIFrameElement | null;
      if (iframe?.contentWindow && event.source !== iframe.contentWindow) return;
      if (!allowedOrigins.has(event.origin)) return;

      if (event.data?.type === 'wallet-layout-change') {
        setIsWide(event.data.layout === 'wide');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isOpen, allowedOrigins]);

  useEffect(() => {
    if (!isOpen) setIsWide(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const panelWidth = isWide ? 516 : 356;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div
        style={{
          position: 'fixed',
          top: 88,
          right: PANEL_RIGHT_PX,
          width: Math.min(panelWidth, window.innerWidth - 80),
          height: 'calc(100vh - 100px)',
          zIndex: 50,
        }}
        className="rounded-lg overflow-hidden shadow-2xl border border-border/30 bg-background"
      >
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
          iframeId={IFRAME_ID}
        />
      </div>
    </>
  );
}
