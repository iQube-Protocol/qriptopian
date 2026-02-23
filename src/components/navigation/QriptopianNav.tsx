import { Zap, BookOpen, Droplets, Code2, TrendingUp, Settings, Bot, Wallet, Library } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type Domain = 'signals' | 'pennydrops' | 'kn0wdz' | 'scrolls' | 'staybull' | 'wallet' | 'codex';

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
  id: 'scrolls' as Domain,
  icon: BookOpen,
  label: 'Scrolls'
}, {
  id: 'kn0wdz' as Domain,
  icon: Code2,
  label: 'Kn0wdZ'
}, {
  id: 'staybull' as Domain,
  icon: TrendingUp,
  label: 'StayBull'
}, {
  id: 'wallet' as Domain,
  icon: Wallet,
  label: 'SmartWallet'
}, {
  id: 'codex' as Domain,
  icon: Library,
  label: 'KNYT Codex'
}];

const topDomains = domains.filter(d => ['pennydrops', 'scrolls', 'kn0wdz'].includes(d.id));
const bottomDomains = domains.filter(d => ['codex', 'wallet'].includes(d.id));

export function QriptopianNav({
  activeDomain,
  onDomainClick,
  onAIClick
}: QriptopianNavProps) {
  const renderButton = (item: typeof domains[0]) => {
    const Icon = item.icon;
    const isActive = activeDomain === item.id;
    return (
      <Tooltip key={item.id}>
        <TooltipTrigger asChild>
          <button 
            onClick={() => onDomainClick(item.id)} 
            className={cn(
              "w-full h-12 rounded-lg flex items-center justify-center transition-all relative group",
              isActive 
                ? "bg-cyan-500/20 text-cyan-400" 
                : "text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10"
            )}
          >
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r" />
            )}
            <Icon className="h-5 w-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-[#071327] text-[#d0f6ff] border-[#1e2b40]">
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="hidden md:flex fixed right-[2px] top-1/2 -translate-y-1/2 w-14 flex-col items-center py-6 z-50 pointer-events-auto">
        <nav className="flex flex-col gap-1 w-full px-1">
          {topDomains.map(renderButton)}
          
          {/* Divider */}
          <div className="my-2 mx-2 border-t border-border/30" />

          {/* Bottom group: Codex, SmartWallet, AI */}
          {bottomDomains.map(renderButton)}

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
        </nav>
      </aside>
    </TooltipProvider>
  );
}
