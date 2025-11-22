import { useState } from "react";
import Draggable from "react-draggable";
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
  
  const getDefaultPosition = (container: string) => {
    const saved = localStorage.getItem(`avatar-position-${container}`);
    if (saved) {
      return JSON.parse(saved);
    }
    return { x: 0, y: 0 };
  };

  const handleDomainClick = (domain: Domain) => {
    // Close AI drawer when any domain drawer is opened
    setIsAIOpen(false);
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
        onAIClick={() => {
          // Close any domain drawer before opening AI
          setActiveDomain(null);
          setIsAIOpen(true);
        }}
      />

      {/* Domain Drawers */}
      <SignalsDrawer isOpen={activeDomain === 'signals'} onClose={() => setActiveDomain(null)} />
      <PennyDropsDrawer isOpen={activeDomain === 'pennydrops'} onClose={() => setActiveDomain(null)} />
      <Kn0wdZDrawer isOpen={activeDomain === 'kn0wdz'} onClose={() => setActiveDomain(null)} />
      <KnytRiseDrawer isOpen={activeDomain === 'knytrise'} onClose={() => setActiveDomain(null)} />
      <StayBullDrawer isOpen={activeDomain === 'staybull'} onClose={() => setActiveDomain(null)} />
      
      {/* Aigent Drawer */}
      <AigentDrawer isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />

      {/* Floating MetaAvatar - Penny Drops only */}
      {avatarInitialized && activeContainer === 'pennydrops' && (
        <Draggable
          handle=".drag-handle"
          bounds="parent"
          defaultPosition={getDefaultPosition('pennydrops')}
          onStop={(e, data) => {
            const position = { x: data.x, y: data.y };
            localStorage.setItem('avatar-position-pennydrops', JSON.stringify(position));
          }}
        >
          <div className="fixed right-[104px] top-[244px] w-[352px] h-[calc(100vh-268px)] opacity-100 z-[100]">
            <div className="h-full w-full p-6">
              <div className="h-full w-full rounded-lg border border-border/30 bg-muted/10 overflow-hidden relative">
                <div className="drag-handle absolute top-0 left-0 right-0 h-8 bg-muted/20 cursor-move flex items-center justify-center z-10 border-b border-border/20">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-muted-foreground/40"></div>
                    <div className="w-1 h-1 rounded-full bg-muted-foreground/40"></div>
                    <div className="w-1 h-1 rounded-full bg-muted-foreground/40"></div>
                  </div>
                </div>
                <div className="h-full w-full pt-8">
                  <MetaAvatar key={avatarRefreshKey} />
                </div>
              </div>
            </div>
          </div>
        </Draggable>
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
