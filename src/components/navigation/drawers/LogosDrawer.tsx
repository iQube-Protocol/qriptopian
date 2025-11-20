import { DrawerLayer } from "../DrawerLayer";

interface LogosDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogosDrawer({ isOpen, onClose }: LogosDrawerProps) {
  const tabs = [
    { id: 'stack', label: 'Stack' },
    { id: 'proofs', label: 'Proofs' },
    { id: 'tutorials', label: 'Tutorials' },
    { id: 'economics', label: 'Economics' },
  ];

  return (
    <DrawerLayer
      isOpen={isOpen}
      onClose={onClose}
      title="Logos"
      subtitle="The Stack"
      width="lg"
      tabs={tabs}
    >
      <div className="space-y-6">
        {/* Featured Protocol */}
        <div className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl">
          <div className="text-xs text-blue-400 font-semibold mb-2">FEATURED PROTOCOL</div>
          <h3 className="text-2xl font-bold text-white mb-2">DIDQube</h3>
          <p className="text-white/70 mb-4">Verifiable Identity for Agents</p>
          <div className="aspect-video bg-white/5 rounded-lg" />
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: 'Understanding Proof of Risk', difficulty: 'Intermediate', time: '5 min' },
            { title: 'Integrate Q¢ in 3 Steps', difficulty: 'Advanced', time: '10 min' },
            { title: 'Three Signal Currencies', difficulty: 'Beginner', time: '7 min' },
            { title: 'iQubes Deep Dive', difficulty: 'Advanced', time: '15 min' },
          ].map((item, i) => (
            <div
              key={i}
              className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer border border-white/5"
            >
              <h4 className="font-semibold text-white mb-2">{item.title}</h4>
              <div className="flex items-center gap-3 text-xs text-white/50">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">{item.difficulty}</span>
                <span>{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DrawerLayer>
  );
}
