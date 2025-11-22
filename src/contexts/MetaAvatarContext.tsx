import { createContext, useContext, useState, ReactNode } from 'react';

type ContainerType = 'aigent' | 'pennydrops' | null;

interface MetaAvatarContextType {
  avatarInitialized: boolean;
  activeContainer: ContainerType;
  requestAvatar: (container: Exclude<ContainerType, null>) => void;
  releaseAvatar: () => void;
  avatarRefreshKey: number;
  refreshAvatar: () => void;
}

const MetaAvatarContext = createContext<MetaAvatarContextType | undefined>(undefined);

export function MetaAvatarProvider({ children }: { children: ReactNode }) {
  const [avatarInitialized, setAvatarInitialized] = useState(false);
  const [activeContainer, setActiveContainer] = useState<ContainerType>(null);
  const [avatarRefreshKey, setAvatarRefreshKey] = useState(0);

  const requestAvatar = (container: Exclude<ContainerType, null>) => {
    if (!avatarInitialized) {
      setAvatarInitialized(true);
    }
    setActiveContainer(container);
  };

  const releaseAvatar = () => {
    setActiveContainer(null);
  };

  const refreshAvatar = () => {
    setAvatarRefreshKey(prev => prev + 1);
  };

  return (
    <MetaAvatarContext.Provider
      value={{
        avatarInitialized,
        activeContainer,
        requestAvatar,
        releaseAvatar,
        avatarRefreshKey,
        refreshAvatar,
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
