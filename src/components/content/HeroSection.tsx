import heroImage from "@/assets/qriptopian-hero.jpg";

export function HeroSection() {
  return (
    <div className="w-full h-[calc(100vh-88px)] relative flex-shrink-0">
      <img 
        src={heroImage} 
        alt="The Qriptopian - Quantum-Ready Internet" 
        className="w-full h-full object-cover" 
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050f1f]" />
      <div className="absolute inset-0 flex items-end justify-center pb-16">
        <div className="text-center px-8">
          <h1 className="text-6xl font-bold text-[#d0f6ff] mb-4 drop-shadow-[0_0_30px_rgba(0,196,255,0.5)]">
            The Qriptopian
          </h1>
          <p className="text-xl text-[#8fb3c0] drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
            Navigate the Quantum-Ready Internet
          </p>
        </div>
      </div>
    </div>
  );
}
