import React, { useState } from 'react';
import { X, FileText, Sparkles, Check, AlertCircle, Loader2 } from 'lucide-react';
import { inferenceService } from '../services/aiInference';

interface ResumeBioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSkills: (skills: string[]) => void;
  existingSkills: string[];
}

export const ResumeBioModal: React.FC<ResumeBioModalProps> = ({
  isOpen,
  onClose,
  onAddSkills,
  existingSkills
}) => {
  const [text, setText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [selectedExtracted, setSelectedExtracted] = useState<string[]>([]);
  const [hasExtracted, setHasExtracted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExtract = async () => {
    if (!text.trim()) {
      setErrorMsg('Please paste some resume or professional bio text first.');
      return;
    }
    setErrorMsg(null);
    setIsExtracting(true);

    try {
      const skills = await inferenceService.extractSkills(text);

      if (skills.length === 0) {
        setErrorMsg('No distinct technical skills could be extracted. Try providing more details about technologies, libraries, and tools.');
      } else {
        // Filter out duplicates with case-insensitive check against existing
        const existingLower = new Set(existingSkills.map(s => s.toLowerCase()));
        const uniqueExtracted = skills.filter((s, idx, arr) => arr.indexOf(s) === idx);

        setExtractedSkills(uniqueExtracted);
        // Pre-select all extracted skills that aren't already in user's profile
        setSelectedExtracted(uniqueExtracted.filter(s => !existingLower.has(s.toLowerCase())));
        setHasExtracted(true);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to extract skills. Please try again.');
    } finally {
      setIsExtracting(false);
    }
  };

  const toggleSelectSkill = (skill: string) => {
    setSelectedExtracted(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleConfirmAndAdd = () => {
    if (selectedExtracted.length > 0) {
      onAddSkills(selectedExtracted);
    }
    onClose();
    // Reset state
    setText('');
    setHasExtracted(false);
    setExtractedSkills([]);
    setSelectedExtracted([]);
  };

  const handleSelectAll = () => {
    setSelectedExtracted([...extractedSkills]);
  };

  const handleDeselectAll = () => {
    setSelectedExtracted([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Paste Resume or Professional Bio
              </h3>
              <p className="text-xs text-slate-400">
                AI extracts verified technical skills and lets you review before adding.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {!hasExtracted ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Paste Resume, LinkedIn Summary, or Bio Text
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Example: Senior Frontend Engineer with 4 years of experience building web apps with TypeScript, React, Next.js, Tailwind CSS, GraphQL, and Node.js. Experienced with PostgreSQL, Docker, Jest, and CI/CD pipelines..."
                  rows={8}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed"
                />
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 space-y-1">
                <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>How skill confirmation works:</span>
                </div>
                <p>
                  1. AI parses languages, frameworks, cloud platforms, databases, and core dev tooling.
                </p>
                <p>
                  2. You will get a confirmation checklist where you can toggle individual skills before adding.
                </p>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-xs text-slate-200 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-indigo-300">
                    Extracted {extractedSkills.length} Technical Skills
                  </div>
                  <p className="text-slate-300 mt-0.5">
                    Review and confirm which skills to add to your SkillPath profile.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">
                  Selected: <strong className="text-indigo-400">{selectedExtracted.length}</strong> of {extractedSkills.length}
                </span>
                <div className="space-x-2">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline"
                  >
                    Select All
                  </button>
                  <span className="text-slate-600">|</span>
                  <button
                    type="button"
                    onClick={handleDeselectAll}
                    className="text-xs text-slate-400 hover:text-slate-200 hover:underline"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-1">
                {extractedSkills.map((skill) => {
                  const isChecked = selectedExtracted.includes(skill);
                  const isAlreadyPossessed = existingSkills.some(
                    s => s.toLowerCase() === skill.toLowerCase()
                  );

                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSelectSkill(skill)}
                      className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition-colors text-xs font-medium ${
                        isChecked
                          ? 'bg-indigo-900/50 border-indigo-500 text-white shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="truncate pr-2">{skill}</span>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                          isChecked ? 'bg-indigo-600 text-white' : 'border border-slate-700'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          {!hasExtracted ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExtract}
                disabled={isExtracting || !text.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Extracting Skills with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Extract Skills with AI</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setHasExtracted(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                Back to Edit Text
              </button>
              <button
                type="button"
                onClick={handleConfirmAndAdd}
                disabled={selectedExtracted.length === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Add {selectedExtracted.length} Skills</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
