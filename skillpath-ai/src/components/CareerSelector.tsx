import React from 'react';
import { CAREER_OPTIONS } from '../data/careerData';
import { Layers, Layout, Server, Cpu, Database, Cloud, Smartphone, Shield, CheckCircle2 } from 'lucide-react';

interface CareerSelectorProps {
  selectedCareer: string;
  onSelectCareer: (career: string) => void;
}

export const CareerSelector: React.FC<CareerSelectorProps> = ({
  selectedCareer,
  onSelectCareer
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layers': return <Layers className="w-5 h-5" />;
      case 'Layout': return <Layout className="w-5 h-5" />;
      case 'Server': return <Server className="w-5 h-5" />;
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'Database': return <Database className="w-5 h-5" />;
      case 'Cloud': return <Cloud className="w-5 h-5" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5" />;
      case 'Shield': return <Shield className="w-5 h-5" />;
      default: return <Layers className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>Target Career Goal</span>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Required
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Select the specific professional discipline you are actively targeting.
          </p>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Selected: <span className="text-indigo-400 font-semibold">{selectedCareer}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {CAREER_OPTIONS.map((career) => {
          const isSelected = selectedCareer === career.title;
          return (
            <button
              key={career.id}
              type="button"
              onClick={() => onSelectCareer(career.title)}
              className={`relative text-left p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between group ${
                isSelected
                  ? 'bg-gradient-to-br from-indigo-950/60 via-slate-900 to-indigo-900/40 border-indigo-500/80 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                  : 'bg-slate-900/70 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 text-indigo-400">
                  <CheckCircle2 className="w-4 h-4 fill-indigo-400 text-slate-950" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                        : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700 group-hover:text-white'
                    }`}
                  >
                    {getIcon(career.icon)}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-500 block truncate">
                      {career.category}
                    </span>
                    <h4
                      className={`text-sm font-bold truncate leading-tight ${
                        isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'
                      }`}
                    >
                      {career.title}
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {career.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1">
                {career.benchmarkCoreSkills.slice(0, 3).map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-400 font-mono"
                  >
                    {skill.split(' / ')[0]}
                  </span>
                ))}
                {career.benchmarkCoreSkills.length > 3 && (
                  <span className="text-[10px] px-1 py-0.5 text-slate-500">
                    +{career.benchmarkCoreSkills.length - 3} more
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
