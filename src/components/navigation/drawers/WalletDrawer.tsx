import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WALLET_EMBED_URL } from "@/config/embed";

interface WalletDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletDrawer({ isOpen, onClose }: WalletDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed inset-0 md:right-[80px] md:top-[88px] md:left-auto md:h-[calc(100vh-88px)] md:w-[calc(100vw-160px)] bg-background/95 md:bg-background/80 backdrop-blur-xl md:border-l border-border/30 shadow-[0_0_60px_rgba(0,0,0,0.5)] z-50 overflow-hidden flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex-shrink-0 border-b border-border/30 bg-background/60 backdrop-blur-sm">
          <div className="p-4 md:p-6 flex items-center justify-between gap-2 md:gap-4">
            <div className="flex-shrink min-w-0">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1 truncate">SmartWallet</h2>
              <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Manage your balances, KNYT, Q¢ & more</p>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="flex-shrink-0 text-muted-foreground hover:text-foreground hover:bg-accent/50"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Iframe Content */}
        <div className="flex-1 overflow-hidden" style={{ minHeight: 480 }}>
          <iframe
            src={`${WALLET_EMBED_URL}&_t=${Date.now()}`}
            style={{ width: "100%", height: "100%", border: "none" }}
            loading="lazy"
            allow="clipboard-write; fullscreen; autoplay"
            title="KNYT SmartWallet"
          />
        </div>
      </div>
    </>
  );
}
