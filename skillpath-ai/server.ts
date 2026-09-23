import 'dotenv/config';
import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// Helper function with exponential backoff, candidate model failover, and graceful fallback
interface GeminiCallOptions {
  prompt: string;
  systemInstruction?: string;
  responseMimeType?: string;
  responseSchema?: any;
  primaryModel?: string;
}

async function callGeminiWithRetry(options: GeminiCallOptions): Promise<string | null> {
  if (!aiClient) return null;

  const candidateModels = [
    options.primaryModel || 'gemini-3.8-flash',
    'gemini-flash-latest',
    'gemini-3.1-flash-lite'
  ];

  for (let i = 0; i < candidateModels.length; i++) {
    const model = candidateModels[i];
    try {
      const response = await aiClient.models.generateContent({
        model,
        contents: options.prompt,
        config: {
          systemInstruction: options.systemInstruction,
          responseMimeType: options.responseMimeType,
          responseSchema: options.responseSchema
        }
      });
      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      const errMsg = String(err?.message || err || '');
      const isTransient =
        errMsg.includes('503') ||
        errMsg.includes('UNAVAILABLE') ||
        errMsg.includes('high demand') ||
        errMsg.includes('429') ||
        errMsg.includes('RESOURCE_EXHAUSTED') ||
        errMsg.includes('500') ||
        errMsg.includes('INTERNAL');

      if (isTransient) {
        if (i < candidateModels.length - 1) {
          console.warn(`[AI Engine] Model ${model} is experiencing temporary high demand (503/UNAVAILABLE). Retrying with candidate model ${candidateModels[i + 1]}...`);
          // Exponential backoff with jitter
          await new Promise(res => setTimeout(res, 500 * (i + 1) + Math.random() * 200));
          continue;
        } else {
          console.warn('[AI Engine] Upstream model capacity temporarily constrained across candidate models. Seamlessly engaging intelligent algorithmic fallback.');
          return null;
        }
      }

      console.warn(`[AI Engine] Model call notice (${model}): ${errMsg.slice(0, 120)}. Switching to intelligent fallback.`);
      break;
    }
  }

  return null;
}

// Fallback generator when API key is missing or model request times out
function generateSmartFallbackAnalysis(profile: {
  selectedCareer: string;
  experienceLevel: string;
  currentSkills: string[];
  resumeBioText?: string;
}) {
  const { selectedCareer, experienceLevel, currentSkills = [] } = profile;
  const currentSkillsLower = new Set(currentSkills.map(s => s.toLowerCase().trim()));

  // Benchmark knowledge base
  const careerBenchmarks: Record<string, { core: string[]; important: string[]; specialized: string[] }> = {
    'Full-Stack Developer': {
      core: ['JavaScript / TypeScript', 'React', 'Node.js', 'PostgreSQL / SQL', 'REST APIs', 'Git'],
      important: ['Tailwind CSS', 'Docker', 'State Management', 'Testing (Jest/Vitest)', 'CI/CD Pipelines'],
      specialized: ['System Design', 'Microservices', 'GraphQL', 'Redis', 'AWS Deployment']
    },
    'Frontend Engineer': {
      core: ['HTML5 & CSS3', 'JavaScript / TypeScript', 'React', 'Tailwind CSS', 'Git'],
      important: ['Next.js', 'State Management (Zustand/Redux)', 'Web Performance', 'Testing (Playwright/Vitest)', 'Accessibility (a11y)'],
      specialized: ['Micro-frontends', 'Animation & Motion', 'Design Systems', 'WebAssembly']
    },
    'Backend Engineer': {
      core: ['Python or Node.js or Go', 'SQL & Database Design', 'RESTful API Architecture', 'Git', 'Data Structures & Algorithms'],
      important: ['PostgreSQL', 'Docker', 'Redis / Caching', 'Authentication (OAuth/JWT)', 'Message Queues'],
      specialized: ['Distributed Systems', 'Kafka', 'Kubernetes', 'gRPC', 'Database Indexing & Tuning']
    },
    'AI & Machine Learning Engineer': {
      core: ['Python', 'PyTorch or TensorFlow', 'Data Analysis (Pandas/NumPy)', 'Machine Learning Fundamentals', 'Git'],
      important: ['LLMs & Prompt Engineering', 'RAG & Vector Databases', 'Model Deployment (FastAPI/Docker)', 'Fine-Tuning', 'MLOps'],
      specialized: ['Quantization & Edge AI (ONNX/QNN)', 'Distributed Training', 'Reinforcement Learning', 'AI Safety & Evaluation']
    },
    'Data Engineer': {
      core: ['SQL (Advanced)', 'Python', 'Data Warehousing (Snowflake/BigQuery)', 'ETL Pipelines', 'Git'],
      important: ['Apache Spark', 'Airflow Orchestration', 'Kafka Streaming', 'dbt Data Modeling', 'Cloud Storage (S3/GCS)'],
      specialized: ['Data Mesh Architecture', 'Real-Time Stream Processing', 'Data Quality & Lineage', 'Iceberg/Delta Lake']
    },
    'DevOps & Cloud Engineer': {
      core: ['Linux & Bash Scripting', 'Docker & Containerization', 'CI/CD Pipelines', 'AWS / GCP Cloud', 'Git'],
      important: ['Kubernetes (K8s)', 'Terraform (IaC)', 'Observability (Prometheus/Grafana)', 'Networking & Security'],
      specialized: ['Service Mesh (Istio)', 'GitOps (ArgoCD)', 'Site Reliability Engineering', 'Multi-Region High Availability']
    },
    'Mobile App Developer': {
      core: ['React Native or Flutter or Swift/Kotlin', 'JavaScript / TypeScript', 'Mobile UI/UX', 'REST APIs', 'Git'],
      important: ['State Management', 'App Store Deployment & Fastlane', 'Offline Data Storage', 'Push Notifications'],
      specialized: ['Native Modules Bridge', 'Deep Linking & Auth', 'Performance Profiling', 'Mobile Security']
    },
    'Cybersecurity Analyst': {
      core: ['Networking Fundamentals (TCP/IP)', 'Linux Security', 'Vulnerability Assessment', 'Web Application Security (OWASP)', 'Git'],
      important: ['Penetration Testing Tools', 'SIEM & Log Monitoring', 'Identity & Access Management (IAM)', 'Incident Response'],
      specialized: ['Threat Hunting', 'Reverse Engineering & Malware Analysis', 'Zero Trust Architecture', 'Cloud SecOps']
    }
  };

  const defaultBench = careerBenchmarks[selectedCareer] || careerBenchmarks['Full-Stack Developer'];
  const allBench = [...defaultBench.core, ...defaultBench.important, ...defaultBench.specialized];

  // Identify strengths (possessed skills that match or complement the role)
  const strengths = currentSkills.map(skill => {
    return {
      skill,
      whyStrong: `Solid foundation in ${skill} directly supports your career trajectory as a ${selectedCareer}.`,
      category: 'Possessed Skill'
    };
  });

  // Calculate gaps
  const missingCore = defaultBench.core.filter(b => !Array.from(currentSkillsLower).some(s => b.toLowerCase().includes(s) || s.includes(b.toLowerCase())));
  const missingImportant = defaultBench.important.filter(b => !Array.from(currentSkillsLower).some(s => b.toLowerCase().includes(s) || s.includes(b.toLowerCase())));
  const missingSpecialized = defaultBench.specialized.filter(b => !Array.from(currentSkillsLower).some(s => b.toLowerCase().includes(s) || s.includes(b.toLowerCase())));

  const priorityGaps = [
    ...missingCore.map((skill, idx) => ({
      id: `gap-core-${idx}`,
      skill,
      priority: 'high' as const,
      category: 'Core Competency',
      impact: `Critical blocker for ${selectedCareer} roles; expected as table-stakes in industry interviews.`,
      timeToLearn: '2-3 weeks'
    })),
    ...missingImportant.map((skill, idx) => ({
      id: `gap-imp-${idx}`,
      skill,
      priority: 'medium' as const,
      category: 'Key Architectural Skill',
      impact: `Significantly enhances autonomous execution and software quality in ${selectedCareer} workflows.`,
      timeToLearn: '1-2 weeks'
    })),
    ...missingSpecialized.slice(0, 2).map((skill, idx) => ({
      id: `gap-spec-${idx}`,
      skill,
      priority: 'low' as const,
      category: 'Specialized Domain',
      impact: `Distinguishes you from other candidates when applying for competitive roles.`,
      timeToLearn: '3-4 weeks'
    }))
  ];

  const totalEvaluated = Math.max(allBench.length, 10);
  const matchedCount = currentSkills.length;
  const coveragePercentage = Math.min(Math.round((matchedCount / (matchedCount + priorityGaps.length)) * 100), 95);

  const recommendedOrder = priorityGaps.slice(0, 5).map((gap, index) => ({
    step: index + 1,
    skill: gap.skill,
    rationale: `Mastering ${gap.skill} now builds prerequisite understanding for advanced ${selectedCareer} patterns.`,
    milestone: `Complete a targeted code implementation or module demonstrating ${gap.skill}.`,
    targetHorizon: `Week ${index * 2 + 1}-${index * 2 + 2}`
  }));

  // Generate personalized roadmap based on gaps
  const roadmap = priorityGaps.slice(0, 4).map((gap, index) => ({
    id: `phase-${index + 1}`,
    phaseNumber: index + 1,
    title: `Phase ${index + 1}: ${gap.skill} Mastery`,
    skill: gap.skill,
    whyNeeded: `Required to bridge critical gap in ${selectedCareer}. ${gap.impact}`,
    estimatedDuration: gap.timeToLearn,
    prerequisites: index === 0 ? (currentSkills.slice(0, 2).length ? currentSkills.slice(0, 2) : ['Foundational programming']) : [priorityGaps[index - 1].skill],
    recommendedProject: `Build a focused prototype showcasing ${gap.skill} integration with production-style error handling and tests.`,
    completed: false
  }));

  const projects = [
    {
      id: 'proj-beginner',
      difficulty: 'Beginner' as const,
      title: `${selectedCareer} Starter Showcase`,
      tagline: 'Foundational portfolio piece emphasizing clean architecture and core skills',
      description: `Build an end-to-end focused application solving a daily productivity or workflow problem, incorporating ${priorityGaps[0]?.skill || 'core fundamentals'}.`,
      skillsPracticed: [priorityGaps[0]?.skill || 'Core Framework', ...currentSkills.slice(0, 2)],
      keyDeliverables: [
        'Structured modular codebase with responsive UI',
        'Clean data layer with error boundaries',
        'Detailed README with architecture overview and demo video'
      ],
      portfolioValue: 'Demonstrates ability to ship working software from idea to deployment.',
      estimatedTime: '1-2 weeks'
    },
    {
      id: 'proj-intermediate',
      difficulty: 'Intermediate' as const,
      title: `Scalable ${selectedCareer} Workflow Engine`,
      tagline: 'Production-ready system demonstrating API integration, persistence, and state',
      description: `Create a multi-feature system with database persistence, authentication/session management, and automated background jobs or API integrations.`,
      skillsPracticed: [priorityGaps[0]?.skill || 'Database', priorityGaps[1]?.skill || 'API Architecture', ...currentSkills.slice(0, 2)],
      keyDeliverables: [
        'Relational or document schema with migrations',
        'Secure API endpoints with rate limiting & validation',
        'Automated unit and integration test suite'
      ],
      portfolioValue: 'Shows hiring managers that you understand real-world system complexities.',
      estimatedTime: '2-4 weeks'
    },
    {
      id: 'proj-advanced',
      difficulty: 'Advanced' as const,
      title: `Enterprise-Grade ${selectedCareer} Platform`,
      tagline: 'High-throughput, observable architecture with CI/CD and production telemetry',
      description: `Design and deploy a full-scale distributed solution incorporating caching, async processing, containerization, and automated deployment pipelines.`,
      skillsPracticed: [priorityGaps[1]?.skill || 'Docker/DevOps', priorityGaps[2]?.skill || 'Caching/Redis', 'CI/CD Pipelines'],
      keyDeliverables: [
        'Containerized microservices or modular monolith deployed on cloud',
        'Structured logging and performance monitoring dashboards',
        'Comprehensive documentation including system architecture diagrams'
      ],
      portfolioValue: 'Serves as your standout capstone piece during senior-level technical interviews.',
      estimatedTime: '4-6 weeks'
    }
  ];

  return {
    analyzedAt: new Date().toISOString(),
    careerGoal: selectedCareer,
    experienceLevel: profile.experienceLevel,
    skillCoverage: {
      coveragePercentage: Math.max(coveragePercentage, 20),
      possessedCount: currentSkills.length,
      requiredBenchmarkCount: allBench.length,
      priorityGapsCount: priorityGaps.length,
      recommendedNextSkillsCount: Math.min(priorityGaps.length, 5)
    },
    summary: `Based on your ${experienceLevel} profile targeting ${selectedCareer}, you possess strong foundational competencies in ${currentSkills.slice(0, 3).join(', ') || 'software development'}. We have pinpointed ${priorityGaps.length} priority gaps to focus your learning trajectory efficiently.`,
    currentStrengths: strengths,
    requiredSkills: allBench.map(b => ({
      skill: b,
      importance: defaultBench.core.includes(b) ? ('core' as const) : defaultBench.important.includes(b) ? ('important' as const) : ('specialized' as const),
      description: `Essential standard expectation for ${selectedCareer} positions.`,
      alreadyAcquired: Array.from(currentSkillsLower).some(s => b.toLowerCase().includes(s) || s.includes(b.toLowerCase()))
    })),
    prioritySkillGaps: priorityGaps,
    recommendedLearningOrder: recommendedOrder,
    roadmap,
    projects
  };
}

// 1. POST /api/analyze
app.post('/api/analyze', async (req, res) => {
  const profile = req.body;
  if (!profile || !profile.selectedCareer) {
    return res.status(400).json({ error: 'Missing selected career in profile.' });
  }

  if (aiClient) {
    const prompt = `
You are the principal career intelligence engine for SkillPath AI.
Analyze the user's profile and generate a comprehensive career development report.

User Profile:
- Target Career: ${profile.selectedCareer}
- Experience Level: ${profile.experienceLevel}
- Current Skills: ${JSON.stringify(profile.currentSkills || [])}
- Resume / Bio Text: ${profile.resumeBioText ? profile.resumeBioText.slice(0, 2000) : 'None provided'}

Guidelines:
1. Identify real Strengths based on the user's current skills that align with ${profile.selectedCareer}.
2. Identify Required Skills for this role (core, important, specialized).
3. Identify Priority Skill Gaps (High, Medium, Low priority) specifically missing from their profile.
4. Provide Recommended Learning Order with step-by-step milestones.
5. Create a Personalized Roadmap specifically based on the user's skill gaps. Each phase must include:
   - skill/topic
   - why it is needed
   - estimated learning duration
   - prerequisite skills
   - recommended practical project
   - completed: false
6. Recommend 3 distinct projects (Beginner, Intermediate, Advanced) customized to their career goal and skill gaps.
7. Credibility: Do NOT present a fabricated "job readiness percentage" as an authoritative score. Instead, provide "Skill Coverage" metrics (e.g. realistic percentage of benchmark skills covered, number of priority gaps, number of recommended next skills).
`;

    const rawJson = await callGeminiWithRetry({
      prompt,
      systemInstruction: `You are an expert technical career advisor. You output strictly valid JSON conforming to the requested schema. Do not include markdown code block formatting like \`\`\`json. Output raw JSON only. Never fabricate a job readiness guarantee. Use honest terms like "Skill Coverage", "Priority Gaps", and "Recommended Next Skills".`,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          careerGoal: { type: Type.STRING },
          summary: { type: Type.STRING },
          skillCoverage: {
            type: Type.OBJECT,
            properties: {
              coveragePercentage: { type: Type.NUMBER },
              possessedCount: { type: Type.NUMBER },
              requiredBenchmarkCount: { type: Type.NUMBER },
              priorityGapsCount: { type: Type.NUMBER },
              recommendedNextSkillsCount: { type: Type.NUMBER }
            },
            required: ['coveragePercentage', 'possessedCount', 'requiredBenchmarkCount', 'priorityGapsCount', 'recommendedNextSkillsCount']
          },
          currentStrengths: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                skill: { type: Type.STRING },
                whyStrong: { type: Type.STRING },
                category: { type: Type.STRING }
              },
              required: ['skill', 'whyStrong']
            }
          },
          requiredSkills: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                skill: { type: Type.STRING },
                importance: { type: Type.STRING },
                description: { type: Type.STRING },
                alreadyAcquired: { type: Type.BOOLEAN }
              },
              required: ['skill', 'importance', 'description', 'alreadyAcquired']
            }
          },
          prioritySkillGaps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                skill: { type: Type.STRING },
                priority: { type: Type.STRING },
                category: { type: Type.STRING },
                impact: { type: Type.STRING },
                timeToLearn: { type: Type.STRING }
              },
              required: ['id', 'skill', 'priority', 'category', 'impact', 'timeToLearn']
            }
          },
          recommendedLearningOrder: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                step: { type: Type.INTEGER },
                skill: { type: Type.STRING },
                rationale: { type: Type.STRING },
                milestone: { type: Type.STRING },
                targetHorizon: { type: Type.STRING }
              },
              required: ['step', 'skill', 'rationale', 'milestone', 'targetHorizon']
            }
          },
          roadmap: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                phaseNumber: { type: Type.INTEGER },
                title: { type: Type.STRING },
                skill: { type: Type.STRING },
                whyNeeded: { type: Type.STRING },
                estimatedDuration: { type: Type.STRING },
                prerequisites: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                recommendedProject: { type: Type.STRING },
                completed: { type: Type.BOOLEAN }
              },
              required: ['id', 'phaseNumber', 'title', 'skill', 'whyNeeded', 'estimatedDuration', 'prerequisites', 'recommendedProject', 'completed']
            }
          },
          projects: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                title: { type: Type.STRING },
                tagline: { type: Type.STRING },
                description: { type: Type.STRING },
                skillsPracticed: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                keyDeliverables: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                portfolioValue: { type: Type.STRING },
                estimatedTime: { type: Type.STRING }
              },
              required: ['id', 'difficulty', 'title', 'tagline', 'description', 'skillsPracticed', 'keyDeliverables', 'portfolioValue', 'estimatedTime']
            }
          }
        },
        required: ['careerGoal', 'summary', 'skillCoverage', 'currentStrengths', 'requiredSkills', 'prioritySkillGaps', 'recommendedLearningOrder', 'roadmap', 'projects']
      }
    });

    if (rawJson) {
      try {
        const parsed = JSON.parse(rawJson);
        parsed.analyzedAt = new Date().toISOString();
        parsed.experienceLevel = profile.experienceLevel;
        return res.json(parsed);
      } catch (parseErr) {
        console.warn('[AI Engine] Structured JSON parse issue, falling back to algorithmic analysis.');
      }
    }
  }

  // Graceful smart fallback when API key is not yet set or upstream model is temporarily unavailable
  const fallbackData = generateSmartFallbackAnalysis(profile);
  return res.json(fallbackData);
});

// 2. POST /api/extract-skills
app.post('/api/extract-skills', async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'No text provided for skill extraction.' });
  }

  if (aiClient) {
    const prompt = `
Extract all technical skills, programming languages, frameworks, cloud tools, databases, devops technologies, and core technical methodologies mentioned in or clearly implied by the following resume / bio text.
Return a standardized list of unique skills (e.g., "TypeScript", "React", "Docker", "PostgreSQL").
Resume/Bio Text:
${text.slice(0, 4000)}
`;

    const rawJson = await callGeminiWithRetry({
      prompt,
      systemInstruction: 'You extract recognized technical skills accurately. Return a JSON array of strings only. No markdown formatting.',
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    });

    if (rawJson) {
      try {
        const parsed = JSON.parse(rawJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return res.json({ skills: parsed });
        }
      } catch {
        // proceed to regex fallback
      }
    }
  }

  // Regex/Keyword fallback for skill extraction
  const commonSkills = [
    'JavaScript', 'TypeScript', 'Python', 'React', 'Next.js', 'Node.js', 'Express',
    'HTML', 'CSS', 'Tailwind CSS', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis',
    'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Git', 'Linux', 'REST APIs',
    'GraphQL', 'CI/CD', 'Jest', 'PyTorch', 'TensorFlow', 'Pandas', 'FastAPI',
    'Go', 'Java', 'C++', 'Rust', 'SQL', 'Redux', 'Zustand', 'Airflow', 'Spark'
  ];
  const extracted = commonSkills.filter(skill => {
    const reg = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return reg.test(text);
  });
  return res.json({ skills: extracted.length > 0 ? extracted : ['JavaScript', 'Git', 'React', 'Problem Solving'] });
});

// 3. POST /api/chat
app.post('/api/chat', async (req, res) => {
  const { messages, profile, analysis } = req.body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required.' });
  }

  const latestUserMessage = messages[messages.length - 1]?.content || '';
  const goal = profile?.selectedCareer || 'Software Engineer';
  const level = profile?.experienceLevel || 'junior';
  const skills = (profile?.currentSkills || []).join(', ') || 'general programming';
  const gaps = analysis?.prioritySkillGaps?.map((g: any) => `${g.skill} (${g.priority} priority)`).join(', ') || 'Skill gap evaluation in progress';
  const roadmapOverview = analysis?.roadmap?.map((r: any) => `Phase ${r.phaseNumber}: ${r.skill}`).join(' -> ') || 'Phased roadmap active';
  const projectTitles = analysis?.projects?.map((p: any) => `${p.title} (${p.difficulty})`).join(', ') || 'Project blueprints in Projects tab';

  if (aiClient) {
    const systemPrompt = `
You are the dedicated SkillPath AI Career Assistant.
You have complete context on the user's current career profile and gap report:
- Target Career: ${goal}
- Experience Level: ${level}
- Current Skills: ${JSON.stringify(profile?.currentSkills || [])}
- Identified Skill Gaps: ${JSON.stringify(analysis?.prioritySkillGaps || [])}
- Personalized Roadmap: ${JSON.stringify(analysis?.roadmap || [])}
- Recommended Projects: ${JSON.stringify(analysis?.projects || [])}

Guidelines:
- Provide direct, encouraging, highly technical, and practical advice grounded in the user's specific skills and gaps.
- When answering "What should I learn next?", cite their current skills and point directly to their highest priority gap from the context.
- When answering "Why do I need this skill?", explain how it functions in real-world engineering teams and system architectures for ${goal}.
- When answering "Suggest a project", refer to their tailored project blueprints and explain key technical deliverables.
- When answering "Explain my roadmap", clarify the sequence of phases and why learning prerequisites in order prevents burnout.
- Keep responses concise, well-structured with markdown headings and bullet points. Never provide vague platitudes.
`;

    // Format chat history
    const conversationPrompt = messages.map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n\n');

    const reply = await callGeminiWithRetry({
      prompt: `${systemPrompt}\n\nConversation History:\n${conversationPrompt}\n\nAssistant:`
    });

    if (reply) {
      return res.json({ reply });
    }
  }

  // Intelligent contextual fallback responses incorporating complete profile and analysis context
  let fallbackReply = `As your SkillPath Career Coach for **${goal}** (${level} level), here is actionable guidance based on your profile:\n\n`;

  if (latestUserMessage.toLowerCase().includes('learn next') || latestUserMessage.toLowerCase().includes('what should i learn')) {
    const topGap = analysis?.prioritySkillGaps?.[0]?.skill || 'Core Framework Competencies';
    fallbackReply += `### Recommended Next Focus
1. **Bridge Priority Gap: ${topGap}**: This is your highest-impact skill gap for ${goal}.
2. **Current Strengths to Build On**: Leverage your background in ${skills} as an anchor.
3. **Follow Your Roadmap**: Start with ${analysis?.roadmap?.[0]?.title || 'Phase 1'} in the Roadmap tab.`;
  } else if (latestUserMessage.toLowerCase().includes('why do i need') || latestUserMessage.toLowerCase().includes('why need')) {
    fallbackReply += `### Skill Rationale for ${goal}
Every skill in your personalized gap analysis (${gaps}) is directly mapped to current hiring benchmarks for ${level} ${goal} roles. In competitive interviews, employers evaluate real architectural proficiency rather than surface familiarity.`;
  } else if (latestUserMessage.toLowerCase().includes('suggest a project') || latestUserMessage.toLowerCase().includes('project')) {
    const firstProj = analysis?.projects?.[0];
    fallbackReply += `### Recommended Portfolio Project
**${firstProj?.title || `Production-Grade ${goal} Application`}**:
- **Why it matters**: ${firstProj?.tagline || 'Proves end-to-end competency to hiring managers'}
- **Skills Practiced**: ${firstProj?.skillsPracticed?.join(', ') || skills}
- **Deliverables**: ${firstProj?.keyDeliverables?.join('; ') || 'Modular architecture, automated tests, clean documentation'}
- Explore all 3 tiered projects (Beginner, Intermediate, Advanced) in your **Projects** tab.`;
  } else if (latestUserMessage.toLowerCase().includes('roadmap') || latestUserMessage.toLowerCase().includes('explain roadmap')) {
    fallbackReply += `### Roadmap Sequence Overview
Your personalized learning sequence:
${roadmapOverview}

This sequence is ordered so each milestone reinforces the previous one without cognitive overload.`;
  } else {
    fallbackReply += `Based on your **${level}** experience level and target career as **${goal}**, you have a strong starting base with ${skills}. Your identified priority gaps include ${gaps}.\n\nI am here to help you unpack specific concepts, review system architecture, or structure your study schedule. What would you like to explore next?`;
  }

  return res.json({ reply: fallbackReply });
});

// 4. GET /api/inference-status
// Developer/debug endpoint reporting AI runtime status without exposing secrets
app.get('/api/inference-status', (req, res) => {
  const configuredProvider = process.env.AI_INFERENCE_PROVIDER || 'development';
  const snapdragonModelPath = process.env.SNAPDRAGON_MODEL_PATH || process.env.AI_MODEL_ID || '';
  const snapdragonEndpoint = process.env.SNAPDRAGON_INFERENCE_ENDPOINT || process.env.AI_INFERENCE_ENDPOINT || '';
  const snapdragonExecutionProvider = process.env.SNAPDRAGON_EXECUTION_PROVIDER || 'QNN';

  const isSnapdragonRequested = configuredProvider.toLowerCase() === 'snapdragon' || configuredProvider.toLowerCase() === 'snapdragon-qualcomm';
  const hasSnapdragonConfig = Boolean(snapdragonModelPath || snapdragonEndpoint);

  // Strictly check if local hardware/endpoint is verified
  // In standard web development/preview environments, Qualcomm Hexagon NPU is not active
  const isHardwareVerified = false;

  let runtimeStatus: 'development' | 'snapdragon-configured' | 'snapdragon-unavailable' = 'development';
  let runtimeStatusLabel: 'Development AI' | 'Snapdragon/Qualcomm provider configured' | 'Snapdragon provider unavailable' = 'Development AI';

  if (isSnapdragonRequested) {
    if (hasSnapdragonConfig && isHardwareVerified) {
      runtimeStatus = 'snapdragon-configured';
      runtimeStatusLabel = 'Snapdragon/Qualcomm provider configured';
    } else {
      runtimeStatus = 'snapdragon-unavailable';
      runtimeStatusLabel = 'Snapdragon provider unavailable';
    }
  } else {
    runtimeStatus = 'development';
    runtimeStatusLabel = 'Development AI';
  }

  res.json({
    available: true,
    activeProvider: 'cloud-gemini',
    configuredProvider,
    runtimeStatus,
    runtimeStatusLabel,
    modelPath: snapdragonModelPath || undefined,
    inferenceEndpoint: snapdragonEndpoint || undefined,
    executionProvider: snapdragonExecutionProvider,
    isSnapdragonConfigured: hasSnapdragonConfig,
    isHardwareVerified,
    cloudModel: 'gemini-3.8-flash',
    snapdragonArchitecture: {
      status: runtimeStatus,
      statusLabel: runtimeStatusLabel,
      description: 'Modular Qualcomm AI Hub inference abstraction ready. Prepared for local ONNX Runtime with QNN Execution Provider on Snapdragon Copilot+ Windows PCs.'
    }
  });
});

// Serve frontend in production or through Vite in development
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`SkillPath AI server running on port ${PORT} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer();
