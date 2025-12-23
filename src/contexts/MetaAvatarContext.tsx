import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ContainerType = 'aigent' | 'pennydrops' | null;
export type AvatarAgent = 'moneypenny' | 'know1';

// Agent configurations - Kn0w1 agent ID to be provided via env var
export const AVATAR_AGENTS: Record<AvatarAgent, { agentId: string; name: string; description: string }> = {
  moneypenny: {
    agentId: import.meta.env.VITE_DID_AGENT_ID || 'v2_agt_dY78cKv2',
    name: 'MoneyPenny',
    description: 'COYN and Q¢ specialist'
  },
  know1: {
    agentId: import.meta.env.VITE_DID_KNOW1_AGENT_ID || '',
    name: 'Kn0w1',
    description: 'Knowledge and research specialist'
  }
};

interface MetaAvatarContextType {
  avatarInitialized: boolean;
  activeContainer: ContainerType;
  selectedAgent: AvatarAgent;
  activeAgent: AvatarAgent;
  requestAvatar: (container: Exclude<ContainerType, null>) => void;
  releaseAvatar: (container?: Exclude<ContainerType, null>) => void;
  avatarRefreshKey: number;
  refreshAvatar: () => void;
  setSelectedAgent: (agent: AvatarAgent) => void;
}

const MetaAvatarContext = createContext<MetaAvatarContextType | undefined>(undefined);

export function MetaAvatarProvider({ children }: { children: ReactNode }) {
  const [avatarInitialized, setAvatarInitialized] = useState(false);
  const [activeContainer, setActiveContainer] = useState<ContainerType>(null);
  const [avatarRefreshKey, setAvatarRefreshKey] = useState(0);
  
  // User's selected agent in AigentDrawer (persists across container changes)
  const [selectedAgent, setSelectedAgentState] = useState<AvatarAgent>('moneypenny');
  // Currently active/displayed agent (may differ due to PennyDrops forcing MoneyPenny)
  const [activeAgent, setActiveAgent] = useState<AvatarAgent>('moneypenny');

  const requestAvatar = useCallback((container: Exclude<ContainerType, null>) => {
    console.log(`[MetaAvatar] Requesting avatar for: ${container}`);
    if (!avatarInitialized) {
      setAvatarInitialized(true);
    }
    
    // Determine which agent to show based on container
    if (container === 'pennydrops') {
      // PennyDrops ALWAYS shows MoneyPenny
      setActiveAgent('moneypenny');
    } else if (container === 'aigent') {
      // AigentDrawer shows user's selected agent
      setActiveAgent(selectedAgent);
    }
    
    setActiveContainer(container);
  }, [avatarInitialized, selectedAgent]);

  const releaseAvatar = useCallback((container?: Exclude<ContainerType, null>) => {
    setActiveContainer(current => {
      // Only release if the caller is the current active container
      if (container && current !== container) {
        console.log(`[MetaAvatar] ${container} tried to release, but ${current} is active - ignoring`);
        return current;
      }
      console.log(`[MetaAvatar] Releasing avatar from: ${container || 'unknown'}`);
      return null;
    });
  }, []);

  const refreshAvatar = useCallback(() => {
    setAvatarRefreshKey(prev => prev + 1);
  }, []);

  const setSelectedAgent = useCallback((agent: AvatarAgent) => {
    console.log(`[MetaAvatar] Setting selected agent to: ${agent}`);
    setSelectedAgentState(agent);
    
    // If aigent drawer is active, also update the active agent immediately
    setActiveContainer(current => {
      if (current === 'aigent') {
        setActiveAgent(agent);
        // Trigger refresh to reload D-ID with new agent
        setAvatarRefreshKey(prev => prev + 1);
      }
      return current;
    });
  }, []);

  return (
    <MetaAvatarContext.Provider
      value={{
        avatarInitialized,
        activeContainer,
        selectedAgent,
        activeAgent,
        requestAvatar,
        releaseAvatar,
        avatarRefreshKey,
        refreshAvatar,
        setSelectedAgent,
      }}
    >
      {children}
    </MetaAvatarContext.Provider>
  );
}

export function useMetaAvatar() {
  const context = useContext(MetaAvatarContext);
  if (!context) {
    throw new Error('useMetaAvatar must be used within MetaAvatarProvider');
  }
  return context;
}
