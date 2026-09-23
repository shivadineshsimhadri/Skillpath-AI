import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserProfile, AIAnalysisResult } from '../types';
import { inferenceService } from '../services/aiInference';
import {
  MessageSquare,
  Send,
  Sparkles,
  User,
  Bot,
  Loader2,
  HelpCircle,
  TrendingUp,
  FolderGit2,
  Map,
  Compass
} from 'lucide-react';

interface AIChatAssistantProps {
  profile: UserProfile;
  analysis: AIAnalysisResult | null;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({
  profile,
  analysis,
  initialPrompt,
  onClearInitialPrompt
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am your **SkillPath AI Career Coach**.\n\nI have loaded your complete career context:\n- **Target Career:** ${profile.selectedCareer}\n- **Experience Level:** ${profile.experienceLevel}\n- **Current Skills:** ${profile.currentSkills.length} skills recorded\n- **Identified Gaps:** ${analysis?.prioritySkillGaps?.length || 'Pending analysis'}\n\nHow can I help accelerate your learning journey today?`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { label: 'What should I learn next?', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { label: 'Why do I need this skill?', icon: <HelpCircle className="w-3.5 h-3.5" /> },
    { label: 'Suggest a project', icon: <FolderGit2 className="w-3.5 h-3.5" /> },
    { label: 'Explain my roadmap', icon: <Map className="w-3.5 h-3.5" /> }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle external prompt trigger from roadmap or project cards
  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const updatedMessages = [...messages, userMessage];
      const replyText = await inferenceService.chat(updatedMessages, profile, analysis);

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error(err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `I encountered a momentary connection difficulty. Based on your target role as **${profile.selectedCareer}**, feel free to try again or review your Roadmap tab for the next step!`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto animate-fadeIn">
      {/* Context Badge Header */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-100 flex items-center gap-2">
              <span>Context-Aware AI Career Assistant</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Live Context
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Grounded in your active career goal, skills, identified gaps, and roadmap.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
          <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">
            Role: <strong className="text-indigo-400">{profile.selectedCareer}</strong>
          </span>
          <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">
            Level: <strong className="text-slate-200">{profile.experienceLevel}</strong>
          </span>
          <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">
            Skills: <strong className="text-cyan-400">{profile.currentSkills.length}</strong>
          </span>
          <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">
            Gaps: <strong className="text-amber-400">{analysis?.prioritySkillGaps?.length || 0}</strong>
          </span>
          <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">
            Runtime: <strong className="text-emerald-400">{inferenceService.getRuntimeStatusLabel()}</strong>
          </span>
        </div>
      </div>

      {/* Quick Prompts Shelf */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>Quick Prompts:</span>
        </span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(qp.label)}
            disabled={isTyping}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-indigo-600/30 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-white text-xs font-medium transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            {qp.icon}
            <span>{qp.label}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="min-h-[420px] max-h-[550px] overflow-y-auto rounded-2xl bg-slate-900/80 border border-slate-800 p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                    : 'bg-slate-800 text-indigo-400 border border-slate-700'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/10'
                    : 'bg-slate-950/80 border border-slate-800/80 text-slate-200 rounded-tl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-indigo-400 border border-slate-700 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-2 text-xs text-slate-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span>SkillPath AI is reasoning over your profile...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask about ${profile.selectedCareer} requirements, interview prep, skill gaps, or projects (Press Enter to send)...`}
          rows={2}
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-3.5 pr-14 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-sans leading-relaxed"
        />

        <button
          type="button"
          onClick={() => handleSendMessage()}
          disabled={!input.trim() || isTyping}
          className="absolute right-3 bottom-3 p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
