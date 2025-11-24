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
                      className="cursor-pointer relative group"
                    >
                      <Kn0w1Viewer items={[item]} domain="knytrise" />
                      
                      {/* Modality Buttons Overlay */}
                      {content.length > 0 && content[index] && (
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          {contentService.hasModality(content[index], 'read') && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItemIndex(index);
                                setActiveMode('read');
                              }}
                              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/80 hover:bg-black border border-cyan-500/30 hover:border-cyan-500 flex items-center justify-center transition-all hover:scale-110"
                              title="Read"
                            >
                              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                            </button>
                          )}
                          {contentService.hasModality(content[index], 'watch') && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItemIndex(index);
                                setActiveMode('watch');
                              }}
                              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/80 hover:bg-black border border-cyan-500/30 hover:border-cyan-500 flex items-center justify-center transition-all hover:scale-110 animate-pulse"
                              title="Watch"
                            >
                              <Play className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                            </button>
                          )}
                          {contentService.hasModality(content[index], 'listen') && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItemIndex(index);
                                setActiveMode('listen');
                              }}
                              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/80 hover:bg-black border border-cyan-500/30 hover:border-cyan-500 flex items-center justify-center transition-all hover:scale-110"
                              title="Listen"
                            >
                              <Headphones className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                            </button>
                          )}
                        </div>
                      )}
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
                className="text-white hover:text-cyan-400 text-2xl bg-black/90 hover:bg-black rounded-full w-14 h-14 border-2 border-white/20 hover:border-cyan-400 flex items-center justify-center transition-all hover:scale-110 shadow-xl ml-4"
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

      {/* Watch Modal */}
      {activeMode === 'watch' && currentContent && currentModalities?.watch && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-4 sm:p-8">
          <div className="relative w-full max-w-7xl max-h-[90vh]">
            <button 
              onClick={() => setActiveMode(null)} 
              className="absolute top-4 right-4 text-white hover:text-cyan-400 text-2xl bg-black/90 hover:bg-black rounded-full w-14 h-14 border-2 border-white/20 hover:border-cyan-400 flex items-center justify-center z-10 transition-all hover:scale-110 shadow-xl"
            >
              ×
            </button>
            {(currentModalities.watch.video_url.includes('youtube.com') || currentModalities.watch.video_url.includes('youtu.be')) ? (
              <div className="w-full aspect-video rounded-lg overflow-hidden shadow-2xl bg-black max-h-[85vh]">
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
                className="w-full max-h-[85vh] rounded-lg shadow-2xl"
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
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[100] p-4 sm:p-8">
          <div className="relative w-full max-w-2xl bg-gradient-to-br from-[#0a1628] via-[#0f1c2e] to-[#0a1628] rounded-2xl border border-qripto-cyan/20 shadow-[0_0_80px_rgba(0,196,255,0.15)] p-8">
            <button 
              onClick={() => setActiveMode(null)} 
              className="absolute top-4 right-4 text-white hover:text-cyan-400 text-2xl bg-black/90 hover:bg-black rounded-full w-14 h-14 border-2 border-white/20 hover:border-cyan-400 flex items-center justify-center transition-all hover:scale-110 shadow-xl"
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
