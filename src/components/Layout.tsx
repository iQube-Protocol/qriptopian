import { useState } from "react";
import { MoneyPennyNav, Domain } from "@/components/navigation/MoneyPennyNav";
import { TopHeader } from "@/components/navigation/TopHeader";
import { SignalsDrawer } from "@/components/navigation/drawers/SignalsDrawer";
import { MythosDrawer } from "@/components/navigation/drawers/MythosDrawer";
import { LogosDrawer } from "@/components/navigation/drawers/LogosDrawer";
import { MarketsDrawer } from "@/components/navigation/drawers/MarketsDrawer";
import { BuildersDrawer } from "@/components/navigation/drawers/BuildersDrawer";
import { CityDrawer } from "@/components/navigation/drawers/CityDrawer";
import { DispatchesDrawer } from "@/components/navigation/drawers/DispatchesDrawer";
import { AIOverlay } from "@/components/AIOverlay";

export function Layout({ children }: { children: React.ReactNode }) {
  const [activeDomain, setActiveDomain] = useState<Domain | null>(null);
  const [isAIOpen, setIsAIOpen] = useState(false);

  const handleDomainClick = (domain: Domain) => {
    setActiveDomain(activeDomain === domain ? null : domain);
  };

  return (
    <div className="flex h-screen bg-[#020818]">
      <TopHeader />
      
      <div className="flex w-full pt-[88px]">
        <main className="flex-1 overflow-hidden pr-8">
          {children}
        </main>
      </div>

      <MoneyPennyNav 
        activeDomain={activeDomain} 
        onDomainClick={handleDomainClick}
        onAIClick={() => setIsAIOpen(true)}
      />

      {/* Domain Drawers */}
      <SignalsDrawer isOpen={activeDomain === 'signals'} onClose={() => setActiveDomain(null)} />
      <MythosDrawer isOpen={activeDomain === 'mythos'} onClose={() => setActiveDomain(null)} />
      <LogosDrawer isOpen={activeDomain === 'logos'} onClose={() => setActiveDomain(null)} />
      <MarketsDrawer isOpen={activeDomain === 'markets'} onClose={() => setActiveDomain(null)} />
      <BuildersDrawer isOpen={activeDomain === 'builders'} onClose={() => setActiveDomain(null)} />
      <CityDrawer isOpen={activeDomain === 'city'} onClose={() => setActiveDomain(null)} />
      <DispatchesDrawer isOpen={activeDomain === 'dispatches'} onClose={() => setActiveDomain(null)} />
      
      {/* AI Overlay */}
      <AIOverlay isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
}
