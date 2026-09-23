import React from 'react';
import { ExperienceLevel } from '../types';
import { GraduationCap, Briefcase, Award, Crown, Check } from 'lucide-react';

interface ExperienceSelectorProps {
  experienceLevel: ExperienceLevel;
  onSelectExperience: (level: ExperienceLevel) => void;
}

export const ExperienceSelector: React.FC<ExperienceSelectorProps> = ({
  experienceLevel,
  onSelectExperience
}) => {
  const levels: Array<{
    id: ExperienceLevel;
    label: string;
    sublabel: string;
    description: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'beginner',
      label: 'Beginner / Student',
      sublabel: '0 years',
      description: 'Building fundamentals, studying core syntax, or exploring first software projects.',
      icon: <GraduationCap className="w-5 h-5" />
    },
    {
      id: 'junior',
      label: 'Junior / Transitioning',
      sublabel: '0 - 2 years',
      description: 'Familiar with basic tools, working on portfolio repos, transitioning into tech.',
      icon: <Briefcase className="w-5 h-5" />
    },
    {
      id: 'mid',
      label: 'Mid-Level Engineer',
      sublabel: '2 - 5 years',
      description: 'Autonomous execution, production deployments, system architecture & APIs.',
      icon: <Award className="w-5 h-5" />
    },
    {
      id: 'senior',
      label: 'Senior / Specialist',
      sublabel: '5+ years',
      description: 'Distributed architectures, mentoring, high-throughput scaling & technical strategy.',
      icon: <Crown className="w-5 h-5" />
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>Experience Level</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              Calibrates AI Depth
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Tailors benchmark expectations, project complexity, and roadmap pace.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {levels.map((lvl) => {
          const isSelected = experienceLevel === lvl.id;
          return (
            <button
              key={lvl.id}
              type="button"
              onClick={() => onSelectExperience(lvl.id)}
              className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-950/40 border-indigo-500 text-slate-100 shadow-sm shadow-indigo-500/10 ring-1 ring-indigo-500/40'
                  : 'bg-slate-900/60 hover:bg-slate-800/70 border-slate-800 text-slate-300'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {lvl.icon}
                  </div>
                  <div>
                    <span className="text-sm font-bold block leading-tight text-white">
                      {lvl.label}
                    </span>
                    <span className="text-[10px] font-mono text-indigo-400 font-semibold">
                      {lvl.sublabel}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {lvl.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
