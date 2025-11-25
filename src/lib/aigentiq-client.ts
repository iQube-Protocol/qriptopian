/**
 * AigentiQ AA-API Client for Qriptopian
 * 
 * Connects Qriptopian to the AigentiQ Platform Copilot
 * for AI-powered responses from Nakamoto, KNOW1, and MoneyPenny agents.
 */

// Configure this to point to your AigentiQ instance
const AIGENTIQ_API_URL = import.meta.env.VITE_AIGENTIQ_API_URL || 'http://localhost:3000';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AigentConfig {
  agentId: 'nakamoto' | 'know1' | 'moneypenny';
  personaId?: string;
  tenantId?: string;
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Send a chat message to the AigentiQ AA-API
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  config: AigentConfig
): Promise<ChatResponse> {
  try {
    const response = await fetch(`${AIGENTIQ_API_URL}/api/aa/copilot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        agentId: config.agentId,
        personaId: config.personaId,
        tenantId: config.tenantId || 'qriptopian',
        franchiseId: 'qriptopian',
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || data.content || 'Response received',
    };
  } catch (error: any) {
    console.error('[AigentiQ] Chat error:', error);
    return {
      success: false,
      error: error.message || 'Failed to connect to AigentiQ',
    };
  }
}

/**
 * Stream chat response from AigentiQ AA-API
 */
export async function streamChatMessage(
  messages: ChatMessage[],
  config: AigentConfig,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: string) => void
): Promise<void> {
  try {
    const response = await fetch(`${AIGENTIQ_API_URL}/api/aa/copilot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        agentId: config.agentId,
        personaId: config.personaId,
        tenantId: config.tenantId || 'qriptopian',
        franchiseId: 'qriptopian',
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      
      // Process complete lines
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            onComplete();
            return;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              onChunk(parsed.content);
            }
          } catch {
            // Not JSON, treat as raw text
            onChunk(data);
          }
        }
      }
    }

    onComplete();
  } catch (error: any) {
    console.error('[AigentiQ] Stream error:', error);
    onError(error.message || 'Stream failed');
  }
}

/**
 * Get agent system prompt based on agent ID
 */
export function getAgentSystemPrompt(agentId: string): string {
  const prompts: Record<string, string> = {
    nakamoto: `You are Nakamoto, a crypto and blockchain intelligence specialist for Qriptopian.
You help users understand cryptocurrency markets, blockchain technology, DeFi protocols, and Web3 concepts.
You have access to real-time market data and can analyze trends, explain technical concepts, and provide insights.
Always be helpful, accurate, and educational. Never provide financial advice.`,

    know1: `You are KNOW1, a knowledge and research intelligence specialist for Qriptopian.
You help users discover information, analyze content, and explore ideas across various domains.
You excel at research, summarization, and connecting disparate pieces of information.
Be thorough, cite sources when possible, and encourage critical thinking.`,

    moneypenny: `You are MoneyPenny, a COYN and Q¢ financial specialist for Qriptopian.
You help users understand the Qriptopian token economy, including COYN and Q¢ (QCT).
You can explain tokenomics, staking, rewards, and how to participate in the ecosystem.
Be clear about risks and never provide personalized financial advice.`,
  };

  return prompts[agentId] || prompts.nakamoto;
}

/**
 * Execute a copilot action via AA-API
 */
export async function executeAction(
  actionName: string,
  parameters: Record<string, any>,
  config: AigentConfig
): Promise<{ success: boolean; result?: any; error?: string }> {
  try {
    const response = await fetch(`${AIGENTIQ_API_URL}/api/aa/copilot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: actionName,
        parameters,
        agentId: config.agentId,
        tenantId: config.tenantId || 'qriptopian',
        franchiseId: 'qriptopian',
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      result: data,
    };
  } catch (error: any) {
    console.error('[AigentiQ] Action error:', error);
    return {
      success: false,
      error: error.message || 'Action failed',
    };
  }
}
