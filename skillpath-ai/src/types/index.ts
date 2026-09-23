export type ExperienceLevel = 'beginner' | 'junior' | 'mid' | 'senior';

export interface CareerOption {
  id: string;
  title: string;
  category: string;
  icon: string;
  description: string;
  benchmarkCoreSkills: string[];
  benchmarkImportantSkills: string[];
  popularRoles: string[];
}

export interface UserProfile {
  selectedCareer: string;
  experienceLevel: ExperienceLevel;
  currentSkills: string[];
  resumeBioText?: string;
  lastUpdated?: string;
}

export interface SkillStrength {
  skill: string;
  whyStrong: string;
  category?: string;
}

export interface RequiredSkillBenchmark {
  skill: string;
  importance: 'core' | 'important' | 'specialized';
  description: string;
  alreadyAcquired: boolean;
}

export interface PrioritySkillGap {
  id: string;
  skill: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  impact: string;
  timeToLearn: string;
}

export interface LearningOrderStep {
  step: number;
  skill: string;
  rationale: string;
  milestone: string;
  targetHorizon: string;
}

export interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  title: string;
  skill: string;
  whyNeeded: string;
  estimatedDuration: string;
  prerequisites: string[];
  recommendedProject: string;
  completed: boolean;
}

export interface ProjectRecommendation {
  id: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  title: string;
  tagline: string;
  description: string;
  skillsPracticed: string[];
  keyDeliverables: string[];
  portfolioValue: string;
  estimatedTime: string;
}

export interface AIAnalysisResult {
  analyzedAt: string;
  careerGoal: string;
  experienceLevel: ExperienceLevel;
  skillCoverage: {
    coveragePercentage: number;
    possessedCount: number;
    requiredBenchmarkCount: number;
    priorityGapsCount: number;
    recommendedNextSkillsCount: number;
  };
  summary: string;
  currentStrengths: SkillStrength[];
  requiredSkills: RequiredSkillBenchmark[];
  prioritySkillGaps: PrioritySkillGap[];
  recommendedLearningOrder: LearningOrderStep[];
  roadmap: RoadmapPhase[];
  projects: ProjectRecommendation[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export type InferenceProviderType = 'cloud-gemini' | 'snapdragon-npu-local';

export type AIRuntimeStatus =
  | 'development'
  | 'snapdragon-configured'
  | 'snapdragon-unavailable';

export interface AIRuntimeInfo {
  status: AIRuntimeStatus;
  statusLabel: 'Development AI' | 'Snapdragon/Qualcomm provider configured' | 'Snapdragon provider unavailable';
  activeProviderId: string;
  activeProviderName: string;
  configuredProvider: string;
  modelIdentifier?: string;
  inferenceEndpoint?: string;
  executionProvider?: string;
  isHardwareVerified: boolean;
  notes: string;
}

export interface AIInferenceProviderConfig {
  id: InferenceProviderType;
  name: string;
  description: string;
  status: 'active' | 'ready-interface' | 'unavailable';
  statusLabel: string;
  npuHardwareAvailable: boolean;
  engineDetails: string;
}
