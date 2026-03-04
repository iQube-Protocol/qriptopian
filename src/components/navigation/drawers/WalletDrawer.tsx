import { useState, useEffect, useCallback, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmbedFrame } from "@/components/EmbedFrame";
import { buildEmbedUrl, getOrderedBases } from "@/lib/embedUtils";

// Embed configuration
const EMBED_PATH = '/triad/embed/wallet';
const EMBED_VERSION = '2025-12-30-01';

// How long to wait before defaulting to wide mode if no message received
const WIDE_DEFAULT_TIMEOUT_MS = 3000;

interface WalletDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletDrawer({ isOpen, onClose }: WalletDrawerProps) {
  const [isWide, setIsWide] = useState(false);
  const receivedMessage = useRef(false);

  // Listen for wallet resize postMessages (broadened origin check)
  useEffect(() => {
    if (!isOpen) return;

    receivedMessage.current = false;

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
        receivedMessage.current = true;
        const wide = event.data.layout === 'wide';
        setIsWide(wide);
        if (import.meta.env.DEV) {
          console.log('[WalletDrawer] Layout change → isWide:', wide);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    // Safety net: default to wide after timeout if no message received
    const timer = setTimeout(() => {
      if (!receivedMessage.current) {
        if (import.meta.env.DEV) {
          console.log('[WalletDrawer] No layout message received, defaulting to wide');
        }
        setIsWide(true);
      }
    }, WIDE_DEFAULT_TIMEOUT_MS);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(timer);
    };
  }, [isOpen]);

  // Reset width when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setIsWide(false);
      receivedMessage.current = false;
    }
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
      
      {/* Wallet panel - right edge flush with nav icon panel, expands left */}
      <div className={`fixed top-[88px] right-[46px] z-50 w-full ${isWide ? 'md:w-[32.25rem]' : 'md:w-[22.25rem]'} h-[calc(100vh-100px)] max-w-[calc(100vw-60px)] rounded-lg overflow-hidden shadow-2xl border border-border/30 transition-[width] duration-300 ease-out`}>
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
