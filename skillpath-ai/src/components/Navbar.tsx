import React from 'react';
import { Compass, Cpu, Sparkles, User, BarChart3, Map, FolderGit2, MessageSquare } from 'lucide-react';
import { inferenceService } from '../services/aiInference';

interface NavbarProps {
  activeTab: 'setup' | 'analysis' | 'roadmap' | 'projects' | 'assistant';
  setActiveTab: (tab: 'setup' | 'analysis' | 'roadmap' | 'projects' | 'assistant') => void;
  selectedCareer: string;
  onOpenArchitectureModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedCareer,
  onOpenArchitectureModal
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('setup')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  SkillPath AI
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Career Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Context-Aware Career Analysis & Roadmaps
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('setup')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'setup'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile & Skills</span>
            </button>

            <button
              onClick={() => setActiveTab('analysis')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'analysis'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>AI Analysis</span>
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'roadmap'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Roadmap</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'projects'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>Projects</span>
            </button>

            <button
              onClick={() => setActiveTab('assistant')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'assistant'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>AI Assistant</span>
            </button>
          </nav>

          {/* Inference Architecture Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenArchitectureModal}
              title="View AI Inference Architecture & Qualcomm Snapdragon NPU Roadmap"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden lg:inline text-slate-400">AI Runtime:</span>
              <span className="text-emerald-400 font-semibold">{inferenceService.getRuntimeStatusLabel()}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden flex overflow-x-auto py-2 px-4 gap-1 border-t border-slate-800 bg-slate-900/95 scrollbar-none">
        <button
          onClick={() => setActiveTab('setup')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium shrink-0 ${
            activeTab === 'setup' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-800'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          Profile
        </button>
        <button
          onClick={() => setActiveTab('analysis')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium shrink-0 ${
            activeTab === 'analysis' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-800'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Analysis
        </button>
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium shrink-0 ${
            activeTab === 'roadmap' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-800'
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          Roadmap
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium shrink-0 ${
            activeTab === 'projects' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-800'
          }`}
        >
          <FolderGit2 className="w-3.5 h-3.5" />
          Projects
        </button>
        <button
          onClick={() => setActiveTab('assistant')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium shrink-0 ${
            activeTab === 'assistant' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-800'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Assistant
        </button>
      </div>
    </header>
  );
};
