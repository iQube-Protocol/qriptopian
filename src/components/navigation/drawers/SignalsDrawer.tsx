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

      {/* Column 2 & 3: Hero Image and Thumbnails */}
      <div className="col-span-2 space-y-4">
        {/* Hero Image Section */}
        <div className="relative h-[400px] rounded-lg overflow-hidden bg-gradient-to-br from-cyan-900 via-blue-900 to-purple-900">
          <img
            src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=600&fit=crop"
            alt="Market Overview"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="inline-block px-3 py-1 bg-cyan-500/20 border border-cyan-500 rounded text-sm text-cyan-400 mb-3">
              LIVE ANALYSIS
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Q¢ Market Intelligence</h2>
            <p className="text-lg text-gray-300">Real-time insights across all major protocols</p>
          </div>
        </div>

        {/* Thumbnail Content Panels */}
        <div className="grid grid-cols-3 gap-4">
          <div className="relative rounded-lg overflow-hidden group cursor-pointer bg-card/50 backdrop-blur-sm border border-border/30 hover:border-cyan-500/50 transition-all">
            <div className="aspect-video relative">
              <img
                src="https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400&h=300&fit=crop"
                alt="DeFi Protocols"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute top-2 left-2">
                <span className="px-2 py-1 bg-orange-500/20 border border-orange-500 rounded text-xs text-orange-400">HOT</span>
              </div>
            </div>
            <div className="p-3">
              <h4 className="text-sm font-semibold text-foreground mb-1">DeFi Protocol Monitor</h4>
              <p className="text-xs text-muted-foreground">Track governance changes</p>
            </div>
          </div>

          <div className="relative rounded-lg overflow-hidden group cursor-pointer bg-card/50 backdrop-blur-sm border border-border/30 hover:border-cyan-500/50 transition-all">
            <div className="aspect-video relative">
              <img
                src="https://images.unsplash.com/photo-1642790551116-18e150f248e4?w=400&h=300&fit=crop"
                alt="Cross-Chain Activity"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute top-2 left-2">
                <span className="px-2 py-1 bg-cyan-500/20 border border-cyan-500 rounded text-xs text-cyan-400">LIVE</span>
              </div>
            </div>
            <div className="p-3">
              <h4 className="text-sm font-semibold text-foreground mb-1">Cross-Chain Flows</h4>
              <p className="text-xs text-muted-foreground">Multi-chain analytics</p>
            </div>
          </div>

          <div className="relative rounded-lg overflow-hidden group cursor-pointer bg-card/50 backdrop-blur-sm border border-border/30 hover:border-cyan-500/50 transition-all">
            <div className="aspect-video relative">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
                alt="Market Sentiment"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute top-2 left-2">
                <span className="px-2 py-1 bg-green-500/20 border border-green-500 rounded text-xs text-green-400">NEW</span>
              </div>
            </div>
            <div className="p-3">
              <h4 className="text-sm font-semibold text-foreground mb-1">Sentiment Analysis</h4>
              <p className="text-xs text-muted-foreground">AI-powered insights</p>
            </div>
          </div>

          <div className="relative rounded-lg overflow-hidden group cursor-pointer bg-card/50 backdrop-blur-sm border border-border/30 hover:border-cyan-500/50 transition-all">
            <div className="aspect-video relative">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
                alt="Volume Metrics"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>
            <div className="p-3">
              <h4 className="text-sm font-semibold text-foreground mb-1">Volume Tracker</h4>
              <p className="text-xs text-muted-foreground">24h trading volume</p>
            </div>
          </div>

          <div className="relative rounded-lg overflow-hidden group cursor-pointer bg-card/50 backdrop-blur-sm border border-border/30 hover:border-cyan-500/50 transition-all">
            <div className="aspect-video relative">
              <img
                src="https://images.unsplash.com/photo-1543286386-2e659306cd6c?w=400&h=300&fit=crop"
                alt="Whale Activity"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute top-2 left-2">
                <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500 rounded text-xs text-yellow-400">ALERT</span>
              </div>
            </div>
            <div className="p-3">
              <h4 className="text-sm font-semibold text-foreground mb-1">Whale Movements</h4>
              <p className="text-xs text-muted-foreground">Large transactions</p>
            </div>
          </div>

          <div className="relative rounded-lg overflow-hidden group cursor-pointer bg-card/50 backdrop-blur-sm border border-border/30 hover:border-cyan-500/50 transition-all">
            <div className="aspect-video relative">
              <img
                src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=400&h=300&fit=crop"
                alt="Gas Tracker"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>
            <div className="p-3">
              <h4 className="text-sm font-semibold text-foreground mb-1">Gas Price Monitor</h4>
              <p className="text-xs text-muted-foreground">Network fee trends</p>
            </div>
          </div>
        </div>
      </div>
    </DrawerLayer>
  );
}
