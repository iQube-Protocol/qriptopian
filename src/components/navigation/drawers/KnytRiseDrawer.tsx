import { DrawerLayer } from "../DrawerLayer";
import { Kn0w1Viewer } from "@/components/content/Kn0w1Viewer";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { Maximize2, BookOpen, Play, Headphones } from "lucide-react";
import { contentService, type Content, ContentModalities } from "@/services/contentService";

interface KnytRiseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const knytRiseContent = [
  {
    id: '1',
    title: 'The Awakening: Chapter 1',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=800&fit=crop',
    badge: 'COMIC'
  },
  {
    id: '2',
    title: 'Chronicles of the Quantum Realm',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1200&h=800&fit=crop',
    badge: 'STORY'
  },
  {
    id: '3',
    title: 'Voices from the Digital Frontier',
    image: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=1200&h=800&fit=crop',
    badge: 'SERIES'
  },
  {
    id: '4',
    title: 'The Rise of the Agent Network',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=800&fit=crop',
    badge: 'COMIC'
  },
  {
    id: '5',
    title: 'Legends of the Blockchain',
    image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1200&h=800&fit=crop',
    badge: 'STORY'
  },
  {
    id: '6',
    title: 'The iQube Chronicles',
    image: 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=1200&h=800&fit=crop',
    badge: 'SERIES'
  },
];

export function KnytRiseDrawer({ isOpen, onClose }: KnytRiseDrawerProps) {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMode, setActiveMode] = useState<'read' | 'watch' | 'listen' | null>(null);
  
  const tabs = [
    { id: 'stories', label: 'Stories' }
  ];

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await contentService.getContentBySection('knytrise');
        setContent(data);
      } catch (error) {
        console.error('Error loading KNYT Rise content:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadContent();
    }
  }, [isOpen]);

  // Map database content to viewer format
  const displayContent = content.length > 0 
    ? content.map(item => ({
        id: item.id,
        title: item.title,
        image: item.thumbnail || '',
        badge: item.type?.toUpperCase() || 'STORY'
      }))
    : knytRiseContent; // Fallback to mock data only if no real content

  const currentContent = content[selectedItemIndex];
  const currentModalities = currentContent?.modalities as ContentModalities | null;

  return (
    <DrawerLayer
      isOpen={isOpen}
      onClose={onClose}
      title="KNYT Rise"
      subtitle="Chronicles from the Quantum-Ready Internet"
      columns={2}
      tabs={tabs}
    >
      <div className="col-span-full space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading content...</div>
          </div>
        ) : (
          <>
            {/* Main Carousel with Large Cards */}
            <Carousel 
              className="w-full"
              opts={{
                align: "start",
                loop: true
              }}
              plugins={[WheelGesturesPlugin()]}
            >
              <CarouselContent>
                {displayContent.map((item, index) => (
                  <CarouselItem key={item.id} className="md:basis-1/2">
                    <div 
                      onClick={() => setSelectedItemIndex(index)}
                      className="cursor-pointer"
                    >
                      <Kn0w1Viewer items={[item]} domain="knytrise" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* Thumbnail Scrolling Layer */}
            <div className="border-t border-border/30 pt-4">
              <Carousel
                className="w-full"
                opts={{
                  align: "start",
                  dragFree: true
                }}
                plugins={[WheelGesturesPlugin()]}
              >
                <CarouselContent className="-ml-2">
                  {displayContent.map((item, index) => (
                    <CarouselItem key={`thumb-${item.id}`} className="basis-1/6 pl-2">
                      <div className="relative group">
                        <button
                          onClick={() => {
                            setSelectedItemIndex(index);
                            setActiveMode(null);
                          }}
                          className={`w-full aspect-video rounded-lg overflow-hidden border-2 transition-all hover:border-primary/50 ${
                            selectedItemIndex === index 
                              ? 'border-primary ring-2 ring-primary/20' 
                              : 'border-border/30'
                          }`}
                        >
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </button>
                        {/* Action Menu */}
                        {content.length > 0 && content[index] && (
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {contentService.hasModality(content[index], 'read') && (
                              <button 
                                onClick={() => {
                                  setSelectedItemIndex(index);
                                  setActiveMode('read');
                                }}
                                className="w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors" 
                                aria-label="Read"
                              >
                                <BookOpen className="h-2.5 w-2.5" />
                              </button>
                            )}
                            {contentService.hasModality(content[index], 'watch') && (
                              <button 
                                onClick={() => {
                                  setSelectedItemIndex(index);
                                  setActiveMode('watch');
                                }}
                                className="w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors" 
                                aria-label="Watch"
                              >
                                <Play className="h-2.5 w-2.5" />
                              </button>
                            )}
                            {contentService.hasModality(content[index], 'listen') && (
                              <button 
                                onClick={() => {
                                  setSelectedItemIndex(index);
                                  setActiveMode('listen');
                                }}
                                className="w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors" 
                                aria-label="Listen"
                              >
                                <Headphones className="h-2.5 w-2.5" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </>
        )}
      </div>

      {/* Read Modal */}
      {activeMode === 'read' && currentContent && currentModalities?.read && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 z-[100]">
          <div className="max-w-4xl w-full bg-gradient-to-br from-[#0a1628] via-[#0f1c2e] to-[#0a1628] rounded-2xl border border-qripto-cyan/20 shadow-[0_0_80px_rgba(0,196,255,0.15)] p-6 sm:p-12 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-8">
              <div className="flex-1">
                <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-qripto-cyan to-white bg-clip-text text-transparent leading-tight mb-3">
                  {currentContent.title}
                </h2>
                {currentContent.excerpt && (
                  <p className="text-lg text-qripto-cyan/80 italic font-light mb-2">
                    {currentContent.excerpt}
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
            
            <article className="space-y-8">
              {currentModalities.read.text.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('#')) {
                  const text = paragraph.replace(/^#+\s*/, '');
                  return (
                    <h3 key={idx} className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-6 pb-4 border-b border-qripto-cyan/20">
                      <span className="bg-gradient-to-r from-qripto-cyan to-qripto-purple bg-clip-text text-transparent">
                        {text}
                      </span>
                    </h3>
                  );
                }
                
                return (
                  <p key={idx} className="text-gray-300 leading-[1.8] text-base sm:text-lg font-light tracking-wide">
                    {paragraph.split('\n').map((line, lineIdx) => (
                      <span key={lineIdx}>
                        {line}
                        {lineIdx < paragraph.split('\n').length - 1 && <><br /><br /></>}
                      </span>
                    ))}
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

      {/* Watch Modal */}
      {activeMode === 'watch' && currentContent && currentModalities?.watch && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-8">
          <div className="relative w-full max-w-6xl">
            <button 
              onClick={() => setActiveMode(null)} 
              className="absolute -top-4 -right-4 text-white hover:text-cyan-400 text-2xl bg-black/70 hover:bg-black/90 rounded-full w-12 h-12 flex items-center justify-center z-10 transition-colors"
            >
              ×
            </button>
            {(currentModalities.watch.video_url.includes('youtube.com') || currentModalities.watch.video_url.includes('youtu.be')) ? (
              <div className="w-full aspect-video rounded-lg overflow-hidden shadow-2xl bg-black">
                <iframe
                  src={currentModalities.watch.video_url}
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
                className="w-full h-auto rounded-lg shadow-2xl"
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
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[100] p-8">
          <div className="relative w-full max-w-2xl bg-gradient-to-br from-[#0a1628] via-[#0f1c2e] to-[#0a1628] rounded-2xl border border-qripto-cyan/20 shadow-[0_0_80px_rgba(0,196,255,0.15)] p-8">
            <button 
              onClick={() => setActiveMode(null)} 
              className="absolute top-4 right-4 text-qripto-cyan hover:text-white text-3xl transition-colors leading-none"
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
    </DrawerLayer>
  );
}
