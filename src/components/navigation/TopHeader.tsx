import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersonaSelector } from "@/components/PersonaSelector";
import { Link } from "react-router-dom";

export function TopHeader() {
  return <header className="fixed top-0 left-0 right-0 h-[88px] bg-[#0a1628] border-b border-[#1a2942] z-40 px-8 flex items-start pt-6">
      <div className="flex-1">
        <Link to="/" className="inline-block">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">The Qriptopian</h1>
        </Link>
        <div className="flex items-center gap-4 mt-1">
          <p className="text-sm text-gray-400">Stories from the Quantum-Ready Internet</p>
          <Link to="/thresholds" className="text-[11px] uppercase tracking-[0.18em] text-amber-300/80 hover:text-amber-200 transition-colors">Essays · Thresholds</Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-cyan-400"><Bell className="h-5 w-5" /></Button>
        <PersonaSelector />
        <Button size="sm" className="bg-white/5 backdrop-blur-md border border-white/10 text-gray-300 hover:bg-white/10 hover:border-cyan-500/20 hover:text-cyan-300 transition-all">Connect Wallet</Button>
      </div>
    </header>;
}
