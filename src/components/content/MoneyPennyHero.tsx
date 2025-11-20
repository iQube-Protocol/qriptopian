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
    <div className="h-full w-full bg-[#0a1628] flex items-center justify-center">
      {/* Contained Modal - Full Width */}
      <div className="w-full h-full bg-[#0f1e33] border-y border-[#1a2942] shadow-2xl flex flex-col overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
                    : 'bg-[#1a2942] border border-[#2a3952]'
                }`}
              >
                <p className="text-gray-200">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-[#1a2942] p-6 bg-[#0a1628]">
          <form onSubmit={handleSubmit}>
            <div className="flex gap-4 items-center">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for hero images or explore content..."
                className="flex-1 bg-[#1a2942] border-[#2a3952] text-gray-200 placeholder:text-gray-500 focus:border-cyan-500/50"
              />
              <Button
                type="submit"
                className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
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
