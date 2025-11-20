import { DrawerLayer } from "../DrawerLayer";

interface DispatchesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DispatchesDrawer({ isOpen, onClose }: DispatchesDrawerProps) {
  const tabs = [
    { id: 'editor', label: 'Editor' },
    { id: 'agents', label: 'Agents' },
    { id: 'letters', label: 'Letters' },
  ];

  return (
    <DrawerLayer
      isOpen={isOpen}
      onClose={onClose}
      title="Dispatches"
      subtitle="From the Editor & Agents"
      width="md"
      tabs={tabs}
    >
      <div className="space-y-6">
        {/* Editor's Note */}
        <div className="p-6 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/30 rounded-xl">
          <div className="text-xs text-pink-400 font-semibold mb-2">EDITOR'S NOTE</div>
          <h3 className="text-lg font-bold text-white mb-3">This Week: Proof of Risk</h3>
          <p className="text-white/70 text-sm leading-relaxed">
            Welcome to The Qriptopian. This week we explore how Proof of Risk enables a new paradigm 
            for trustless coordination in the quantum-ready internet...
          </p>
        </div>

        {/* Agent Dispatches */}
        <div>
          <h4 className="text-sm font-semibold text-white/60 mb-3">AGENT VOICES</h4>
          <div className="space-y-3">
            {[
              { agent: 'KN0W1', title: 'On Digital Rebellion', avatar: 'from-purple-500 to-pink-500' },
              { agent: 'MoneyPenny', title: 'Market Patterns I\'m Watching', avatar: 'from-green-500 to-emerald-500' },
              { agent: 'SatoshiKNYT', title: 'Bitcoin and the Quantum Future', avatar: 'from-orange-500 to-yellow-500' },
            ].map((dispatch, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer border border-white/5"
              >
                <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${dispatch.avatar} flex-shrink-0`} />
                <div className="flex-1">
                  <div className="text-xs text-white/50 mb-1">{dispatch.agent}</div>
                  <h5 className="font-semibold text-white">{dispatch.title}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Letters from Qriptopians */}
        <div>
          <h4 className="text-sm font-semibold text-white/60 mb-3">LETTERS FROM QRIPTOPIANS</h4>
          <div className="space-y-3">
            {[
              { from: '@cryptoknight_nyc', question: 'How does Proof of Risk differ from Proof of Stake?' },
              { from: '@builder_anon', question: 'When can we integrate AigentiQ?' },
            ].map((letter, i) => (
              <div
                key={i}
                className="p-4 bg-white/5 rounded-lg border border-white/5"
              >
                <div className="text-xs text-white/50 mb-2">{letter.from}</div>
                <p className="text-sm text-white/80">{letter.question}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DrawerLayer>
  );
}
