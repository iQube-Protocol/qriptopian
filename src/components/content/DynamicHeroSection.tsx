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

  if (loading) {
    return (
      <div className="w-full h-[100svh] md:h-[calc(100vh-88px)] bg-[#050f1f] flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
        </div>
        <div className="flex-shrink-0 h-[180px] md:h-auto" />
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="w-full h-[100svh] md:h-[calc(100vh-88px)] flex flex-col">
        <div className="flex-1 relative">
          <img src={heroImage} alt="Default Hero" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050f1f]" />
        </div>
        <div className="flex-shrink-0 bg-[#050f1f] px-4 py-4 md:hidden">
          <h1 className="font-bold text-[#d0f6ff] mb-2 drop-shadow-[0_0_30px_rgba(0,196,255,0.5)] text-2xl">
            The Qriptopian
          </h1>
          <p className="text-sm text-[#8fb3c0] drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] line-clamp-2">
            Navigate the Quantum-Ready Internet
          </p>
        </div>
        <div className="hidden md:flex absolute inset-0 items-end pb-16">
          <div className="px-8 max-w-2xl">
            <h1 className="font-bold text-[#d0f6ff] mb-4 drop-shadow-[0_0_30px_rgba(0,196,255,0.5)] text-5xl">
              The Qriptopian
            </h1>
            <p className="text-xl text-[#8fb3c0] drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
              Navigate the Quantum-Ready Internet
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Fixed height for mobile text area to ensure consistent positioning
  const mobileTextHeight = 180; // Fixed px height for nav + title + 2-line excerpt

  return (
    <Carousel 
      setApi={setCarouselApi}
      opts={{ loop: true, dragFree: false }}
      plugins={[WheelGesturesPlugin()]}
      className="w-full h-[100svh] md:h-[calc(100vh-88px)] relative flex-shrink-0"
    >
      <CarouselContent className="h-[100svh] md:h-[calc(100vh-88px)]">
        {articles.map((article) => {
          const placement = article.placement as any || {};
          const imageScale = placement.imageScale || 100;
          const imageX = placement.imageX || 50;
          const imageY = placement.imageY || 50;
          
          return (
            <CarouselItem key={article.id} className="h-[100svh] md:h-[calc(100vh-88px)] relative flex flex-col md:block">
              {/* Mobile: Image takes remaining space above fixed text area */}
              <div 
                className="flex-1 md:absolute md:inset-0 md:bg-[length:var(--scale)] bg-cover bg-center md:bg-[position:var(--x)_var(--y)]"
                style={{
                  backgroundImage: `url(${article.thumbnail || heroImage})`,
                  '--scale': `${imageScale}%`,
                  '--x': `${imageX}%`,
                  '--y': `${imageY}%`
                } as React.CSSProperties}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050f1f] pointer-events-none" />
              
              {/* Mobile: Fixed height text area at bottom */}
              <div 
                className="flex-shrink-0 bg-[#050f1f] px-4 py-3 md:hidden relative z-10"
                style={{ minHeight: `${mobileTextHeight}px` }}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex gap-2">
                    {articles.map((_, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => handleDotClick(idx)} 
                        className={`transition-all ${idx === activeArticle ? 'w-8 h-2 bg-cyan-400 rounded-full' : 'w-2 h-2 bg-white/30 hover:bg-white/50 rounded-full'}`} 
                        aria-label={`Article ${idx + 1}`} 
                      />
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    {contentService.hasModality(article, 'read') && (
                      <button 
                        onClick={() => setActiveMode(activeMode === 'read' ? null : 'read')} 
                        className={`p-2 rounded-lg transition-all ${activeMode === 'read' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500' : 'bg-black/50 text-cyan-400 hover:text-cyan-300 hover:bg-black/70'}`} 
                        aria-label="Read"
                      >
                        <BookOpen className="h-4 w-4" />
                      </button>
                    )}
                    {contentService.hasModality(article, 'watch') && (
                      <button 
                        onClick={() => setActiveMode(activeMode === 'watch' ? null : 'watch')} 
                        className={`p-2 rounded-lg transition-all ${activeMode === 'watch' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500' : 'bg-black/50 text-cyan-400 hover:text-cyan-300 hover:bg-black/70'}`} 
                        aria-label="Watch"
                      >
                        <Play className="h-4 w-4" />
                      </button>
                    )}
                    {contentService.hasModality(article, 'listen') && (
                      <button 
                        onClick={() => setActiveMode(activeMode === 'listen' ? null : 'listen')} 
                        className={`p-2 rounded-lg transition-all ${activeMode === 'listen' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500' : 'bg-black/50 text-cyan-400 hover:text-cyan-300 hover:bg-black/70'}`} 
                        aria-label="Listen"
                      >
                        <Headphones className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                <h1 className="font-bold text-[#d0f6ff] mb-2 drop-shadow-[0_0_30px_rgba(0,196,255,0.5)] text-2xl leading-tight">
                  {article.title}
                </h1>
                {article.excerpt && (
                  <p className="text-sm text-[#8fb3c0] drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] line-clamp-2">
                    {article.excerpt}
                  </p>
                )}
              </div>
              
              {/* Desktop: Overlaid text at bottom */}
              <div className="hidden md:flex absolute inset-0 items-end pb-16">
                <div className="px-8 max-w-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex gap-2">
                      {articles.map((_, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => handleDotClick(idx)} 
                          className={`transition-all ${idx === activeArticle ? 'w-8 h-2 bg-cyan-400 rounded-full' : 'w-2 h-2 bg-white/30 hover:bg-white/50 rounded-full'}`} 
                          aria-label={`Article ${idx + 1}`} 
                        />
                      ))}
                    </div>
                    
                    <div className="flex gap-3">
                      {contentService.hasModality(article, 'read') && (
                        <button 
                          onClick={() => setActiveMode(activeMode === 'read' ? null : 'read')} 
                          className={`p-2 rounded-lg transition-all ${activeMode === 'read' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500' : 'bg-black/50 text-cyan-400 hover:text-cyan-300 hover:bg-black/70'}`} 
                          aria-label="Read"
                        >
                          <BookOpen className="h-4 w-4" />
                        </button>
                      )}
                      {contentService.hasModality(article, 'watch') && (
                        <button 
                          onClick={() => setActiveMode(activeMode === 'watch' ? null : 'watch')} 
                          className={`p-2 rounded-lg transition-all ${activeMode === 'watch' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500' : 'bg-black/50 text-cyan-400 hover:text-cyan-300 hover:bg-black/70'}`} 
                          aria-label="Watch"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                      )}
                      {contentService.hasModality(article, 'listen') && (
                        <button 
                          onClick={() => setActiveMode(activeMode === 'listen' ? null : 'listen')} 
                          className={`p-2 rounded-lg transition-all ${activeMode === 'listen' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500' : 'bg-black/50 text-cyan-400 hover:text-cyan-300 hover:bg-black/70'}`} 
                          aria-label="Listen"
                        >
                          <Headphones className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <h1 className="font-bold text-[#d0f6ff] mb-4 drop-shadow-[0_0_30px_rgba(0,196,255,0.5)] text-4xl">
                    {article.title}
                  </h1>
                  {article.excerpt && (
                    <p className="text-lg text-[#8fb3c0] drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                      {article.excerpt}
                    </p>
                  )}
                </div>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>

      {activeMode === 'read' && currentArticle && currentModalities?.read && (
        <ArticleRenderer
          content={currentModalities.read.text}
          title={currentArticle.title}
          excerpt={currentArticle.excerpt}
          duration={currentModalities.read.duration}
        />
      )}

      {activeMode === 'watch' && currentArticle && currentModalities?.watch && (
        <div className="absolute inset-0 bg-black/95 flex items-center justify-center z-50 p-4 md:p-8">
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
    </Carousel>
  );
}
