import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TopHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 h-[88px] bg-[#0a1628] border-b border-[#1a2942] z-40 px-8 flex items-start pt-6">
      <div className="flex-1">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
          The Qriptopian
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Stories from the Quantum-Ready Internet
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-cyan-400">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="sm" className="border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10">
          Chat
        </Button>
        <Button variant="outline" size="sm" className="border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10">
          Feed
        </Button>
        <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600">
          Connect Wallet
        </Button>
      </div>
    </header>
  );
}
