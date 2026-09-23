import React from 'react';
import { AIAnalysisResult } from '../types';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Target,
  Clock,
  Compass,
  CheckCircle2,
  RefreshCw,
  Loader2,
  ListOrdered
} from 'lucide-react';

interface AnalysisDashboardProps {
  analysis: AIAnalysisResult | null;
  isLoading: boolean;
  onRefreshAnalysis: () => void;
  onNavigateToRoadmap: () => void;
  onNavigateToProjects: () => void;
  selectedCareer: string;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  analysis,
  isLoading,
  onRefreshAnalysis,
  onNavigateToRoadmap,
  onNavigateToProjects,
  selectedCareer
}) => {
  if (isLoading) {
    return (
      <div className="min-h-[420px] rounded-2xl bg-slate-900/60 border border-slate-800 p-8 flex flex-col items-center justify-center text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <Sparkles className="w-4 h-4 text-cyan-400 absolute -top-1 -right-1 animate-pulse" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-100">
            Running Context-Aware AI Career Analysis
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Cross-referencing your skills and experience level against live industry benchmarks for{' '}
            <strong className="text-indigo-400">{selectedCareer}</strong>...
          </p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-[400px] rounded-2xl bg-slate-900/60 border border-slate-800 p-8 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <Compass className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-100">
            No Analysis Generated Yet
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Select your target career, experience level, and skills, then click the button below to generate your personalized gap report.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefreshAnalysis}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate AI Analysis</span>
        </button>
      </div>
    );
  }

  const { skillCoverage, currentStrengths, prioritySkillGaps, requiredSkills, recommendedLearningOrder } = analysis;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Context-Aware Analysis
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Target: <strong className="text-slate-200">{analysis.careerGoal}</strong> ({analysis.experienceLevel})
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Career Skill Profile & Gap Analysis
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            {analysis.summary}
          </p>
        </div>

        <button
          type="button"
          onClick={onRefreshAnalysis}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 shrink-0 transition-colors cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
          <span>Re-run Analysis</span>
        </button>
      </div>

      {/* Credibility Metrics Row (No fake job readiness score) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: Skill Coverage */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-400">Skill Coverage</span>
            <Target className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white font-mono">
                {skillCoverage.coveragePercentage}%
              </span>
              <span className="text-[11px] text-slate-400">
                ({skillCoverage.possessedCount} skills matched)
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 mt-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(skillCoverage.coveragePercentage, 100)}%` }}
              />
            </div>
          </div>
          <span className="text-[10px] text-slate-500 mt-2 block">
            Possessed vs benchmark requirements
          </span>
        </div>

        {/* Metric 2: Priority Gaps */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-400">Priority Gaps</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-amber-400 font-mono">
                {skillCoverage.priorityGapsCount}
              </span>
              <span className="text-xs text-slate-400">identified</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              High & medium impact skills to acquire
            </p>
          </div>
          <span className="text-[10px] text-amber-400/80 mt-2 block font-medium">
            Personalized in Roadmap tab
          </span>
        </div>

        {/* Metric 3: Recommended Next Skills */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-400">Recommended Next Skills</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-cyan-400 font-mono">
                {skillCoverage.recommendedNextSkillsCount}
              </span>
              <span className="text-xs text-slate-400">immediate</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Sequenced for maximum compounding effect
            </p>
          </div>
          <span className="text-[10px] text-cyan-400/80 mt-2 block font-medium">
            Optimal learning order
          </span>
        </div>

        {/* Metric 4: Roadmap Milestones */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-400">Roadmap Milestones</span>
            <Compass className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {analysis.roadmap.length}
              </span>
              <span className="text-xs text-slate-400">phases</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {analysis.roadmap.filter(p => p.completed).length} completed so far
            </p>
          </div>
          <button
            onClick={onNavigateToRoadmap}
            className="text-[10px] text-indigo-400 hover:text-indigo-300 mt-2 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Open Interactive Roadmap</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Grid: Strengths & Priority Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Strengths */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">
                  Current Strengths
                </h3>
                <p className="text-[11px] text-slate-400">
                  Skills you already have that elevate your {selectedCareer} profile
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
              {currentStrengths.length} Validated
            </span>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {currentStrengths.length === 0 ? (
              <div className="text-xs text-slate-500 italic p-4 text-center">
                No active skills recorded yet. Add your current skills in the Profile tab.
              </div>
            ) : (
              currentStrengths.map((str, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-emerald-300 font-mono">
                      {str.skill}
                    </span>
                    {str.category && (
                      <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">
                        {str.category}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {str.whyStrong}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Priority Skill Gaps */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">
                  Priority Skill Gaps
                </h3>
                <p className="text-[11px] text-slate-400">
                  Key requirements to bridge for competitive hiring
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-full">
              {prioritySkillGaps.length} Gaps
            </span>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {prioritySkillGaps.length === 0 ? (
              <div className="text-xs text-emerald-400 p-4 text-center font-medium bg-emerald-950/20 rounded-xl border border-emerald-800/30">
                All benchmark core requirements are represented in your skill profile!
              </div>
            ) : (
              prioritySkillGaps.map((gap) => (
                <div
                  key={gap.id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-200 font-mono">
                      {gap.skill}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          gap.priority.toLowerCase() === 'high'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : gap.priority.toLowerCase() === 'medium'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {gap.priority} Priority
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {gap.timeToLearn}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {gap.impact}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recommended Learning Order */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <ListOrdered className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Recommended Learning Order
              </h3>
              <p className="text-[11px] text-slate-400">
                Sequenced learning progression designed to prevent cognitive overload
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToRoadmap}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            <span>View Full Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {recommendedLearningOrder.map((step) => (
            <div
              key={step.step}
              className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center font-mono">
                    {step.step}
                  </span>
                  <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/40">
                    {step.targetHorizon}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">
                  {step.skill}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  {step.rationale}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-cyan-300 flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-cyan-400" />
                <span><strong>Milestone:</strong> {step.milestone}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Required Skills Benchmark Overview */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              Role Benchmark Skills Matrix
            </h3>
            <p className="text-[11px] text-slate-400">
              Comprehensive role expectations for {selectedCareer} categorized by importance
            </p>
          </div>
          <button
            onClick={onNavigateToProjects}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            <span>See Project Blueprints</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {requiredSkills.map((req, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border transition-colors flex items-start justify-between gap-2 ${
                req.alreadyAcquired
                  ? 'bg-slate-950/40 border-emerald-900/40 text-slate-300'
                  : 'bg-slate-950/80 border-slate-800 text-slate-400'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs font-bold text-slate-200">
                    {req.skill}
                  </span>
                  <span
                    className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                      req.importance === 'core'
                        ? 'bg-indigo-900/60 text-indigo-300'
                        : req.importance === 'important'
                        ? 'bg-slate-800 text-slate-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {req.importance}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {req.description}
                </p>
              </div>

              <div className="shrink-0 mt-0.5">
                {req.alreadyAcquired ? (
                  <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
                    <CheckCircle2 className="w-3 h-3" />
                    Covered
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-amber-400/90 flex items-center gap-1 bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-800/30">
                    Gap
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
