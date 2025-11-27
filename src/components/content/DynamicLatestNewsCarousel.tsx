import { useEffect, useState } from "react";
import { Lock, Crown, Maximize2, BookOpen, Play, Headphones, X, ExternalLink } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { contentService, Content } from "@/services/contentService";
import { isYouTubeUrl, getYouTubeEmbedUrl } from "@/lib/videoUtils";
import { WebsiteViewer } from "./WebsiteViewer";
import { ArticleRenderer } from "./ArticleRenderer";

export function DynamicLatestNewsCarousel() {
  const [articles, setArticles] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenContent, setFullscreenContent] = useState<Content | null>(null);
  const [activeModality, setActiveModality] = useState<'read' | 'watch' | 'listen' | 'link' | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Content | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await contentService.getContentBySection('latest-news');
        setArticles(data);
      } catch (error) {
        console.error('Error loading latest news:', error);
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, []);

  useEffect(() => {
    if (!api) return;
    const updateButtons = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
      setCurrentSlide(api.selectedScrollSnap());
    };
    updateButtons();
    api.on("select", updateButtons);
    api.on("reInit", updateButtons);
    return () => {
      api.off("select", updateButtons);
      api.off("reInit", updateButtons);
    };
  }, [api]);

  const scrollPrev = () => api?.scrollPrev();
  const scrollNext = () => api?.scrollNext();
  const scrollTo = (index: number) => api?.scrollTo(index);

  const handleFullscreen = (article: Content) => {
    setFullscreenContent(article);
    setIsFullscreen(true);
  };

  const handleModalityClick = (article: Content, modality: 'read' | 'watch' | 'listen' | 'link') => {
    setSelectedArticle(article);
    setActiveModality(modality);
  };

  const closeModal = () => {
    setSelectedArticle(null);
    setActiveModality(null);
  };

  if (loading) {
    return (
      <div className="w-full bg-[#071327] py-12 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-[#071327] py-8 md:py-12 px-4 md:pr-[81px]">
      <div className="w-full">
        <div className="flex items-center justify-between mb-6 md:mb-8 px-2">
          <h2 className="text-[#d0f6ff] text-xl md:text-2xl font-medium text-left px-0 mx-0">Latest News</h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={scrollPrev} 
              disabled={!canScrollPrev} 
              className="p-2 rounded-full bg-[#020b18]/80 border border-[#1e2b40] text-cyan-400 hover:bg-[#020b18] hover:text-cyan-300 hover:border-cyan-500/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button 
              onClick={scrollNext} 
              disabled={!canScrollNext} 
              className="p-2 rounded-full bg-[#020b18]/80 border border-[#1e2b40] text-cyan-400 hover:bg-[#020b18] hover:text-cyan-300 hover:border-cyan-500/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
        <Carousel 
          setApi={setApi} 
          className="w-full" 
          opts={{
            align: "start",
            loop: true
          }}
          plugins={[WheelGesturesPlugin()]}
        >
          <CarouselContent className="-ml-4">
            {articles.map((article) => (
              <CarouselItem key={article.id} className="pl-4 basis-full md:basis-[48%] lg:basis-[30%]">
                <div className="relative bg-[#020b18] border border-[#1e2b40] rounded-lg overflow-hidden hover:border-cyan-500/30 transition-colors group">
                  {article.thumbnail && (
                    <div className="relative">
                      <img 
                        src={article.thumbnail} 
                        alt={article.title} 
                        className="w-full h-36 md:h-48 object-cover" 
                      />
                    </div>
                  )}
                  <div className="p-4 md:p-6">
                    {/* Navigation dots and modality buttons */}
                    <div className="flex items-center gap-4 mb-4">
                      <button 
                        onClick={() => handleFullscreen(article)}
                        className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors" 
                        aria-label="Fullscreen"
                      >
                        <Maximize2 className="h-3 w-3" />
                      </button>
                      
                      <div className="flex gap-2">
                        {contentService.hasModality(article, 'read') && (
                          <button 
                            onClick={() => handleModalityClick(article, 'read')}
                            className="p-2 rounded-lg transition-all bg-black/50 text-cyan-400 hover:text-cyan-300 hover:bg-black/70" 
                            aria-label="Read"
                          >
                            <BookOpen className="h-4 w-4" />
                          </button>
                        )}
                        {contentService.hasModality(article, 'watch') && (
                          <button 
                            onClick={() => handleModalityClick(article, 'watch')}
                            className="p-2 rounded-lg transition-all bg-black/50 text-cyan-400 hover:text-cyan-300 hover:bg-black/70" 
                            aria-label="Watch"
                          >
                            <Play className="h-4 w-4" />
                          </button>
                        )}
                        {contentService.hasModality(article, 'listen') && (
                          <button 
                            onClick={() => handleModalityClick(article, 'listen')}
                            className="p-2 rounded-lg transition-all bg-black/50 text-cyan-400 hover:text-cyan-300 hover:bg-black/70" 
                            aria-label="Listen"
                          >
                            <Headphones className="h-4 w-4" />
                          </button>
                        )}
                        {contentService.hasModality(article, 'link') && (
                          <button 
                            onClick={() => handleModalityClick(article, 'link')}
                            className="p-2 rounded-lg transition-all bg-black/50 text-cyan-400 hover:text-cyan-300 hover:bg-black/70" 
                            aria-label="Open Link"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {article.tags && article.tags.length > 0 && (
                      <Badge variant="default" className="bg-purple-500/20 text-purple-400 border-purple-500/30 mb-2">
                        {article.tags[0]}
                      </Badge>
                    )}
                    <h3 className="text-xl font-semibold text-[#d0f6ff] mb-2">{article.title}</h3>
                    {article.excerpt && (
                      <p className="text-[#8fb3c0] text-sm mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {articles.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
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

      {/* Fullscreen Modal */}
      {isFullscreen && fullscreenContent && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white hover:text-cyan-400 transition-colors z-10"
          >
            <X className="h-8 w-8" />
          </button>
          <img
            src={fullscreenContent.thumbnail || ''}
            alt={fullscreenContent.title}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}

      {/* Modality Rendering */}
      {activeModality === 'read' && selectedArticle && (
        <ArticleRenderer
          content={(contentService.getModality(selectedArticle, 'read') as { text: string })?.text || ''}
          title={selectedArticle.title}
          excerpt={selectedArticle.excerpt || undefined}
          duration={selectedArticle.duration || undefined}
          onClose={closeModal}
        />
      )}

      {/* Modality Dialog for watch/listen */}
      <Dialog open={(activeModality === 'watch' || activeModality === 'listen') && selectedArticle !== null} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#020b18] border-[#1e2b40] p-4 md:p-6">
          <DialogHeader>
            <DialogTitle className="text-[#d0f6ff]">{selectedArticle?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {activeModality === 'watch' && selectedArticle && (() => {
              const watchModality = contentService.getModality(selectedArticle, 'watch') as { video_url: string } | undefined;
              const videoUrl = watchModality?.video_url;
              if (!videoUrl) return <p className="text-[#8fb3c0]">Video not available</p>;
              
              if (isYouTubeUrl(videoUrl)) {
                return (
                  <iframe
                    src={getYouTubeEmbedUrl(videoUrl)}
                    className="w-full aspect-[9/16] md:aspect-video rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                );
              }
              
              return (
                <video 
                  src={videoUrl}
                  controls 
                  className="w-full rounded-lg"
                >
                  Your browser does not support the video tag.
                </video>
              );
            })()}
            {activeModality === 'listen' && selectedArticle && (
              <audio 
                src={(contentService.getModality(selectedArticle, 'listen') as { audio_url: string })?.audio_url || ''}
                controls 
                className="w-full"
              >
                Your browser does not support the audio tag.
              </audio>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Link Modality - uses WebsiteViewer */}
      {activeModality === 'link' && selectedArticle && (
        <WebsiteViewer
          url={(contentService.getModality(selectedArticle, 'link') as { url: string })?.url || ''}
          title={selectedArticle.title}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
