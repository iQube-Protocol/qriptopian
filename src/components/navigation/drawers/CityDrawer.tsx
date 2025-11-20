import { DrawerLayer } from "../DrawerLayer";

interface CityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CityDrawer({ isOpen, onClose }: CityDrawerProps) {
  const tabs = [
    { id: 'events', label: 'Events' },
    { id: 'recaps', label: 'Recaps' },
    { id: 'calendar', label: 'Calendar' },
  ];

  return (
    <DrawerLayer
      isOpen={isOpen}
      onClose={onClose}
      title="City"
      subtitle="NYC & The Real World"
      width="md"
      tabs={tabs}
    >
      <div className="space-y-6">
        {/* City Header */}
        <div className="p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl">
          <div className="text-xs text-yellow-400 font-semibold mb-2">CURRENT CITY</div>
          <h3 className="text-2xl font-bold text-white mb-1">New York City</h3>
          <p className="text-white/70 text-sm">The Digital Mint</p>
          <div className="mt-4 text-sm text-white/80">
            <span className="text-cyan-500">Next Event:</span> Bitcoin 2026 • Jun 15-17
          </div>
        </div>

        {/* Upcoming Events */}
        <div>
          <h4 className="text-sm font-semibold text-white/60 mb-3">UPCOMING EVENTS</h4>
          <div className="space-y-3">
            {[
              { title: 'metaKNYT Gallery Opening', date: 'Dec 1, 2025', location: 'SoHo, NYC', type: 'Art Exhibit' },
              { title: 'Q¢ Trading Workshop', date: 'Dec 5, 2025', location: 'Wall Street', type: 'Workshop' },
              { title: 'Qriptopian Meetup', date: 'Dec 10, 2025', location: 'Brooklyn', type: 'Social' },
            ].map((event, i) => (
              <div
                key={i}
                className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer border border-white/5"
              >
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-semibold text-white">{event.title}</h5>
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                    {event.type}
                  </span>
                </div>
                <div className="text-sm text-white/70">{event.date}</div>
                <div className="text-xs text-white/50">{event.location}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DrawerLayer>
  );
}
