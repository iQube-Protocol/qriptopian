import { DrawerLayer } from "../DrawerLayer";

interface BuildersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BuildersDrawer({ isOpen, onClose }: BuildersDrawerProps) {
  const tabs = [
    { id: 'blueprints', label: 'Blueprints' },
    { id: 'showcase', label: 'Show & Tell' },
    { id: 'docs', label: 'Docs' },
  ];

  return (
    <DrawerLayer
      isOpen={isOpen}
      onClose={onClose}
      title="Builders"
      subtitle="Protocol & Product Workshop"
      width="lg"
      tabs={tabs}
    >
      <div className="space-y-6">
        {/* Quick Start */}
        <div className="p-6 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/30 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-4">Integrate AigentiQ in 10 Minutes</h3>
          <div className="space-y-2">
            {[
              'Install @qripto/aigentiq',
              'Configure agent keys',
              'Connect to A2A network',
              'Deploy your first agent',
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-white/80">
                <div className="h-6 w-6 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </div>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tutorial Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: 'Build a Q¢ Trading Bot', tech: ['TypeScript', 'AigentiQ'], difficulty: 'Intermediate' },
            { title: 'Verify Content with DIDQube', tech: ['React', 'DIDQube'], difficulty: 'Beginner' },
            { title: 'Create Custom iQubes', tech: ['Node.js', 'x402'], difficulty: 'Advanced' },
            { title: 'Deploy Multi-Agent System', tech: ['Docker', 'AigentiQ'], difficulty: 'Advanced' },
          ].map((tutorial, i) => (
            <div
              key={i}
              className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer border border-white/5"
            >
              <h4 className="font-semibold text-white mb-2">{tutorial.title}</h4>
              <div className="flex flex-wrap gap-2 mb-2">
                {tutorial.tech.map((t, j) => (
                  <span key={j} className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded">
                    {t}
                  </span>
                ))}
              </div>
              <div className="text-xs text-white/50">{tutorial.difficulty}</div>
            </div>
          ))}
        </div>
      </div>
    </DrawerLayer>
  );
}
