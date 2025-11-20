import { Sheet, SheetContent, SheetOverlay } from "@/components/ui/sheet";
import { useOverlayManager } from "@/hooks/use-overlay-manager";

interface OverlayManagerProps {
  currentStrategy?: any;
  onStrategyChange?: (strategy: any) => void;
}

export function OverlayManager({ currentStrategy, onStrategyChange }: OverlayManagerProps) {
  const { activeOverlay, closeOverlay } = useOverlayManager();

  const renderOverlay = () => {
    switch (activeOverlay) {
      default:
        return <div className="p-6">Overlay content coming soon...</div>;
    }
  };

  return (
    <Sheet open={!!activeOverlay} onOpenChange={(open) => !open && closeOverlay()}>
      <SheetOverlay className="bg-transparent" />
      <SheetContent 
        side="left" 
        className="!left-14 !right-0 !w-auto !max-w-none h-[600px] top-auto bottom-[4.5rem] bg-background/20 backdrop-blur-sm border-r border-primary/20 p-6"
      >
        {renderOverlay()}
      </SheetContent>
    </Sheet>
  );
}
