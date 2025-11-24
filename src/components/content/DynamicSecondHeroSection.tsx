import { useState, useEffect } from "react";
import { BookOpen, Play, Headphones } from "lucide-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { contentService, Content, ContentModalities } from "@/services/contentService";
import quantumTechHero from "@/assets/quantum-tech-hero.jpg";

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
      <div className="w-full h-screen bg-[#050f1f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="w-full h-screen relative flex-shrink-0 bg-[#050f1f]">
        <img src={quantumTechHero} alt="Quantum Technology - The Future of Computing" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050f1f] via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-end pb-16">
          <div className="px-8 max-w-2xl">
            <h1 className="text-6xl md:text-7xl font-bold text-[#d0f6ff] mb-6 drop-shadow-[0_0_30px_rgba(0,196,255,0.5)]">
              Powering the Quantum Future
            </h1>
            <p className="text-xl md:text-2xl text-[#8fb3c0] mb-8 drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
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
      className="w-full h-screen relative flex-shrink-0"
    >
      <CarouselContent className="h-screen">
        {articles.map((article) => {
          const placement = article.placement as any || {};
          const imageScale = placement.imageScale || 100;
          const imageX = placement.imageX || 50;
          const imageY = placement.imageY || 50;
          
          return (
            <CarouselItem key={article.id} className="h-screen relative">
              <div 
                className="w-full h-full"
                style={{
                  backgroundImage: `url(${article.thumbnail || quantumTechHero})`,
                  backgroundSize: `${imageScale}%`,
                  backgroundPosition: `${imageX}% ${imageY}%`,
                  backgroundRepeat: 'no-repeat'
                }}
              />
            
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
        <div className="absolute inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 z-50">
          <div className="max-w-4xl w-full bg-gradient-to-br from-[#0a1628] via-[#0f1c2e] to-[#0a1628] rounded-2xl border border-qripto-cyan/20 shadow-[0_0_80px_rgba(0,196,255,0.15)] p-6 sm:p-12 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-8">
              <div className="flex-1">
                <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-qripto-cyan to-white bg-clip-text text-transparent leading-tight mb-3">
                  {currentArticle.title}
                </h2>
                {currentArticle.excerpt && (
                  <p className="text-lg text-qripto-cyan/80 italic font-light mb-2">
                    {currentArticle.excerpt}
                  </p>
                )}
                {currentModalities.read.duration && (
                  <p className="text-qripto-cyan/60 text-sm font-light tracking-wider uppercase">
                    {currentModalities.read.duration}
                  </p>
                )}
              </div>
              <button 
                onClick={() => setActiveMode(null)} 
                className="text-qripto-cyan hover:text-white text-3xl ml-4 transition-colors leading-none"
              >
                ×
              </button>
            </div>
            
            <div className="h-px bg-gradient-to-r from-transparent via-qripto-cyan/30 to-transparent mb-10"></div>
            
            <article className="space-y-6">
              {currentModalities.read.text.split('\n\n').map((block, idx) => {
                const trimmedBlock = block.trim();
                
                // Headings with solid color background
                if (trimmedBlock.startsWith('#')) {
                  const text = trimmedBlock.replace(/^#+\s*/, '');
                  return (
                    <h3 key={idx} className="text-xl sm:text-2xl font-bold text-white mt-10 mb-4 px-4 py-3 bg-gradient-to-r from-qripto-cyan/20 to-qripto-purple/20 border-l-4 border-qripto-cyan rounded-r-lg">
                      {text}
                    </h3>
                  );
                }
                
                // Bullet points
                if (trimmedBlock.startsWith('*') || trimmedBlock.startsWith('-')) {
                  const items = trimmedBlock.split('\n').filter(line => line.trim());
                  return (
                    <ul key={idx} className="space-y-3 ml-4">
                      {items.map((item, itemIdx) => (
                        <li key={itemIdx} className="text-gray-300 leading-relaxed text-base sm:text-lg font-light flex items-start">
                          <span className="text-qripto-cyan mr-3 mt-1.5 flex-shrink-0">•</span>
                          <span>{item.replace(/^[*-]\s*/, '')}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                
                // Sidebars/block quotes
                if (trimmedBlock.startsWith('>')) {
                  const text = trimmedBlock.replace(/^>\s*/, '').replace(/\n>/g, '\n');
                  return (
                    <div key={idx} className="border-l-4 border-qripto-purple pl-6 py-4 my-6 bg-qripto-purple/5 rounded-r-lg">
                      <p className="text-gray-300 leading-relaxed text-base sm:text-lg font-light italic">
                        {text}
                      </p>
                    </div>
                  );
                }
                
                // Regular paragraphs - keep text together, single line breaks stay within paragraph
                const lines = trimmedBlock.split('\n').filter(line => line.trim());
                if (lines.length === 1) {
                  // Single sentence for emphasis
                  return (
                    <p key={idx} className="text-gray-200 leading-relaxed text-lg sm:text-xl font-normal tracking-wide">
                      {lines[0]}
                    </p>
                  );
                }
                
                // Multi-line paragraph
                return (
                  <p key={idx} className="text-gray-300 leading-[1.9] text-base sm:text-lg font-light tracking-wide">
                    {lines.join(' ')}
                  </p>
                );
              })}
            </article>
            
            <div className="mt-16 pt-8 border-t border-qripto-cyan/20 flex justify-center">
              <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-qripto-cyan to-transparent"></div>
            </div>
          </div>
        </div>
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
            
            <video 
              src={currentModalities.watch.video_url}
              controls 
              autoPlay
              className="w-full h-auto rounded-lg shadow-2xl"
              poster={currentModalities.watch.thumbnail || currentArticle.thumbnail}
            >
              Your browser does not support the video tag.
            </video>
            
            {currentModalities.watch.duration && (
              <div className="text-cyan-400 mt-4 text-center">Duration: {currentModalities.watch.duration}</div>
            )}
          </div>
        </div>
      )}
    </Carousel>
  );
}
