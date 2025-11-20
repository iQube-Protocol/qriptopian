import { DrawerLayer } from "../DrawerLayer";
import { Kn0w1Viewer } from "@/components/content/Kn0w1Viewer";

interface SignalsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const signalsContent = [
  {
    id: '1',
    title: 'Real-Time Market Signals: Q¢ HFT Update',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=800&fit=crop',
    badge: 'LIVE'
  },
  {
    id: '2',
    title: 'Cross-Chain Activity Surge Detected',
    image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1200&h=800&fit=crop',
    badge: 'HOT'
  },
  {
    id: '3',
    title: 'DeFi Protocol Governance Changes',
    image: 'https://images.unsplash.com/photo-1642790551116-18e150f248e4?w=1200&h=800&fit=crop',
    badge: 'NEW'
  },
];

export function SignalsDrawer({ isOpen, onClose }: SignalsDrawerProps) {
  const tabs = [
    { id: 'current', label: 'Current' },
    { id: 'archive', label: 'Archive' },
  ];

  return (
    <DrawerLayer
      isOpen={isOpen}
      onClose={onClose}
      title="Signals"
      subtitle="What's happening now"
      columns={3}
      tabs={tabs}
    >
      {/* Column 1: Main Signal Viewer */}
      <div className="h-full">
        <Kn0w1Viewer items={signalsContent} domain="signals" />
      </div>

      {/* Column 2: Market Metrics */}
      <div className="space-y-4">
        <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-foreground mb-3">Market Metrics</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Q¢ Volume (24h)</p>
              <p className="text-2xl font-bold text-cyan-400">$2.4M</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Traders</p>
              <p className="text-2xl font-bold text-cyan-400">1,247</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">HFT Rate</p>
              <p className="text-2xl font-bold text-cyan-400">98.7%</p>
            </div>
          </div>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-foreground mb-3">Network Activity</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Ethereum</span>
              <span className="text-sm font-semibold text-green-400">+12.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Solana</span>
              <span className="text-sm font-semibold text-green-400">+8.3%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Polygon</span>
              <span className="text-sm font-semibold text-red-400">-2.1%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Column 3: Recent Alerts */}
      <div className="space-y-4">
        <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-foreground mb-3">Recent Alerts</h3>
          <div className="space-y-3">
            <div className="border-l-2 border-cyan-500 pl-3">
              <p className="text-sm font-medium text-foreground">Price Spike Detected</p>
              <p className="text-xs text-muted-foreground">2 minutes ago</p>
            </div>
            <div className="border-l-2 border-orange-500 pl-3">
              <p className="text-sm font-medium text-foreground">Volume Surge Alert</p>
              <p className="text-xs text-muted-foreground">8 minutes ago</p>
            </div>
            <div className="border-l-2 border-yellow-500 pl-3">
              <p className="text-sm font-medium text-foreground">Whale Movement</p>
              <p className="text-xs text-muted-foreground">15 minutes ago</p>
            </div>
            <div className="border-l-2 border-cyan-500 pl-3">
              <p className="text-sm font-medium text-foreground">Cross-Chain Bridge</p>
              <p className="text-xs text-muted-foreground">23 minutes ago</p>
            </div>
          </div>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-foreground mb-3">Protocol Status</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">DeFi TVL</span>
              <span className="px-2 py-1 bg-green-500/20 border border-green-500 rounded text-xs text-green-400">HEALTHY</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Gas Prices</span>
              <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500 rounded text-xs text-yellow-400">ELEVATED</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Network Load</span>
              <span className="px-2 py-1 bg-green-500/20 border border-green-500 rounded text-xs text-green-400">NORMAL</span>
            </div>
          </div>
        </div>
      </div>
    </DrawerLayer>
  );
}
