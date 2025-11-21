import { DrawerLayer } from "../DrawerLayer";
import { Kn0w1Viewer } from "@/components/content/Kn0w1Viewer";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { Code2, Terminal, Book } from "lucide-react";

interface Kn0wdZDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const kn0wdZContent = [
  {
    id: '1',
    title: 'Building on QIRI Protocol',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=800&fit=crop',
    badge: 'BUILD'
  }
];

const thumbnailContent = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    title: 'Smart Contract Basics',
    subtitle: 'Getting started with QIRI',
    badge: 'TUTORIAL'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1550439062-609e1531270e?w=400&h=300&fit=crop',
    title: 'API Integration',
    subtitle: 'Connect to the network',
    badge: 'API'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=300&fit=crop',
    title: 'Security Best Practices',
    subtitle: 'Keep your dApp safe',
    badge: 'SECURITY'
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    title: 'Testing & Deployment',
    subtitle: 'Ship with confidence',
    badge: 'DEVOPS'
  }
];

export function Kn0wdZDrawer({ isOpen, onClose }: Kn0wdZDrawerProps) {
  const tabs = [
    { id: 'stories', label: 'Stories' }
  ];

  return (
    <DrawerLayer
      isOpen={isOpen}
      onClose={onClose}
      title="21 Kn0wdZ"
      subtitle="Builder & Developer Knowledge - How It Works"
      columns={3}
      tabs={tabs}
    >
      {/* Left: 1 column large Kn0w1Viewer */}
      <div className="col-span-1">
        <Kn0w1Viewer items={kn0wdZContent} domain="kn0wdz" />
      </div>

      {/* Right: 2 columns split - code snippet area + resources */}
      <div className="col-span-2 grid grid-cols-2 gap-6">
        {/* Code Snippet Area */}
        <div className="col-span-1 h-[400px] overflow-y-auto space-y-4">
          <div className="bg-[#0a1628] border border-green-500/20 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="h-5 w-5 text-green-400" />
              <h3 className="text-lg font-bold text-green-400">Quick Start</h3>
            </div>
            <pre className="text-sm text-green-300 font-mono overflow-x-auto">
{`// Initialize QIRI SDK
import { QIRI } from '@qriptopian/sdk';

const qiri = new QIRI({
  network: 'mainnet',
  apiKey: process.env.QIRI_KEY
});

// Create a transaction
const tx = await qiri.send({
  to: 'did:qiri:recipient',
  amount: 100, // Q¢
  memo: 'Payment for services'
});`}
            </pre>
          </div>

          <div className="bg-[#0a1628] border border-green-500/20 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="h-5 w-5 text-green-400" />
              <h3 className="text-lg font-bold text-green-400">Core Concepts</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">▹</span>
                <span>Decentralized Identity (DIDs)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">▹</span>
                <span>iQubes: Data Containers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">▹</span>
                <span>Q¢ Micropayments</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">▹</span>
                <span>X.402 Protocol</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Resources Sidebar */}
        <div className="col-span-1 h-[400px]">
          <div className="bg-[#0a1628] border border-blue-500/20 rounded-xl p-6 h-full overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
              <Book className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-bold text-blue-400">Resources</h3>
            </div>
            <div className="space-y-3">
              <a href="#" className="block p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors">
                <div className="text-sm font-semibold text-blue-300">Documentation</div>
                <div className="text-xs text-gray-400">Full API reference</div>
              </a>
              <a href="#" className="block p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors">
                <div className="text-sm font-semibold text-blue-300">GitHub Repos</div>
                <div className="text-xs text-gray-400">Open source examples</div>
              </a>
              <a href="#" className="block p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors">
                <div className="text-sm font-semibold text-blue-300">Discord</div>
                <div className="text-xs text-gray-400">Developer community</div>
              </a>
              <a href="#" className="block p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors">
                <div className="text-sm font-semibold text-blue-300">Video Tutorials</div>
                <div className="text-xs text-gray-400">Step-by-step guides</div>
              </a>
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
