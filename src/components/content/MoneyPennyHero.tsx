import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

export function MoneyPennyHero() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1628] via-[#0f2847] to-[#0a1628]">
      <div className="text-center max-w-2xl px-8">
        {/* Agent Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full blur-2xl opacity-30 animate-pulse" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
              <Bot className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
            The Qriptopian
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-400 mb-8">
          Quantum-Ready Internet Publishing System
        </p>

        {/* Description */}
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Navigate through domains of knowledge, discover curated content, and explore the future of digital media on the quantum-ready internet.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center">
          <Button className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white px-8 py-6 text-lg">
            Explore Content
          </Button>
          <Button 
            variant="outline" 
            className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 px-8 py-6 text-lg"
          >
            Learn More
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-800">
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">7</div>
            <div className="text-sm text-gray-500">Content Domains</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">∞</div>
            <div className="text-sm text-gray-500">Stories & Chronicles</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">Q¢</div>
            <div className="text-sm text-gray-500">Quantum-Ready</div>
          </div>
        </div>
      </div>
    </div>
  );
}
