import { useState } from "react";
import { BookOpen, X, RotateCcw, ChevronRight, ChevronLeft, Eye, Play, Headphones, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
interface ContentItem {
  id: string;
  title: string;
  image: string;
  badge?: string;
}
interface SmartAction {
  type: 'read' | 'watch' | 'listen' | 'view' | 'share';
  enabled: boolean;
}
interface Kn0w1ViewerProps {
  items: ContentItem[];
  domain: string;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  onModeChange?: (mode: 'read' | 'watch' | 'listen') => void;
  hideActionIcons?: boolean;
  smartActions?: SmartAction[];
}
const smartActionIcon: Record<string, typeof BookOpen> = {
  read: BookOpen,
  watch: Play,
  listen: Headphones,
  view: Eye,
  share: Share2,
};

export function Kn0w1Viewer({
  items,
  domain,
  onFullscreenChange,
  onModeChange,
  hideActionIcons = false,
  smartActions
}: Kn0w1ViewerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mode, setMode] = useState<'read' | 'watch' | 'listen'>('watch');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreenToggle = (value: boolean) => {
    setIsFullscreen(value);
    onFullscreenChange?.(value);
  };
  const activeItem = items[activeIndex];
  const handlePrevious = () => {
    setActiveIndex(prev => prev === 0 ? items.length - 1 : prev - 1);
  };
  const handleNext = () => {
    setActiveIndex(prev => prev === items.length - 1 ? 0 : prev + 1);
  };
  if (isFullscreen) {
    return <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4">
        {/* Media player sub menu - repositioned for mobile */}
        <div className="absolute top-4 right-4 md:right-24 z-10 flex md:flex-col gap-3">
          <button onClick={() => handleFullscreenToggle(false)} className="w-10 h-10 md:w-auto md:h-auto flex items-center justify-center text-white hover:text-cyan-400 transition-colors bg-black/50 md:bg-transparent rounded-full">
            <X className="h-5 w-5 md:h-6 md:w-6" />
          </button>
          <button onClick={() => setActiveIndex(activeIndex)} className="w-10 h-10 md:w-auto md:h-auto flex items-center justify-center text-white hover:text-cyan-400 transition-colors bg-black/50 md:bg-transparent rounded-full">
            <RotateCcw className="h-4 w-4" />
          </button>
          <button onClick={handleNext} className="w-10 h-10 md:w-auto md:h-auto flex items-center justify-center text-white hover:text-cyan-400 transition-colors bg-black/50 md:bg-transparent rounded-full">
            <ChevronRight className="h-4 w-4" />
          </button>
          <button onClick={handlePrevious} className="w-10 h-10 md:w-auto md:h-auto flex items-center justify-center text-white hover:text-cyan-400 transition-colors bg-black/50 md:bg-transparent rounded-full">
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
        
        <div className="relative w-full h-full flex items-center justify-center">
          <img src={activeItem.image} alt={activeItem.title} className="max-w-full max-h-full object-contain" />
          
          {/* Fullscreen Dot Navigation */}
          <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-3">
            {items.map((item, index) => <button key={item.id} onClick={() => setActiveIndex(index)} className={cn("transition-all rounded-full", activeIndex === index ? "w-8 md:w-12 h-2 md:h-3 bg-cyan-400" : "w-2 md:w-3 h-2 md:h-3 bg-white/50 hover:bg-white/70")} aria-label={`Go to ${item.title}`} />)}
          </div>
        </div>
      </div>;
  }
  return <div className="h-full">
      {/* Hero Image */}
      <div className="relative h-[300px] md:h-[400px] bg-gradient-to-b from-purple-900 via-blue-900 to-black rounded-lg overflow-hidden">
        <img src={activeItem.image} alt={activeItem.title} className="w-full h-full object-cover opacity-80" />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        {/* Top Right - Action Icons */}
        {!hideActionIcons && smartActions && smartActions.length > 0 && (
          <div className="absolute top-4 right-4 md:top-6 md:right-6 flex gap-2">
            {smartActions.filter(a => a.enabled).map((action) => {
              const Icon = smartActionIcon[action.type] || Eye;
              return (
                <button
                  key={action.type}
                  onClick={() => {
                    if (action.type === 'view') {
                      handleFullscreenToggle(true);
                    } else if (action.type === 'share') {
                      // Share handled externally
                    } else {
                      onModeChange?.(action.type as 'read' | 'watch' | 'listen');
                    }
                  }}
                  className="w-8 h-8 flex items-center justify-center text-cyan-400 hover:text-cyan-300 transition-colors bg-black/50 rounded-full"
                  aria-label={action.type.charAt(0).toUpperCase() + action.type.slice(1)}
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              );
            })}
          </div>
        )}
        {/* Legacy fallback: show view icon if no smartActions provided and not hidden */}
        {!hideActionIcons && !smartActions && (
          <div className="absolute top-4 right-4 md:top-6 md:right-6 flex gap-2">
            <button onClick={() => handleFullscreenToggle(true)} className="w-8 h-8 flex items-center justify-center text-cyan-400 hover:text-cyan-300 transition-colors bg-black/50 rounded-full" aria-label="View">
              <Eye className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
        
        {/* Bottom Left - Title */}
        <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 max-w-[80%]">
          <h2 className="text-base md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 truncate w-full">
            {activeItem.title}
          </h2>
        </div>
      </div>
    </div>;
}