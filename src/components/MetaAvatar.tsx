import { useEffect, useRef } from 'react';

interface MetaAvatarProps {
  agentId?: string;
  clientKey?: string;
  orientation?: 'horizontal' | 'vertical';
  position?: 'left' | 'right' | 'center';
  name?: string;
}

export function MetaAvatar({
  agentId = "v2_agt_dY78cKv2",
  clientKey = "Z29vZ2xlLW9hdXRoMnwxMDcyNjU3ODI2NjQ5ODgyODU4MDk6YkoxSDdROEp5S2Q1Mk1CbEx0ODE2",
  orientation = "horizontal",
  position = "right",
  name = "did-agent"
}: MetaAvatarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (scriptLoadedRef.current) return;

    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://agent.d-id.com/v2/index.js';
    script.setAttribute('data-mode', 'fabio');
    script.setAttribute('data-client-key', clientKey);
    script.setAttribute('data-agent-id', agentId);
    script.setAttribute('data-name', name);
    script.setAttribute('data-monitor', 'true');
    script.setAttribute('data-orientation', orientation);
    script.setAttribute('data-position', position);

    if (containerRef.current) {
      containerRef.current.appendChild(script);
      scriptLoadedRef.current = true;
    }

    return () => {
      if (containerRef.current && script.parentNode === containerRef.current) {
        containerRef.current.removeChild(script);
        scriptLoadedRef.current = false;
      }
    };
  }, [agentId, clientKey, orientation, position, name]);

  return <div ref={containerRef} className="w-full h-full" />;
}
