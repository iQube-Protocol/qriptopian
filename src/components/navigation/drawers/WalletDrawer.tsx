import { useState, useEffect, useCallback, useRef } from "react";
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
  const [isWide, setIsWide] = useState(false);

  // Listen for wallet resize postMessages (broadened origin check)
  useEffect(() => {
    if (!isOpen) return;

    const handleMessage = (event: MessageEvent) => {
      // Debug: log all incoming postMessages in dev
      if (import.meta.env.DEV) {
        console.log('[WalletDrawer] postMessage received:', {
          origin: event.origin,
          type: event.data?.type,
          layout: event.data?.layout,
        });
      }

      // Accept from any aigentz.me origin (handles fallback URLs)
      if (event.data?.type === 'wallet-layout-change') {
        const wide = event.data.layout === 'wide';
        setIsWide(wide);
        if (import.meta.env.DEV) {
          console.log('[WalletDrawer] Layout change → isWide:', wide);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isOpen]);

  // Reset width when drawer closes
  useEffect(() => {
    if (!isOpen) setIsWide(false);
  }, [isOpen]);

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
      
      {/* Outer shell – fixed anchor, never animates width */}
      <div className="fixed top-[88px] right-[46px] z-50 h-[calc(100vh-100px)] w-[calc(100vw-60px)] md:w-[32.25rem]">
        {/* Inner panel – right-aligned, only this animates width */}
        <div className={`absolute right-0 top-0 h-full w-full ${isWide ? 'md:w-[32.25rem]' : 'md:w-[22.25rem]'} md:transition-[width] md:duration-300 md:ease-out origin-right rounded-lg overflow-hidden shadow-2xl border border-border/30 bg-background`}>
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
