import { DrawerLayer } from "../DrawerLayer";
import { Kn0w1Viewer } from "@/components/content/Kn0w1Viewer";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { Maximize2, BookOpen, Play, Headphones, User } from "lucide-react";
import { useMetaAvatar } from "@/contexts/MetaAvatarContext";
import { Button } from "@/components/ui/button";

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
  const [activeMode, setActiveMode] = useState<'stories' | 'metavatar'>('stories');
  const { requestAvatar, releaseAvatar, refreshAvatar } = useMetaAvatar();

  // Request/release avatar based on drawer state and active mode
  useEffect(() => {
    if (isOpen && activeMode === 'metavatar') {
      requestAvatar('pennydrops');
    } else {
      releaseAvatar();
    }
    return () => releaseAvatar();
  }, [isOpen, activeMode, requestAvatar, releaseAvatar]);

  const tabs = [
    { id: 'stories', label: 'Stories' }
  ];

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
    <DrawerLayer
      isOpen={isOpen}
      onClose={onClose}
      title="Penny Drops"
      subtitle="Q¢ use cases - fun, practical, irreverent"
      columns={3}
      tabs={tabs}
      headerActions={
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 rounded-full ${
            activeMode === 'metavatar' 
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
              : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10'
          }`}
          onClick={() => setActiveMode(activeMode === 'metavatar' ? 'stories' : 'metavatar')}
          title="Ask MoneyPenny"
        >
          <User className="h-4 w-4" />
        </Button>
      }
    >
      {activeMode === 'stories' ? (
        <>
          {/* Left: 2 columns of Kn0w1Viewer cards */}
          <div className="col-span-2">
            <Kn0w1Viewer items={pennyDropsContent} domain="pennydrops" />
          </div>

          {/* Right: 1 column sidebar with MoneyPenny MetaAvatar */}
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
                {/* Placeholder for MetaAvatar (actual avatar is rendered globally in Layout) */}
                <div className="flex-grow relative rounded-lg overflow-hidden bg-black/20" />
              </div>
            </div>
          </div>

          {/* Full-width thumbnail carousel */}
          <div className="col-span-full border-t border-border/30 pt-6">
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
        </>
      ) : (
        <div className="col-span-full">
          <div className="relative h-[calc(100vh-200px)] rounded-xl overflow-hidden bg-gradient-to-b from-[#0a1628] to-[#071327] border border-cyan-500/20">
            <div className="absolute inset-0 p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  Ask MoneyPenny
                </h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={refreshAvatar}
                    className="h-8 w-8 text-cyan-400 hover:text-cyan-300"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </Button>
                  <div className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full border border-yellow-500/30">
                    AI ASSISTANT
                  </div>
                </div>
              </div>
              <p className="text-gray-400 mb-6">
                Your AI guide to Q¢ micropayments - ask me anything!
              </p>
              {/* Placeholder for MetaAvatar (actual avatar is rendered globally in Layout) */}
              <div className="flex-grow relative rounded-lg overflow-hidden bg-black/20" />
            </div>
          </div>
        </div>
      )}
    </DrawerLayer>
  );
}
