import { DrawerLayer } from "../DrawerLayer";
import { Kn0w1Viewer } from "@/components/content/Kn0w1Viewer";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { Maximize2, BookOpen, Play, Headphones } from "lucide-react";
import { contentService, type Content, ContentModalities } from "@/services/contentService";
import { ArticleRenderer } from "@/components/content/ArticleRenderer";

interface StayBullDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StayBullDrawer({ isOpen, onClose }: StayBullDrawerProps) {
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
        const data = await contentService.getContentBySection('staybull');
        setContent(data);
      } catch (error) {
        console.error('Error loading StayBull content:', error);
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
        badge: item.type?.toUpperCase() || 'BULL'
      }))
    : [];

  const featureItems = displayContent.slice(0, 3);
  const thumbnailContent = displayContent.slice(3);
  const currentContent = content[selectedItemIndex];
  const currentModalities = currentContent?.modalities as ContentModalities | null;

  return (
    <DrawerLayer
      isOpen={isOpen}
      onClose={onClose}
      title="StayBull"
      subtitle="Investment Upside & Growth Opportunities"
      columns={3}
      tabs={tabs}
    >
      {loading ? (
        <div className="col-span-full flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading content...</div>
        </div>
      ) : content.length === 0 ? (
        <div className="col-span-full flex items-center justify-center py-12">
          <div className="text-muted-foreground">No content available</div>
        </div>
      ) : (
        <>
          {/* 3-column grid of Kn0w1Viewer cards */}
          <div className="col-span-full">
            <div className="grid grid-cols-3 gap-6">
              {featureItems.map((item, index) => (
                <div key={item.id} className="relative group">
                  <Kn0w1Viewer items={[item]} domain="staybull" />
                  {/* Modality Buttons Overlay */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    {contentService.hasModality(content[index], 'read') && (
                      <button
                        onClick={() => {
                          setSelectedItemIndex(index);
                          setActiveMode('read');
                        }}
                        className="w-12 h-12 rounded-full bg-black/80 hover:bg-black border border-cyan-500/30 hover:border-cyan-500 flex items-center justify-center transition-all hover:scale-110"
                        title="Read"
                      >
                        <BookOpen className="w-5 h-5 text-cyan-400" />
                      </button>
                    )}
                    {contentService.hasModality(content[index], 'watch') && (
                      <button
                        onClick={() => {
                          setSelectedItemIndex(index);
                          setActiveMode('watch');
                        }}
                        className="w-12 h-12 rounded-full bg-black/80 hover:bg-black border border-cyan-500/30 hover:border-cyan-500 flex items-center justify-center transition-all hover:scale-110"
                        title="Watch"
                      >
                        <Play className="w-5 h-5 text-cyan-400" />
                      </button>
                    )}
                    {contentService.hasModality(content[index], 'listen') && (
                      <button
                        onClick={() => {
                          setSelectedItemIndex(index);
                          setActiveMode('listen');
                        }}
                        className="w-12 h-12 rounded-full bg-black/80 hover:bg-black border border-cyan-500/30 hover:border-cyan-500 flex items-center justify-center transition-all hover:scale-110"
                        title="Listen"
                      >
                        <Headphones className="w-5 h-5 text-cyan-400" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Full-width thumbnail carousel */}
          {thumbnailContent.length > 0 && (
            <div className="col-span-full border-t border-border/30 pt-6 mt-6">
              <Carousel
                className="w-full"
                opts={{
                  align: "start",
                  dragFree: true
                }}
                plugins={[WheelGesturesPlugin()]}
              >
                <CarouselContent className="-ml-4">
                  {thumbnailContent.map((item, index) => {
                    const contentIndex = index + 3; // +3 because first 3 items are features
                    return (
                      <CarouselItem key={item.id} className="basis-1/5 pl-4">
                        <div className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          {/* Action Menu */}
                          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {contentService.hasModality(content[contentIndex], 'read') && (
                              <button 
                                onClick={() => {
                                  setSelectedItemIndex(contentIndex);
                                  setActiveMode('read');
                                }}
                                className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors" 
                                aria-label="Read"
                              >
                                <BookOpen className="h-3 w-3" />
                              </button>
                            )}
                            {contentService.hasModality(content[contentIndex], 'watch') && (
                              <button 
                                onClick={() => {
                                  setSelectedItemIndex(contentIndex);
                                  setActiveMode('watch');
                                }}
                                className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors" 
                                aria-label="Watch"
                              >
                                <Play className="h-3 w-3" />
                              </button>
                            )}
                            {contentService.hasModality(content[contentIndex], 'listen') && (
                              <button 
                                onClick={() => {
                                  setSelectedItemIndex(contentIndex);
                                  setActiveMode('listen');
                                }}
                                className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors" 
                                aria-label="Listen"
                              >
                                <Headphones className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                          </div>
                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
              </Carousel>
            </div>
          )}
        </>
      )}

      {/* Read Modal */}
      {activeMode === 'read' && currentModalities?.read && (
        <ArticleRenderer
          content={currentModalities.read.text}
          title={currentContent?.title}
          excerpt={currentContent?.excerpt}
          duration={currentModalities.read.duration}
        />
      )}

      {/* Watch Modal */}
      {activeMode === 'watch' && currentContent && currentModalities?.watch && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[9999] p-4 sm:p-8">
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
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[9999] p-4 sm:p-8">
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
