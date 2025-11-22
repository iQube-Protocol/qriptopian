import { useState } from "react";
import { QriptopianNav, Domain } from "@/components/navigation/QriptopianNav";
import { TopHeader } from "@/components/navigation/TopHeader";
import { SignalsDrawer } from "@/components/navigation/drawers/SignalsDrawer";
import { PennyDropsDrawer } from "@/components/navigation/drawers/PennyDropsDrawer";
import { Kn0wdZDrawer } from "@/components/navigation/drawers/Kn0wdZDrawer";
import { KnytRiseDrawer } from "@/components/navigation/drawers/KnytRiseDrawer";
import { StayBullDrawer } from "@/components/navigation/drawers/StayBullDrawer";
import { AigentDrawer } from "@/components/navigation/drawers/AigentDrawer";
import { MetaAvatarProvider, useMetaAvatar } from "@/contexts/MetaAvatarContext";
import { MetaAvatar } from "@/components/MetaAvatar";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [activeDomain, setActiveDomain] = useState<Domain | null>(null);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const { avatarInitialized, activeContainer, avatarRefreshKey } = useMetaAvatar();

  const handleDomainClick = (domain: Domain) => {
    setActiveDomain(activeDomain === domain ? null : domain);
  };

  return (
    <div className="flex h-screen bg-[#020818]">
      <TopHeader />
      
      <div className="flex w-full pt-[88px]">
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>

      <QriptopianNav 
        activeDomain={activeDomain} 
        onDomainClick={handleDomainClick}
        onAIClick={() => setIsAIOpen(true)}
      />

      {/* Domain Drawers */}
      <SignalsDrawer isOpen={activeDomain === 'signals'} onClose={() => setActiveDomain(null)} />
      <PennyDropsDrawer isOpen={activeDomain === 'pennydrops'} onClose={() => setActiveDomain(null)} />
      <Kn0wdZDrawer isOpen={activeDomain === 'kn0wdz'} onClose={() => setActiveDomain(null)} />
      <KnytRiseDrawer isOpen={activeDomain === 'knytrise'} onClose={() => setActiveDomain(null)} />
      <StayBullDrawer isOpen={activeDomain === 'staybull'} onClose={() => setActiveDomain(null)} />
      
      {/* Aigent Drawer */}
      <AigentDrawer isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />

      {/* Global Persistent MetaAvatar */}
      {avatarInitialized && (
        <div 
          className={`fixed transition-all duration-300 border-2 border-red-500 ${
            activeContainer === 'aigent' 
              ? 'right-[80px] top-[172px] w-[calc(100vw-160px)] h-[calc(100vh-172px)] opacity-100 z-[110]' 
              : activeContainer === 'pennydrops'
              ? 'right-[120px] top-[288px] w-[340px] h-[284px] opacity-100 z-[110]'
              : 'opacity-0 pointer-events-none -z-10'
          }`}
        >
          {activeContainer === 'aigent' && (
            <div className="h-full w-full p-6">
              <div className="h-full w-full rounded-lg border border-border/30 bg-muted/10 overflow-hidden">
                <MetaAvatar key={`aigent-${avatarRefreshKey}`} />
              </div>
            </div>
          )}
          {activeContainer === 'pennydrops' && (
            <div className="h-full w-full">
              <MetaAvatar key={`pennydrops-${avatarRefreshKey}`} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <MetaAvatarProvider>
      <LayoutContent>{children}</LayoutContent>
    </MetaAvatarProvider>
  );
}
