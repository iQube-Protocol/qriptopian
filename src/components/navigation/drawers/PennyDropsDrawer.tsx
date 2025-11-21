import { DrawerLayer } from "../DrawerLayer";
import { Kn0w1Viewer } from "@/components/content/Kn0w1Viewer";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useState } from "react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { Maximize2, BookOpen, Play, Headphones } from "lucide-react";

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

      {/* Right: 1 column sidebar with featured use case */}
      <div className="col-span-1">
        <div className="relative h-[600px] rounded-xl overflow-hidden group">
          <img 
            src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=1200&fit=crop"
            alt="Featured Use Case"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
            <div className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full border border-yellow-500/30">
              FEATURED Q¢ CASE
            </div>
            <h3 className="text-2xl font-bold text-white">
              The Penny Drop Effect
            </h3>
            <p className="text-gray-300 text-sm">
              How micropayments are changing everyday commerce
            </p>

            {/* Media Controls */}
            <div className="flex gap-2 pt-2">
              <button 
                onClick={() => setIsFullscreen(true)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all backdrop-blur-sm"
              >
                <Maximize2 className="h-5 w-5 text-white" />
              </button>
              <button className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all backdrop-blur-sm">
                <BookOpen className="h-5 w-5 text-white" />
              </button>
              <button className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all backdrop-blur-sm">
                <Play className="h-5 w-5 text-white" />
              </button>
              <button className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all backdrop-blur-sm">
                <Headphones className="h-5 w-5 text-white" />
              </button>
            </div>
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
    </DrawerLayer>
  );
}
