# MetaAvatar Persistence Pattern

## Overview

This document describes the implementation pattern for persisting third-party iframe-based widgets (specifically D-ID's AI avatar SDK) across React component lifecycle changes and navigation events.

## The Problem

D-ID's SDK injects an iframe into a target container when the script loads. In React, when a component unmounts (e.g., closing a drawer), the iframe is destroyed. Re-mounting the component requires re-initializing the SDK, causing:

- Visible loading delays
- Session state loss
- Poor user experience
- Potential rate limiting from repeated SDK initializations

## The Solution: Singleton Render Pattern

**Never unmount the component.** Instead:
1. Render the MetaAvatar once at the app root level
2. Use CSS transforms to position it where needed
3. Coordinate ownership via React Context

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         App Root                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                  MetaAvatarProvider                         ││
│  │  ┌─────────────────────────────────────────────────────────┐││
│  │  │                     Layout                              │││
│  │  │                                                         │││
│  │  │  ┌─────────────────┐    ┌──────────────────────────┐   │││
│  │  │  │   MetaAvatar    │    │     Page Content         │   │││
│  │  │  │  (Always Live)  │    │  ┌────────────────────┐  │   │││
│  │  │  │                 │    │  │   AigentDrawer     │  │   │││
│  │  │  │  CSS positions  │◄───│  │  requestAvatar()  │  │   │││
│  │  │  │  based on       │    │  │  releaseAvatar()  │  │   │││
│  │  │  │  activeContainer│    │  └────────────────────┘  │   │││
│  │  │  └─────────────────┘    │  ┌────────────────────┐  │   │││
│  │  │                         │  │  PennyDropsDrawer  │  │   │││
│  │  │                         │  │  requestAvatar()  │  │   │││
│  │  │                         │  │  releaseAvatar()  │  │   │││
│  │  │                         │  └────────────────────┘  │   │││
│  │  │                         └──────────────────────────┘   │││
│  │  └─────────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## Key Files

| File | Purpose |
|------|---------|
| `src/contexts/MetaAvatarContext.tsx` | Global state management for avatar ownership |
| `src/components/MetaAvatar.tsx` | D-ID script injection and container management |
| `src/components/Layout.tsx` | Global rendering and CSS positioning |
| `src/components/navigation/drawers/AigentDrawer.tsx` | Consumer example - requests/releases avatar |
| `src/components/navigation/drawers/PennyDropsDrawer.tsx` | Consumer with modal awareness |

---

## Implementation Details

### 1. Context Provider (`MetaAvatarContext.tsx`)

The context manages:
- `avatarInitialized`: Whether the avatar has been requested at least once
- `activeContainer`: Which component currently "owns" the avatar
- `requestAvatar(container)`: Claim ownership
- `releaseAvatar(container)`: Release ownership (with safety check)
- `avatarRefreshKey`: Force re-initialization counter
- `refreshAvatar()`: Trigger re-initialization

```typescript
import { createContext, useContext, useState, ReactNode } from 'react';

type ContainerType = 'aigent' | 'pennydrops' | null;

interface MetaAvatarContextType {
  avatarInitialized: boolean;
  activeContainer: ContainerType;
  requestAvatar: (container: Exclude<ContainerType, null>) => void;
  releaseAvatar: (container?: Exclude<ContainerType, null>) => void;
  avatarRefreshKey: number;
  refreshAvatar: () => void;
}

const MetaAvatarContext = createContext<MetaAvatarContextType | undefined>(undefined);

export function MetaAvatarProvider({ children }: { children: ReactNode }) {
  const [avatarInitialized, setAvatarInitialized] = useState(false);
  const [activeContainer, setActiveContainer] = useState<ContainerType>(null);
  const [avatarRefreshKey, setAvatarRefreshKey] = useState(0);

  const requestAvatar = (container: Exclude<ContainerType, null>) => {
    console.log(`[MetaAvatar] Requesting avatar for: ${container}`);
    if (!avatarInitialized) {
      setAvatarInitialized(true);
    }
    setActiveContainer(container);
  };

  // CRITICAL: Safety check prevents race conditions
  const releaseAvatar = (container?: Exclude<ContainerType, null>) => {
    setActiveContainer(current => {
      // Only release if the caller is the current active container
      if (container && current !== container) {
        console.log(`[MetaAvatar] ${container} tried to release, but ${current} is active - ignoring`);
        return current;
      }
      console.log(`[MetaAvatar] Releasing avatar from: ${container || 'unknown'}`);
      return null;
    });
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
```

### 2. MetaAvatar Component (`MetaAvatar.tsx`)

Handles D-ID SDK script injection with cleanup:

```typescript
import { useEffect, useRef } from 'react';

export function MetaAvatar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const containerIdRef = useRef(`did-avatar-container-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    const init = () => {
      const containerId = (containerIdRef.current = `did-avatar-container-${Math.random().toString(36).slice(2)}`);

      console.log("[MetaAvatar] init", { containerId, ts: new Date().toISOString() });

      // CRITICAL: Remove any previously injected D-ID artifacts
      document.querySelectorAll('script[src*="agent.d-id.com"]').forEach((s) => s.remove());
      document.querySelectorAll('[id^="did-avatar-container-"]').forEach((el) => {
        if (el instanceof HTMLElement) el.innerHTML = '';
      });

      // Ensure container has the unique id
      if (containerRef.current) {
        containerRef.current.id = containerId;
        containerRef.current.innerHTML = '';
      }

      // Get credentials from environment
      const clientKey = import.meta.env.VITE_DID_CLIENT_KEY || 'your-default-key';
      const agentId = import.meta.env.VITE_DID_AGENT_ID || 'your-agent-id';

      // Create fresh script element
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://agent.d-id.com/v2/index.js';
      script.setAttribute('data-mode', 'full');
      script.setAttribute('data-client-key', clientKey);
      script.setAttribute('data-agent-id', agentId);
      script.setAttribute('data-name', 'did-agent');
      script.setAttribute('data-monitor', 'true');
      script.setAttribute('data-target-id', containerId);  // KEY: Target our container

      document.body.appendChild(script);
      scriptRef.current = script;
    };

    init();

    // Listen for external refresh events
    const handler = () => {
      if (scriptRef.current?.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      init();
    };

    window.addEventListener('metaAvatarRefresh', handler);

    return () => {
      window.removeEventListener('metaAvatarRefresh', handler);
      if (scriptRef.current?.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
```

### 3. Global Rendering in Layout (`Layout.tsx`)

The Layout renders MetaAvatar at the root level with dynamic CSS positioning:

```typescript
import { MetaAvatarProvider, useMetaAvatar } from '@/contexts/MetaAvatarContext';
import { MetaAvatar } from '@/components/MetaAvatar';

function LayoutContent({ children }: { children: ReactNode }) {
  const { avatarInitialized, activeContainer } = useMetaAvatar();

  // Dynamic CSS classes based on active container
  const getAvatarContainerClasses = () => {
    const baseClasses = "transition-all duration-300 pointer-events-auto";
    
    if (!activeContainer) {
      // Hidden state
      return `${baseClasses} opacity-0 pointer-events-none fixed -z-10`;
    }
    
    switch (activeContainer) {
      case 'aigent':
        return `${baseClasses} fixed bottom-4 right-4 w-80 h-96 z-[100] rounded-lg overflow-hidden shadow-2xl`;
      case 'pennydrops':
        return `${baseClasses} fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] z-[100]`;
      default:
        return `${baseClasses} opacity-0 pointer-events-none`;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Page content */}
      {children}
      
      {/* Drawers, navigation, etc. */}
      <AigentDrawer isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
      
      {/* GLOBAL MetaAvatar - rendered once, positioned via CSS */}
      {avatarInitialized && (
        <div className={getAvatarContainerClasses()}>
          <MetaAvatar key={avatarRefreshKey} />
        </div>
      )}
    </div>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <MetaAvatarProvider>
      <LayoutContent>{children}</LayoutContent>
    </MetaAvatarProvider>
  );
}
```

### 4. Consumer Pattern - Drawer Integration

Drawers request/release avatar ownership based on their open state:

```typescript
import { useMetaAvatar } from '@/contexts/MetaAvatarContext';

export function AigentDrawer({ isOpen, onClose }: AigentDrawerProps) {
  const [viewMode, setViewMode] = useState<'metavatar' | 'chat'>('metavatar');
  const { requestAvatar, releaseAvatar } = useMetaAvatar();

  // Request/release based on drawer state AND view mode
  useEffect(() => {
    if (isOpen && viewMode === 'metavatar') {
      requestAvatar('aigent');
    } else {
      releaseAvatar('aigent');  // CRITICAL: Pass container name for safety check
    }
    
    return () => {
      releaseAvatar('aigent');
    };
  }, [isOpen, viewMode, requestAvatar, releaseAvatar]);

  return (
    <div className={`drawer ${isOpen ? 'open' : ''}`}>
      {/* Drawer content - avatar renders globally, not here */}
      <div className="drawer-header">
        <button onClick={() => setViewMode('metavatar')}>Avatar</button>
        <button onClick={() => setViewMode('chat')}>Chat</button>
      </div>
      
      {viewMode === 'chat' && (
        <div className="chat-interface">
          {/* Chat UI */}
        </div>
      )}
    </div>
  );
}
```

### 5. Modal/Fullscreen Awareness

When modals or fullscreen views activate, release the avatar:

```typescript
export function PennyDropsDrawer({ isOpen, onClose }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { requestAvatar, releaseAvatar, activeContainer } = useMetaAvatar();

  useEffect(() => {
    if (isOpen && !isModalOpen) {
      requestAvatar('pennydrops');
    } else {
      releaseAvatar('pennydrops');
    }
    
    return () => releaseAvatar('pennydrops');
  }, [isOpen, isModalOpen]);

  const handleOpenModal = () => {
    releaseAvatar('pennydrops');  // Release before modal opens
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Avatar will be re-requested by the useEffect
  };

  return (
    <>
      <Drawer isOpen={isOpen}>
        <button onClick={handleOpenModal}>Open Fullscreen</button>
      </Drawer>
      
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {/* Modal content */}
      </Modal>
    </>
  );
}
```

---

## Race Condition Prevention

The `releaseAvatar` function includes a critical safety check:

```typescript
const releaseAvatar = (container?: Exclude<ContainerType, null>) => {
  setActiveContainer(current => {
    // Only release if the caller is the current active container
    if (container && current !== container) {
      console.log(`[MetaAvatar] ${container} tried to release, but ${current} is active - ignoring`);
      return current;  // Don't change state
    }
    return null;
  });
};
```

**Why this matters:**

Without this check, the following race condition can occur:

1. User opens AigentDrawer → `requestAvatar('aigent')`
2. User quickly opens PennyDropsDrawer → `requestAvatar('pennydrops')`
3. AigentDrawer's cleanup runs → `releaseAvatar()` would clear PennyDrops' ownership!

With the safety check, step 3 is ignored because 'aigent' is not the current owner.

---

## CSS Positioning Strategy

### Approach: Dynamic Class Switching

Instead of moving DOM elements, apply different CSS classes based on `activeContainer`:

```typescript
const getAvatarClasses = () => {
  const base = "transition-all duration-300 ease-in-out";
  
  switch (activeContainer) {
    case 'aigent':
      return cn(base, 
        "fixed bottom-4 right-4 z-[100]",
        "w-80 h-96",
        "rounded-lg shadow-2xl overflow-hidden"
      );
    case 'pennydrops':
      return cn(base,
        "fixed inset-0 z-[100]",
        "flex items-center justify-center",
        "bg-black/50"
      );
    default:
      return cn(base, "opacity-0 pointer-events-none fixed -z-10");
  }
};
```

### Responsive Considerations

```typescript
case 'aigent':
  return cn(base,
    // Mobile: full width bottom sheet
    "fixed bottom-0 left-0 right-0 h-[50vh] z-[100]",
    // Desktop: positioned card
    "md:bottom-4 md:right-4 md:left-auto md:w-80 md:h-96",
    "rounded-t-lg md:rounded-lg"
  );
```

---

## Environment Configuration

Add to `.env`:

```env
VITE_DID_CLIENT_KEY=your-d-id-client-key
VITE_DID_AGENT_ID=your-d-id-agent-id
```

---

## Troubleshooting

### Avatar Not Appearing

1. Check `avatarInitialized` is true in React DevTools
2. Verify `activeContainer` matches expected value
3. Check browser console for D-ID SDK errors
4. Verify environment variables are set

### Avatar Disappears Unexpectedly

1. Check for components calling `releaseAvatar` without passing container name
2. Look for unmounting components with cleanup effects
3. Add logging to track request/release calls

### Multiple Avatars Appearing

1. Ensure MetaAvatar is only rendered once (in Layout)
2. Check that cleanup removes old script/container elements
3. Verify unique container IDs

### Debug Logging

Enable detailed logging:

```typescript
const requestAvatar = (container: Exclude<ContainerType, null>) => {
  console.log(`[MetaAvatar] Request from ${container}`, {
    currentContainer: activeContainer,
    initialized: avatarInitialized,
    timestamp: new Date().toISOString()
  });
  // ... rest of function
};
```

---

## Extending the Pattern

### Adding a New Container Location

1. Add to `ContainerType`:
```typescript
type ContainerType = 'aigent' | 'pennydrops' | 'newlocation' | null;
```

2. Add CSS positioning in Layout:
```typescript
case 'newlocation':
  return `${baseClasses} fixed top-4 left-4 w-64 h-80 z-[100]`;
```

3. Implement consumer component:
```typescript
useEffect(() => {
  if (shouldShowAvatar) {
    requestAvatar('newlocation');
  }
  return () => releaseAvatar('newlocation');
}, [shouldShowAvatar]);
```

### Adapting for Other Third-Party Iframes

This pattern works for any iframe-based widget:

1. Replace MetaAvatar script injection with your SDK's initialization
2. Keep the container ref and unique ID pattern
3. Maintain the cleanup logic for removing old instances
4. Use the same context coordination pattern

---

## Summary

| Concept | Implementation |
|---------|----------------|
| **Singleton Render** | MetaAvatar in Layout, never unmounts |
| **Context Coordination** | MetaAvatarContext manages ownership |
| **CSS Positioning** | Dynamic classes based on activeContainer |
| **Drawer Integration** | Request on open, release on close |
| **Modal Awareness** | Release before modal, re-request after |
| **Race Prevention** | Container name check in releaseAvatar |
