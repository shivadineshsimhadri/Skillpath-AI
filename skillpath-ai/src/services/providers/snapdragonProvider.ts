import { AIAnalysisResult, ChatMessage, UserProfile, AIInferenceProviderConfig } from '../../types';
import { AIInferenceProvider, AIRuntimeInfo, AIRuntimeStatus } from './types';
import { DevelopmentAIProvider } from './developmentProvider';

/**
 * ============================================================================
 * SNAPDRAGON / QUALCOMM AI HUB MODULAR INFERENCE PROVIDER
 * ============================================================================
 *
 * ARCHITECTURAL SPECIFICATION & INTEGRATION GUIDE FOR SNAPDRAGON WINDOWS PCs:
 * ----------------------------------------------------------------------------
 * This module is architected for on-device edge deployment on Snapdragon Copilot+
 * Windows PCs (e.g. Snapdragon X Elite, Snapdragon X Plus) and Qualcomm Snapdragon
 * 8-series platforms powered by the Qualcomm Hexagon NPU (up to 45 TOPS).
 *
 * WHERE A QUALCOMM AI HUB OPTIMIZED ONNX MODEL CONNECTS:
 * 1. Model Procurement & Compilation:
 *    Download or compile an optimized model from Qualcomm AI Hub:
 *    - e.g., Llama-3.2-3B-Instruct, Mistral-7B-Instruct, or Whisper-Base
 *    - Command: `qai-hub compile --target-runtime onnx --device "Snapdragon X Elite CRD" ...`
 *    - Output: `<model>.onnx` accompanied by the compiled QNN context binary (`<model>_qnn_ctx.bin`).
 *
 * 2. Execution Paths on Snapdragon Windows PCs:
 *    A) Local Node.js / Electron Backend (Server-Side QNN EP):
 *       On Windows on Arm, configure ONNX Runtime (`onnxruntime-node`) with the QNN
 *       Execution Provider:
 *       ```typescript
 *       import * as ort from 'onnxruntime-node';
 *       const session = await ort.InferenceSession.create(process.env.SNAPDRAGON_MODEL_PATH, {
 *         executionProviders: [
 *           {
 *             name: 'QNN',
 *             deviceType: 'NPU',
 *             backendPath: 'QnnHtp.dll' // Qualcomm Hexagon Tensor Processor driver
 *           },
 *           'DirectML', // Fallback GPU acceleration on Windows 11
 *           'CPU'
 *         ]
 *       });
 *       ```
 *
 *    B) Local Dedicated Inference Daemon (Local IPC/REST):
 *       Run a lightweight local daemon (e.g. llama.cpp or ONNX Runtime Server compiled
 *       for ARM64 with Qualcomm QNN enabled) listening on `127.0.0.1:8080`.
 *       Set `SNAPDRAGON_INFERENCE_ENDPOINT="http://127.0.0.1:8080/v1"`.
 *
 *    C) Browser Client WebNN with NPU DeviceType:
 *       When supported in Chromium on Snapdragon Windows 11:
 *       ```typescript
 *       // @ts-ignore
 *       const context = await navigator.ml.createContext({ deviceType: 'npu' });
 *       ```
 *
 * TRUTHFULNESS & STATUS POLICY:
 * - Disabled by default: Only activated when explicit environment variables and
 *   runtime connectivity are verified.
 * - If unconfigured or endpoint unreachable, status is strictly reported as:
 *   "Snapdragon provider unavailable" or "Development AI".
 * - Never claims "Snapdragon NPU active" in this preview environment.
 */

export interface SnapdragonConfig {
  provider: string;
  modelPath?: string;
  inferenceEndpoint?: string;
  executionProvider?: 'QNN' | 'DirectML' | 'CPU' | string;
  isConfigured: boolean;
  isVerifiedReachable: boolean;
}

export class SnapdragonQualcommProvider implements AIInferenceProvider {
  id = 'snapdragon-qualcomm' as const;
  name = 'Qualcomm AI Hub / Snapdragon NPU (Edge Architecture)';
  type = 'snapdragon' as const;
  description = 'Hardware-ready modular edge inference abstraction for Qualcomm Hexagon NPU on Snapdragon Windows PCs via ONNX Runtime / QNN.';

  private fallbackProvider = new DevelopmentAIProvider();
  private configState: SnapdragonConfig = {
    provider: 'development',
    modelPath: '',
    inferenceEndpoint: '',
    executionProvider: 'QNN',
    isConfigured: false,
    isVerifiedReachable: false
  };

  /**
   * Initializes runtime configuration from server status endpoint.
   * Ensures no API secrets are exposed to client code.
   */
  async initializeConfig(): Promise<SnapdragonConfig> {
    try {
      const res = await fetch('/api/inference-status');
      if (res.ok) {
        const data = await res.json();
        this.configState = {
          provider: data.configuredProvider || data.activeProvider || 'development',
          modelPath: data.modelPath || '',
          inferenceEndpoint: data.inferenceEndpoint || '',
          executionProvider: data.executionProvider || 'QNN',
          isConfigured: Boolean(data.isSnapdragonConfigured),
          isVerifiedReachable: Boolean(data.isHardwareVerified)
        };
      }
    } catch (err) {
      console.warn('[Snapdragon Provider] Could not probe runtime config:', err);
    }
    return this.configState;
  }

  /**
   * Evaluates if Snapdragon NPU execution is genuinely available and verified
   */
  async isAvailable(): Promise<boolean> {
    // Only return true if both configured AND verified on-device
    return this.configState.isConfigured && this.configState.isVerifiedReachable;
  }

  /**
   * Determines developer debug status
   */
  getRuntimeStatus(): AIRuntimeStatus {
    if (this.configState.isConfigured) {
      if (this.configState.isVerifiedReachable) {
        return 'snapdragon-configured';
      }
      return 'snapdragon-unavailable';
    }
    return 'development';
  }

  getRuntimeInfo(): AIRuntimeInfo {
    const isConfigured = this.configState.isConfigured;
    const isReachable = this.configState.isVerifiedReachable;

    let status: AIRuntimeStatus = 'development';
    let statusLabel: AIRuntimeInfo['statusLabel'] = 'Development AI';

    if (isConfigured && isReachable) {
      status = 'snapdragon-configured';
      statusLabel = 'Snapdragon/Qualcomm provider configured';
    } else if (isConfigured && !isReachable) {
      status = 'snapdragon-unavailable';
      statusLabel = 'Snapdragon provider unavailable';
    } else {
      status = 'development';
      statusLabel = 'Development AI';
    }

    return {
      status,
      statusLabel,
      activeProviderId: isReachable ? this.id : this.fallbackProvider.id,
      activeProviderName: isReachable ? this.name : this.fallbackProvider.name,
      configuredProvider: this.configState.provider,
      modelIdentifier: this.configState.modelPath || undefined,
      inferenceEndpoint: this.configState.inferenceEndpoint || undefined,
      executionProvider: this.configState.executionProvider || 'QNN',
      isHardwareVerified: false, // Never claim active NPU without verified local runtime probe
      notes: isConfigured
        ? isReachable
          ? 'Qualcomm AI Hub model endpoint configured and connected.'
          : 'Snapdragon provider configured via environment variables, but local ONNX/QNN runtime endpoint is unavailable.'
        : 'Snapdragon NPU provider is integration-ready. System currently operating on Development AI.'
    };
  }

  getConfig(): AIInferenceProviderConfig {
    const info = this.getRuntimeInfo();
    return {
      id: 'snapdragon-npu-local',
      name: 'Qualcomm AI Hub / Snapdragon NPU',
      description: 'Modular edge inference interface for local NPU processing on Snapdragon Copilot+ PCs. Zero cloud latency and private resume processing when enabled.',
      status: info.status === 'snapdragon-configured' ? 'ready-interface' : 'unavailable',
      statusLabel: info.statusLabel,
      npuHardwareAvailable: false,
      engineDetails: `Target: Hexagon NPU via ONNX Runtime (EP: ${this.configState.executionProvider || 'QNN'}) | Status: ${info.statusLabel} | Fallback: Active`
    };
  }

  /**
   * Performs profile analysis. If local Snapdragon endpoint is reachable, dispatches there;
   * otherwise transparently delegates to the Development Provider with telemetry logging.
   */
  async analyzeProfile(profile: UserProfile): Promise<AIAnalysisResult> {
    if (this.configState.isConfigured && this.configState.isVerifiedReachable && this.configState.inferenceEndpoint) {
      try {
        console.info(`[Snapdragon Provider] Dispatching analysis to local ONNX runtime at ${this.configState.inferenceEndpoint}...`);
        const res = await fetch(`${this.configState.inferenceEndpoint}/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profile)
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('[Snapdragon Provider] Local NPU inference endpoint call failed, delegating to Development AI:', err);
      }
    }

    // Standard fallback path
    return this.fallbackProvider.analyzeProfile(profile);
  }

  /**
   * Handles chat with full career context.
   */
  async chat(
    messages: ChatMessage[],
    profile: UserProfile,
    analysis?: AIAnalysisResult | null
  ): Promise<string> {
    if (this.configState.isConfigured && this.configState.isVerifiedReachable && this.configState.inferenceEndpoint) {
      try {
        console.info(`[Snapdragon Provider] Dispatching chat to local ONNX runtime at ${this.configState.inferenceEndpoint}...`);
        const res = await fetch(`${this.configState.inferenceEndpoint}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages, profile, analysis })
        });
        if (res.ok) {
          const data = await res.json();
          return data.reply;
        }
      } catch (err) {
        console.warn('[Snapdragon Provider] Local NPU chat call failed, delegating to Development AI:', err);
      }
    }

    // Standard fallback path
    return this.fallbackProvider.chat(messages, profile, analysis);
  }

  /**
   * Extracts technical skills from resume text.
   */
  async extractSkills(text: string): Promise<string[]> {
    if (this.configState.isConfigured && this.configState.isVerifiedReachable && this.configState.inferenceEndpoint) {
      try {
        const res = await fetch(`${this.configState.inferenceEndpoint}/extract-skills`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text })
        });
        if (res.ok) {
          const data = await res.json();
          return data.skills || [];
        }
      } catch (err) {
        console.warn('[Snapdragon Provider] Local NPU extraction failed, delegating to Development AI:', err);
      }
    }

    // Standard fallback path
    return this.fallbackProvider.extractSkills(text);
  }
}
