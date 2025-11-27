import { useState, useEffect } from "react";
import { DrawerLayer } from "../DrawerLayer";
import { Kn0w1Viewer } from "@/components/content/Kn0w1Viewer";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { Code2, Terminal, Book, Palette, Film, MessageSquare, Maximize2, BookOpen, Play, Headphones, Building2, TrendingUp, ExternalLink } from "lucide-react";
import { contentService, type Content, ContentModalities } from "@/services/contentService";
import { ArticleRenderer } from "@/components/content/ArticleRenderer";
import { isYouTubeUrl, getYouTubeEmbedUrl } from "@/lib/videoUtils";
import { WebsiteViewer } from "@/components/content/WebsiteViewer";

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

const execContent = [
  {
    id: '1',
    title: 'iQube Business Strategy',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop',
    badge: 'STRATEGY'
  }
];

const execThumbnails = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop',
    title: 'Partnership Frameworks',
    subtitle: 'Strategic alliance models',
    badge: 'BIZDEV'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop',
    title: 'Revenue Models',
    subtitle: 'Monetization strategies',
    badge: 'REVENUE'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    title: 'Operations Playbook',
    subtitle: 'Scaling infrastructure',
    badge: 'OPS'
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=300&fit=crop',
    title: 'Market Analysis',
    subtitle: 'Competitive landscape',
    badge: 'MARKET'
  }
];

export function Kn0wdZDrawer({ isOpen, onClose }: Kn0wdZDrawerProps) {
  const [activeTab, setActiveTab] = useState('dev');
  const [activeMode, setActiveMode] = useState<'read' | 'watch' | 'listen' | 'link' | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [thumbnailCarouselApi, setThumbnailCarouselApi] = useState<any>();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleFullscreenToggle = (value: boolean) => {
    setIsFullscreen(value);
  };

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await contentService.getContentBySection('21knowdz', { tab: activeTab as 'dev' | 'creative' | 'exec' });
        console.log('Loaded Kn0wdZ content:', data);
        setContent(data);
      } catch (error) {
        console.error('Error loading Kn0wdZ content:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      setLoading(true);
      loadContent();
    }
  }, [isOpen, activeTab]);

  // Map database content to Kn0w1Viewer format
  const featureContent = content
    .filter(item => {
      const placement = item.placement as { position?: number; section?: string; tab?: string } | null;
      return placement?.position === 1;
    })
    .map(item => {
      const originalIndex = content.findIndex(c => c.id === item.id);
      return {
        id: item.id,
        originalIndex,
        title: item.title,
        image: item.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=800&fit=crop',
        badge: item.tags?.[0] || item.type?.toUpperCase() || 'FEATURE'
      };
    });

  // Map database content to thumbnail format (positions 2-5)
  const thumbnailContent = content
    .filter(item => {
      const placement = item.placement as { position?: number; section?: string; tab?: string } | null;
      return placement?.position && placement.position > 1;
    })
    .sort((a, b) => {
      const aPlacement = a.placement as { position?: number } | null;
      const bPlacement = b.placement as { position?: number } | null;
      return (aPlacement?.position || 0) - (bPlacement?.position || 0);
    })
    .map((item, index) => {
      // Find the original index in the content array for this item
      const originalIndex = content.findIndex(c => c.id === item.id);
      return {
        id: item.id,
        originalIndex, // Store the original index for modal access
        image: item.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
        title: item.title,
        subtitle: item.excerpt || '',
      badge: item.tags?.[0] || item.type?.toUpperCase() || 'ARTICLE'
    };
  });

  // Track thumbnail carousel slide changes
  useEffect(() => {
    if (!thumbnailCarouselApi) return;
    const updateSlide = () => {
      setCurrentSlide(thumbnailCarouselApi.selectedScrollSnap());
    };
    updateSlide();
    thumbnailCarouselApi.on("select", updateSlide);
    return () => thumbnailCarouselApi.off("select", updateSlide);
  }, [thumbnailCarouselApi]);

  const tabs = [
    { id: 'dev', label: 'Dev' },
    { id: 'creative', label: 'Creative' },
    { id: 'exec', label: 'Exec' }
  ];
  
  const isDevTab = activeTab === 'dev';
  const isExecTab = activeTab === 'exec';

  return (
    <DrawerLayer
      isOpen={isOpen}
      onClose={onClose}
      title="Kn0wdZ"
      subtitle={
        isDevTab 
          ? "Builder & Developer Knowledge - How It Works" 
          : isExecTab 
          ? "Impact Imperatives & Business Development - Strategic Insights"
          : "Creative Storytelling & Visual Content"
      }
      columns={3}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {/* Left: 1 column large Kn0w1Viewer - hidden on mobile (mobile uses full portrait view) */}
      <div className="hidden md:block md:col-span-1">
        {loading ? (
          <div className="h-[300px] md:h-[400px] flex items-center justify-center bg-[#0a1628] border border-border/30 rounded-xl">
            <p className="text-muted-foreground">Loading content...</p>
          </div>
        ) : featureContent.length > 0 ? (
          <Kn0w1Viewer 
            items={featureContent} 
            domain="kn0wdz"
            onFullscreenChange={setIsFullscreen}
            onModeChange={(mode) => {
              if (featureContent[0]?.originalIndex !== undefined) {
                setSelectedItemIndex(featureContent[0].originalIndex);
                setActiveMode(mode);
              }
            }}
          />
        ) : (
          <div className="h-[300px] md:h-[400px] flex items-center justify-center bg-[#0a1628] border border-border/30 rounded-xl">
            <p className="text-muted-foreground">No feature content available</p>
          </div>
        )}
      </div>

      {/* Mobile: Full portrait hero image with hover-reveal thumbnail carousel */}
      <div className="col-span-full md:hidden relative">
        {/* Full height portrait hero image */}
        <div className="relative h-[calc(100vh-180px)] rounded-lg overflow-hidden">
          {featureContent.length > 0 && (
            <>
              <img 
                src={featureContent[0]?.image} 
                alt={featureContent[0]?.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              {/* Title overlay at bottom */}
              <div className="absolute bottom-12 left-4 right-4">
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  {featureContent[0]?.title}
                </h2>
              </div>
              
              {/* Action icons */}
              <div className="absolute bottom-28 left-4 flex gap-2">
                <button 
                  onClick={() => handleFullscreenToggle(true)}
                  className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
                <button 
                  onClick={() => {
                    if (featureContent[0]?.originalIndex !== undefined) {
                      setSelectedItemIndex(featureContent[0].originalIndex);
                      setActiveMode('read');
                    }
                  }}
                  className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                </button>
              </div>
            </>
          )}
          
          {/* Hover-reveal thumbnail carousel overlay */}
          <div className="fixed bottom-0 left-0 right-0 group/thumbnails z-50">
            {/* Trigger zone */}
            <div className="h-16 w-full" />
            
            {/* Thumbnail carousel - appears on hover */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-8 pb-4 px-2 opacity-0 group-hover/thumbnails:opacity-100 transition-opacity duration-300">
              <Carousel
                setApi={setThumbnailCarouselApi}
                className="w-full"
                opts={{
                  align: "start",
                  dragFree: true
                }}
                plugins={[WheelGesturesPlugin()]}
              >
                <CarouselContent className="-ml-2">
                  {thumbnailContent.map((item, index) => (
                    <CarouselItem key={item.id} className="basis-[43%] pl-2">
                      <div 
                        className="relative aspect-video rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => {
                          setSelectedItemIndex(item.originalIndex);
                          setActiveMode('read');
                        }}
                      >
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        {/* Action icons on thumbnails */}
                        <div className="absolute top-1 right-1 flex gap-1">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItemIndex(item.originalIndex);
                              setActiveMode('read');
                            }}
                            className="w-6 h-6 rounded-full bg-black/50 flex items-center justify-center text-cyan-400"
                          >
                            <BookOpen className="h-2.5 w-2.5" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItemIndex(item.originalIndex);
                              setActiveMode('link');
                            }}
                            className="w-6 h-6 rounded-full bg-black/50 flex items-center justify-center text-cyan-400"
                          >
                            <ExternalLink className="h-2.5 w-2.5" />
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-2">
                          <h4 className="text-xs font-semibold text-white truncate">{item.title}</h4>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              
              {/* Pagination Dots */}
              <div className="flex items-center justify-center gap-2 mt-2">
                {thumbnailContent.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => thumbnailCarouselApi?.scrollTo(index)}
                    className={`transition-all ${
                      index === currentSlide
                        ? 'w-6 h-1.5 bg-cyan-400 rounded-full'
                        : 'w-1.5 h-1.5 bg-white/30 rounded-full'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: 2 columns split - content area + resources - hidden on mobile */}
      <div className="hidden md:grid col-span-full md:col-span-2 grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Content Area */}
        <div className="col-span-1 h-auto md:h-[400px] overflow-y-auto space-y-3 md:space-y-4">
          {isExecTab ? (
            <>
              <div className="bg-[#0a1628] border border-orange-500/20 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-5 w-5 text-orange-400" />
                  <h3 className="text-lg font-bold text-orange-400">Strategic Impact & Business Development</h3>
                </div>
                <div className="text-sm text-gray-300 space-y-3">
                  <p className="leading-relaxed">
                    Drive measurable impact through iQube infrastructure while building sustainable business models and strategic partnerships.
                  </p>
                  <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
                    <div className="font-semibold text-orange-300 mb-2">Key Imperatives</div>
                    <div className="text-xs space-y-1">
                      <div>• Impact measurement & reporting frameworks</div>
                      <div>• Enterprise integration & revenue models</div>
                      <div>• Operational scaling & efficiency</div>
                      <div>• Market positioning & ecosystem growth</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0a1628] border border-orange-500/20 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-orange-400" />
                  <h3 className="text-lg font-bold text-orange-400">Focus Areas</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">▹</span>
                    <span>Social Impact Metrics & ROI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">▹</span>
                    <span>Partnership Pipeline & Go-to-Market</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">▹</span>
                    <span>Operational Excellence & KPIs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">▹</span>
                    <span>Sustainable Growth & Value Creation</span>
                  </li>
                </ul>
              </div>
            </>
          ) : isDevTab ? (
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
        <div className="col-span-1 h-auto md:h-[400px]">
          <div className="bg-[#0a1628] border border-blue-500/20 rounded-xl p-4 md:p-6 h-full overflow-y-auto">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <Book className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />
              <h3 className="text-base md:text-lg font-bold text-blue-400">Resources</h3>
            </div>
            <div className="space-y-2 md:space-y-3">
              {isExecTab ? (
                <>
                  <a href="#" className="block p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors">
                    <div className="text-sm font-semibold text-blue-300">Strategic Playbooks</div>
                    <div className="text-xs text-gray-400">Business model templates</div>
                  </a>
                  <a href="#" className="block p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors">
                    <div className="text-sm font-semibold text-blue-300">Partner Portal</div>
                    <div className="text-xs text-gray-400">Integration resources</div>
                  </a>
                  <a href="#" className="block p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors">
                    <div className="text-sm font-semibold text-blue-300">Ops Dashboard</div>
                    <div className="text-xs text-gray-400">Metrics & analytics</div>
                  </a>
                  <a href="#" className="block p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors">
                    <div className="text-sm font-semibold text-blue-300">Market Intelligence</div>
                    <div className="text-xs text-gray-400">Competitive insights</div>
                  </a>
                </>
              ) : isDevTab ? (
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

      {/* Full-width thumbnail carousel - desktop only */}
      <div className="col-span-full border-t border-border/30 pt-4 md:pt-6 hidden md:block">
        <Carousel
          setApi={setThumbnailCarouselApi}
          className="w-full"
          opts={{
            align: "start",
            dragFree: true
          }}
          plugins={[WheelGesturesPlugin()]}
        >
          <CarouselContent className="-ml-4">
            {thumbnailContent.map((item, index) => (
              <CarouselItem key={item.id} className="basis-1/4 pl-4">
                <div className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                   {/* Action Menu */}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        setSelectedItemIndex(item.originalIndex);
                        setActiveMode('read');
                      }}
                      className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors" 
                      aria-label="Read"
                    >
                      <BookOpen className="h-3 w-3" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedItemIndex(item.originalIndex);
                        setActiveMode('watch');
                      }}
                      className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors" 
                      aria-label="Watch"
                    >
                      <Play className="h-3 w-3" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedItemIndex(item.originalIndex);
                        setActiveMode('listen');
                      }}
                      className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors" 
                      aria-label="Listen"
                    >
                      <Headphones className="h-3 w-3" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedItemIndex(item.originalIndex);
                        setActiveMode('link');
                      }}
                      className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors" 
                      aria-label="Open Link"
                    >
                      <ExternalLink className="h-3 w-3" />
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
        
        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {thumbnailContent.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                thumbnailCarouselApi?.scrollTo(index);
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

      {/* Modality Modals */}
      {activeMode === 'read' && content[selectedItemIndex]?.modalities && (
        <ArticleRenderer
          content={(content[selectedItemIndex].modalities as ContentModalities).read?.text || ''}
          title={content[selectedItemIndex]?.title}
          excerpt={content[selectedItemIndex]?.excerpt}
          duration={(content[selectedItemIndex].modalities as ContentModalities).read?.duration}
          onClose={() => setActiveMode(null)}
        />
      )}

      {activeMode === 'watch' && content[selectedItemIndex] && (content[selectedItemIndex].modalities as ContentModalities)?.watch && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[9999] p-4 sm:p-8">
          <div className="relative w-full max-w-7xl max-h-[90vh]">
            <button 
              onClick={() => setActiveMode(null)} 
              className="absolute top-4 right-4 text-white hover:text-cyan-400 text-2xl bg-black/90 hover:bg-black rounded-full w-14 h-14 border-2 border-white/20 hover:border-cyan-400 flex items-center justify-center z-10 transition-all hover:scale-110 shadow-xl"
            >
              ×
            </button>
            {isYouTubeUrl((content[selectedItemIndex].modalities as ContentModalities).watch!.video_url) ? (
              <div className="w-full aspect-video rounded-lg overflow-hidden shadow-2xl bg-black max-h-[85vh]">
                <iframe
                  src={getYouTubeEmbedUrl((content[selectedItemIndex].modalities as ContentModalities).watch!.video_url)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title={content[selectedItemIndex].title}
                />
              </div>
            ) : (
              <video 
                src={(content[selectedItemIndex].modalities as ContentModalities).watch!.video_url}
                controls 
                autoPlay
                className="w-full max-h-[85vh] rounded-lg shadow-2xl"
                poster={(content[selectedItemIndex].modalities as ContentModalities).watch?.thumbnail || content[selectedItemIndex].thumbnail}
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      )}

      {activeMode === 'listen' && content[selectedItemIndex] && (content[selectedItemIndex].modalities as ContentModalities)?.listen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[9999] p-4 sm:p-8">
          <div className="relative w-full max-w-2xl bg-gradient-to-br from-[#0a1628] via-[#0f1c2e] to-[#0a1628] rounded-2xl border border-qripto-cyan/20 shadow-[0_0_80px_rgba(0,196,255,0.15)] p-8">
            <button 
              onClick={() => setActiveMode(null)} 
              className="absolute top-4 right-4 text-white hover:text-cyan-400 text-2xl bg-black/90 hover:bg-black rounded-full w-14 h-14 border-2 border-white/20 hover:border-cyan-400 flex items-center justify-center transition-all hover:scale-110 shadow-xl"
            >
              ×
            </button>
            
            {(content[selectedItemIndex].modalities as ContentModalities).listen?.cover_image && (
              <img 
                src={(content[selectedItemIndex].modalities as ContentModalities).listen!.cover_image} 
                alt={content[selectedItemIndex].title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}
            
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-qripto-cyan to-white bg-clip-text text-transparent mb-4">
              {content[selectedItemIndex].title}
            </h2>
            
            {(content[selectedItemIndex].modalities as ContentModalities).listen?.duration && (
              <p className="text-qripto-cyan/60 text-sm mb-6">Duration: {(content[selectedItemIndex].modalities as ContentModalities).listen!.duration}</p>
            )}
            
            <audio 
              src={(content[selectedItemIndex].modalities as ContentModalities).listen!.audio_url}
              controls 
              autoPlay
              className="w-full"
            >
              Your browser does not support the audio tag.
            </audio>
          </div>
        </div>
      )}

      {activeMode === 'link' && content[selectedItemIndex] && (content[selectedItemIndex].modalities as ContentModalities)?.link && (
        <WebsiteViewer
          url={(content[selectedItemIndex].modalities as ContentModalities).link!.url}
          title={content[selectedItemIndex].title}
          onClose={() => setActiveMode(null)}
        />
      )}
    </DrawerLayer>
  );
}
