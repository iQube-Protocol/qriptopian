import { useState, useEffect } from "react";
import { X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useMetaAvatar } from "@/contexts/MetaAvatarContext";

interface DrawerLayerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  columns?: 1 | 2 | 3;
  tabs?: { id: string; label: string }[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  children: React.ReactNode;
  enableMetaAvatar?: boolean;
  metaAvatarContainer?: 'pennydrops' | 'aigent';
}

export function DrawerLayer({ isOpen, onClose, title, subtitle, columns = 2, tabs, activeTab: controlledActiveTab, onTabChange, children, enableMetaAvatar = false, metaAvatarContainer }: DrawerLayerProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(tabs?.[0]?.id || '');
  const activeTab = controlledActiveTab ?? internalActiveTab;
  const [showMetaAvatar, setShowMetaAvatar] = useState(true);
  const { requestAvatar, releaseAvatar } = useMetaAvatar();
  
  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
  };

  const toggleMetaAvatar = () => {
    setShowMetaAvatar(prev => {
      console.log('[DrawerLayer] MetaAvatar toggle:', !prev, 'container:', metaAvatarContainer);
      return !prev;
    });
  };

  // Ensure MetaAvatar defaults to visible when drawer opens
  useEffect(() => {
    if (!enableMetaAvatar) return;
    if (isOpen) {
      setShowMetaAvatar(true);
    } else {
      setShowMetaAvatar(false);
    }
  }, [isOpen, enableMetaAvatar]);

  // Request/release avatar based on drawer and metavatar state
  useEffect(() => {
    console.log('[DrawerLayer] Effect:', { isOpen, showMetaAvatar, metaAvatarContainer });
    if (isOpen && showMetaAvatar && metaAvatarContainer) {
      console.log('[DrawerLayer] Requesting avatar for:', metaAvatarContainer);
      requestAvatar(metaAvatarContainer);
    } else if (metaAvatarContainer) {
      console.log('[DrawerLayer] Releasing avatar for:', metaAvatarContainer);
      releaseAvatar(metaAvatarContainer);
    }
    return () => {
      if (metaAvatarContainer) {
        releaseAvatar(metaAvatarContainer);
      }
    };
  }, [isOpen, showMetaAvatar, metaAvatarContainer, requestAvatar, releaseAvatar]);

  if (!isOpen) return null;

  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer - slides from right, positioned between screen edge and nav */}
      <div className={`fixed right-[80px] top-[88px] h-[calc(100vh-88px)] w-[calc(100vw-160px)] bg-background/80 backdrop-blur-xl border-l border-border/30 shadow-[0_0_60px_rgba(0,0,0,0.5)] z-50 overflow-hidden flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex-shrink-0 border-b border-border/30 bg-background/60 backdrop-blur-sm">
          <div className="p-6 flex items-center justify-between gap-4">
            <div className="flex-shrink-0">
              <h2 className="text-2xl font-bold text-foreground mb-1">{title}</h2>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            
            <div className="flex items-center gap-6">
              {/* Tabs */}
              {tabs && tabs.length > 0 && (
                <div className="flex gap-2">
                  {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`px-4 py-2 text-sm font-medium transition-all whitespace-nowrap border-b-2 ${
                      activeTab === tab.id
                        ? 'text-primary border-primary'
                        : 'text-muted-foreground border-transparent hover:text-foreground'
                    }`}
                  >
                    {tab.label}
                  </button>
                  ))}
                </div>
              )}

              {/* MetaAvatar Toggle */}
              {enableMetaAvatar && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={toggleMetaAvatar}
                        className={`p-2 rounded-lg transition-all ${
                          showMetaAvatar 
                            ? 'text-cyan-400 bg-cyan-400/10 border border-cyan-400/30' 
                            : 'text-muted-foreground hover:text-cyan-400 hover:bg-accent/50'
                        }`}
                      >
                        <User className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{showMetaAvatar ? 'Hide' : 'Show'} MetaAvatar</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="flex-shrink-0 text-muted-foreground hover:text-foreground hover:bg-accent/50 ml-4"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content with column support */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className={`grid ${columnClasses[columns]} gap-6`}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
