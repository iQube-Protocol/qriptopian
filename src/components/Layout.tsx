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

export function Layout({ children }: { children: React.ReactNode }) {
  const [activeDomain, setActiveDomain] = useState<Domain | null>(null);

  const handleDomainClick = (domain: Domain) => {
    setActiveDomain(activeDomain === domain ? null : domain);
  };

  return (
    <div className="flex h-screen bg-[#020818]">
      <TopHeader />
      
      <div className="flex w-full pt-[88px]">
        <MoneyPennyNav activeDomain={activeDomain} onDomainClick={handleDomainClick} />
        
        <main className="flex-1 overflow-hidden px-6 pb-6">
          {children}
        </main>
      </div>

      {/* Domain Drawers */}
      <SignalsDrawer isOpen={activeDomain === 'signals'} onClose={() => setActiveDomain(null)} />
      <MythosDrawer isOpen={activeDomain === 'mythos'} onClose={() => setActiveDomain(null)} />
      <LogosDrawer isOpen={activeDomain === 'logos'} onClose={() => setActiveDomain(null)} />
      <MarketsDrawer isOpen={activeDomain === 'markets'} onClose={() => setActiveDomain(null)} />
      <BuildersDrawer isOpen={activeDomain === 'builders'} onClose={() => setActiveDomain(null)} />
      <CityDrawer isOpen={activeDomain === 'city'} onClose={() => setActiveDomain(null)} />
      <DispatchesDrawer isOpen={activeDomain === 'dispatches'} onClose={() => setActiveDomain(null)} />
    </div>
  );
}
