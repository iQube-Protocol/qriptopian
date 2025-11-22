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
    return container === 'aigent' 
      ? { x: 0, y: 0 }
      : { x: 0, y: 0 };
  };

  const [avatarPosition, setAvatarPosition] = useState(
    activeContainer ? getDefaultPosition(activeContainer) : { x: 0, y: 0 }
  );

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
      {(() => {
        console.log('[Layout] Avatar render check:', { avatarInitialized, activeContainer });
        return avatarInitialized && activeContainer;
      })() && (
        <Draggable
          handle=".drag-handle"
          bounds="parent"
          defaultPosition={getDefaultPosition(activeContainer)}
          onStop={(e, data) => {
            const position = { x: data.x, y: data.y };
            setAvatarPosition(position);
            localStorage.setItem(`avatar-position-${activeContainer}`, JSON.stringify(position));
          }}
        >
          <div 
            className={`fixed transition-opacity duration-300 ${
              activeContainer === 'aigent' 
                ? 'right-[80px] top-[172px] w-[calc(100vw-160px)] h-[calc(100vh-172px)] opacity-100 z-[100]' 
                : activeContainer === 'pennydrops'
                ? 'right-[104px] top-[244px] w-[352px] h-[calc(100vh-268px)] opacity-100 z-[100]'
                : 'opacity-0 pointer-events-none -z-10'
            }`}
          >
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
