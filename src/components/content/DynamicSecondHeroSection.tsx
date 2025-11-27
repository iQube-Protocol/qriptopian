import { useState, useEffect } from "react";
import { BookOpen, Play, Headphones } from "lucide-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { contentService, Content, ContentModalities } from "@/services/contentService";
import quantumTechHero from "@/assets/quantum-tech-hero.jpg";
import { ArticleRenderer } from "@/components/content/ArticleRenderer";
import { isYouTubeUrl, getYouTubeEmbedUrl } from "@/lib/videoUtils";

export function DynamicSecondHeroSection() {
  const [articles, setArticles] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeArticle, setActiveArticle] = useState(0);
  const [activeMode, setActiveMode] = useState<'read' | 'watch' | 'listen' | null>(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await contentService.getContentBySection('second-hero');
        if (data.length > 0) {
          setArticles(data);
        }
      } catch (error) {
        console.error('Error loading second hero:', error);
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
      <div className="w-full h-[70vh] md:h-screen bg-[#050f1f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="w-full h-[70vh] md:h-screen relative flex-shrink-0 bg-[#050f1f]">
        <img src={quantumTechHero} alt="Quantum Technology - The Future of Computing" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050f1f] via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-end pb-8 md:pb-16">
          <div className="px-6 sm:px-8 md:px-8 max-w-2xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#d0f6ff] mb-4 md:mb-6 drop-shadow-[0_0_30px_rgba(0,196,255,0.5)]">
              Powering the Quantum Future
            </h1>
            <p className="text-base md:text-xl lg:text-2xl text-[#8fb3c0] mb-8 drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
              Advanced computing infrastructure for the next generation of digital innovation
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Carousel 
      setApi={setCarouselApi}
      opts={{ loop: true, dragFree: false }}
      plugins={[WheelGesturesPlugin()]}
      className="w-full h-[70vh] md:h-screen relative flex-shrink-0"
    >
      <CarouselContent className="h-[70vh] md:h-screen">
        {articles.map((article) => {
          const placement = article.placement as any || {};
          const imageScale = placement.imageScale || 100;
          const imageX = placement.imageX || 50;
          const imageY = placement.imageY || 50;
          
          return (
            <CarouselItem key={article.id} className="h-[70vh] md:h-screen relative">
              <div 
                className="w-full h-full md:bg-[length:var(--scale)] bg-cover bg-center md:bg-[position:var(--x)_var(--y)]"
                style={{
                  backgroundImage: `url(${article.thumbnail || quantumTechHero})`,
                  '--scale': `${imageScale}%`,
                  '--x': `${imageX}%`,
                  '--y': `${imageY}%`
                } as React.CSSProperties}
              />
            
            <div className="absolute inset-0 flex items-end pb-8 md:pb-16">
              <div className="px-6 sm:px-8 md:px-8 max-w-2xl">
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
                
                <h1 className="font-bold text-[#d0f6ff] mb-4 drop-shadow-[0_0_30px_rgba(0,196,255,0.5)] text-3xl md:text-4xl">
                  {article.title}
                </h1>
                {article.excerpt && (
                  <p className="text-base md:text-lg text-[#8fb3c0] drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
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
        <div className="absolute inset-0 bg-black/95 flex items-center justify-center z-50 p-8">
          <div className="relative w-full max-w-6xl">
            <button 
              onClick={() => setActiveMode(null)} 
              className="absolute -top-4 -right-4 text-white hover:text-cyan-400 text-2xl bg-black/70 hover:bg-black/90 rounded-full w-12 h-12 flex items-center justify-center z-10 transition-colors"
            >
              ×
            </button>
            
            {isYouTubeUrl(currentModalities.watch.video_url) ? (
              <iframe
                src={getYouTubeEmbedUrl(currentModalities.watch.video_url)}
                className="w-full aspect-video rounded-lg shadow-2xl"
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
