import { useState, useEffect } from "react";
import { QriptopianNav, Domain } from "@/components/navigation/QriptopianNav";
import { TopHeader } from "@/components/navigation/TopHeader";
import { SignalsDrawer } from "@/components/navigation/drawers/SignalsDrawer";
import { PennyDropsDrawer } from "@/components/navigation/drawers/PennyDropsDrawer";
import { Kn0wdZDrawer } from "@/components/navigation/drawers/Kn0wdZDrawer";
import { KnytRiseDrawer } from "@/components/navigation/drawers/KnytRiseDrawer";
import { StayBullDrawer } from "@/components/navigation/drawers/StayBullDrawer";
import { AigentDrawer } from "@/components/navigation/drawers/AigentDrawer";
import { MetaAvatarProvider, useMetaAvatar } from "@/contexts/MetaAvatarContext";
import { AigentAvatar } from "@/components/AigentAvatar";
import { PennyDropsAvatar } from "@/components/PennyDropsAvatar";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [activeDomain, setActiveDomain] = useState<Domain | null>(null);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const { avatarInitialized, activeContainer } = useMetaAvatar();

  // Debug logging
  useEffect(() => {
    console.log('[Layout] Avatar state changed', { avatarInitialized, activeContainer });
  }, [avatarInitialized, activeContainer]);

  // Mutual exclusion: close AI Assistant when PennyDrops opens
  useEffect(() => {
    if (activeDomain === 'pennydrops' && isAIOpen) {
      setIsAIOpen(false);
    }
  }, [activeDomain, isAIOpen]);

  // Mutual exclusion: close PennyDrops when AI Assistant opens
  useEffect(() => {
    if (isAIOpen && activeDomain === 'pennydrops') {
      setActiveDomain(null);
    }
  }, [isAIOpen, activeDomain]);

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

      {/* Aigent Avatar - Full Screen */}
      {avatarInitialized && (
        <div 
          className={`fixed right-[80px] top-[172px] w-[calc(100vw-160px)] h-[calc(100vh-172px)] transition-opacity duration-300 z-[100] ${
            activeContainer === 'aigent' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="h-full w-full p-6">
            <div className="h-full w-full overflow-hidden rounded-lg border border-border/30 bg-muted/10">
              <AigentAvatar />
            </div>
          </div>
        </div>
      )}

      {/* PennyDrops Avatar - Embedded Box */}
      {avatarInitialized && (
        <div 
          className={`fixed right-[120px] top-[188px] w-[352px] h-[400px] transition-opacity duration-300 z-[200] ${
            activeContainer === 'pennydrops' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="h-full w-full">
            <div className="h-full w-full overflow-hidden">
              <PennyDropsAvatar />
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
