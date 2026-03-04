import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmbedFrame } from "@/components/EmbedFrame";
import { buildEmbedUrl, getOrderedBases } from "@/lib/embedUtils";

// Embed configuration
const EMBED_PATH = '/triad/embed/wallet';
const EMBED_VERSION = '2025-12-30-01';

// Explicit pixel widths – single source of truth
const WIDTH_NARROW = 356;
const WIDTH_WIDE = 516;
const ALLOWED_ORIGINS = ['https://dev-beta.aigentz.me', 'https://aigentzbeta-production.up.railway.app'];

interface WalletDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletDrawer({ isOpen, onClose }: WalletDrawerProps) {
  const [isWide, setIsWide] = useState(false);
  const hasReceivedFirstLayout = useRef(false);
  const [animateEnabled, setAnimateEnabled] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Listen for wallet resize postMessages with strict validation
  useEffect(() => {
    if (!isOpen) return;

    const handleMessage = (event: MessageEvent) => {
      // Strict origin check
      if (!ALLOWED_ORIGINS.some(o => event.origin.startsWith(o.replace(/\/$/, '')))) return;

      if (event.data?.type === 'wallet-layout-change') {
        const wide = event.data.layout === 'wide';

        if (!hasReceivedFirstLayout.current) {
          // First layout update: apply instantly, no animation
          hasReceivedFirstLayout.current = true;
          setIsWide(wide);
          // Enable animation after a frame so the first paint is instant
          requestAnimationFrame(() => {
            setAnimateEnabled(true);
          });
        } else {
          setIsWide(wide);
        }

        if (import.meta.env.DEV) {
          console.log('[WalletDrawer] Layout change → isWide:', wide, 'animated:', hasReceivedFirstLayout.current);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isOpen]);

  // Reset state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setIsWide(false);
      setAnimateEnabled(false);
      hasReceivedFirstLayout.current = false;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const bases = getOrderedBases();
  const primaryBase = bases[0] || 'https://dev-beta.aigentz.me';
  const embedUrl = buildEmbedUrl(primaryBase, EMBED_PATH, {}, EMBED_VERSION);
  const fallbackBases = bases.slice(1);

  const currentWidth = isWide ? WIDTH_WIDE : WIDTH_NARROW;

  return (
    <>
      {/* Transparent backdrop - click to close */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Outer shell – fixed anchor at right edge, never animates */}
      <div
        className="fixed z-50"
        style={{
          top: 88,
          right: 46,
          height: 'calc(100vh - 100px)',
          width: Math.min(WIDTH_WIDE, window.innerWidth - 60),
        }}
      >
        {/* Inner panel – absolute right-0, only width changes */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            height: '100%',
            width: window.innerWidth >= 768 ? currentWidth : '100%',
            transition: animateEnabled && window.innerWidth >= 768
              ? 'width 300ms ease-out'
              : 'none',
          }}
          className="rounded-lg overflow-hidden shadow-2xl border border-border/30 bg-background"
        >
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
      </div>
    </>
  );
}
