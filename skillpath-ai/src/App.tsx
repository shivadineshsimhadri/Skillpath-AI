/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, AIAnalysisResult, ExperienceLevel } from './types';
import { Navbar } from './components/Navbar';
import { CareerSelector } from './components/CareerSelector';
import { ExperienceSelector } from './components/ExperienceSelector';
import { SkillSelector } from './components/SkillSelector';
import { ResumeBioModal } from './components/ResumeBioModal';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { RoadmapView } from './components/RoadmapView';
import { ProjectRecommendations } from './components/ProjectRecommendations';
import { AIChatAssistant } from './components/AIChatAssistant';
import { SnapdragonArchitectureModal } from './components/SnapdragonArchitectureModal';
import { inferenceService } from './services/aiInference';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Compass,
  Map,
  FolderGit2,
  MessageSquare
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'setup' | 'analysis' | 'roadmap' | 'projects' | 'assistant'>('setup');
  const [selectedCareer, setSelectedCareer] = useState<string>('Full-Stack Developer');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('junior');
  const [currentSkills, setCurrentSkills] = useState<string[]>([
    'JavaScript',
    'React',
    'HTML5 & CSS3',
    'Git',
    'Node.js'
  ]);
  const [resumeBioText, setResumeBioText] = useState<string>('');

  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const [isResumeModalOpen, setIsResumeModalOpen] = useState<boolean>(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState<boolean>(false);
  const [assistantPrompt, setAssistantPrompt] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Run AI Analysis
  const runAnalysis = async () => {
    setIsLoadingAnalysis(true);
    setAnalysisError(null);

    const profile: UserProfile = {
      selectedCareer,
      experienceLevel,
      currentSkills,
      resumeBioText: resumeBioText.trim() ? resumeBioText : undefined
    };

    try {
      const result = await inferenceService.analyzeProfile(profile);
      setAnalysis(result);
      showToast('Context-aware analysis and personalized roadmap updated!');
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setAnalysisError(err.message || 'Analysis encountered an error. Please try again.');
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  // Trigger initial analysis on startup
  useEffect(() => {
    runAnalysis();
  }, []);

  // Skill toggle
  const handleToggleSkill = (skill: string) => {
    setCurrentSkills(prev => {
      const exists = prev.some(s => s.toLowerCase() === skill.toLowerCase());
      if (exists) {
        return prev.filter(s => s.toLowerCase() !== skill.toLowerCase());
      } else {
        return [...prev, skill];
      }
    });
  };

  // Add custom skill
  const handleAddCustomSkill = (skill: string) => {
    if (!currentSkills.some(s => s.toLowerCase() === skill.toLowerCase())) {
      setCurrentSkills(prev => [...prev, skill]);
      showToast(`Added "${skill}" to your skills.`);
    }
  };

  // Clear skills
  const handleClearSkills = () => {
    setCurrentSkills([]);
    showToast('Cleared all skills.');
  };

  // Add confirmed extracted skills from resume modal
  const handleAddExtractedSkills = (newSkills: string[]) => {
    setCurrentSkills(prev => {
      const existingLower = new Set(prev.map(s => s.toLowerCase()));
      const toAdd = newSkills.filter(s => !existingLower.has(s.toLowerCase()));
      return [...prev, ...toAdd];
    });
    showToast(`Added ${newSkills.length} verified skills from resume.`);
  };

  // Toggle roadmap phase completion state
  const handleTogglePhaseCompletion = (phaseId: string) => {
    if (!analysis) return;
    setAnalysis(prev => {
      if (!prev) return null;
      const updatedRoadmap = prev.roadmap.map(phase => {
        if (phase.id === phaseId) {
          return { ...phase, completed: !phase.completed };
        }
        return phase;
      });

      // Recalculate skill coverage score slightly as user completes phases
      const completedCount = updatedRoadmap.filter(p => p.completed).length;
      const baseCoverage = prev.skillCoverage.coveragePercentage;
      const boost = completedCount * 3;
      const newCoverage = Math.min(baseCoverage + boost, 98);

      return {
        ...prev,
        skillCoverage: {
          ...prev.skillCoverage,
          coveragePercentage: newCoverage
        },
        roadmap: updatedRoadmap
      };
    });
  };

  // Deep link to assistant with tailored question
  const handleAskAssistant = (promptText: string) => {
    setAssistantPrompt(promptText);
    setActiveTab('assistant');
  };

  const currentProfile: UserProfile = {
    selectedCareer,
    experienceLevel,
    currentSkills,
    resumeBioText
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCareer={selectedCareer}
        onOpenArchitectureModal={() => setIsArchitectureModalOpen(true)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-indigo-500/50 text-slate-100 shadow-2xl text-xs font-medium animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* SETUP TAB: Career, Experience, Skills & Resume */}
        {activeTab === 'setup' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Hero / Context Title */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Interactive Career Calibration</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Configure Your SkillPath Profile
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  Select your career ambition and experience level, then map your current skills or paste your resume. Our AI analysis engine generates a tailored gap roadmap and tiered projects.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsResumeModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors shadow-sm cursor-pointer"
                >
                  Paste Resume / Bio
                </button>
                <button
                  type="button"
                  onClick={() => {
                    runAnalysis();
                    setActiveTab('analysis');
                  }}
                  disabled={isLoadingAnalysis}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Career Gaps</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {analysisError && (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{analysisError}</span>
              </div>
            )}

            {/* Step 1: Career Selection */}
            <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <CareerSelector
                selectedCareer={selectedCareer}
                onSelectCareer={(career) => {
                  setSelectedCareer(career);
                  showToast(`Target career set to ${career}`);
                }}
              />
            </section>

            {/* Step 2: Experience Level Selection */}
            <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <ExperienceSelector
                experienceLevel={experienceLevel}
                onSelectExperience={(level) => {
                  setExperienceLevel(level);
                  showToast(`Experience level set to ${level}`);
                }}
              />
            </section>

            {/* Step 3: Current Skills & Resume Extraction */}
            <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <SkillSelector
                currentSkills={currentSkills}
                onToggleSkill={handleToggleSkill}
                onAddCustomSkill={handleAddCustomSkill}
                onClearSkills={handleClearSkills}
                onOpenResumeModal={() => setIsResumeModalOpen(true)}
                selectedCareer={selectedCareer}
              />
            </section>

            {/* Bottom Launch Bar */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <Compass className="w-5 h-5 text-indigo-400" />
                <span>
                  Ready to calculate your priority gaps for <strong className="text-white">{selectedCareer}</strong> ({currentSkills.length} skills listed)
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  runAnalysis();
                  setActiveTab('analysis');
                }}
                disabled={isLoadingAnalysis}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Run Context-Aware AI Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ANALYSIS TAB */}
        {activeTab === 'analysis' && (
          <AnalysisDashboard
            analysis={analysis}
            isLoading={isLoadingAnalysis}
            onRefreshAnalysis={runAnalysis}
            onNavigateToRoadmap={() => setActiveTab('roadmap')}
            onNavigateToProjects={() => setActiveTab('projects')}
            selectedCareer={selectedCareer}
          />
        )}

        {/* ROADMAP TAB */}
        {activeTab === 'roadmap' && (
          <RoadmapView
            roadmap={analysis?.roadmap || []}
            onTogglePhaseCompletion={handleTogglePhaseCompletion}
            selectedCareer={selectedCareer}
            onAskAboutPhase={(skill) => handleAskAssistant(`Why do I need to learn ${skill} for ${selectedCareer}?`)}
            onNavigateToProjects={() => setActiveTab('projects')}
          />
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <ProjectRecommendations
            projects={analysis?.projects || []}
            selectedCareer={selectedCareer}
            onAskAboutProject={(projTitle) => handleAskAssistant(`How should I architect and build the "${projTitle}" project to impress hiring managers?`)}
          />
        )}

        {/* CAREER ASSISTANT TAB */}
        {activeTab === 'assistant' && (
          <AIChatAssistant
            profile={currentProfile}
            analysis={analysis}
            initialPrompt={assistantPrompt}
            onClearInitialPrompt={() => setAssistantPrompt(undefined)}
          />
        )}
      </main>

      {/* Resume / Bio Modal with Verification Checklist */}
      <ResumeBioModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        onAddSkills={handleAddExtractedSkills}
        existingSkills={currentSkills}
      />

      {/* Snapdragon / Qualcomm AI Hub Architecture Modal */}
      <SnapdragonArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">SkillPath AI</span>
            <span>•</span>
            <span>Context-Aware Career Engine</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span>Inference: Google Gemini 3.8 Flash</span>
            <span>•</span>
            <button
              onClick={() => setIsArchitectureModalOpen(true)}
              className="text-cyan-400 hover:underline"
            >
              Snapdragon NPU Architecture Ready
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
