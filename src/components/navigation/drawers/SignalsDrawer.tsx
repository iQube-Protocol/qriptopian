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
      <Kn0w1Viewer items={signalsContent} domain="signals" />
    </DrawerLayer>
  );
}
