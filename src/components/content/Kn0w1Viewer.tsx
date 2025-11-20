import { useState } from "react";
import { Play, BookOpen, Maximize2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ContentItem {
  id: string;
  title: string;
  image: string;
  badge?: string;
}

interface Kn0w1ViewerProps {
  items: ContentItem[];
  domain: string;
}

export function Kn0w1Viewer({ items, domain }: Kn0w1ViewerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mode, setMode] = useState<'read' | 'watch'>('watch');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const activeItem = items[activeIndex];

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 z-10 text-white hover:text-cyan-400 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={activeItem.image}
            alt={activeItem.title}
            className="max-w-full max-h-full object-contain"
          />
          
          {/* Fullscreen Controls */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="bg-black/50 hover:bg-black/70 text-white"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <div className="bg-black/50 px-4 py-2 rounded-lg text-white text-sm">
              {activeIndex + 1} / {items.length}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="bg-black/50 hover:bg-black/70 text-white"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Hero Section */}
      <div className="flex h-[60vh]">
        {/* Left Hero - Original Size */}
        <div className="relative flex-1 bg-gradient-to-b from-purple-900 via-blue-900 to-black">
          <img
            src={activeItem.image}
            alt={activeItem.title}
            className="w-full h-full object-cover opacity-80"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          
          {/* Badge */}
          {activeItem.badge && (
            <div className="absolute top-4 right-4 px-2 py-1 bg-cyan-500/20 border border-cyan-500 rounded text-xs text-cyan-400">
              {activeItem.badge}
            </div>
          )}
          
          {/* Play Button Center */}
          <button 
            onClick={() => setIsFullscreen(true)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-cyan-500/30 border-2 border-cyan-400 flex items-center justify-center group hover:scale-110 transition-all"
          >
            <Play className="h-6 w-6 text-cyan-400 ml-1" fill="currentColor" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="absolute top-4 left-4 p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-colors"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
          
          {/* Title and Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-3">
              {activeItem.title}
            </h2>
            
            <div className="flex gap-2">
              <Button
                onClick={() => setMode('read')}
                variant={mode === 'read' ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  "gap-2",
                  mode === 'read' 
                    ? "bg-cyan-500 hover:bg-cyan-600 text-white" 
                    : "border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                )}
              >
                <BookOpen className="h-3 w-3" />
                Read
              </Button>
              <Button
                onClick={() => setMode('watch')}
                variant={mode === 'watch' ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  "gap-2",
                  mode === 'watch' 
                    ? "bg-cyan-500 hover:bg-cyan-600 text-white" 
                    : "border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                )}
              >
                <Play className="h-3 w-3" />
                Watch
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
              >
                <Play className="h-3 w-3" />
                Listen
              </Button>
            </div>
          </div>
        </div>

        {/* Right Hero - Double Width */}
        <div className="relative flex-[2] bg-gradient-to-b from-purple-900 via-blue-900 to-black">
          <img
            src={activeItem.image}
            alt={activeItem.title}
            className="w-full h-full object-cover opacity-80"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          
          {/* Play Button Center */}
          <button 
            onClick={() => setIsFullscreen(true)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-cyan-500/30 border-2 border-cyan-400 flex items-center justify-center group hover:scale-110 transition-all"
          >
            <Play className="h-10 w-10 text-cyan-400 ml-1" fill="currentColor" />
          </button>
          
          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              {activeItem.title}
            </h2>
          </div>
        </div>
      </div>

      {/* Featured Content Carousel */}
      <div className="relative px-8 py-6 bg-[#0a1628]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-white">Featured Content</h3>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {items.slice(0, 3).map((item, index) => (
            <button
              key={item.id}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative aspect-[3/2] rounded-lg overflow-hidden group cursor-pointer transition-all",
                activeIndex === index 
                  ? "ring-2 ring-cyan-400 scale-105" 
                  : "hover:scale-105"
              )}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              {item.badge && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-orange-500/20 border border-orange-500 rounded text-xs text-orange-400">
                  {item.badge}
                </div>
              )}
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-xs font-medium text-white line-clamp-2">{item.title}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
