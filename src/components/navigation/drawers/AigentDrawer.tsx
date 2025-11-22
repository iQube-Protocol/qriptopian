import { useState, useEffect } from "react";
import { X, Send, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useMetaAvatar } from "@/contexts/MetaAvatarContext";

interface AigentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AigentDrawer({
  isOpen,
  onClose
}: AigentDrawerProps) {
  const [viewMode, setViewMode] = useState<'metavatar' | 'chat'>('metavatar');
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
  }>>([{
    role: 'assistant',
    content: 'Welcome! I can help you discover insights, analyze markets, and explore content. How can I assist you today?'
  }]);
  const { requestAvatar, releaseAvatar, refreshAvatar } = useMetaAvatar();

  // Request/release avatar based on drawer and view mode state
  useEffect(() => {
    if (isOpen && viewMode === 'metavatar') {
      requestAvatar('aigent');
    } else {
      releaseAvatar('aigent');
    }
    return () => releaseAvatar('aigent');
  }, [isOpen, viewMode, requestAvatar, releaseAvatar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, {
      role: 'user',
      content: input
    }]);
    setInput("");
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I understand your question. Let me help you with that...'
      }]);
    }, 1000);
  };
  if (!isOpen) return null;
  return <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      
      {/* Drawer */}
      <div className={`fixed right-[80px] top-[88px] h-[calc(100vh-88px)] w-[calc(100vw-160px)] bg-background/80 backdrop-blur-xl border-l border-border/30 shadow-[0_0_60px_rgba(0,0,0,0.5)] z-50 overflow-hidden flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex-shrink-0 border-b border-border/30 bg-background/60 backdrop-blur-sm">
          <div className="p-6 flex items-center justify-between gap-4">
            <div className="flex-shrink-0">
              <h2 className="text-xl font-bold text-cyan-400 mb-1">Aigent MoneyPenny</h2>
              <p className="text-sm text-muted-foreground">COYN and Q¢ specialist</p>
            </div>
            
            <div className="flex items-center gap-6">

              <TooltipProvider>
                {/* Refresh Button - Only visible in metavatar mode */}
                {viewMode === 'metavatar' && <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" onClick={() => {
                    console.log('[AigentDrawer] MetaAvatar refresh clicked');
                    refreshAvatar();
                  }} className={`p-1 rounded-full transition-colors ${viewMode === 'metavatar' ? 'text-cyan-400 hover:text-cyan-300' : 'text-white hover:text-cyan-400'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
                          <path d="M21 3v5h-5"/>
                        </svg>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Refresh MetaVatar</p>
                    </TooltipContent>
                  </Tooltip>}

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 bg-background/20 backdrop-blur-md rounded-lg p-1 border border-border/20">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" onClick={() => setViewMode('metavatar')} className={`px-2 py-1.5 text-xs font-medium rounded transition-all ${viewMode === 'metavatar' ? 'text-cyan-400' : 'text-white hover:text-cyan-400 hover:bg-background/10'}`}>
                        <User className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>metaVatar Mode</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" onClick={() => setViewMode('chat')} className={`px-2 py-1.5 text-xs font-medium rounded transition-all ${viewMode === 'chat' ? 'text-cyan-400' : 'text-white hover:text-cyan-400 hover:bg-background/10'}`}>
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Text Mode</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
              
              <Button variant="ghost" size="icon" onClick={onClose} className="flex-shrink-0 text-muted-foreground hover:text-foreground hover:bg-accent/50 ml-4">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {viewMode === 'chat' ? (
            <>
              {/* Chat Messages */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4 max-w-4xl mx-auto">
                  {messages.map((message, i) => (
                    <div key={i} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {message.role === 'user' ? <User className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                        </div>
                        <div className={`rounded-lg p-4 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Chat Input */}
              <div className="p-6 border-t border-border/30">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            // Placeholder for MetaAvatar (actual avatar is rendered globally in Layout)
            <div className="flex-1 p-6">
              <div className="h-full w-full rounded-lg border border-border/30 bg-muted/10" />
            </div>
          )}
        </div>
      </div>
    </>;
}