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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Overlay Content */}
      <div className="relative w-full max-w-4xl h-[80vh] bg-gradient-to-b from-[#0a1628] to-[#020b18] border border-[#1e2b40]/50 rounded-2xl shadow-[0_0_60px_rgba(0,196,255,0.3)] flex flex-col overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 text-[#8fb3c0] hover:text-[#d0f6ff] transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header Section */}
        <div className="p-8 pb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,196,255,0.5)]">
              <span className="text-xl font-bold text-[#020b18]">AI</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#d0f6ff] mb-1">Qriptopian AI</h3>
              <p className="text-sm text-[#8fb3c0]">Ask me anything</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 pb-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className="space-y-2">
              <div
                className={`inline-block max-w-[85%] px-6 py-4 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 text-[#d0f6ff] ml-auto float-right clear-both border border-cyan-500/20'
                    : 'bg-[#1a2537]/80 text-[#b8cfe0] border border-[#2a3a52]'
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
        <div className="p-6 bg-[#0a1628]/50 border-t border-[#1e2b40]/50 backdrop-blur-sm">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-3 bg-[#1a2537]/60 border border-[#2a3a52] rounded-xl px-4 py-3 shadow-lg">
              <button
                type="button"
                className="text-[#8fb3c0] hover:text-cyan-400 transition-colors"
              >
                <Search className="h-5 w-5" />
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
                <Mic className="h-5 w-5" />
              </button>
              <Button
                type="submit"
                size="icon"
                className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 text-[#020b18] shadow-[0_0_20px_rgba(0,196,255,0.6)] transition-all"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
