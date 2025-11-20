import { useState } from "react";
import { Zap, BookOpen, Cog, DollarSign, Wrench, Building2, Mail, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type Domain = 'signals' | 'mythos' | 'logos' | 'markets' | 'builders' | 'city' | 'dispatches' | 'profile' | 'settings';

interface IconBarProps {
  activeDomain: Domain | null;
  onDomainClick: (domain: Domain) => void;
}

const domains = [
  { id: 'signals' as Domain, icon: Zap, label: 'Signals', color: 'text-cyan-500' },
  { id: 'mythos' as Domain, icon: BookOpen, label: 'Mythos', color: 'text-purple-500' },
  { id: 'logos' as Domain, icon: Cog, label: 'Logos', color: 'text-blue-500' },
  { id: 'markets' as Domain, icon: DollarSign, label: 'Markets', color: 'text-green-500' },
  { id: 'builders' as Domain, icon: Wrench, label: 'Builders', color: 'text-orange-500' },
  { id: 'city' as Domain, icon: Building2, label: 'City', color: 'text-yellow-500' },
  { id: 'dispatches' as Domain, icon: Mail, label: 'Dispatches', color: 'text-pink-500' },
];

const systemItems = [
  { id: 'profile' as Domain, icon: User, label: 'Profile' },
  { id: 'settings' as Domain, icon: Settings, label: 'Settings' },
];

export function IconBar({ activeDomain, onDomainClick }: IconBarProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="fixed left-0 top-0 bottom-0 w-14 bg-[#0f1729] border-r border-white/5 flex flex-col items-center py-4 z-50">
        {/* Logo */}
        <div className="mb-6">
          <div className="h-8 w-8 rounded bg-gradient-to-br from-primary to-secondary" />
        </div>

        {/* Primary Domains */}
        <div className="flex-1 flex flex-col gap-2">
          {domains.map((domain) => {
            const Icon = domain.icon;
            const isActive = activeDomain === domain.id;
            
            return (
              <Tooltip key={domain.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onDomainClick(domain.id)}
                    className={cn(
                      "relative w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                      "hover:bg-white/5",
                      isActive && "bg-white/10",
                      isActive && domain.color,
                      !isActive && "text-white/60 hover:text-white/90"
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-current rounded-r" />
                    )}
                    <Icon className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-surface border-white/10">
                  {domain.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* System Items */}
        <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
          {systemItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeDomain === item.id;
            
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onDomainClick(item.id)}
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                      "hover:bg-white/5",
                      isActive && "bg-white/10 text-cyan-500",
                      !isActive && "text-white/60 hover:text-white/90"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-surface border-white/10">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
