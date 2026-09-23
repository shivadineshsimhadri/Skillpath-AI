/**
 * ============================================================================
 * SKILLPATH AI - UNIFIED INFERENCE SERVICE ARCHITECTURE
 * ============================================================================
 *
 * Architecture:
 *   SkillPath UI
 *       ↓
 *   AI Inference Service (inferenceService)
 *       ↓
 *   Inference Provider Interface (AIInferenceProvider)
 *       ├── Current/Web Development Provider (DevelopmentAIProvider)
 *       └── Snapdragon/Qualcomm AI Hub Provider (SnapdragonQualcommProvider)
 *
 * Grounding & Truthfulness Policy:
 *   - The application communicates through this single unified inference service.
 *   - Snapdragon / Qualcomm AI Hub NPU execution is NOT claimed active unless
 *     explicitly configured and hardware-verified.
 *   - Defaults cleanly to Development AI (Google Gemini 3.8 Flash server-side).
 */

import { AIAnalysisResult, AIInferenceProviderConfig, ChatMessage, UserProfile } from '../types';
import { AIInferenceProvider, AIRuntimeInfo, AIRuntimeStatus } from './providers/types';
import { DevelopmentAIProvider } from './providers/developmentProvider';
import { SnapdragonQualcommProvider } from './providers/snapdragonProvider';

export * from './providers/types';
export { DevelopmentAIProvider } from './providers/developmentProvider';
export { SnapdragonQualcommProvider } from './providers/snapdragonProvider';

class UnifiedInferenceService {
  private developmentProvider: DevelopmentAIProvider;
  private snapdragonProvider: SnapdragonQualcommProvider;
  private activeProviderType: 'development' | 'snapdragon' = 'development';
  private runtimeInfoCache: AIRuntimeInfo | null = null;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.developmentProvider = new DevelopmentAIProvider();
    this.snapdragonProvider = new SnapdragonQualcommProvider();
    this.initPromise = this.init();
  }

  private async init(): Promise<void> {
    try {
      const snapConfig = await this.snapdragonProvider.initializeConfig();
      if (snapConfig.isConfigured && snapConfig.isVerifiedReachable) {
        this.activeProviderType = 'snapdragon';
      } else {
        this.activeProviderType = 'development';
      }
      this.runtimeInfoCache = this.snapdragonProvider.getRuntimeInfo();
    } catch (err) {
      console.warn('[UnifiedInferenceService] Initialization failed, using development provider:', err);
      this.activeProviderType = 'development';
    }
  }

  /**
   * Refreshes developer/debug runtime telemetry from the server
   */
  async refreshRuntimeConfig(): Promise<AIRuntimeInfo> {
    await this.snapdragonProvider.initializeConfig();
    this.runtimeInfoCache = this.snapdragonProvider.getRuntimeInfo();
    return this.runtimeInfoCache;
  }

  /**
   * Returns current AI Runtime status info for developer / debug information
   */
  getRuntimeInfo(): AIRuntimeInfo {
    if (this.runtimeInfoCache) {
      return this.runtimeInfoCache;
    }
    return this.snapdragonProvider.getRuntimeInfo();
  }

  /**
   * Returns current AI Runtime status:
   * 'development' | 'snapdragon-configured' | 'snapdragon-unavailable'
   */
  getRuntimeStatus(): AIRuntimeStatus {
    return this.getRuntimeInfo().status;
  }

  /**
   * Returns current AI Runtime status label:
   * 'Development AI' | 'Snapdragon/Qualcomm provider configured' | 'Snapdragon provider unavailable'
   */
  getRuntimeStatusLabel(): string {
    return this.getRuntimeInfo().statusLabel;
  }

  /**
   * Resolves the active provider according to configuration and verified availability
   */
  getActiveProvider(): AIInferenceProvider {
    if (this.activeProviderType === 'snapdragon') {
      return this.snapdragonProvider;
    }
    return this.developmentProvider;
  }

  /**
   * Main entry point for career profile analysis & gap detection.
   * Keeps the application code calling this service rather than direct providers.
   */
  async analyzeProfile(profile: UserProfile): Promise<AIAnalysisResult> {
    await this.initPromise;
    const provider = this.getActiveProvider();
    return provider.analyzeProfile(profile);
  }

  /**
   * Main entry point for context-aware conversational career assistant.
   * Passes complete context: career goal, experience level, current skills,
   * skill gaps, roadmap, and project recommendations.
   */
  async chat(
    messages: ChatMessage[],
    profile: UserProfile,
    analysis?: AIAnalysisResult | null
  ): Promise<string> {
    await this.initPromise;
    const provider = this.getActiveProvider();
    return provider.chat(messages, profile, analysis);
  }

  /**
   * Main entry point for skill extraction from resume / bio text.
   */
  async extractSkills(text: string): Promise<string[]> {
    await this.initPromise;
    const provider = this.getActiveProvider();
    return provider.extractSkills(text);
  }

  /**
   * Backward-compatible helper for legacy component calls
   */
  getProvider(id?: string): AIInferenceProvider {
    if (id === 'snapdragon-npu-local' || id === 'snapdragon-qualcomm') {
      return this.snapdragonProvider;
    }
    if (id === 'cloud-gemini' || id === 'cloud-development') {
      return this.developmentProvider;
    }
    return this.getActiveProvider();
  }

  getActiveProviderId(): string {
    return this.getActiveProvider().id;
  }

  getAllProviderConfigs(): AIInferenceProviderConfig[] {
    return [
      this.developmentProvider.getConfig(),
      this.snapdragonProvider.getConfig()
    ];
  }
}

export const inferenceService = new UnifiedInferenceService();
