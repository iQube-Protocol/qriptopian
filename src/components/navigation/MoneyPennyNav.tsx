import { Zap, BookOpen, Cog, DollarSign, Wrench, Building2, Mail, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type Domain = 'signals' | 'mythos' | 'logos' | 'markets' | 'builders' | 'city' | 'dispatches';

interface MoneyPennyNavProps {
  activeDomain: Domain | null;
  onDomainClick: (domain: Domain) => void;
}

const domains = [
  { id: 'signals' as Domain, icon: Zap, label: 'Signals' },
  { id: 'mythos' as Domain, icon: BookOpen, label: 'Mythos' },
  { id: 'logos' as Domain, icon: Cog, label: 'Logos' },
  { id: 'markets' as Domain, icon: DollarSign, label: 'Markets' },
  { id: 'builders' as Domain, icon: Wrench, label: 'Builders' },
  { id: 'city' as Domain, icon: Building2, label: 'City' },
  { id: 'dispatches' as Domain, icon: Mail, label: 'Dispatches' },
];

export function MoneyPennyNav({ activeDomain, onDomainClick }: MoneyPennyNavProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <aside className="fixed left-0 top-0 bottom-0 w-16 bg-[#0a1628] border-r border-[#1a2942] flex flex-col items-center py-6 z-50">
        {/* Logo */}
        <div className="mb-8 cursor-pointer group">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg transition-transform group-hover:scale-110">
            Q
          </div>
        </div>

        {/* Navigation Icons */}
        <nav className="flex-1 flex flex-col gap-2 w-full px-2">
          {domains.map((domain) => {
            const Icon = domain.icon;
            const isActive = activeDomain === domain.id;
            
            return (
              <Tooltip key={domain.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onDomainClick(domain.id)}
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
                <TooltipContent side="right" className="bg-[#1a2942] text-white border-[#2a3952]">
                  {domain.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* Bottom Settings */}
        <div className="w-full px-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="w-full h-12 rounded-lg flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all">
                <Settings className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-[#1a2942] text-white border-[#2a3952]">
              Settings
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}
