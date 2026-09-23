# 🚀 SkillPath AI

### Know your goal. Discover your gaps. Build your path.

SkillPath AI is an AI-powered career and skill roadmap platform designed to help students and aspiring professionals understand what skills they need to develop for their target career.

It analyzes a user's career goal, experience level, current skills, and optional resume/bio information to identify skill gaps and generate a personalized learning roadmap.

---

## 🎯 Problem Statement

Students often struggle to understand:

- What skills are required for their target career
- Which skills they already have
- Which skills they are missing
- What they should learn first
- Which projects can help them gain practical experience

SkillPath AI brings these steps together into one personalized career guidance platform.

---

## 💡 Solution

SkillPath AI creates a personalized path from a user's current skill set to their desired career.

### User Flow

Career Goal
↓
Current Skills
↓
AI Skill Analysis
↓
Skill Gap Identification
↓
Personalized Roadmap
↓
Project Recommendations
↓
AI Career Assistant

---

## ✨ Core Features

### 1. 🎯 Career Goal Setup
Users can select their target career and experience level.

Supported career paths include:

- Software Developer
- AI/ML Engineer
- Data Scientist
- Cybersecurity Analyst
- Cloud Engineer
- Data Analyst
- Custom Career Goal

### 2. 🧠 AI Skill Gap Analysis
Analyzes the user's current skills against the requirements of their selected career.

It identifies:

- Current strengths
- Required skills
- Priority skill gaps
- Recommended learning order

### 3. 🗺️ Personalized Learning Roadmap
Creates a structured learning path based on the user's skill gaps.

Each roadmap stage can include:

- Skill/topic
- Why it is needed
- Learning duration
- Prerequisites
- Practical project
- Completion status

### 4. 💻 AI Project Recommendations
Suggests practical projects based on the user's:

- Career goal
- Current skills
- Skill gaps
- Experience level

Projects can be explored at beginner, intermediate, and advanced levels.

### 5. 🤖 AI Career Assistant
A context-aware assistant that can help users understand their career roadmap.

Example questions:

- What should I learn next?
- Why do I need this skill?
- Suggest a project for me.
- Explain my roadmap.

---

## 🧩 Technology Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- AI-powered analysis
- Modular AI inference architecture
- GitHub
- Vercel

---

## ⚡ Snapdragon AI Architecture

SkillPath AI is designed with a modular AI inference architecture that can support future integration with optimized on-device AI models.

The architecture provides an abstraction layer for connecting local AI inference providers.

This makes it possible to explore future optimization for Snapdragon-powered PCs and Qualcomm AI technologies without tightly coupling the application to a single AI provider.

> Note: Snapdragon/Qualcomm hardware acceleration should only be considered active when an actual supported model and runtime integration is implemented and verified.

---

## 🏗️ Project Architecture

```text
SkillPath AI
│
├── src/
│   ├── components/
│   │   ├── AIChatAssistant
│   │   ├── AnalysisDashboard
│   │   ├── CareerSelector
│   │   ├── ExperienceSelector
│   │   ├── ProjectRecommendations
│   │   ├── ResumeBioModal
│   │   ├── RoadmapView
│   │   ├── SkillSelector
│   │   └── SnapdragonArchitectureModal
│   │
│   ├── data/
│   │   └── careerData
│   │
│   ├── services/
│   │   ├── aiInference
│   │   └── providers/
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── index.html
├── package.json
├── server.ts
├── vite.config.ts
└── README.md
