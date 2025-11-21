import { useEffect, useRef } from 'react';

export function MetaAvatar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const containerIdRef = useRef(`did-avatar-container-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    const init = () => {
      const containerId = (containerIdRef.current = `did-avatar-container-${Math.random().toString(36).slice(2)}`);

      console.log("[MetaAvatar] init", { containerId, ts: new Date().toISOString() });

      // Remove any previously injected D-ID artifacts
      document.querySelectorAll('script[src*="agent.d-id.com"]').forEach((s) => s.remove());
      document.querySelectorAll('[id^="did-avatar-container-"]').forEach((el) => {
        if (el instanceof HTMLElement) el.innerHTML = '';
      });

      // Ensure container has the unique id
      if (containerRef.current) {
        containerRef.current.id = containerId;
        containerRef.current.innerHTML = '';
      }

      // Get credentials from environment (must be provided by the host app)
      const clientKey = import.meta.env.VITE_DID_CLIENT_KEY;
      const agentId = import.meta.env.VITE_DID_AGENT_ID;

      if (!clientKey || !agentId) {
        console.error("[MetaAvatar] Missing D-ID credentials. Set VITE_DID_CLIENT_KEY and VITE_DID_AGENT_ID.", {
          hasClientKey: !!clientKey,
          hasAgentId: !!agentId,
        });
        return;
      }

      // Create fresh script element
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://agent.d-id.com/v2/index.js';
      script.setAttribute('data-mode', 'full');
      script.setAttribute('data-client-key', clientKey);
      script.setAttribute('data-agent-id', agentId);
      script.setAttribute('data-name', 'did-agent');
      script.setAttribute('data-monitor', 'true');
      script.setAttribute('data-target-id', containerId);

      document.body.appendChild(script);
      scriptRef.current = script;
    };

    // Initialize on mount
    init();

    // Listen for external refresh events
    const handler = () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
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
