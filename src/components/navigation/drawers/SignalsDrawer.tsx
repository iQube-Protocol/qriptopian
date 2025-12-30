import { useState, useEffect } from "react";
import { DrawerLayer } from "../DrawerLayer";
import { Kn0w1Viewer } from "@/components/content/Kn0w1Viewer";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { BookOpen, Play, Headphones, X } from "lucide-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
interface SignalsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}
const signalsContent = [{
  id: '1',
  title: 'Real-Time Market Signals: Q¢ HFT Update',
  image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=800&fit=crop',
  badge: 'LIVE'
}, {
  id: '2',
  title: 'Cross-Chain Activity Surge Detected',
  image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1200&h=800&fit=crop',
  badge: 'HOT'
}, {
  id: '3',
  title: 'DeFi Protocol Governance Changes',
  image: 'https://images.unsplash.com/photo-1642790551116-18e150f248e4?w=1200&h=800&fit=crop',
  badge: 'NEW'
}];
const thumbnailContent = [{
  id: '1',
  image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400&h=300&fit=crop',
  title: 'DeFi Protocol Monitor',
  subtitle: 'Track governance changes',
  badge: 'HOT'
}, {
  id: '2',
  image: 'https://images.unsplash.com/photo-1642790551116-18e150f248e4?w=400&h=300&fit=crop',
  title: 'Cross-Chain Flows',
  subtitle: 'Multi-chain analytics',
  badge: 'LIVE'
}, {
  id: '3',
  image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
  title: 'Sentiment Analysis',
  subtitle: 'AI-powered insights',
  badge: 'NEW'
}, {
  id: '4',
  image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
  title: 'Volume Tracker',
  subtitle: '24h trading volume'
}, {
  id: '5',
  image: 'https://images.unsplash.com/photo-1543286386-2e659306cd6c?w=400&h=300&fit=crop',
  title: 'Whale Movements',
  subtitle: 'Large transactions',
  badge: 'ALERT'
}, {
  id: '6',
  image: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=400&h=300&fit=crop',
  title: 'Gas Price Monitor',
  subtitle: 'Network fee trends'
}];
export function SignalsDrawer({
  isOpen,
  onClose
}: SignalsDrawerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [carouselApi, setCarouselApi] = useState<any>();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const tabs = [{
    id: 'current',
    label: 'Current'
  }, {
    id: 'archive',
    label: 'Archive'
  }];

  // Track carousel slide changes
  useEffect(() => {
    if (!carouselApi) return;
    const updateSlide = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };
    updateSlide();
    carouselApi.on("select", updateSlide);
    return () => carouselApi.off("select", updateSlide);
  }, [carouselApi]);
  if (isFullscreen) {
    return <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
        <button onClick={() => setIsFullscreen(false)} className="absolute top-4 right-4 z-10 text-white hover:text-cyan-400 transition-colors">
          <X className="h-6 w-6" />
        </button>
        
        <div className="relative w-full h-full flex items-center justify-center">
          <img src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1920&h=1080&fit=crop" alt="Market Overview" className="max-w-full max-h-full object-contain" />
        </div>
      </div>;
  }
  return <DrawerLayer isOpen={isOpen} onClose={onClose} title="Signals" subtitle="What's happening now" columns={3} tabs={tabs}>
      <div className="col-span-3">
        <div className="grid grid-cols-3 gap-6">
          {/* Column 1, 2 & 3: Main Signal Viewer */}
          <div className="h-full col-span-3">
            <Kn0w1Viewer items={signalsContent} domain="signals" />
          </div>
          
        </div>

        {/* Full Width Carousel Below */}
        <div className="mt-6">
          <Carousel 
            setApi={setCarouselApi}
            opts={{
              align: "start",
              loop: true
            }} 
            plugins={[WheelGesturesPlugin()]} 
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {thumbnailContent.map(item => <CarouselItem key={item.id} className="pl-4 basis-1/3">
                  <div className="relative rounded-lg overflow-hidden group cursor-pointer bg-card/50 backdrop-blur-sm border border-border/30 hover:border-cyan-500/50 transition-all">
                    <div className="aspect-video relative">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      {/* Action Menu - show all for demo purposes */}
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                    </div>
                    <div className="p-3">
                      <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                    </div>
                  </div>
                </CarouselItem>)}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
          
          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {thumbnailContent.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  carouselApi?.scrollTo(index);
                }}
                className={`transition-all ${
                  index === currentSlide
                    ? 'w-8 h-2 bg-cyan-400 rounded-full'
                    : 'w-2 h-2 bg-white/30 hover:bg-white/50 rounded-full'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </DrawerLayer>;
}