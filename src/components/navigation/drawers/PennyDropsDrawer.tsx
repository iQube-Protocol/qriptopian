import { DrawerLayer } from "../DrawerLayer";
import { Kn0w1Viewer } from "@/components/content/Kn0w1Viewer";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { Maximize2, BookOpen, Play, Headphones, MessageCircle } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<'stories' | 'moneypenny'>('stories');
  const { requestAvatar, releaseAvatar } = useMetaAvatar();

  // Request/release avatar based on tab selection
  useEffect(() => {
    if (isOpen && activeTab === 'moneypenny') {
      requestAvatar('pennydrops');
    } else {
      releaseAvatar('pennydrops');
    }
  }, [isOpen, activeTab, requestAvatar, releaseAvatar]);

  // Cleanup on unmount
  useEffect(() => {
    return () => releaseAvatar('pennydrops');
  }, [releaseAvatar]);

  const drawerTabs = [
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
      tabs={drawerTabs}
    >
      {/* Tabs for Stories and Ask MoneyPenny */}
      <div className="col-span-full mb-4">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'stories' | 'moneypenny')}>
          <TabsList>
            <TabsTrigger value="stories">
              <BookOpen className="w-4 h-4 mr-2" />
              Stories
            </TabsTrigger>
            <TabsTrigger value="moneypenny">
              <MessageCircle className="w-4 h-4 mr-2" />
              Ask MoneyPenny
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {/* Left: 2 columns of Kn0w1Viewer cards */}
      <div className="col-span-2">
        <Kn0w1Viewer items={pennyDropsContent} domain="pennydrops" />
      </div>

      {/* Right: 1 column sidebar with article content */}
      <div className="col-span-1">
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-b from-muted/50 to-muted/20 border border-border/30 p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded border border-yellow-500/30">
                FEATURED
              </span>
              <span className="text-xs text-muted-foreground">5 min read</span>
            </div>
            <h3 className="text-xl font-bold text-foreground">
              The Future of Micropayments
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Q¢ is revolutionizing how we think about small transactions. From tipping content creators 
              to paying for individual articles, micropayments are enabling new business models that were 
              previously impossible.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Learn how Q¢'s innovative approach is making every penny count in the digital economy, 
              empowering creators and consumers alike with frictionless, instant transactions.
            </p>
            <div className="pt-4 border-t border-border/30">
              <button className="text-sm text-primary hover:underline font-medium">
                Read full article →
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
