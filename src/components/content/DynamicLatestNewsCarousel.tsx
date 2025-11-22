import { useEffect, useState } from "react";
import { Lock, Crown } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { contentService, Content } from "@/services/contentService";

export function DynamicLatestNewsCarousel() {
  const [articles, setArticles] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

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
    <div className="w-full bg-[#071327] py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 px-12">
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
                <div className="bg-[#020b18] border border-[#1e2b40] rounded-lg overflow-hidden hover:border-cyan-500/30 transition-colors">
                  {article.thumbnail && (
                    <img 
                      src={article.thumbnail} 
                      alt={article.title} 
                      className="w-full h-48 object-cover" 
                    />
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
    </div>
  );
}
