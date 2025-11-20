import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { HeroSection } from "./HeroSection";
import { LatestNewsCarousel } from "./LatestNewsCarousel";

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

  return (
    <div className="h-full w-full flex items-stretch">
      <div className="w-full h-full flex flex-col bg-[#050f1f] border-l border-r-0 border-t-0 border-b-0 border-[#17243a] shadow-[0_0_40px_rgba(0,0,0,0.7)] overflow-y-auto">
        <HeroSection />
        <LatestNewsCarousel />

        {/* Chat Interface */}
        <div className="w-full bg-[#050f1f] py-8 px-8 border-t border-[#17243a]">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#020b18] border border-[#1e2b40] rounded-lg p-6 mb-4 max-h-[400px] overflow-y-auto">
              {messages.map((message) => (
                <div key={message.id} className={`mb-4 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block max-w-[80%] rounded-lg p-4 ${message.type === 'user' ? 'bg-cyan-900/30 text-[#d0f6ff]' : 'bg-[#071327] text-[#8fb3c0]'}`}>
                    <p className="text-sm">{message.content}</p>
                    {message.imageUrl && (
                      <img src={message.imageUrl} alt="Generated content" className="mt-3 rounded-lg w-full" />
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input type="text" placeholder="Ask MoneyPenny to generate content..." value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 bg-[#020b18] border-[#1e2b40] text-[#d0f6ff] placeholder:text-[#8fb3c0]/50 focus:border-cyan-500/50" />
              <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
