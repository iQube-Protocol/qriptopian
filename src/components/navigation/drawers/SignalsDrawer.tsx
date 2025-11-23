import { useState } from "react";
import { DrawerLayer } from "../DrawerLayer";
import { Kn0w1Viewer } from "@/components/content/Kn0w1Viewer";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { BookOpen, Play, Headphones, Maximize2, X } from "lucide-react";
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
  const tabs = [{
    id: 'current',
    label: 'Current'
  }, {
    id: 'archive',
    label: 'Archive'
  }];
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
          {/* Column 1 & 2: Main Signal Viewer */}
          <div className="h-full col-span-2">
            <Kn0w1Viewer items={signalsContent} domain="signals" />
          </div>

          {/* Column 3: Hero Image */}
          
        </div>

        {/* Full Width Carousel Below */}
        <div className="mt-6">
          <Carousel opts={{
          align: "start",
          loop: true
        }} plugins={[WheelGesturesPlugin()]} className="w-full">
            <CarouselContent className="-ml-4">
              {thumbnailContent.map(item => <CarouselItem key={item.id} className="pl-4 basis-1/3">
                  <div className="relative rounded-lg overflow-hidden group cursor-pointer bg-card/50 backdrop-blur-sm border border-border/30 hover:border-cyan-500/50 transition-all">
                    <div className="aspect-video relative">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      {item.badge && <div className="absolute top-2 left-2">
                          <span className={`px-2 py-1 rounded text-xs ${item.badge === 'HOT' ? 'bg-orange-500/20 border border-orange-500 text-orange-400' : item.badge === 'LIVE' ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-400' : item.badge === 'NEW' ? 'bg-green-500/20 border border-green-500 text-green-400' : 'bg-yellow-500/20 border border-yellow-500 text-yellow-400'}`}>
                            {item.badge}
                          </span>
                        </div>}
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
        </div>
      </div>
    </DrawerLayer>;
}