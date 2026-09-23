import React from 'react';
import { RoadmapPhase } from '../types';
import {
  CheckCircle2,
  Circle,
  Clock,
  Code2,
  HelpCircle,
  Layers,
  ArrowRight,
  Sparkles,
  MessageSquare
} from 'lucide-react';

interface RoadmapViewProps {
  roadmap: RoadmapPhase[];
  onTogglePhaseCompletion: (phaseId: string) => void;
  selectedCareer: string;
  onAskAboutPhase: (phaseSkill: string) => void;
  onNavigateToProjects: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  roadmap,
  onTogglePhaseCompletion,
  selectedCareer,
  onAskAboutPhase,
  onNavigateToProjects
}) => {
  const completedCount = roadmap.filter(p => p.completed).length;
  const totalCount = roadmap.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (roadmap.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
        <Sparkles className="w-8 h-8 text-indigo-400 mx-auto" />
        <h3 className="text-base font-bold text-white">No Roadmap Generated Yet</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Please generate an AI analysis from the Profile or Analysis tab to create your personalized gap-based roadmap.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Progress Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Personalized Gap Roadmap
            </span>
            <span className="text-xs text-slate-400">
              Customized for {selectedCareer}
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Targeted Skill Gap Progression
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Every phase in this roadmap directly resolves one of your identified skill gaps. Toggle phases as completed to track your compounding progress.
          </p>
        </div>

        {/* Completion Progress Widget */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 shrink-0 min-w-56 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Roadmap Progress</span>
            <span className="font-mono font-bold text-indigo-400">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500 flex justify-between">
            <span>{completedCount} of {totalCount} Phases Complete</span>
            {completedCount === totalCount && (
              <span className="text-emerald-400 font-bold">All Completed!</span>
            )}
          </div>
        </div>
      </div>

      {/* Phases Timeline */}
      <div className="space-y-4">
        {roadmap.map((phase, index) => {
          return (
            <div
              key={phase.id}
              className={`p-5 rounded-2xl border transition-all duration-200 relative overflow-hidden ${
                phase.completed
                  ? 'bg-slate-900/40 border-emerald-800/50 shadow-sm shadow-emerald-500/5'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 shadow-md'
              }`}
            >
              {/* Top Row: Phase number, Title, Duration, Completion Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm font-mono shrink-0 transition-colors ${
                      phase.completed
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                        : 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                    }`}
                  >
                    {phase.phaseNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-indigo-400 font-mono">
                        Phase {phase.phaseNumber}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {phase.estimatedDuration}
                      </span>
                    </div>
                    <h3
                      className={`text-base font-bold transition-colors ${
                        phase.completed ? 'text-emerald-300 line-through' : 'text-white'
                      }`}
                    >
                      {phase.skill}
                    </h3>
                  </div>
                </div>

                {/* Interactive Completion State Button */}
                <button
                  type="button"
                  onClick={() => onTogglePhaseCompletion(phase.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer self-start sm:self-auto ${
                    phase.completed
                      ? 'bg-emerald-950/80 border border-emerald-600 text-emerald-300 hover:bg-emerald-900/80 shadow-sm'
                      : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-indigo-600 hover:text-white hover:border-indigo-500'
                  }`}
                >
                  {phase.completed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Phase Completed</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4 text-slate-400" />
                      <span>Mark as Complete</span>
                    </>
                  )}
                </button>
              </div>

              {/* Body Details */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-3 pt-3 border-t border-slate-800/80 text-xs">
                {/* Why It Is Needed */}
                <div className="lg:col-span-5 space-y-1">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Why This Skill Is Needed</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {phase.whyNeeded}
                  </p>

                  {/* Prerequisites */}
                  <div className="pt-2">
                    <span className="text-[10px] text-slate-500 font-semibold block mb-1">
                      Prerequisites:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {phase.prerequisites && phase.prerequisites.length > 0 ? (
                        phase.prerequisites.map((pre, pidx) => (
                          <span
                            key={pidx}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono"
                          >
                            {pre}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">None</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recommended Practical Project */}
                <div className="lg:col-span-7 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-400 uppercase tracking-wider mb-1">
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Recommended Practical Project</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed font-sans">
                      {phase.recommendedProject}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => onAskAboutPhase(phase.skill)}
                      className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Ask AI: "Why do I need {phase.skill}?"</span>
                    </button>

                    <button
                      type="button"
                      onClick={onNavigateToProjects}
                      className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
                    >
                      <span>Explore full projects</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
