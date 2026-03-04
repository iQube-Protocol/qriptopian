import { useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmbedFrame } from "@/components/EmbedFrame";
import { buildEmbedUrl, getOrderedBases } from "@/lib/embedUtils";

const EMBED_PATH = '/triad/embed/wallet';
const EMBED_VERSION = '2025-12-30-01';
const IFRAME_ID = 'knyt-wallet-iframe';

// Two-state positioning:
// - wide uses the original anchor position that previously worked
// - narrow uses nav-aware offset
const WIDE_RIGHT_PX = 46;
const NARROW_RIGHT_PX = 54;
const PANEL_GAP_FROM_VIEWPORT_PX = 80;

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

  const allowedOrigins = useMemo(
    () =>
      new Set(
        bases
          .map((base) => {
            try {
              return new URL(base).origin;
            } catch {
              return null;
            }
          })
          .filter((origin): origin is string => Boolean(origin))
      ),
    [bases]
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
  const panelRight = isWide ? WIDE_RIGHT_PX : NARROW_RIGHT_PX;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Stable shell at chosen state position */}
      <div
        style={{
          position: 'fixed',
          top: 88,
          right: panelRight,
          width: Math.min(516, window.innerWidth - PANEL_GAP_FROM_VIEWPORT_PX),
          height: 'calc(100vh - 100px)',
          zIndex: 50,
        }}
      >
        {/* Right-anchored panel: width changes always extend left */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: Math.min(panelWidth, window.innerWidth - PANEL_GAP_FROM_VIEWPORT_PX),
            height: '100%',
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
      </div>
    </>
  );
}
