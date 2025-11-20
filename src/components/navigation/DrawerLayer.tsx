import { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DrawerLayerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  width?: 'sm' | 'md' | 'lg' | 'full';
  tabs?: { id: string; label: string }[];
  children: ReactNode;
}

const widthClasses = {
  sm: 'w-96',
  md: 'w-[480px]',
  lg: 'w-[720px]',
  full: 'w-full max-w-7xl',
};

export function DrawerLayer({
  isOpen,
  onClose,
  title,
  subtitle,
  width = 'lg',
  tabs,
  children,
}: DrawerLayerProps) {
  if (!isOpen) return null;

  const content = tabs && tabs.length > 0 ? (
    <Tabs defaultValue={tabs[0]?.id} className="h-full flex flex-col">
      {/* Header with gradient backdrop */}
      <div className="relative p-8 border-b border-white/5">
        {/* Gradient glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        
        <div className="relative flex items-start justify-between mb-4">
          <div>
            {title && (
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-foreground to-foreground bg-clip-text text-transparent">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-2 font-light tracking-wide">{subtitle}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className={cn(
              "text-muted-foreground hover:text-foreground",
              "hover:bg-white/5 rounded-xl transition-all duration-300",
              "hover:scale-110"
            )}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Tabs with luxury styling */}
        <TabsList className={cn(
          "grid w-full bg-white/5 p-1 rounded-xl border border-white/5 relative mt-4",
          tabs.length === 2 && "grid-cols-2",
          tabs.length === 3 && "grid-cols-3",
          tabs.length === 4 && "grid-cols-4",
          tabs.length > 4 && "grid-cols-5"
        )}>
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className={cn(
                "data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/20 data-[state=active]:to-secondary/20",
                "data-[state=active]:text-primary data-[state=active]:shadow-[0_0_20px_rgba(94,234,212,0.2)]",
                "transition-all duration-300 rounded-lg font-medium"
              )}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* Content with custom scrollbar */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20">
        {tabs.map((tab) => (
          <TabsContent 
            key={tab.id} 
            value={tab.id} 
            className="p-8 mt-0 animate-fade-in h-full"
          >
            {children}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  ) : (
    <>
      {/* Header with gradient backdrop */}
      <div className="relative p-8 border-b border-white/5">
        {/* Gradient glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        
        <div className="relative flex items-start justify-between">
          <div>
            {title && (
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-foreground to-foreground bg-clip-text text-transparent">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-2 font-light tracking-wide">{subtitle}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className={cn(
              "text-muted-foreground hover:text-foreground",
              "hover:bg-white/5 rounded-xl transition-all duration-300",
              "hover:scale-110"
            )}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content with custom scrollbar */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20 p-8 animate-fade-in">
        {children}
      </div>
    </>
  );

  return (
    <>
      {/* Backdrop with gradient */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 animate-fade-in"
        onClick={onClose}
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4))'
        }}
      />
      
      {/* Drawer */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-screen z-50",
          "bg-black/40 backdrop-blur-xl border-l border-white/5",
          "animate-slide-in-right overflow-hidden flex flex-col",
          "shadow-[-20px_0_60px_rgba(0,0,0,0.5)]",
          widthClasses[width]
        )}
      >
        {content}
      </div>
    </>
  );
}
