import { DrawerLayer } from "../DrawerLayer";
import { Kn0w1Viewer } from "@/components/content/Kn0w1Viewer";

interface MythosDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const mythosContent = [
  {
    id: '1',
    title: 'The Awakening: Chapter 1',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=800&fit=crop',
    badge: 'COMIC'
  },
  {
    id: '2',
    title: 'Chronicles of the Quantum Realm',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1200&h=800&fit=crop',
    badge: 'STORY'
  },
  {
    id: '3',
    title: 'Voices from the Digital Frontier',
    image: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=1200&h=800&fit=crop',
    badge: 'SERIES'
  },
];

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
      columns={2}
      tabs={tabs}
    >
      <Kn0w1Viewer items={mythosContent} domain="mythos" />
    </DrawerLayer>
  );
}
