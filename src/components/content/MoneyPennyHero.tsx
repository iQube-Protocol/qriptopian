import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import heroImage from "@/assets/qriptopian-hero.jpg";
interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
}
export function MoneyPennyHero() {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    type: 'assistant',
    content: 'Welcome to The Qriptopian. Ask me to generate hero images or explore multi-modal content from the quantum-ready internet.',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1920&h=1080&fit=crop'
  }]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Simulate response with image
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Generated content for: "${input}"`,
        imageUrl: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1920&h=1080&fit=crop'
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };
  return <div className="h-full w-full flex items-stretch">
      <div className="w-full h-full flex flex-col bg-[#050f1f] border-l border-r-0 border-t-0 border-b-0 border-[#17243a] shadow-[0_0_40px_rgba(0,0,0,0.7)] overflow-y-auto">
        {/* Hero Image with Title Overlay */}
        <div className="w-full h-screen relative flex-shrink-0">
          <img src={heroImage} alt="The Qriptopian - Quantum-Ready Internet" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050f1f]" />
          <div className="absolute inset-0 flex items-end justify-center pb-24">
            <div className="text-center px-8">
              <h1 className="text-6xl font-bold text-[#d0f6ff] mb-4 drop-shadow-[0_0_30px_rgba(0,196,255,0.5)]">
                Welcome to The Qriptopian
              </h1>
              <p className="text-xl text-[#8fb3c0] drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                Navigate the Quantum-Ready Internet
              </p>
            </div>
          </div>
        </div>

        {/* Blurb Section */}
        

        {/* Three Column Content Grid */}
        <div className="w-full bg-[#071327] py-12 px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1 */}
            <div className="bg-[#020b18] border border-[#1e2b40] rounded-lg overflow-hidden hover:border-cyan-500/30 transition-colors">
              <img src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop" alt="Quantum Signals" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#d0f6ff] mb-2">Quantum Signals</h3>
                <p className="text-[#8fb3c0] text-sm mb-4">
                  Real-time insights and analytics from the quantum computing frontier
                </p>
                <button className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
                  Explore →
                </button>
              </div>
            </div>

            {/* Column 2 */}
            <div className="bg-[#020b18] border border-[#1e2b40] rounded-lg overflow-hidden hover:border-cyan-500/30 transition-colors">
              <img src="https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400&h=300&fit=crop" alt="Blockchain Stories" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#d0f6ff] mb-2">Blockchain Stories</h3>
                <p className="text-[#8fb3c0] text-sm mb-4">
                  Narratives and mythos from the decentralized revolution
                </p>
                <button className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
                  Explore →
                </button>
              </div>
            </div>

            {/* Column 3 */}
            <div className="bg-[#020b18] border border-[#1e2b40] rounded-lg overflow-hidden hover:border-cyan-500/30 transition-colors">
              <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop" alt="Market Intelligence" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#d0f6ff] mb-2">Market Intelligence</h3>
                <p className="text-[#8fb3c0] text-sm mb-4">
                  Strategic analysis and trading insights for the crypto markets
                </p>
                <button className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
                  Explore →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-[#17243a] bg-[#050f1f] py-4">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-3 bg-[#020b18] border-x-0 border-t border-b border-[#1e2b40] px-4 py-2">
              <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask The Qriptopian about trades, stories, or strategies..." className="flex-1 bg-transparent border-0 text-sm text-[#d0f6ff] placeholder:text-[#4d6b83] focus-visible:ring-0 focus-visible:ring-offset-0" />
              <Button type="submit" size="icon" className="h-9 w-9 rounded-full bg-[#00c4ff] hover:bg-[#00e0ff] text-[#001320] shadow-[0_0_16px_rgba(0,196,255,0.6)]">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>;
}