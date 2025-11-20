import { useState } from "react";
import { X, Send, Search, Mic } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AIOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIOverlay({ isOpen, onClose }: AIOverlayProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; timestamp?: string }>>([
    {
      role: 'assistant',
      content: 'Welcome to The Qriptopian AI! I can help you discover insights, analyze markets, and explore content. Try asking me about specific topics or strategies.',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const timestamp = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    setMessages(prev => [...prev, { role: 'user', content: input, timestamp }]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I received your message: "${input}"`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
      }]);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed bottom-0 right-0 w-full md:w-[600px] h-[33vh] z-40 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Overlay Content */}
      <div className="h-full bg-[#0a1628]/70 backdrop-blur-md border-l border-t border-[#1e2b40]/50 shadow-[0_0_60px_rgba(0,196,255,0.2)] flex flex-col">
        {/* Header Section */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2b40]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,196,255,0.5)]">
              <span className="text-lg font-bold text-[#020b18]">AI</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#d0f6ff]">Qriptopian AI</h3>
              <p className="text-xs text-[#8fb3c0]">Ask me anything</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8fb3c0] hover:text-[#d0f6ff] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className="space-y-1">
              <div
                className={`inline-block max-w-[85%] px-4 py-3 rounded-xl ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-cyan-500/30 to-cyan-600/20 text-[#d0f6ff] ml-auto float-right clear-both border border-cyan-500/30'
                    : 'bg-[#1a2537]/90 text-[#b8cfe0] border border-[#2a3a52]'
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
              {msg.timestamp && (
                <div className={`text-xs text-[#4d6b83] ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </div>
              )}
              <div className="clear-both" />
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="px-6 py-4 border-t border-[#1e2b40]/50">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 bg-[#1a2537]/80 border border-[#2a3a52] rounded-lg px-4 py-2.5">
              <button
                type="button"
                className="text-[#8fb3c0] hover:text-cyan-400 transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search content with natural language..."
                className="flex-1 bg-transparent border-0 text-sm text-[#d0f6ff] placeholder:text-[#4d6b83] focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <button
                type="button"
                className="text-[#8fb3c0] hover:text-cyan-400 transition-colors"
              >
                <Mic className="h-4 w-4" />
              </button>
              <Button
                type="submit"
                size="icon"
                className="h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 text-[#020b18] shadow-[0_0_20px_rgba(0,196,255,0.6)] transition-all"
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
