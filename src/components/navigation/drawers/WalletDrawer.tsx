import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmbedFrame } from "@/components/EmbedFrame";
import { buildEmbedUrl, getOrderedBases } from "@/lib/embedUtils";

const EMBED_PATH = '/triad/embed/wallet';
const EMBED_VERSION = '2025-12-30-01';
const ALLOWED_ORIGINS = ['https://dev-beta.aigentz.me', 'https://aigentzbeta-production.up.railway.app'];

interface WalletDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletDrawer({ isOpen, onClose }: WalletDrawerProps) {
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleMessage = (event: MessageEvent) => {
      if (!ALLOWED_ORIGINS.includes(event.origin)) return;
      if (event.data?.type === 'wallet-layout-change') {
        setIsWide(event.data.layout === 'wide');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) setIsWide(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const bases = getOrderedBases();
  const primaryBase = bases[0] || 'https://dev-beta.aigentz.me';
  const embedUrl = buildEmbedUrl(primaryBase, EMBED_PATH, {}, EMBED_VERSION);
  const fallbackBases = bases.slice(1);

  // Panel width in px. Right edge is always pinned to left edge of icon bar.
  const panelWidth = isWide ? 516 : 356;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Single panel – no nesting, no breakpoints, no w-full.
          right:46px pins it flush LEFT of the 46px icon bar.
          Width grows/shrinks to the LEFT only. */}
      <div
        style={{
          position: 'fixed',
          top: 88,
          right: 46,
          width: Math.min(panelWidth, window.innerWidth - 60),
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
        />
      </div>
    </>
  );
}
