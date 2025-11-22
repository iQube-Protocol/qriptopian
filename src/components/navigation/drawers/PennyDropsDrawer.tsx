import { Kn0w1Viewer } from "@/components/content/Kn0w1Viewer";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { User, MessageSquare, X } from "lucide-react";
import { useMetaAvatar } from "@/contexts/MetaAvatarContext";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PennyDropsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const pennyDropsContent = [
  {
    id: '1',
    title: 'Q¢ in the Coffee Shop',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200&h=800&fit=crop',
    badge: 'Q¢ CASE'
  },
  {
    id: '2',
    title: 'Micropayments Revolution',
    image: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=1200&h=800&fit=crop',
    badge: 'PENNY WISE'
  }
];

const thumbnailContent = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400&h=300&fit=crop',
    title: 'Street Vendor Adoption',
    subtitle: 'Real-world Q¢ stories',
    badge: 'USE CASE'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
    title: 'Gaming Microtransactions',
    subtitle: 'Play and earn Q¢',
    badge: 'GAMING'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=300&fit=crop',
    title: 'Content Creator Tips',
    subtitle: 'Support creators directly',
    badge: 'CREATOR'
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
    title: 'Charity Donations',
    subtitle: 'Every penny counts',
    badge: 'CHARITY'
  }
];

export function PennyDropsDrawer({ isOpen, onClose }: PennyDropsDrawerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'metavatar' | 'chat'>('chat');
  const { requestAvatar, releaseAvatar, refreshAvatar } = useMetaAvatar();

  useEffect(() => {
    if (isOpen && viewMode === 'metavatar') {
      requestAvatar('pennydrops');
    } else {
      releaseAvatar();
    }
    return () => releaseAvatar();
  }, [isOpen, viewMode, requestAvatar, releaseAvatar]);

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <img 
          src={pennyDropsContent[0].image}
          alt={pennyDropsContent[0].title}
          className="w-full h-full object-contain"
        />
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose} 
      />
      
      {/* Drawer */}
      <div className={`fixed right-[80px] top-[88px] h-[calc(100vh-88px)] w-[calc(100vw-160px)] bg-background/80 backdrop-blur-xl border-l border-border/30 shadow-[0_0_60px_rgba(0,0,0,0.5)] z-50 overflow-hidden flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header with icon toggles */}
        <div className="flex-shrink-0 border-b border-border/30 bg-background/60 backdrop-blur-sm">
          <div className="p-6 flex items-center justify-between gap-4">
            <div className="flex-shrink-0">
              <h2 className="text-xl font-bold text-cyan-400 mb-1">Penny Drops</h2>
              <p className="text-sm text-muted-foreground">Q¢ use cases - fun, practical, irreverent</p>
            </div>
            
            <div className="flex items-center gap-6">
              <TooltipProvider>
                {/* Refresh Button - Only visible in metavatar mode */}
                {viewMode === 'metavatar' && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => refreshAvatar()}
                        className="p-1 rounded-full text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
                          <path d="M21 3v5h-5"/>
                        </svg>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Refresh MetaAvatar</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 bg-background/20 backdrop-blur-md rounded-lg p-1 border border-border/20">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setViewMode('metavatar')}
                        className={`px-2 py-1.5 text-xs font-medium rounded transition-all ${
                          viewMode === 'metavatar' 
                            ? 'text-cyan-400' 
                            : 'text-white hover:text-cyan-400 hover:bg-background/10'
                        }`}
                      >
                        <User className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>MetaAvatar Mode</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setViewMode('chat')}
                        className={`px-2 py-1.5 text-xs font-medium rounded transition-all ${
                          viewMode === 'chat' 
                            ? 'text-cyan-400' 
                            : 'text-white hover:text-cyan-400 hover:bg-background/10'
                        }`}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Stories Mode</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
              
              <Button variant="ghost" size="icon" onClick={onClose} className="flex-shrink-0 text-muted-foreground hover:text-foreground hover:bg-accent/50 ml-4">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {viewMode === 'chat' ? (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-3 gap-6">
                {/* Left: 2 columns of Kn0w1Viewer cards */}
                <div className="col-span-2">
                  <Kn0w1Viewer items={pennyDropsContent} domain="pennydrops" />
                </div>

                {/* Right: 1 column sidebar with MoneyPenny info */}
                <div className="col-span-1">
                  <div className="relative h-[400px] rounded-xl overflow-hidden bg-gradient-to-b from-[#0a1628] to-[#071327] border border-cyan-500/20">
                    <div className="absolute inset-0 p-4 flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                          Ask MoneyPenny
                        </h3>
                        <div className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full border border-yellow-500/30">
                          AI ASSISTANT
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">
                        Your AI guide to Q¢ micropayments
                      </p>
                      <div className="flex-grow relative rounded-lg overflow-hidden bg-black/20" />
                    </div>
                  </div>
                </div>

                {/* Full-width thumbnail carousel */}
                <div className="col-span-full border-t border-border/30 pt-6 mt-6">
                  <Carousel
                    className="w-full"
                    opts={{
                      align: "start",
                      dragFree: true
                    }}
                    plugins={[WheelGesturesPlugin()]}
                  >
                    <CarouselContent className="-ml-4">
                      {thumbnailContent.map((item) => (
                        <CarouselItem key={item.id} className="basis-1/4 pl-4">
                          <div className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer">
                            <img 
                              src={item.image} 
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              {item.badge && (
                                <span className="inline-block px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-[10px] font-bold rounded mb-1 border border-yellow-500/30">
                                  {item.badge}
                                </span>
                              )}
                              <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                              <p className="text-xs text-gray-400">{item.subtitle}</p>
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 p-6 flex items-center justify-center">
              <div className="h-[400px] w-full max-w-md rounded-lg border border-border/30 bg-muted/10 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Ask MoneyPenny</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
