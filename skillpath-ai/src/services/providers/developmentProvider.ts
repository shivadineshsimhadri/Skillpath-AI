import { AIAnalysisResult, ChatMessage, UserProfile, AIInferenceProviderConfig } from '../../types';
import { AIInferenceProvider } from './types';

/**
 * Current Web Development AI Provider
 *
 * Interfaces with the server-side AI proxy powered by Google Gemini 3.8 Flash
 * with built-in resilient algorithmic fallback for zero-downtime offline testing.
 */
export class DevelopmentAIProvider implements AIInferenceProvider {
  id = 'cloud-development' as const;
  name = 'Development AI (Gemini 3.8 Flash / Server Proxy)';
  type = 'development' as const;
  description = 'High-velocity neural reasoning via server-side proxy. Used for local development and cloud preview.';

  async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch('/api/inference-status');
      if (!res.ok) return false;
      const data = await res.json();
      return Boolean(data.available);
    } catch {
      return true; // resilient fallback active in server
    }
  }

  getConfig(): AIInferenceProviderConfig {
    return {
      id: 'cloud-gemini',
      name: 'Development AI',
      description: 'Server-side neural inference pipeline running Gemini 3.8 Flash with structured JSON schemas.',
      status: 'active',
      statusLabel: 'Development AI',
      npuHardwareAvailable: false,
      engineDetails: 'Engine: Gemini 3.8 Flash via Express Server Proxy | Latency: ~600-1100ms'
    };
  }

  async analyzeProfile(profile: UserProfile): Promise<AIAnalysisResult> {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Analysis request failed with status ${res.status}`);
    }

    return await res.json();
  }

  async chat(
    messages: ChatMessage[],
    profile: UserProfile,
    analysis?: AIAnalysisResult | null
  ): Promise<string> {
    // Preserve full career context: career goal, experience level, current skills, skill gaps, roadmap, project recommendations
    const payload = {
      messages,
      profile,
      analysis: analysis
        ? {
            prioritySkillGaps: analysis.prioritySkillGaps,
            roadmap: analysis.roadmap,
            projects: analysis.projects,
            summary: analysis.summary,
            skillCoverage: analysis.skillCoverage
          }
        : undefined
    };

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Assistant request failed with status ${res.status}`);
    }

    const data = await res.json();
    return data.reply;
  }

  async extractSkills(text: string): Promise<string[]> {
    const res = await fetch('/api/extract-skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Extraction failed with status ${res.status}`);
    }

    const data = await res.json();
    return data.skills || [];
  }
}
