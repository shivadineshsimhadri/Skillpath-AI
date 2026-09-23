import React from 'react';
import { ProjectRecommendation } from '../types';
import {
  FolderGit2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  Briefcase,
  Star,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

interface ProjectRecommendationsProps {
  projects: ProjectRecommendation[];
  selectedCareer: string;
  onAskAboutProject: (projectTitle: string) => void;
}

export const ProjectRecommendations: React.FC<ProjectRecommendationsProps> = ({
  projects,
  selectedCareer,
  onAskAboutProject
}) => {
  if (!projects || projects.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
        <FolderGit2 className="w-8 h-8 text-indigo-400 mx-auto" />
        <h3 className="text-base font-bold text-white">No Project Recommendations Yet</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Run an AI analysis to generate Beginner, Intermediate, and Advanced project blueprints aligned with your skill gaps.
        </p>
      </div>
    );
  }

  const getDifficultyBadge = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'beginner':
        return (
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Beginner Tier
          </span>
        );
      case 'intermediate':
        return (
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Intermediate Tier
          </span>
        );
      case 'advanced':
        return (
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Advanced Capstone
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
            {diff}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Gap-Driven Projects
            </span>
            <span className="text-xs text-slate-400">
              Tailored for {selectedCareer}
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Portfolio Project Recommendations
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Hiring managers value proof of competency over passive courses. These 3 tiered projects allow you to practice and showcase your newly bridged skills.
          </p>
        </div>

        <div className="text-xs text-slate-400 font-mono bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800 shrink-0">
          Tiered Architecture: <strong className="text-indigo-400">3 Blueprints</strong>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-md group"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-2 mb-2">
                {getDifficultyBadge(proj.difficulty)}
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {proj.estimatedTime}
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                {proj.title}
              </h3>
              <p className="text-xs text-indigo-400/90 font-medium mt-0.5 mb-2.5">
                {proj.tagline}
              </p>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {proj.description}
              </p>

              {/* Skills Practiced */}
              <div className="space-y-1.5 mb-4">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Skills Practiced (Gaps Bridged):
                </span>
                <div className="flex flex-wrap gap-1">
                  {proj.skillsPracticed.map((skill, sidx) => (
                    <span
                      key={sidx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/70 text-indigo-200 border border-indigo-800/40"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Deliverables */}
              <div className="space-y-1.5 mb-4">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Core Requirements & Deliverables:
                </span>
                <ul className="space-y-1 text-xs text-slate-400">
                  {proj.keyDeliverables.map((deliv, didx) => (
                    <li key={didx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{deliv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Portfolio Value */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1 mb-4">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                  <Star className="w-3.5 h-3.5" />
                  <span>Resume & Interview Value</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {proj.portfolioValue}
                </p>
              </div>
            </div>

            {/* Action */}
            <div className="pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => onAskAboutProject(proj.title)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask AI Career Coach About This</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
