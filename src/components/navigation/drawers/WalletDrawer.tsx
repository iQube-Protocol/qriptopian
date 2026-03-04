import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmbedFrame } from "@/components/EmbedFrame";
import { buildEmbedUrl, getOrderedBases } from "@/lib/embedUtils";

// Embed configuration
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
      const originAllowed = ALLOWED_ORIGINS.some((origin) => event.origin === origin);
      if (!originAllowed) return;

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

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div className="fixed top-[88px] right-[46px] z-50 h-[calc(100vh-100px)] w-[calc(100vw-60px)] md:w-[32.25rem]">
        <div
          className={`absolute right-0 top-0 h-full w-full ${isWide ? 'md:w-[32.25rem]' : 'md:w-[22.25rem]'} rounded-lg overflow-hidden shadow-2xl border border-border/30 bg-background`}
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
      </div>
    </>
  );
}

