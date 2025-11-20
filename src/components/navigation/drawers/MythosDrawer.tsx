import { DrawerLayer } from "../DrawerLayer";

interface MythosDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MythosDrawer({ isOpen, onClose }: MythosDrawerProps) {
  const tabs = [
    { id: 'stories', label: 'Stories' },
    { id: 'chronicles', label: 'Chronicles' },
    { id: 'voices', label: 'Voices' },
    { id: 'culture', label: 'Culture' },
  ];

  return (
    <DrawerLayer
      isOpen={isOpen}
      onClose={onClose}
      title="Mythos"
      subtitle="Stories from the Quantum-Ready Internet"
      width="full"
      tabs={tabs}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute top-3 right-3">
                <div className="px-2 py-1 bg-purple-500/20 border border-purple-500 rounded text-xs text-purple-500">
                  COMIC
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h4 className="font-bold text-white group-hover:text-cyan-500 transition-colors">
                  Chapter {i}: The Awakening
                </h4>
              </div>
            </div>
            
            {/* Logos Sidebar */}
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-xs">
              <div className="font-semibold text-blue-400 mb-1">WHAT THIS MEANS</div>
              <div className="text-white/70">
                This story illustrates DIDQube identity verification in action.
              </div>
            </div>
          </div>
        ))}
      </div>
    </DrawerLayer>
  );
}
