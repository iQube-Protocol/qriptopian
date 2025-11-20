import { DrawerLayer } from "../DrawerLayer";

interface MarketsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MarketsDrawer({ isOpen, onClose }: MarketsDrawerProps) {
  const tabs = [
    { id: 'briefing', label: 'Briefing' },
    { id: 'strategies', label: 'Strategies' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'learn', label: 'Learn' },
  ];

  return (
    <DrawerLayer
      isOpen={isOpen}
      onClose={onClose}
      title="Markets"
      subtitle="MoneyPenny's Ledger"
      width="lg"
      tabs={tabs}
    >
      <div className="space-y-6">
        {/* Agent Header */}
        <div className="flex items-center gap-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500" />
          <div>
            <div className="font-semibold text-white">MoneyPenny</div>
            <div className="text-xs text-white/50">Analyzing • Updated 2 min ago</div>
          </div>
        </div>

        {/* Market Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Q¢ Volume (24h)', value: '$1.2M', change: '+15%', positive: true },
            { label: 'Avg Spread', value: '0.03%', change: '-12%', positive: true },
            { label: 'Active Strategies', value: '47', change: '+3', positive: true },
          ].map((stat, i) => (
            <div key={i} className="p-4 bg-white/5 rounded-lg border border-white/5">
              <div className="text-xs text-white/50 mb-1">{stat.label}</div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className={stat.positive ? 'text-green-500 text-sm' : 'text-red-500 text-sm'}>
                {stat.change}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Briefings */}
        <div>
          <h4 className="text-sm font-semibold text-white/60 mb-3">RECENT BRIEFINGS</h4>
          <div className="space-y-3">
            {[
              'Weekly Market Patterns Analysis',
              'Strategies in the Sandbox: HFT Results',
              'Understanding Micro-Liquidity',
            ].map((title, i) => (
              <div
                key={i}
                className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer border border-white/5"
              >
                <div className="font-medium text-white">{title}</div>
                <div className="text-xs text-white/50 mt-1">by MoneyPenny • 2 days ago</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DrawerLayer>
  );
}
