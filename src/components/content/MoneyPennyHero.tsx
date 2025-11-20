import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Lock, Crown } from "lucide-react";
import heroImage from "@/assets/qriptopian-hero.jpg";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
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
        <div className="w-full h-[calc(100vh-88px)] relative flex-shrink-0">
          <img src={heroImage} alt="The Qriptopian - Quantum-Ready Internet" className="w-full h-full object-cover" />
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

        {/* Carousel Content Section */}
        <div className="w-full bg-[#071327] py-12 px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-[#d0f6ff] mb-8 text-left">Latest News</h2>
            <Carousel className="w-full">
              <CarouselContent className="-ml-4">
                <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
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
                </CarouselItem>

                <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
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
                </CarouselItem>

                <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
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
                </CarouselItem>

                <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="bg-[#020b18] border border-[#1e2b40] rounded-lg overflow-hidden hover:border-cyan-500/30 transition-colors">
                    <img src="https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=300&fit=crop" alt="DeFi Protocols" className="w-full h-48 object-cover" />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-[#d0f6ff] mb-2">DeFi Protocols</h3>
                      <p className="text-[#8fb3c0] text-sm mb-4">
                        Deep dives into decentralized finance mechanisms and innovations
                      </p>
                      <button className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
                        Explore →
                      </button>
                    </div>
                  </div>
                </CarouselItem>

                <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="bg-[#020b18] border border-[#1e2b40] rounded-lg overflow-hidden hover:border-cyan-500/30 transition-colors">
                    <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop" alt="Tech Infrastructure" className="w-full h-48 object-cover" />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-[#d0f6ff] mb-2">Tech Infrastructure</h3>
                      <p className="text-[#8fb3c0] text-sm mb-4">
                        Building blocks of the next-generation internet architecture
                      </p>
                      <button className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
                        Explore →
                      </button>
                    </div>
                  </div>
                </CarouselItem>

                <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="bg-[#020b18] border border-[#1e2b40] rounded-lg overflow-hidden hover:border-cyan-500/30 transition-colors">
                    <img src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop" alt="Crypto Economics" className="w-full h-48 object-cover" />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-[#d0f6ff] mb-2">Crypto Economics</h3>
                      <p className="text-[#8fb3c0] text-sm mb-4">
                        Economic models and tokenomics shaping the digital economy
                      </p>
                      <button className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
                        Explore →
                      </button>
                    </div>
                  </div>
                </CarouselItem>

                {/* Premium Content - Token Gated */}
                <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="bg-[#020b18] border border-amber-500/30 rounded-lg overflow-hidden hover:border-amber-500/50 transition-colors relative">
                    <div className="absolute top-3 right-3 z-10">
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50 flex items-center gap-1">
                        <Crown className="h-3 w-3" />
                        Premium
                      </Badge>
                    </div>
                    <div className="relative">
                      <img src="https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=400&h=300&fit=crop" alt="Quantum Trading Algorithms" className="w-full h-48 object-cover opacity-60" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="h-12 w-12 text-amber-400" />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-[#d0f6ff] mb-2">Quantum Trading Algorithms</h3>
                      <p className="text-[#8fb3c0] text-sm mb-4">
                        Exclusive insights into quantum-powered algorithmic trading strategies
                      </p>
                      <button className="text-amber-400 text-sm hover:text-amber-300 transition-colors flex items-center gap-2">
                        <Lock className="h-3 w-3" />
                        Unlock with 100 QCT →
                      </button>
                    </div>
                  </div>
                </CarouselItem>

                {/* Regular Content */}
                <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="bg-[#020b18] border border-[#1e2b40] rounded-lg overflow-hidden hover:border-cyan-500/30 transition-colors">
                    <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop" alt="AI & Machine Learning" className="w-full h-48 object-cover" />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-[#d0f6ff] mb-2">AI & Machine Learning</h3>
                      <p className="text-[#8fb3c0] text-sm mb-4">
                        The convergence of artificial intelligence and blockchain technology
                      </p>
                      <button className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
                        Explore →
                      </button>
                    </div>
                  </div>
                </CarouselItem>

                {/* Premium Content - Token Gated */}
                <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="bg-[#020b18] border border-amber-500/30 rounded-lg overflow-hidden hover:border-amber-500/50 transition-colors relative">
                    <div className="absolute top-3 right-3 z-10">
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50 flex items-center gap-1">
                        <Crown className="h-3 w-3" />
                        Premium
                      </Badge>
                    </div>
                    <div className="relative">
                      <img src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=400&h=300&fit=crop" alt="Advanced DeFi Strategies" className="w-full h-48 object-cover opacity-60" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="h-12 w-12 text-amber-400" />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-[#d0f6ff] mb-2">Advanced DeFi Strategies</h3>
                      <p className="text-[#8fb3c0] text-sm mb-4">
                        Master-level strategies for yield optimization and liquidity management
                      </p>
                      <button className="text-amber-400 text-sm hover:text-amber-300 transition-colors flex items-center gap-2">
                        <Lock className="h-3 w-3" />
                        Unlock with 150 QCT →
                      </button>
                    </div>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </div>
        </div>

      </div>
    </div>;
}