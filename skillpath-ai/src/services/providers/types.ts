import { AIAnalysisResult, ChatMessage, UserProfile, AIInferenceProviderConfig } from '../../types';

/**
 * AI Runtime Status representing current deployment state.
 * Strictly limited to:
 * - 'development': Running cloud/development AI engine (e.g. Gemini 3.8 Flash)
 * - 'snapdragon-configured': Model path or inference endpoint configured for Qualcomm AI Hub / Snapdragon
 * - 'snapdragon-unavailable': Snapdragon provider requested/inspected but no verified local model or NPU endpoint detected
 */
export type AIRuntimeStatus =
  | 'development'
  | 'snapdragon-configured'
  | 'snapdragon-unavailable';

export interface AIRuntimeInfo {
  status: AIRuntimeStatus;
  statusLabel: 'Development AI' | 'Snapdragon/Qualcomm provider configured' | 'Snapdragon provider unavailable';
  activeProviderId: string;
  activeProviderName: string;
  configuredProvider: string;
  modelIdentifier?: string;
  inferenceEndpoint?: string;
  executionProvider?: string;
  isHardwareVerified: boolean;
  notes: string;
}

export interface CareerAIContext {
  profile: UserProfile;
  analysis?: AIAnalysisResult | null;
}

/**
 * Clean AI Inference Provider Interface
 * All providers (Development / Cloud / Qualcomm AI Hub / Snapdragon NPU) adhere to this contract.
 */
export interface AIInferenceProvider {
  id: 'cloud-development' | 'snapdragon-qualcomm' | 'cloud-gemini' | 'snapdragon-npu-local';
  name: string;
  type: 'development' | 'snapdragon';
  description: string;

  /**
   * Probes whether the runtime, local weights, or endpoints are genuinely available
   */
  isAvailable(): Promise<boolean>;

  /**
   * Diagnostic runtime configuration and telemetry for developer debug information
   */
  getConfig(): AIInferenceProviderConfig;

  /**
   * Generates comprehensive role benchmark gap analysis and personalized roadmap
   */
  analyzeProfile(profile: UserProfile): Promise<AIAnalysisResult>;

  /**
   * Context-aware conversational career coaching
   */
  chat(
    messages: ChatMessage[],
    profile: UserProfile,
    analysis?: AIAnalysisResult | null
  ): Promise<string>;

  /**
   * Parses resume or professional bio text to extract recognized technical competencies
   */
  extractSkills(text: string): Promise<string[]>;
}
