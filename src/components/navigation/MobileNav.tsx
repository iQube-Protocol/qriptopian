import { X, Droplets, Code2, BookOpen, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Domain } from "./QriptopianNav";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  activeDomain: Domain | null;
  onDomainClick: (domain: Domain) => void;
  onAIClick: () => void;
}

const domains = [
  { id: 'pennydrops' as Domain, icon: Droplets, label: 'Penny Drops', description: 'Q¢ use cases' },
  { id: 'scrolls' as Domain, icon: BookOpen, label: 'Scrolls', description: 'Stories & comics' },
  { id: 'kn0wdz' as Domain, icon: Code2, label: 'Kn0wdZ', description: 'Knowledge base' }
];

export function MobileNav({ isOpen, onClose, activeDomain, onDomainClick, onAIClick }: MobileNavProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
        onClick={onClose}
      />
      
      {/* Mobile Menu */}
      <div className="fixed inset-y-0 right-0 w-[280px] bg-[#0a1628] border-l border-[#1a2942] z-[70] md:hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1a2942]">
          <h2 className="text-lg font-bold text-cyan-400">Navigation</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-cyan-400"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {domains.map((domain) => {
              const Icon = domain.icon;
              const isActive = activeDomain === domain.id;
              
              return (
                <button
                  key={domain.id}
                  onClick={() => {
                    onDomainClick(domain.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 p-4 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                      : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{domain.label}</div>
                    <div className="text-xs opacity-70">{domain.description}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* AI Assistant */}
          <div className="mt-6 pt-6 border-t border-[#1a2942]">
            <button
              onClick={() => {
                onAIClick();
                onClose();
              }}
              className="w-full flex items-center gap-3 p-4 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
            >
              <Bot className="h-5 w-5 flex-shrink-0" />
              <div className="flex-1 text-left">
                <div className="font-medium">AI Assistant</div>
                <div className="text-xs opacity-70">Chat & support</div>
              </div>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
