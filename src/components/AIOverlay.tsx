import { useState } from "react";
import { X, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AIOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIOverlay({ isOpen, onClose }: AIOverlayProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: 'Hello! How can I assist you today?'
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I received your message: "${input}"`
      }]);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-32 px-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Overlay Content */}
      <div className="relative w-full max-w-3xl h-[50vh] bg-[#020b18]/95 border border-[#1e2b40] rounded-lg shadow-[0_0_40px_rgba(0,196,255,0.2)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1e2b40]">
          <h3 className="text-lg font-semibold text-[#d0f6ff]">AI Assistant</h3>
          <button
            onClick={onClose}
            className="text-[#8fb3c0] hover:text-[#d0f6ff] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-[#00c4ff]/20 text-[#d0f6ff]'
                    : 'bg-[#1e2b40] text-[#8fb3c0]'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="border-t border-[#1e2b40] p-4">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-3 bg-[#050f1f] border border-[#1e2b40] rounded-lg px-4 py-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
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
