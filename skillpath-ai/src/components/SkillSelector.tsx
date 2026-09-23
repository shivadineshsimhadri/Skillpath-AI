import React, { useState, useMemo } from 'react';
import { SKILL_CATEGORIES, CAREER_OPTIONS } from '../data/careerData';
import { Search, Plus, X, Sparkles, FileText, Check, Tag } from 'lucide-react';

interface SkillSelectorProps {
  currentSkills: string[];
  onToggleSkill: (skill: string) => void;
  onAddCustomSkill: (skill: string) => void;
  onClearSkills: () => void;
  onOpenResumeModal: () => void;
  selectedCareer: string;
}

export const SkillSelector: React.FC<SkillSelectorProps> = ({
  currentSkills,
  onToggleSkill,
  onAddCustomSkill,
  onClearSkills,
  onOpenResumeModal,
  selectedCareer
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Find target career benchmark skills to suggest
  const targetCareerData = useMemo(() => {
    return CAREER_OPTIONS.find(c => c.title === selectedCareer) || CAREER_OPTIONS[0];
  }, [selectedCareer]);

  const allSkillsList = useMemo(() => {
    const list: Array<{ name: string; category: string }> = [];
    Object.entries(SKILL_CATEGORIES).forEach(([cat, skills]) => {
      skills.forEach(skill => {
        list.push({ name: skill, category: cat });
      });
    });
    return list;
  }, []);

  const filteredSkills = useMemo(() => {
    return allSkillsList.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = activeCategory === 'All' || item.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [allSkillsList, searchQuery, activeCategory]);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      onAddCustomSkill(customInput.trim());
      setCustomInput('');
    }
  };

  const handleAddAllBenchmarkSkills = () => {
    targetCareerData.benchmarkCoreSkills.forEach(s => {
      const cleanName = s.split(' / ')[0].split(' or ')[0];
      if (!currentSkills.some(cs => cs.toLowerCase() === cleanName.toLowerCase())) {
        onToggleSkill(cleanName);
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Header and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>Your Current Skills</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
              {currentSkills.length} Selected
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Select the languages, libraries, databases, and tools you already know or have used.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenResumeModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-500/40 text-xs font-medium text-indigo-300 transition-colors shadow-sm cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paste Resume / Bio</span>
          </button>

          {currentSkills.length > 0 && (
            <button
              type="button"
              onClick={onClearSkills}
              className="text-xs text-slate-400 hover:text-red-400 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Selected Skills Pill Shelf */}
      <div className="min-h-16 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center gap-1.5">
        {currentSkills.length === 0 ? (
          <div className="text-xs text-slate-500 italic flex items-center gap-2 py-2 px-1">
            <Tag className="w-3.5 h-3.5" />
            <span>No skills selected yet. Click skills below, add custom ones, or paste your resume.</span>
          </div>
        ) : (
          currentSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-900/70 to-slate-800 text-indigo-200 border border-indigo-500/30 shadow-sm"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => onToggleSkill(skill)}
                className="text-slate-400 hover:text-white rounded p-0.5 hover:bg-indigo-700/50"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))
        )}
      </div>

      {/* Recommended for Selected Career */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="text-xs">
            <span className="font-semibold text-slate-200">Recommended for {selectedCareer}:</span>
            <span className="text-slate-400 ml-1 hidden sm:inline">Click to quickly add core expectations</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {targetCareerData.benchmarkCoreSkills.map((benchmarkSkill) => {
            const clean = benchmarkSkill.split(' / ')[0].split(' or ')[0];
            const alreadyHas = currentSkills.some(s => s.toLowerCase() === clean.toLowerCase());
            return (
              <button
                key={clean}
                type="button"
                onClick={() => onToggleSkill(clean)}
                className={`text-[11px] px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
                  alreadyHas
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                {alreadyHas ? <Check className="w-3 h-3 text-indigo-400" /> : <Plus className="w-3 h-3 text-slate-400" />}
                <span>{clean}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Custom Skill Input Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
        <div className="sm:col-span-7 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 80+ skills (e.g., React, TypeScript, Docker, SQL)..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <form onSubmit={handleCustomSubmit} className="sm:col-span-5 flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Add custom skill..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!customInput.trim()}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-indigo-600 disabled:opacity-40 text-slate-200 hover:text-white text-xs font-semibold shrink-0 transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          type="button"
          onClick={() => setActiveCategory('All')}
          className={`px-3 py-1 rounded-lg shrink-0 font-medium transition-colors ${
            activeCategory === 'All'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          All Categories
        </button>
        {Object.keys(SKILL_CATEGORIES).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-lg shrink-0 font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Browser Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-56 overflow-y-auto p-1">
        {filteredSkills.map(({ name }) => {
          const isSelected = currentSkills.some(s => s.toLowerCase() === name.toLowerCase());
          return (
            <button
              key={name}
              type="button"
              onClick={() => onToggleSkill(name)}
              className={`p-2 rounded-lg border text-left text-xs font-medium transition-all flex items-center justify-between ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="truncate pr-1">{name}</span>
              {isSelected ? (
                <Check className="w-3.5 h-3.5 shrink-0 stroke-[3]" />
              ) : (
                <Plus className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
