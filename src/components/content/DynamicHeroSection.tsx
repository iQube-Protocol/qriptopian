import { useState, useEffect } from "react";
import { BookOpen, Play, Headphones } from "lucide-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { contentService, Content, ContentModalities } from "@/services/contentService";
import heroImage from "@/assets/qriptopian-hero.jpg";

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
      <div className="w-full h-[calc(100vh-88px)] bg-[#050f1f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="w-full h-[calc(100vh-88px)] relative">
        <img src={heroImage} alt="Default Hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050f1f]" />
        <div className="absolute inset-0 flex items-end pb-16">
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

  return (
    <Carousel 
      setApi={setCarouselApi}
      opts={{ loop: true, dragFree: false }}
      plugins={[WheelGesturesPlugin()]}
      className="w-full h-[calc(100vh-88px)] relative flex-shrink-0"
    >
      <CarouselContent className="h-[calc(100vh-88px)]">
        {articles.map((article) => (
          <CarouselItem key={article.id} className="h-[calc(100vh-88px)] relative">
            <img 
              src={article.thumbnail || heroImage} 
              alt={article.title} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050f1f]" />
            
            <div className="absolute inset-0 flex items-end pb-16">
              <div className="px-8 max-w-2xl">
                <div className="flex items-center gap-4 mb-6">
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
                </div>
                
                <h1 className="font-bold text-[#d0f6ff] mb-4 drop-shadow-[0_0_30px_rgba(0,196,255,0.5)] text-5xl">
                  {article.title}
                </h1>
                {article.excerpt && (
                  <p className="text-xl text-[#8fb3c0] drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                    {article.excerpt}
                  </p>
                )}
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {activeMode === 'read' && currentArticle && currentModalities?.read && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-8 z-50">
          <div className="max-w-4xl w-full bg-[#0a1528]/95 rounded-lg border border-cyan-500/20 p-8 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-[#d0f6ff] mb-2">{currentArticle.title}</h2>
                {currentModalities.read.duration && (
                  <p className="text-cyan-400">{currentModalities.read.duration}</p>
                )}
              </div>
              <button onClick={() => setActiveMode(null)} className="text-cyan-400 hover:text-cyan-300 text-xl">
                ×
              </button>
            </div>
            <div className="prose prose-cyan max-w-none">
              <p className="text-gray-300 leading-relaxed text-lg">
                {currentModalities.read.text}
              </p>
            </div>
          </div>
        </div>
      )}

      {activeMode === 'watch' && currentArticle && currentModalities?.watch && (
        <div className="absolute inset-0 bg-black/95 flex items-center justify-center z-50">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute top-6 right-24 z-10">
              <button onClick={() => setActiveMode(null)} className="text-white hover:text-cyan-400 text-xl bg-black/50 rounded-full w-10 h-10 flex items-center justify-center">
                ×
              </button>
            </div>
            
            <div className="text-center max-w-4xl w-full">
              <div className="w-32 h-32 mx-auto mb-6 bg-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-500">
                <Play className="h-16 w-16 text-cyan-400" />
              </div>
              <h3 className="text-2xl text-white mb-4">{currentArticle.title}</h3>
              {currentModalities.watch.duration && (
                <div className="text-cyan-400 mb-6">Duration: {currentModalities.watch.duration}</div>
              )}
              <p className="text-gray-400 mb-4">Video URL: {currentModalities.watch.video_url}</p>
            </div>
          </div>
        </div>
      )}
    </Carousel>
  );
}
