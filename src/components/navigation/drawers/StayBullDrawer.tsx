import { DrawerLayer } from "../DrawerLayer";
import { Kn0w1Viewer } from "@/components/content/Kn0w1Viewer";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";

interface StayBullDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const stayBullContent = [
  {
    id: '1',
    title: 'COYN Token Economics',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=800&fit=crop',
    badge: 'BULL'
  },
  {
    id: '2',
    title: 'Q¢ Market Opportunities',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&h=800&fit=crop',
    badge: 'INVEST'
  },
  {
    id: '3',
    title: 'Quantum-Ready ROI',
    image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1200&h=800&fit=crop',
    badge: 'GROWTH'
  }
];

const thumbnailContent = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=300&fit=crop',
    title: 'Market Analysis',
    subtitle: 'Weekly insights',
    badge: 'ANALYSIS'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=400&h=300&fit=crop',
    title: 'Investment Strategies',
    subtitle: 'Long-term plays',
    badge: 'STRATEGY'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    title: 'Portfolio Diversification',
    subtitle: 'Risk management',
    badge: 'PORTFOLIO'
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    title: 'Market Indicators',
    subtitle: 'Key metrics to watch',
    badge: 'METRICS'
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1635070041409-e63e783ab1f7?w=400&h=300&fit=crop',
    title: 'Bull Case Thesis',
    subtitle: 'Why now is the time',
    badge: 'THESIS'
  }
];

export function StayBullDrawer({ isOpen, onClose }: StayBullDrawerProps) {
  const tabs = [
    { id: 'stories', label: 'Stories' }
  ];

  return (
    <DrawerLayer
      isOpen={isOpen}
      onClose={onClose}
      title="StayBull"
      subtitle="Investment Upside & Growth Opportunities"
      columns={3}
      tabs={tabs}
    >
      {/* 3-column grid of Kn0w1Viewer cards */}
      <div className="col-span-full">
        <div className="grid grid-cols-3 gap-6">
          {stayBullContent.map((item) => (
            <div key={item.id}>
              <Kn0w1Viewer items={[item]} domain="staybull" />
            </div>
          ))}
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
              <CarouselItem key={item.id} className="basis-1/5 pl-4">
                <div className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    {item.badge && (
                      <span className="inline-block px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold rounded mb-1 border border-green-500/30">
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
