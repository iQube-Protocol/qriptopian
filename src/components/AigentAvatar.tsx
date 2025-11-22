import { useEffect, useRef } from 'react';

export function AigentAvatar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const containerIdRef = useRef('aigent-avatar-container');

  useEffect(() => {
    const containerId = containerIdRef.current;

    console.log("[AigentAvatar] init", { containerId, ts: new Date().toISOString() });

    // Remove any previously injected D-ID artifacts for this container
    document.querySelectorAll(`script[data-target-id="${containerId}"]`).forEach((s) => s.remove());
    const existingContainer = document.getElementById(containerId);
    if (existingContainer instanceof HTMLElement) {
      existingContainer.innerHTML = '';
    }

    // Ensure container has the unique id
    if (containerRef.current) {
      containerRef.current.id = containerId;
      containerRef.current.innerHTML = '';
    }

    // Get credentials from environment
    const clientKey = import.meta.env.VITE_DID_CLIENT_KEY || 'Z29vZ2xlLW9hdXRoMnwxMDcyNjU3ODI2NjQ5ODgyODU4MDk6YkoxSDdROEp5S2Q1Mk1CbEx0ODE2';
    const agentId = import.meta.env.VITE_DID_AGENT_ID || 'v2_agt_dY78cKv2';

    // Create fresh script element
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://agent.d-id.com/v2/index.js';
    script.setAttribute('data-mode', 'full');
    script.setAttribute('data-client-key', clientKey);
    script.setAttribute('data-agent-id', agentId);
    script.setAttribute('data-name', 'aigent-agent');
    script.setAttribute('data-monitor', 'true');
    script.setAttribute('data-target-id', containerId);

    document.body.appendChild(script);
    scriptRef.current = script;

    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
