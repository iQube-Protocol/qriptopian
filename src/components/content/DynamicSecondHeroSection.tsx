import { useEffect, useState } from "react";
import { contentService, Content } from "@/services/contentService";
import quantumTechHero from "@/assets/quantum-tech-hero.jpg";
export function DynamicSecondHeroSection() {
  const [article, setArticle] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await contentService.getContentBySection('second-hero');
        if (data.length > 0) {
          setArticle(data[0]);
        }
      } catch (error) {
        console.error('Error loading second hero:', error);
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, []);
  if (loading) {
    return <div className="w-full h-screen bg-[#050f1f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>;
  }

  // If no article, show default content
  if (!article) {
    return <div className="w-full h-screen relative flex-shrink-0 bg-[#050f1f]">
        <img src={quantumTechHero} alt="Quantum Technology - The Future of Computing" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050f1f] via-[#050f1f]/50 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-8 max-w-4xl">
            <h1 className="text-6xl md:text-7xl font-bold text-[#d0f6ff] mb-6 drop-shadow-[0_0_30px_rgba(0,196,255,0.5)]">
              Powering the Quantum Future
            </h1>
            <p className="text-xl md:text-2xl text-[#8fb3c0] mb-8 drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
              Advanced computing infrastructure for the next generation of digital innovation
            </p>
            <button className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-colors shadow-[0_0_20px_rgba(0,196,255,0.3)]">
              Explore Technology
            </button>
          </div>
        </div>
      </div>;
  }
  return <div className="w-full h-screen relative flex-shrink-0 bg-[#050f1f]">
      <div className="w-full h-full" style={{
      backgroundImage: `url(${article.thumbnail || quantumTechHero})`,
      backgroundSize: `${(article.placement as any)?.imageScale || 100}%`,
      backgroundPosition: `${(article.placement as any)?.imageX || 50}% ${(article.placement as any)?.imageY || 50}%`,
      backgroundRepeat: 'no-repeat'
    }} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050f1f] via-[#050f1f]/50 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-8 max-w-4xl">
          <h1 className="text-6xl md:text-7xl font-bold text-[#d0f6ff] mb-6 drop-shadow-[0_0_30px_rgba(0,196,255,0.5)]">
            {article.title}
          </h1>
          {article.excerpt && <p className="text-xl md:text-2xl text-[#8fb3c0] mb-8 drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
              {article.excerpt}
            </p>}
          
        </div>
      </div>
    </div>;
}