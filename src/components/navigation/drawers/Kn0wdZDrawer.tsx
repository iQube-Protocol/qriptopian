import { useState } from "react";
import { DrawerLayer } from "../DrawerLayer";
import { Kn0w1Viewer } from "@/components/content/Kn0w1Viewer";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { Code2, Terminal, Book, Palette, Film, MessageSquare, Maximize2, BookOpen, Play, Headphones } from "lucide-react";

interface Kn0wdZDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const devContent = [
  {
    id: '1',
    title: 'Building on QIRI Protocol',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=800&fit=crop',
    badge: 'BUILD'
  }
];

const creativeContent = [
  {
    id: '1',
    title: 'Mythos Storytelling Framework',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=800&fit=crop',
    badge: 'MYTHOS'
  }
];

const devThumbnails = [
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

const creativeThumbnails = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=400&h=300&fit=crop',
    title: 'Comic Panel Layouts',
    subtitle: 'Visual storytelling basics',
    badge: 'COMICS'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop',
    title: 'Character Animation',
    subtitle: 'Bring characters to life',
    badge: 'ANIMATION'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
    title: 'Social Content Templates',
    subtitle: 'Engage your audience',
    badge: 'SOCIAL'
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
    title: 'Logo Design System',
    subtitle: 'Brand identity guidelines',
    badge: 'LOGOS'
  }
];

export function Kn0wdZDrawer({ isOpen, onClose }: Kn0wdZDrawerProps) {
  const [activeTab, setActiveTab] = useState('dev');
  
  const tabs = [
    { id: 'dev', label: 'Dev' },
    { id: 'creative', label: 'Creative' }
  ];
  
  const isDevTab = activeTab === 'dev';

  return (
    <DrawerLayer
      isOpen={isOpen}
      onClose={onClose}
      title="Kn0wdZ"
      subtitle={isDevTab ? "Builder & Developer Knowledge - How It Works" : "Creative Storytelling & Visual Content"}
      columns={3}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {/* Left: 1 column large Kn0w1Viewer */}
      <div className="col-span-1">
        <Kn0w1Viewer items={isDevTab ? devContent : creativeContent} domain="kn0wdz" />
      </div>

      {/* Right: 2 columns split - content area + resources */}
      <div className="col-span-2 grid grid-cols-2 gap-6">
        {/* Content Area */}
        <div className="col-span-1 h-[400px] overflow-y-auto space-y-4">
          {isDevTab ? (
            <>
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
            </>
          ) : (
            <>
              <div className="bg-[#0a1628] border border-purple-500/20 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="h-5 w-5 text-purple-400" />
                  <h3 className="text-lg font-bold text-purple-400">Creative Framework</h3>
                </div>
                <div className="text-sm text-gray-300 space-y-3">
                  <p className="leading-relaxed">
                    Build compelling narratives that resonate with your audience through our mythos storytelling framework.
                  </p>
                  <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                    <div className="font-semibold text-purple-300 mb-2">Story Structure</div>
                    <div className="text-xs space-y-1">
                      <div>1. Establish world & characters</div>
                      <div>2. Define central conflict</div>
                      <div>3. Build tension & stakes</div>
                      <div>4. Resolution & transformation</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0a1628] border border-purple-500/20 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Film className="h-5 w-5 text-purple-400" />
                  <h3 className="text-lg font-bold text-purple-400">Core Elements</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">▹</span>
                    <span>Visual Narrative Design</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">▹</span>
                    <span>Character Development</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">▹</span>
                    <span>Motion & Animation Principles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">▹</span>
                    <span>Social Content Strategy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">▹</span>
                    <span>Brand Identity & Logos</span>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Resources Sidebar */}
        <div className="col-span-1 h-[400px]">
          <div className="bg-[#0a1628] border border-blue-500/20 rounded-xl p-6 h-full overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
              <Book className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-bold text-blue-400">Resources</h3>
            </div>
            <div className="space-y-3">
              {isDevTab ? (
                <>
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
                </>
              ) : (
                <>
                  <a href="#" className="block p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors">
                    <div className="text-sm font-semibold text-blue-300">Style Guide</div>
                    <div className="text-xs text-gray-400">Visual standards & templates</div>
                  </a>
                  <a href="#" className="block p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors">
                    <div className="text-sm font-semibold text-blue-300">Asset Library</div>
                    <div className="text-xs text-gray-400">Logos, characters & props</div>
                  </a>
                  <a href="#" className="block p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors">
                    <div className="text-sm font-semibold text-blue-300">Creative Community</div>
                    <div className="text-xs text-gray-400">Share & collaborate</div>
                  </a>
                  <a href="#" className="block p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors">
                    <div className="text-sm font-semibold text-blue-300">Tutorial Series</div>
                    <div className="text-xs text-gray-400">Comics, animation & more</div>
                  </a>
                </>
              )}
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
            {(isDevTab ? devThumbnails : creativeThumbnails).map((item) => (
              <CarouselItem key={item.id} className="basis-1/4 pl-4">
                <div className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer">
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
