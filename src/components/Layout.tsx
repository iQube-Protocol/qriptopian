import { useState } from "react";
import { QriptopianNav, Domain } from "@/components/navigation/QriptopianNav";
import { MobileNav } from "@/components/navigation/MobileNav";
import { TopHeader } from "@/components/navigation/TopHeader";
import { SignalsDrawer } from "@/components/navigation/drawers/SignalsDrawer";
import { PennyDropsDrawer } from "@/components/navigation/drawers/PennyDropsDrawer";
import { Kn0wdZDrawer } from "@/components/navigation/drawers/Kn0wdZDrawer";
import { ScrollsDrawer } from "@/components/navigation/drawers/KnytRiseDrawer";
import { StayBullDrawer } from "@/components/navigation/drawers/StayBullDrawer";
import { AigentDrawer } from "@/components/navigation/drawers/AigentDrawer";
import { MetaAvatarProvider, useMetaAvatar } from "@/contexts/MetaAvatarContext";
import { MetaAvatar } from "@/components/MetaAvatar";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [activeDomain, setActiveDomain] = useState<Domain | null>(null);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { avatarInitialized, activeContainer, avatarRefreshKey } = useMetaAvatar();

  const handleDomainClick = (domain: Domain) => {
    setActiveDomain(activeDomain === domain ? null : domain);
  };

  return (
    <div className="flex h-screen bg-[#020818]">
      <TopHeader onMobileMenuClick={() => setIsMobileNavOpen(true)} />
      
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

      <MobileNav 
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        activeDomain={activeDomain}
        onDomainClick={handleDomainClick}
        onAIClick={() => setIsAIOpen(true)}
      />

      {/* Domain Drawers */}
      <SignalsDrawer isOpen={activeDomain === 'signals'} onClose={() => setActiveDomain(null)} />
      <PennyDropsDrawer isOpen={activeDomain === 'pennydrops'} onClose={() => setActiveDomain(null)} />
      <Kn0wdZDrawer isOpen={activeDomain === 'kn0wdz'} onClose={() => setActiveDomain(null)} />
      <ScrollsDrawer isOpen={activeDomain === 'scrolls'} onClose={() => setActiveDomain(null)} />
      <StayBullDrawer isOpen={activeDomain === 'staybull'} onClose={() => setActiveDomain(null)} />
      
      {/* Aigent Drawer */}
      <AigentDrawer isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />

      {/* Global Persistent MetaAvatar */}
      {avatarInitialized && (
        <div 
          className={`fixed transition-all duration-300 ${
            activeContainer === 'aigent' 
              ? 'hidden md:block right-[80px] top-[172px] w-[calc(100vw-160px)] h-[calc(100vh-172px)] opacity-100 z-[100]' 
              : activeContainer === 'pennydrops'
              ? 'block inset-x-0 top-[88px] h-[200px] md:right-[92px] md:top-[216px] md:left-auto md:inset-x-auto md:w-[calc((100vw-92px)/3-40px)] md:h-[400px] opacity-100 z-[100] md:rounded-lg overflow-hidden'
              : 'opacity-0 pointer-events-none -z-10'
          }`}
        >
          <div className={`h-full w-full ${activeContainer === 'aigent' ? 'p-6' : 'p-0'}`}>
            <div className={`h-full w-full overflow-hidden ${activeContainer === 'aigent' ? 'rounded-lg border border-border/30 bg-muted/10' : ''}`}>
              <MetaAvatar key={avatarRefreshKey} />
            </div>
          </div>
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
