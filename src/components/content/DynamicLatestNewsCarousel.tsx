import { useEffect, useState } from "react";
import { Lock, Crown, Maximize2, BookOpen, Play, Headphones, X, ExternalLink } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { contentService, Content } from "@/services/contentService";
import { isYouTubeUrl, getYouTubeEmbedUrl } from "@/lib/videoUtils";
import { WebsiteViewer } from "./WebsiteViewer";

export function DynamicLatestNewsCarousel() {
  const [articles, setArticles] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
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
    <div className="w-full bg-[#071327] py-12 px-4">
      <div className="max-w-[95%] mx-auto">
        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="text-[#d0f6ff] text-2xl font-medium text-left px-0 mx-0">Latest News</h2>
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
              <CarouselItem key={article.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="relative bg-[#020b18] border border-[#1e2b40] rounded-lg overflow-hidden hover:border-cyan-500/30 transition-colors group">
                  {article.thumbnail && (
                    <div className="relative">
                      <img 
                        src={article.thumbnail} 
                        alt={article.title} 
                        className="w-full h-48 object-cover" 
                      />
                      {/* Action Menu */}
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleFullscreen(article)}
                          className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors" 
                          aria-label="Fullscreen"
                        >
                          <Maximize2 className="h-3 w-3" />
                        </button>
                        {contentService.hasModality(article, 'read') && (
                          <button 
                            onClick={() => handleModalityClick(article, 'read')}
                            className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors" 
                            aria-label="Read"
                          >
                            <BookOpen className="h-3 w-3" />
                          </button>
                        )}
                        {contentService.hasModality(article, 'watch') && (
                          <button 
                            onClick={() => handleModalityClick(article, 'watch')}
                            className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors" 
                            aria-label="Watch"
                          >
                            <Play className="h-3 w-3" />
                          </button>
                        )}
                        {contentService.hasModality(article, 'listen') && (
                          <button 
                            onClick={() => handleModalityClick(article, 'listen')}
                            className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors" 
                            aria-label="Listen"
                          >
                            <Headphones className="h-3 w-3" />
                          </button>
                        )}
                        {contentService.hasModality(article, 'link') && (
                          <button 
                            onClick={() => handleModalityClick(article, 'link')}
                            className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors" 
                            aria-label="Open Link"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="p-6">
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
                    <button className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
                      Explore →
                    </button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
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

      {/* Modality Dialog */}
      <Dialog open={activeModality !== null && activeModality !== 'link'} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#020b18] border-[#1e2b40]">
          <DialogHeader>
            <DialogTitle className="text-[#d0f6ff]">{selectedArticle?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {activeModality === 'read' && selectedArticle && (
              <div className="prose prose-invert max-w-none">
                <p className="text-[#8fb3c0] whitespace-pre-wrap">
                  {(contentService.getModality(selectedArticle, 'read') as { text: string })?.text || 'Content not available'}
                </p>
              </div>
            )}
            {activeModality === 'watch' && selectedArticle && (() => {
              const watchModality = contentService.getModality(selectedArticle, 'watch') as { video_url: string } | undefined;
              const videoUrl = watchModality?.video_url;
              if (!videoUrl) return <p className="text-[#8fb3c0]">Video not available</p>;
              
              if (isYouTubeUrl(videoUrl)) {
                return (
                  <iframe
                    src={getYouTubeEmbedUrl(videoUrl)}
                    className="w-full aspect-video rounded-lg"
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
