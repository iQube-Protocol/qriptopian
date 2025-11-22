import { createContext, useContext, useState, ReactNode } from 'react';

type ContainerType = 'aigent' | 'pennydrops' | null;

interface MetaAvatarContextType {
  avatarInitialized: boolean;
  activeContainer: ContainerType;
  requestAvatar: (container: Exclude<ContainerType, null>) => void;
  releaseAvatar: () => void;
}

const MetaAvatarContext = createContext<MetaAvatarContextType | undefined>(undefined);

export function MetaAvatarProvider({ children }: { children: ReactNode }) {
  const [avatarInitialized, setAvatarInitialized] = useState(false);
  const [activeContainer, setActiveContainer] = useState<ContainerType>(null);

  const requestAvatar = (container: Exclude<ContainerType, null>) => {
    if (!avatarInitialized) {
      setAvatarInitialized(true);
    }
    setActiveContainer(container);
  };

  const releaseAvatar = () => {
    setActiveContainer(null);
  };

  return (
    <MetaAvatarContext.Provider
      value={{
        avatarInitialized,
        activeContainer,
        requestAvatar,
        releaseAvatar,
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
