import { Zap, BookOpen, Droplets, Code2, TrendingUp, Settings, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type Domain = 'signals' | 'pennydrops' | 'kn0wdz' | 'knytrise' | 'staybull';

interface QriptopianNavProps {
  activeDomain: Domain | null;
  onDomainClick: (domain: Domain) => void;
  onAIClick: () => void;
}

const domains = [{
  id: 'signals' as Domain,
  icon: Zap,
  label: 'Signals'
}, {
  id: 'pennydrops' as Domain,
  icon: Droplets,
  label: 'Penny Drops'
}, {
  id: 'knytrise' as Domain,
  icon: BookOpen,
  label: 'KNYT Scrolls'
}, {
  id: 'kn0wdz' as Domain,
  icon: Code2,
  label: 'Kn0wdZ'
}, {
  id: 'staybull' as Domain,
  icon: TrendingUp,
  label: 'StayBull'
}];

const navItems = [
  ...domains,
  {
    id: 'settings' as const,
    icon: Settings,
    label: 'Settings'
  }
];

export function QriptopianNav({
  activeDomain,
  onDomainClick,
  onAIClick
}: QriptopianNavProps) {
  return <TooltipProvider delayDuration={0}>
      <aside className="fixed right-0 top-1/2 -translate-y-1/2 w-16 flex flex-col items-center py-6 z-50">
        {/* Navigation Icons */}
        <nav className="flex flex-col gap-2 w-full px-2">
        {navItems
            .filter(item => !['signals', 'staybull', 'settings'].includes(item.id))
            .map(item => {
          const Icon = item.icon;
          const isActive = activeDomain === item.id;
          const isSettings = item.id === 'settings';
          
          return <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button 
                    onClick={() => !isSettings && onDomainClick(item.id as Domain)} 
                    className={cn("w-full h-12 rounded-lg flex items-center justify-center transition-all relative group", isActive ? "bg-cyan-500/20 text-cyan-400" : "text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10")}
                  >
                    {isActive && !isSettings && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r" />}
                    <Icon className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="bg-[#071327] text-[#d0f6ff] border-[#1e2b40]">
                  {item.label}
                </TooltipContent>
              </Tooltip>;
        })}
          
          {/* AI Assistant Icon */}
          <div className="mt-4 pt-4 border-t border-[#1e2b40]">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onAIClick}
                  className="w-full h-12 rounded-lg flex items-center justify-center transition-all text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10"
                >
                  <Bot className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" className="bg-[#071327] text-[#d0f6ff] border-[#1e2b40]">
                AI Assistant
              </TooltipContent>
            </Tooltip>
          </div>
        </nav>
      </aside>
    </TooltipProvider>;
}
