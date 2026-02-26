import { useState, useEffect } from "react";
import { BookOpen, Play, Headphones } from "lucide-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { contentService, Content, ContentModalities } from "@/services/contentService";
import heroImage from "@/assets/qriptopian-hero.jpg";
import { ArticleRenderer } from "@/components/content/ArticleRenderer";
import { isYouTubeUrl, getYouTubeEmbedUrl } from "@/lib/videoUtils";

export function DynamicHeroSection() {
  const [articles, setArticles] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeArticle, setActiveArticle] = useState(0);
  const [activeMode, setActiveMode] = useState<'read' | 'watch' | 'listen' | null>(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await contentService.getContentBySection('home-hero');
        setArticles(data);
      } catch (error) {
        console.error('Error loading hero content:', error);
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, []);
  
  const currentArticle = articles[activeArticle];
  const currentModalities = currentArticle?.modalities as ContentModalities | null;

  // Listen for close article event from ArticleRenderer
  useEffect(() => {
    const handleCloseArticle = () => {
      setActiveMode(null);
    };
    window.addEventListener('closeArticle', handleCloseArticle);
    return () => window.removeEventListener('closeArticle', handleCloseArticle);
  }, []);

  useEffect(() => {
    if (!carouselApi) return;
    
    carouselApi.on("select", () => {
      setActiveArticle(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  const handleDotClick = (index: number) => {
    setActiveArticle(index);
    carouselApi?.scrollTo(index);
  };

  // Mobile header is ~64px, desktop is ~88px
  const heroHeight = "h-[calc(100dvh-64px)] md:h-[calc(100dvh-88px)]";

  if (loading) {
    return (
      <div className={`w-full ${heroHeight} bg-[#050f1f] flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className={`w-full ${heroHeight} relative`}>
        <img src={heroImage} alt="Default Hero" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050f1f]" />
        <div className="absolute inset-0 flex items-end pb-8 md:pb-16">
          <div className="px-6 md:px-8 max-w-2xl">
            <h1 className="font-bold text-[#d0f6ff] mb-2 md:mb-4 drop-shadow-[0_0_30px_rgba(0,196,255,0.5)] text-2xl md:text-5xl">
              The Qriptopian
            </h1>
            <p className="text-sm md:text-xl text-[#8fb3c0] drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] line-clamp-2 md:line-clamp-none">
              Navigate the Quantum-Ready Internet
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${heroHeight} relative flex-shrink-0 overflow-hidden`}>
      <Carousel 
        setApi={setCarouselApi}
        opts={{ loop: true, dragFree: false }}
        plugins={[WheelGesturesPlugin()]}
        className="w-full h-full relative"
      >
        <CarouselContent className={`-ml-0 ${heroHeight}`}>
          {articles.map((article) => {
            const placement = article.placement as any || {};
            const imageScale = placement.imageScale || 100;
            const imageX = placement.imageX || 50;
            const imageY = placement.imageY || 50;
            
            return (
              <CarouselItem key={article.id} className={`${heroHeight} relative`}>
                {/* Full-bleed background image */}
                <img 
                  src={article.thumbnail || heroImage}
                  alt={article.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    objectPosition: `${imageX}% ${imageY}%`,
                    transform: `scale(${imageScale / 100})`,
                    transformOrigin: `${imageX}% ${imageY}%`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050f1f]" />

                {/* Overlaid text at bottom */}
                <div className="absolute inset-0 flex items-end pb-8 md:pb-16">
                  <div className="px-6 md:px-8 max-w-2xl">
                    <div className="flex items-center gap-2 mb-3 md:mb-6">
                      {articles.map((_, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => handleDotClick(idx)} 
                          className={`transition-all ${idx === activeArticle ? 'w-8 h-2 bg-cyan-400 rounded-full' : 'w-2 h-2 bg-white/30 hover:bg-white/50 rounded-full'}`} 
                          aria-label={`Article ${idx + 1}`} 
                        />
                      ))}
                      {/* SmartAction icons inline with dots */}
                      <div className="flex gap-2 ml-3">
                        {contentService.hasModality(article, 'read') && (
                          <button 
                            onClick={() => setActiveMode(activeMode === 'read' ? null : 'read')} 
                            className={`p-1.5 rounded-lg transition-all ${activeMode === 'read' && activeArticle === articles.indexOf(article) ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500' : 'bg-black/50 text-cyan-400 hover:text-cyan-300 hover:bg-black/70'}`} 
                            aria-label="Read"
                          >
                            <BookOpen className="h-4 w-4" />
                          </button>
                        )}
                        {contentService.hasModality(article, 'watch') && (
                          <button 
                            onClick={() => setActiveMode(activeMode === 'watch' ? null : 'watch')} 
                            className={`p-1.5 rounded-lg transition-all ${activeMode === 'watch' && activeArticle === articles.indexOf(article) ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500' : 'bg-black/50 text-cyan-400 hover:text-cyan-300 hover:bg-black/70'}`} 
                            aria-label="Watch"
                          >
                            <Play className="h-4 w-4" />
                          </button>
                        )}
                        {contentService.hasModality(article, 'listen') && (
                          <button 
                            onClick={() => setActiveMode(activeMode === 'listen' ? null : 'listen')} 
                            className={`p-1.5 rounded-lg transition-all ${activeMode === 'listen' && activeArticle === articles.indexOf(article) ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500' : 'bg-black/50 text-cyan-400 hover:text-cyan-300 hover:bg-black/70'}`} 
                            aria-label="Listen"
                          >
                            <Headphones className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <h1 className="font-bold text-[#d0f6ff] mb-2 md:mb-4 drop-shadow-[0_0_30px_rgba(0,196,255,0.5)] text-2xl md:text-4xl leading-tight">
                      {article.title}
                    </h1>
                    {article.excerpt && (
                      <p className="text-sm md:text-lg text-[#8fb3c0] drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] line-clamp-2 md:line-clamp-none">
                        {article.excerpt}
                      </p>
                    )}
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {activeMode === 'read' && currentArticle && currentModalities?.read && (
        <ArticleRenderer
          content={currentModalities.read.text}
          title={currentArticle.title}
          excerpt={currentArticle.excerpt}
          duration={currentModalities.read.duration}
        />
      )}

      {activeMode === 'watch' && currentArticle && currentModalities?.watch && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-4 md:p-8">
          <div className="relative w-full max-w-6xl">
            <button 
              onClick={() => setActiveMode(null)} 
              className="absolute top-2 right-2 md:-top-4 md:-right-4 text-white hover:text-cyan-400 text-2xl bg-black/70 hover:bg-black/90 rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center z-10 transition-colors"
            >
              ×
            </button>
            
            {isYouTubeUrl(currentModalities.watch.video_url) ? (
              <iframe
                src={getYouTubeEmbedUrl(currentModalities.watch.video_url)}
                className="w-full aspect-[9/16] md:aspect-video rounded-lg shadow-2xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video 
                src={currentModalities.watch.video_url}
                controls 
                autoPlay
                className="w-full h-auto rounded-lg shadow-2xl"
                poster={currentModalities.watch.thumbnail || currentArticle.thumbnail}
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
    </div>
  );
}
