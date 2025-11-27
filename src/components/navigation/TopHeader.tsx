import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersonaSelector } from "@/components/PersonaSelector";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

interface TopHeaderProps {
  onMobileMenuClick?: () => void;
}

export function TopHeader({ onMobileMenuClick }: TopHeaderProps) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-[88px] bg-[#0a1628] border-b border-[#1a2942] z-40 px-4 md:px-8 flex items-start pt-6">
      <div className="flex-1">
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
          The Qriptopian
        </h1>
        <p className="hidden md:block text-sm text-gray-400 mt-1">
          Stories from the Quantum-Ready Internet
        </p>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-cyan-400">
          <Bell className="h-5 w-5" />
        </Button>
        
        {/* <PersonaSelector /> */}
        
        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-sm text-gray-400">{user.email}</span>
            <Button 
              onClick={handleSignOut}
              size="sm" 
              variant="ghost"
              className="text-gray-400 hover:text-cyan-400"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button 
            onClick={() => navigate("/auth")}
            size="sm" 
            className="bg-white/5 backdrop-blur-md border border-white/10 text-gray-300 hover:bg-white/10 hover:border-cyan-500/20 hover:text-cyan-300 transition-all"
          >
            Sign In
          </Button>
        )}
        
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-gray-400 hover:text-cyan-400"
          onClick={onMobileMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}