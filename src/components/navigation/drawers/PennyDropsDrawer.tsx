import { DrawerLayer } from "../DrawerLayer";
import { Kn0w1Viewer } from "@/components/content/Kn0w1Viewer";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { Maximize2, BookOpen, Play, Headphones, ExternalLink } from "lucide-react";
import { useMetaAvatar } from "@/contexts/MetaAvatarContext";
import { contentService, type Content, ContentModalities } from "@/services/contentService";
import { ArticleRenderer } from "@/components/content/ArticleRenderer";
import { isYouTubeUrl, getYouTubeEmbedUrl } from "@/lib/videoUtils";
import { WebsiteViewer } from "@/components/content/WebsiteViewer";

interface PennyDropsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PennyDropsDrawer({ isOpen, onClose }: PennyDropsDrawerProps) {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMode, setActiveMode] = useState<'read' | 'watch' | 'listen' | 'link' | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { requestAvatar, releaseAvatar } = useMetaAvatar();
  const [thumbnailCarouselApi, setThumbnailCarouselApi] = useState<any>();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Request/release avatar based on drawer state
  useEffect(() => {
    if (isOpen) {
      requestAvatar('pennydrops');
    } else {
      releaseAvatar('pennydrops');
    }
    return () => releaseAvatar('pennydrops');
  }, [isOpen, requestAvatar, releaseAvatar]);

  // Temporarily hide avatar iframe while media/article modal or fullscreen is active
  useEffect(() => {
    if (activeMode || isFullscreen) {
      // Hide avatar when any modal is open or fullscreen is active
      releaseAvatar('pennydrops');
    } else if (isOpen) {
      // Restore avatar when modals are closed and drawer is still open
      requestAvatar('pennydrops');
    }
  }, [activeMode, isFullscreen, isOpen, requestAvatar, releaseAvatar]);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await contentService.getContentBySection('pennydrops');
        setContent(data);
      } catch (error) {
        console.error('Error loading PennyDrops content:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadContent();
    }
  }, [isOpen]);

  const tabs = [
    { id: 'stories', label: 'Stories' }
  ];

  // Map database content to viewer format
  const displayContent = content.length > 0 
    ? content.map(item => ({
        id: item.id,
        title: item.title,
        image: item.thumbnail || '',
        badge: item.type?.toUpperCase() || 'Q¢ CASE'
      }))
    : [];

  const featureContent = displayContent.slice(0, 1);
  const thumbnailContent = displayContent.slice(1);
  const currentContent = content[selectedItemIndex];
  const currentModalities = currentContent?.modalities as ContentModalities | null;

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

  return (
    <DrawerLayer
      isOpen={isOpen}
      onClose={onClose}
      title="Penny Drops"
      subtitle="Q¢ use cases - fun, practical, irreverent"
      columns={3}
      tabs={tabs}
    >
      {loading ? (
        <div className="col-span-full flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading content...</div>
        </div>
      ) : content.length === 0 ? (
        <div className="col-span-full flex items-center justify-center py-12">
          <div className="text-muted-foreground">No content available</div>
        </div>
      ) : (
        <>
          {/* Mobile: Spacer for MetaAvatar overlay */}
          <div className="col-span-full h-[200px] md:hidden" />

          {/* Left: 2 columns - Large Feature Article on desktop, full width on mobile */}
          <div className="col-span-full md:col-span-2">
            {featureContent.length > 0 && (
              <div className="relative group">
                <Kn0w1Viewer 
                  items={featureContent} 
                  domain="pennydrops"
                  onFullscreenChange={setIsFullscreen}
                />
                {/* Modality Buttons Overlay for Feature */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  {contentService.hasModality(content[0], 'read') && (
                    <button
                      onClick={() => {
                        setSelectedItemIndex(0);
                        setActiveMode('read');
                      }}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/80 hover:bg-black border border-cyan-500/30 hover:border-cyan-500 flex items-center justify-center transition-all hover:scale-110"
                      title="Read"
                    >
                      <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                    </button>
                  )}
                  {contentService.hasModality(content[0], 'watch') && (
                    <button
                      onClick={() => {
                        setSelectedItemIndex(0);
                        setActiveMode('watch');
                      }}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/80 hover:bg-black border border-cyan-500/30 hover:border-cyan-500 flex items-center justify-center transition-all hover:scale-110"
                      title="Watch"
                    >
                      <Play className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                    </button>
                  )}
                  {contentService.hasModality(content[0], 'listen') && (
                    <button
                      onClick={() => {
                        setSelectedItemIndex(0);
                        setActiveMode('listen');
                      }}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/80 hover:bg-black border border-cyan-500/30 hover:border-cyan-500 flex items-center justify-center transition-all hover:scale-110"
                      title="Listen"
                    >
                      <Headphones className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                    </button>
                  )}
                  {contentService.hasModality(content[0], 'link') && (
                    <button
                      onClick={() => {
                        setSelectedItemIndex(0);
                        setActiveMode('link');
                      }}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/80 hover:bg-black border border-cyan-500/30 hover:border-cyan-500 flex items-center justify-center transition-all hover:scale-110"
                      title="Open Link"
                    >
                      <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right: 1 column for MetaAvatar iframe (rendered globally in Layout) - hidden on mobile */}
          <div className="hidden md:block col-span-1" />

          {/* Thumbnail carousel - Desktop: always visible. Mobile: hover-reveal overlay */}
          {thumbnailContent.length > 0 && (
            <>
              {/* Desktop Carousel - always visible */}
              <div className="hidden md:block col-span-full border-t border-border/30 pt-6">
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
                    {thumbnailContent.map((item, index) => {
                      const contentIndex = index + 1;
                      return (
                        <CarouselItem key={item.id} className="basis-1/4 pl-4">
                          <div className="relative aspect-[47/20] rounded-lg overflow-hidden group cursor-pointer">
                            <img 
                              src={item.image} 
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            {/* Action Menu */}
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {contentService.hasModality(content[contentIndex], 'read') && (
                                <button 
                                  onClick={() => {
                                    setSelectedItemIndex(contentIndex);
                                    setActiveMode('read');
                                  }}
                                  className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors" 
                                  aria-label="Read"
                                >
                                  <BookOpen className="h-3 w-3" />
                                </button>
                              )}
                              {contentService.hasModality(content[contentIndex], 'watch') && (
                                <button 
                                  onClick={() => {
                                    setSelectedItemIndex(contentIndex);
                                    setActiveMode('watch');
                                  }}
                                  className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors" 
                                  aria-label="Watch"
                                >
                                  <Play className="h-3 w-3" />
                                </button>
                              )}
                              {contentService.hasModality(content[contentIndex], 'listen') && (
                                <button 
                                  onClick={() => {
                                    setSelectedItemIndex(contentIndex);
                                    setActiveMode('listen');
                                  }}
                                  className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors" 
                                  aria-label="Listen"
                                >
                                  <Headphones className="h-3 w-3" />
                                </button>
                              )}
                              {contentService.hasModality(content[contentIndex], 'link') && (
                                <button 
                                  onClick={() => {
                                    setSelectedItemIndex(contentIndex);
                                    setActiveMode('link');
                                  }}
                                  className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors" 
                                  aria-label="Open Link"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                            </div>
                          </div>
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                </Carousel>
                
                {/* Pagination Dots - Desktop */}
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

              {/* Mobile: Hover-reveal overlay at bottom */}
              <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 group/mobile-carousel">
                {/* Trigger zone - invisible but detects hover/touch */}
                <div className="h-16 w-full" />
                
                {/* Carousel overlay - appears on hover */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent opacity-0 group-hover/mobile-carousel:opacity-100 transition-opacity duration-300 pb-4 pt-8">
                  <Carousel
                    className="w-full px-4"
                    opts={{
                      align: "start",
                      dragFree: true
                    }}
                    plugins={[WheelGesturesPlugin()]}
                  >
                    <CarouselContent className="-ml-2">
                      {thumbnailContent.map((item, index) => {
                        const contentIndex = index + 1;
                        return (
                          <CarouselItem key={item.id} className="basis-[43%] pl-2">
                            <div className="relative aspect-[47/20] rounded-lg overflow-hidden group cursor-pointer">
                              <img 
                                src={item.image} 
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                              {/* Action Menu on hover */}
                              <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {contentService.hasModality(content[contentIndex], 'read') && (
                                  <button 
                                    onClick={() => {
                                      setSelectedItemIndex(contentIndex);
                                      setActiveMode('read');
                                    }}
                                    className="w-6 h-6 rounded-full bg-black/70 border border-cyan-500/30 flex items-center justify-center text-cyan-400" 
                                    aria-label="Read"
                                  >
                                    <BookOpen className="h-3 w-3" />
                                  </button>
                                )}
                                {contentService.hasModality(content[contentIndex], 'watch') && (
                                  <button 
                                    onClick={() => {
                                      setSelectedItemIndex(contentIndex);
                                      setActiveMode('watch');
                                    }}
                                    className="w-6 h-6 rounded-full bg-black/70 border border-cyan-500/30 flex items-center justify-center text-cyan-400" 
                                    aria-label="Watch"
                                  >
                                    <Play className="h-3 w-3" />
                                  </button>
                                )}
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 p-2">
                                <h4 className="text-xs font-semibold text-white truncate">{item.title}</h4>
                              </div>
                            </div>
                          </CarouselItem>
                        );
                      })}
                    </CarouselContent>
                  </Carousel>
                  
                  {/* Pagination Dots - Mobile */}
                  <div className="flex items-center justify-center gap-1.5 mt-3">
                    {thumbnailContent.map((_, index) => (
                      <div
                        key={index}
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
            </>
          )}
        </>
      )}

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
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[9999] p-4 md:p-8">
          <div className="relative w-full max-w-7xl max-h-[90vh]">
            <button 
              onClick={() => setActiveMode(null)} 
              className="absolute top-2 right-2 md:top-4 md:right-4 text-white hover:text-cyan-400 text-2xl bg-black/90 hover:bg-black rounded-full w-12 h-12 md:w-14 md:h-14 border-2 border-white/20 hover:border-cyan-400 flex items-center justify-center z-10 transition-all hover:scale-110 shadow-xl"
            >
              ×
            </button>
            {isYouTubeUrl(currentModalities.watch.video_url) ? (
              <div className="w-full aspect-[9/16] md:aspect-video rounded-lg overflow-hidden shadow-2xl bg-black max-h-[85vh]">
                <iframe
                  src={getYouTubeEmbedUrl(currentModalities.watch.video_url)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title={currentContent.title}
                />
              </div>
            ) : (
              <video 
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

      {/* Listen Modal */}
      {activeMode === 'listen' && currentContent && currentModalities?.listen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[9999] p-4 sm:p-8">
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

      {/* Link Modal */}
      {activeMode === 'link' && currentContent && currentModalities?.link && (
        <WebsiteViewer
          url={currentModalities.link.url}
          title={currentContent.title}
          onClose={() => setActiveMode(null)}
        />
      )}
    </DrawerLayer>
  );
}
