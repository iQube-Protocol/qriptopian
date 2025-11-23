import { DrawerLayer } from "../DrawerLayer";
import { Kn0w1Viewer } from "@/components/content/Kn0w1Viewer";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useState } from "react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { Maximize2, BookOpen, Play, Headphones } from "lucide-react";

interface KnytRiseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const knytRiseContent = [
  {
    id: '1',
    title: 'The Awakening: Chapter 1',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=800&fit=crop',
    badge: 'COMIC'
  },
  {
    id: '2',
    title: 'Chronicles of the Quantum Realm',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1200&h=800&fit=crop',
    badge: 'STORY'
  },
  {
    id: '3',
    title: 'Voices from the Digital Frontier',
    image: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=1200&h=800&fit=crop',
    badge: 'SERIES'
  },
  {
    id: '4',
    title: 'The Rise of the Agent Network',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=800&fit=crop',
    badge: 'COMIC'
  },
  {
    id: '5',
    title: 'Legends of the Blockchain',
    image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1200&h=800&fit=crop',
    badge: 'STORY'
  },
  {
    id: '6',
    title: 'The iQube Chronicles',
    image: 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=1200&h=800&fit=crop',
    badge: 'SERIES'
  },
];

export function KnytRiseDrawer({ isOpen, onClose }: KnytRiseDrawerProps) {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  
  const tabs = [
    { id: 'stories', label: 'Stories' }
  ];

  return (
    <DrawerLayer
      isOpen={isOpen}
      onClose={onClose}
      title="KNYT Rise"
      subtitle="Chronicles from the Quantum-Ready Internet"
      columns={2}
      tabs={tabs}
    >
      <div className="col-span-full space-y-6">
        {/* Main Carousel with Large Cards */}
        <Carousel 
          className="w-full"
          opts={{
            align: "start",
            loop: true
          }}
          plugins={[WheelGesturesPlugin()]}
        >
          <CarouselContent>
            {knytRiseContent.map((item, index) => (
              <CarouselItem key={item.id} className="md:basis-1/2">
                <div 
                  onClick={() => setSelectedItemIndex(index)}
                  className="cursor-pointer"
                >
                  <Kn0w1Viewer items={[item]} domain="knytrise" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Thumbnail Scrolling Layer */}
        <div className="border-t border-border/30 pt-4">
          <Carousel
            className="w-full"
            opts={{
              align: "start",
              dragFree: true
            }}
            plugins={[WheelGesturesPlugin()]}
          >
            <CarouselContent className="-ml-2">
              {knytRiseContent.map((item, index) => (
                <CarouselItem key={`thumb-${item.id}`} className="basis-1/6 pl-2">
                  <div className="relative group">
                    <button
                      onClick={() => setSelectedItemIndex(index)}
                      className={`w-full aspect-video rounded-lg overflow-hidden border-2 transition-all hover:border-primary/50 ${
                        selectedItemIndex === index 
                          ? 'border-primary ring-2 ring-primary/20' 
                          : 'border-border/30'
                      }`}
                    >
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
                    {/* Action Menu */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors" aria-label="Fullscreen">
                        <Maximize2 className="h-2.5 w-2.5" />
                      </button>
                      <button className="w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors" aria-label="Read">
                        <BookOpen className="h-2.5 w-2.5" />
                      </button>
                      <button className="w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors" aria-label="Watch">
                        <Play className="h-2.5 w-2.5" />
                      </button>
                      <button className="w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors" aria-label="Listen">
                        <Headphones className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </DrawerLayer>
  );
}
