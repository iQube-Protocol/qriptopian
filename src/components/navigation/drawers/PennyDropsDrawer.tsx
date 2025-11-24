import { DrawerLayer } from "../DrawerLayer";
import { Kn0w1Viewer } from "@/components/content/Kn0w1Viewer";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { Maximize2, BookOpen, Play, Headphones } from "lucide-react";
import { useMetaAvatar } from "@/contexts/MetaAvatarContext";

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
  const { requestAvatar, releaseAvatar } = useMetaAvatar();

  // Request/release avatar based on drawer state
  useEffect(() => {
    if (isOpen) {
      requestAvatar('pennydrops');
    } else {
      releaseAvatar('pennydrops');
    }
    return () => releaseAvatar('pennydrops');
  }, [isOpen, requestAvatar, releaseAvatar]);

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
    >
      {/* Left: 2 columns of Kn0w1Viewer cards */}
      <div className="col-span-2">
        <Kn0w1Viewer items={pennyDropsContent} domain="pennydrops" />
      </div>

      {/* Right: 1 column for MetaAvatar iframe (rendered globally in Layout) */}
      <div className="col-span-1" />

      {/* Full-width thumbnail carousel */}
      <div className="col-span-full border-t border-border/30 pt-1.5">
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
                <div className="relative aspect-[47/20] rounded-lg overflow-hidden group cursor-pointer">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {/* Action Menu - show all for demo purposes */}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors" aria-label="Fullscreen">
                      <Maximize2 className="h-3 w-3" />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors" aria-label="Read">
                      <BookOpen className="h-3 w-3" />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors" aria-label="Watch">
                      <Play className="h-3 w-3" />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors" aria-label="Listen">
                      <Headphones className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                    <p className="text-xs text-gray-400">{item.subtitle}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </DrawerLayer>
  );
}
