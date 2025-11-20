export function MoneyPennyHero() {
  return (
    <div 
      className="h-full w-full bg-cover bg-center relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1920&h=1080&fit=crop')"
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/80 via-[#0a1628]/60 to-[#0a1628]/80" />
      
      {/* Content */}
      <div className="relative h-full flex items-center justify-center p-12">
        <div className="text-center space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-sm">
            <div className="h-3 w-3 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm text-cyan-400 font-medium">Stories from the Quantum-Ready Internet</span>
          </div>
          
          <h1 className="text-7xl font-bold bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
            The Qriptopian
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Navigate through domains of knowledge curated for builders, traders, and visionaries
          </p>
        </div>
      </div>
    </div>
  );
}
