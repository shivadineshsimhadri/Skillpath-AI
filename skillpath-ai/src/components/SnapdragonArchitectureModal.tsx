import React, { useEffect, useState } from 'react';
import { X, Cpu, Cloud, ShieldAlert, Zap, Layers, Lock, Terminal, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { inferenceService, AIRuntimeInfo } from '../services/aiInference';

interface SnapdragonArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SnapdragonArchitectureModal: React.FC<SnapdragonArchitectureModalProps> = ({
  isOpen,
  onClose
}) => {
  const [runtimeInfo, setRuntimeInfo] = useState<AIRuntimeInfo>(inferenceService.getRuntimeInfo());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      inferenceService.refreshRuntimeConfig().then(info => {
        setRuntimeInfo(info);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const updated = await inferenceService.refreshRuntimeConfig();
      setRuntimeInfo(updated);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Determine badge styling strictly based on the 3 mandated states
  const getStatusBadge = () => {
    switch (runtimeInfo.status) {
      case 'snapdragon-configured':
        return {
          label: 'Snapdragon/Qualcomm provider configured',
          bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
          dot: 'bg-cyan-400',
          icon: <Cpu className="w-3.5 h-3.5 text-cyan-400" />
        };
      case 'snapdragon-unavailable':
        return {
          label: 'Snapdragon provider unavailable',
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
          dot: 'bg-amber-400',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
        };
      case 'development':
      default:
        return {
          label: 'Development AI',
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
          dot: 'bg-emerald-400',
          icon: <Cloud className="w-3.5 h-3.5 text-emerald-400" />
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">
                  AI Inference Architecture & Snapdragon Hub
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Single unified inference service with pluggable Qualcomm/QNN ONNX provider
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* AI Runtime Status - Developer & Debug Telemetry */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
                  Developer & Debug Telemetry: AI Runtime Status
                </span>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 border border-slate-700 transition cursor-pointer"
                title="Probe environment configuration"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Probe Status</span>
              </button>
            </div>

            {/* Status Pill */}
            <div className="flex flex-wrap items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-xs font-semibold ${badge.bg}`}>
                <span className={`w-2 h-2 rounded-full ${badge.dot} animate-pulse`} />
                <span>{badge.label}</span>
              </div>

              <div className="text-[11px] text-slate-400 font-mono">
                Active Provider: <span className="text-slate-200 font-semibold">{runtimeInfo.activeProviderName}</span>
              </div>
            </div>

            {/* Debug Config Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 font-mono text-[10px]">
              <div className="p-2 rounded bg-slate-900/80 border border-slate-800 text-slate-300">
                <span className="text-slate-500 block">AI_INFERENCE_PROVIDER:</span>
                <span className="text-indigo-300 font-bold">{runtimeInfo.configuredProvider || 'development'}</span>
              </div>
              <div className="p-2 rounded bg-slate-900/80 border border-slate-800 text-slate-300">
                <span className="text-slate-500 block">SNAPDRAGON_EXECUTION_PROVIDER:</span>
                <span className="text-cyan-300 font-bold">{runtimeInfo.executionProvider || 'QNN'}</span>
              </div>
              <div className="p-2 rounded bg-slate-900/80 border border-slate-800 text-slate-300 sm:col-span-2">
                <span className="text-slate-500 block">SNAPDRAGON_MODEL_PATH:</span>
                <span className="text-slate-300">{runtimeInfo.modelIdentifier || '(none configured - defaults to development)'}</span>
              </div>
              <div className="p-2 rounded bg-slate-900/80 border border-slate-800 text-slate-300 sm:col-span-2">
                <span className="text-slate-500 block">SNAPDRAGON_INFERENCE_ENDPOINT:</span>
                <span className="text-slate-300">{runtimeInfo.inferenceEndpoint || '(none configured - defaults to development)'}</span>
              </div>
            </div>

            {/* Truthfulness Guarantee */}
            <p className="text-[11px] text-slate-400 italic">
              Verification Policy: Snapdragon NPU execution is never claimed active unless genuine on-device hardware execution is verified.
            </p>
          </div>

          {/* Architecture Diagram */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Inference Architecture Hierarchy
            </span>
            <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-indigo-300 font-mono overflow-x-auto leading-relaxed">
{`SkillPath UI (AnalysisDashboard, AIChatAssistant, Roadmap, Projects)
   ↓
AI Inference Service (src/services/aiInference.ts)
   ↓
Inference Provider Interface (AIInferenceProvider)
   ├── Current/Web Development Provider (DevelopmentAIProvider → Gemini 3.8 Flash)
   └── Snapdragon/Qualcomm AI Hub Provider (SnapdragonQualcommProvider → ONNX / QNN)`}
            </pre>
          </div>

          {/* Integration Guide for Snapdragon Windows PCs */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-900/40 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <Cpu className="w-4 h-4" />
              <span>Snapdragon Windows PCs & Qualcomm AI Hub Integration Guide</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              To connect a Qualcomm AI Hub optimized ONNX model on a Snapdragon Copilot+ PC (Snapdragon X Elite / Snapdragon X Plus running Windows 11 on ARM64):
            </p>

            <ol className="list-decimal list-inside space-y-2 text-slate-300">
              <li>
                <strong className="text-white">Export from Qualcomm AI Hub:</strong> Compile model weights for Qualcomm Hexagon NPU using the Qualcomm Neural Network (QNN) target:
                <div className="mt-1 p-2 rounded bg-slate-900 font-mono text-[10px] text-cyan-200">
                  qai-hub compile --model llama_v3_2_3b --target-runtime onnx --device &quot;Snapdragon X Elite CRD&quot;
                </div>
              </li>
              <li>
                <strong className="text-white">Configure Environment Variables:</strong> In <code className="text-indigo-300">.env</code>:
                <div className="mt-1 p-2 rounded bg-slate-900 font-mono text-[10px] text-cyan-200">
                  AI_INFERENCE_PROVIDER=&quot;snapdragon&quot;<br />
                  SNAPDRAGON_MODEL_PATH=&quot;C:\\models\\qnn\\llama-3.2-3b-instruct.onnx&quot;<br />
                  SNAPDRAGON_EXECUTION_PROVIDER=&quot;QNN&quot;
                </div>
              </li>
              <li>
                <strong className="text-white">ONNX Runtime Execution Hook:</strong> The modular provider (<code className="text-indigo-300">src/services/providers/snapdragonProvider.ts</code>) connects through ONNX Runtime with Qualcomm QNN Execution Provider:
                <div className="mt-1 p-2 rounded bg-slate-900 font-mono text-[10px] text-cyan-200">
                  import * as ort from &apos;onnxruntime-node&apos;;<br />
                  const session = await ort.InferenceSession.create(modelPath, &#123;<br />
                  &nbsp;&nbsp;executionProviders: [&#123; name: &apos;QNN&apos;, deviceType: &apos;NPU&apos;, backendPath: &apos;QnnHtp.dll&apos; &#125;, &apos;DirectML&apos;, &apos;CPU&apos;]<br />
                  &#125;);
                </div>
              </li>
            </ol>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-200 text-xs">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>On-Device Hexagon NPU</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Up to 45 TOPS of dedicated NPU compute with low thermal footprint and zero cloud token fees.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-200 text-xs">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero-Data-Exfiltration Privacy</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Resume text, confidential work history, and custom notes are analyzed locally without network egress.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
