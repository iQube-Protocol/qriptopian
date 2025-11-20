import { DrawerLayer } from "../DrawerLayer";

interface SignalsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignalsDrawer({ isOpen, onClose }: SignalsDrawerProps) {
  const tabs = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'Week' },
    { id: 'archive', label: 'Archive' },
  ];

  return (
    <DrawerLayer
      isOpen={isOpen}
      onClose={onClose}
      title="Signals"
      subtitle="What's happening now"
      width="lg"
      tabs={tabs}
    >
      <div className="space-y-6">
        {/* Lead Story */}
        <div className="relative h-64 rounded-xl overflow-hidden group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="inline-block px-3 py-1 bg-cyan-500/20 border border-cyan-500 rounded-full text-xs text-cyan-500 mb-2">
              MYTHOS
            </div>
            <h3 className="text-2xl font-bold text-white">The Digital Rebellion Begins</h3>
            <p className="text-white/70 text-sm mt-2">Latest chapter from metaKNYT Chronicles</p>
          </div>
        </div>

        {/* Key Announcements */}
        <div>
          <h4 className="text-sm font-semibold text-white/60 mb-3">KEY ANNOUNCEMENTS</h4>
          <div className="grid gap-3">
            {[
              { title: 'Q¢ HFT Update', category: 'MoneyPenny', color: 'green' },
              { title: 'New Chapter Released', category: 'metaKNYT', color: 'purple' },
              { title: 'Reg CF Milestone', category: 'Fair Launch', color: 'orange' },
            ].map((item, i) => (
              <div
                key={i}
                className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer border border-white/5"
              >
                <div className="text-xs text-white/50 mb-1">{item.category}</div>
                <div className="font-medium text-white">{item.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Signal Ticker */}
        <div className="border-t border-white/5 pt-4">
          <h4 className="text-sm font-semibold text-white/60 mb-3">SIGNAL TICKER</h4>
          <div className="flex flex-col gap-2">
            {[
              'Q¢ spreads narrowed 15% this week',
              'New DIDQube verification live',
              'BTC 2026 tickets on sale',
            ].map((signal, i) => (
              <div
                key={i}
                className="text-sm text-cyan-500 hover:text-cyan-400 cursor-pointer flex items-center gap-2"
              >
                <span>→</span>
                <span>{signal}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DrawerLayer>
  );
}
