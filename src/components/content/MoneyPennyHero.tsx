import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
}

export function MoneyPennyHero() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Welcome to The Qriptopian. Ask me to generate hero images or explore multi-modal content from the quantum-ready internet.',
      imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1920&h=1080&fit=crop'
    }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      <div className="w-full max-w-6xl mx-auto my-4 flex flex-col bg-[#050f1f] border border-[#17243a] rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.7)] overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-8 pt-8 pb-4 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}
            >
              {message.imageUrl && (
                <div className="w-full max-w-3xl mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={message.imageUrl} 
                    alt="Content" 
                    className="w-full h-auto"
                  />
                </div>
              )}
              <div
                className={`max-w-2xl rounded-lg p-4 ${
                  message.type === 'user'
                    ? 'bg-cyan-500/10 border border-cyan-500/20'
                    : 'bg-[#071327] border border-[#1e2b40]'
                }`}
              >
                <p className="text-[#d0f6ff]">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-[#17243a] bg-[#050f1f] px-6 py-4">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-3 bg-[#020b18] border border-[#1e2b40] rounded-full px-4 py-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask The Qriptopian about trades, stories, or strategies..."
                className="flex-1 bg-transparent border-0 text-sm text-[#d0f6ff] placeholder:text-[#4d6b83] focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button
                type="submit"
                size="icon"
                className="h-9 w-9 rounded-full bg-[#00c4ff] hover:bg-[#00e0ff] text-[#001320] shadow-[0_0_16px_rgba(0,196,255,0.6)]"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
