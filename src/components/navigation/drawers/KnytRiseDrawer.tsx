import { DrawerLayer } from "../DrawerLayer";
import { Kn0w1Viewer } from "@/components/content/Kn0w1Viewer";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { BookOpen, Play, Headphones, RotateCcw, ChevronRight, ChevronLeft, Eye, Share2 } from "lucide-react";
import { contentService, type Content, ContentModalities } from "@/services/contentService";
import { ArticleRenderer } from "@/components/content/ArticleRenderer";

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

export function ScrollsDrawer({ isOpen, onClose }: KnytRiseDrawerProps) {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMode, setActiveMode] = useState<'read' | 'watch' | 'listen' | null>(null);
  const [carouselApi, setCarouselApi] = useState<any>();
  const [thumbnailCarouselApi, setThumbnailCarouselApi] = useState<any>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [thumbnailSlide, setThumbnailSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('metaknyts');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mediaKey, setMediaKey] = useState(0);
  
  const tabs = [
    { id: 'metaknyts', label: 'metaKnyts' },
    { id: 'synthsims', label: 'The SynthSims' }
  ];

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await contentService.getContentBySection('scrolls', { tab: activeTab as 'metaknyts' | 'synthsims' });
        setContent(data);
      } catch (error) {
        console.error('Error loading Scrolls content:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadContent();
    }
  }, [isOpen, activeTab]);

  // Map database content to viewer format
  const displayContent = content.length > 0 
    ? content.map(item => ({
        id: item.id,
        title: item.title,
        image: item.thumbnail || '',
        badge: item.type?.toUpperCase() || 'STORY'
      }))
    : knytRiseContent;

  // Derive smart actions per content item
  const getSmartActions = (item: Content | undefined) => {
    if (!item) return [];
    const actions: Array<{ type: 'read' | 'watch' | 'listen' | 'view' | 'share'; enabled: boolean }> = [];
    if (contentService.hasModality(item, 'read')) actions.push({ type: 'read', enabled: true });
    if (contentService.hasModality(item, 'watch')) actions.push({ type: 'watch', enabled: true });
    if (contentService.hasModality(item, 'listen')) actions.push({ type: 'listen', enabled: true });
    if (contentService.hasModality(item, 'link')) actions.push({ type: 'share', enabled: true });
    // If no read/watch/listen, show view icon for image-only articles
    if (!actions.some(a => ['read', 'watch', 'listen'].includes(a.type))) {
      actions.unshift({ type: 'view', enabled: true });
    }
    return actions;
  };

  const currentContent = content[selectedItemIndex];
  const currentModalities = currentContent?.modalities as ContentModalities | null;

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

  // Track thumbnail carousel slide changes (mobile)
  useEffect(() => {
    if (!thumbnailCarouselApi) return;
    const updateSlide = () => {
      setThumbnailSlide(thumbnailCarouselApi.selectedScrollSnap());
    };
    updateSlide();
    thumbnailCarouselApi.on("select", updateSlide);
    return () => thumbnailCarouselApi.off("select", updateSlide);
  }, [thumbnailCarouselApi]);

  // Listen for close article event from ArticleRenderer
  useEffect(() => {
    const handleCloseArticle = () => {
      setActiveMode(null);
    };
    window.addEventListener('closeArticle', handleCloseArticle);
    return () => window.removeEventListener('closeArticle', handleCloseArticle);
  }, []);

  const handleReplay = () => {
    setMediaKey((prev) => prev + 1);
  };

  const goToNext = () => {
    if (!content.length) return;
    let nextIndex = selectedItemIndex;
    for (let i = 0; i < content.length; i++) {
      nextIndex = (nextIndex + 1) % content.length;
      if (contentService.hasModality(content[nextIndex], 'watch')) break;
    }
    setSelectedItemIndex(nextIndex);
  };

  const goToPrevious = () => {
    if (!content.length) return;
    let prevIndex = selectedItemIndex;
    for (let i = 0; i < content.length; i++) {
      prevIndex = (prevIndex - 1 + content.length) % content.length;
      if (contentService.hasModality(content[prevIndex], 'watch')) break;
    }
    setSelectedItemIndex(prevIndex);
  };

  return (
    <DrawerLayer
      isOpen={isOpen}
      onClose={onClose}
      title="Scrolls"
      subtitle="Chronicles from the Quantum-Ready Internet"
      columns={2}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <div className="col-span-full space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading content...</div>
          </div>
        ) : (
          <>
            {/* Mobile: Full portrait hero with hover-reveal thumbnails */}
            <div className="md:hidden relative">
              {/* Full height portrait hero image */}
              <div className="relative h-[calc(100vh-180px)] rounded-lg overflow-hidden">
                {displayContent[selectedItemIndex] && (
                  <>
                    <img 
                      src={displayContent[selectedItemIndex].image} 
                      alt={displayContent[selectedItemIndex].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Action icons - top right */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      {content[selectedItemIndex] && getSmartActions(content[selectedItemIndex]).filter(a => a.enabled).map((action) => {
                        const iconMap: Record<string, typeof BookOpen> = { read: BookOpen, watch: Play, listen: Headphones, view: Eye, share: Share2 };
                        const Icon = iconMap[action.type] || Eye;
                        return (
                          <button
                            key={action.type}
                            onClick={() => {
                              if (action.type === 'view') setIsFullscreen(true);
                              else if (action.type !== 'share') setActiveMode(action.type as 'read' | 'watch' | 'listen');
                            }}
                            className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400"
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Title overlay at bottom */}
                    <div className="absolute bottom-12 left-4 right-4">
                      <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                        {displayContent[selectedItemIndex].title}
                      </h2>
                    </div>
                  </>
                )}
                
                {/* Hover-reveal thumbnail carousel overlay */}
                <div className="fixed bottom-0 left-0 right-0 group/thumbnails z-50">
                  {/* Trigger zone */}
                  <div className="h-20 w-full" />
                  
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
                        {displayContent.map((item, index) => (
                          <CarouselItem key={`mobile-thumb-${item.id}`} className="basis-[43%] pl-2">
                            <div 
                              className="relative aspect-video rounded-lg overflow-hidden cursor-pointer"
                              onClick={() => setSelectedItemIndex(index)}
                            >
                              <img 
                                src={item.image} 
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                              {/* Action icons on thumbnails */}
                              {content[index] && (
                                <div className="absolute top-1 right-1 flex gap-1">
                                  {getSmartActions(content[index]).filter(a => a.enabled && a.type !== 'share').slice(0, 2).map((action) => {
                                    const iconMap: Record<string, typeof BookOpen> = { read: BookOpen, watch: Play, listen: Headphones, view: Eye };
                                    const Icon = iconMap[action.type] || Eye;
                                    return (
                                      <button
                                        key={action.type}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedItemIndex(index);
                                          if (action.type === 'view') setIsFullscreen(true);
                                          else setActiveMode(action.type as 'read' | 'watch' | 'listen');
                                        }}
                                        className="w-6 h-6 rounded-full bg-black/50 flex items-center justify-center text-cyan-400"
                                      >
                                        <Icon className="h-2.5 w-2.5" />
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
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
                      {displayContent.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => thumbnailCarouselApi?.scrollTo(index)}
                          className={`transition-all ${
                            index === thumbnailSlide
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

            {/* Desktop: Main Carousel with Large Cards */}
            <div className="hidden md:block">
              <Carousel 
                setApi={setCarouselApi}
                className="w-full"
                opts={{
                  align: "start",
                  loop: true
                }}
                plugins={[WheelGesturesPlugin()]}
              >
              <CarouselContent>
                {displayContent.map((item, index) => (
                  <CarouselItem key={item.id} className="md:basis-1/2">
                    <div 
                      onClick={() => setSelectedItemIndex(index)}
                      className="cursor-pointer relative group"
                    >
                      <Kn0w1Viewer 
                        items={[item]} 
                        domain="scrolls"
                        smartActions={content[index] ? getSmartActions(content[index]) : undefined}
                        onFullscreenChange={(fullscreen) => {
                          setIsFullscreen(fullscreen);
                          setSelectedItemIndex(index);
                        }}
                        onModeChange={(mode) => {
                          setSelectedItemIndex(index);
                          setActiveMode(mode);
                        }}
                      />
                      
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            </div>

            {/* Desktop: Pagination Dots */}
            <div className="hidden md:flex items-center justify-center gap-2 mt-4">
              {displayContent.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedItemIndex(index);
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

            {/* Desktop: Thumbnail Scrolling Layer */}
            <div className="hidden md:block border-t border-border/30 pt-4">
              <Carousel
                className="w-full"
                opts={{
                  align: "start",
                  dragFree: true
                }}
                plugins={[WheelGesturesPlugin()]}
              >
                <CarouselContent className="-ml-2">
                  {displayContent.map((item, index) => (
                    <CarouselItem key={`thumb-${item.id}`} className="basis-1/6 pl-2">
                      <div className="relative group">
                        <button
                          onClick={() => {
                            setSelectedItemIndex(index);
                            setActiveMode(null);
                          }}
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
                        {content.length > 0 && content[index] && (
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {getSmartActions(content[index]).filter(a => a.enabled).map((action) => {
                              const iconMap: Record<string, typeof BookOpen> = { read: BookOpen, watch: Play, listen: Headphones, view: Eye, share: Share2 };
                              const Icon = iconMap[action.type] || Eye;
                              return (
                                <button
                                  key={action.type}
                                  onClick={() => {
                                    setSelectedItemIndex(index);
                                    if (action.type === 'view') setIsFullscreen(true);
                                    else if (action.type !== 'share') setActiveMode(action.type as 'read' | 'watch' | 'listen');
                                  }}
                                  className="w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors"
                                  aria-label={action.type.charAt(0).toUpperCase() + action.type.slice(1)}
                                >
                                  <Icon className="h-2.5 w-2.5" />
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </>
        )}
      </div>

      {/* Read Modal */}
      {activeMode === 'read' && currentModalities?.read && (
        <ArticleRenderer
          content={currentModalities.read.text}
          title={currentContent?.title}
          excerpt={currentContent?.excerpt}
          duration={currentModalities.read.duration}
          onClose={() => setActiveMode(null)}
        />
      )}

      {/* Watch Modal */}
      {activeMode === 'watch' && currentContent && currentModalities?.watch && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-4 sm:p-8">
          <div className="relative w-full max-w-7xl max-h-[90vh]">
            {/* Media player sub menu */}
            <div className="absolute top-4 right-4 z-20 flex flex-col items-center gap-2">
              <button 
                onClick={() => setActiveMode(null)} 
                className="text-white hover:text-cyan-400 text-base bg-black/80 rounded-full w-8 h-8 border border-white/20 hover:border-cyan-400 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                ×
              </button>
              <button
                onClick={handleReplay}
                className="w-8 h-8 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white hover:text-cyan-400 hover:border-cyan-400 transition-colors"
                aria-label="Replay"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={goToNext}
                className="w-8 h-8 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white hover:text-cyan-400 hover:border-cyan-400 transition-colors"
                aria-label="Next short"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={goToPrevious}
                className="w-8 h-8 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white hover:text-cyan-400 hover:border-cyan-400 transition-colors"
                aria-label="Previous short"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>

            {(currentModalities.watch.video_url.includes('youtube.com') || currentModalities.watch.video_url.includes('youtu.be')) ? (
              <div className="w-full aspect-video rounded-lg overflow-hidden shadow-2xl bg-black max-h-[85vh]">
                <iframe
                  key={mediaKey}
                  src={currentModalities.watch.video_url}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title={currentContent.title}
                />
              </div>
            ) : (
              <video 
                key={mediaKey}
                src={currentModalities.watch.video_url}
                controls 
                autoPlay
                className="w-full max-h-[85vh] rounded-lg shadow-2xl"
                poster={currentModalities.watch.thumbnail || currentContent.thumbnail}
              >
                Your browser does not support the video tag.
              </video>
            )}
            {currentModalities.watch.duration && (
              <div className="text-cyan-400 mt-4 text-center">Duration: {currentModalities.watch.duration}</div>
            )}
          </div>
        </div>
      )}

      {/* Fullscreen Image Modal */}
      {isFullscreen && displayContent[selectedItemIndex] && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
          <button 
            onClick={() => setIsFullscreen(false)} 
            className="absolute top-4 right-4 text-white hover:text-cyan-400 text-2xl bg-black/90 hover:bg-black rounded-full w-14 h-14 border-2 border-white/20 hover:border-cyan-400 flex items-center justify-center transition-all hover:scale-110 shadow-xl z-10"
          >
            ×
          </button>
          
          <div className="relative w-full h-full flex items-center justify-center p-8">
            <img 
              src={displayContent[selectedItemIndex].image} 
              alt={displayContent[selectedItemIndex].title} 
              className="max-w-full max-h-full object-contain" 
            />
            
            {/* Fullscreen Dot Navigation */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
              {displayContent.map((item, index) => (
                <button 
                  key={item.id} 
                  onClick={() => setSelectedItemIndex(index)} 
                  className={`transition-all rounded-full ${
                    selectedItemIndex === index 
                      ? "w-12 h-3 bg-cyan-400" 
                      : "w-3 h-3 bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`Go to ${item.title}`} 
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Listen Modal */}
      {activeMode === 'listen' && currentContent && currentModalities?.listen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[100] p-4 sm:p-8">
          <div className="relative w-full max-w-2xl bg-gradient-to-br from-[#0a1628] via-[#0f1c2e] to-[#0a1628] rounded-2xl border border-qripto-cyan/20 shadow-[0_0_80px_rgba(0,196,255,0.15)] p-8">
            <button 
              onClick={() => setActiveMode(null)} 
              className="absolute top-4 right-4 text-white hover:text-cyan-400 text-2xl bg-black/90 hover:bg-black rounded-full w-14 h-14 border-2 border-white/20 hover:border-cyan-400 flex items-center justify-center transition-all hover:scale-110 shadow-xl"
            >
              ×
            </button>
            
            {currentModalities.listen.cover_image && (
              <img 
                src={currentModalities.listen.cover_image} 
                alt={currentContent.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}
            
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-qripto-cyan to-white bg-clip-text text-transparent mb-4">
              {currentContent.title}
            </h2>
            
            {currentModalities.listen.duration && (
              <p className="text-qripto-cyan/60 text-sm mb-6">Duration: {currentModalities.listen.duration}</p>
            )}
            
            <audio 
              src={currentModalities.listen.audio_url}
              controls 
              autoPlay
              className="w-full"
            >
              Your browser does not support the audio tag.
            </audio>
          </div>
        </div>
      )}
    </DrawerLayer>
  );
}
