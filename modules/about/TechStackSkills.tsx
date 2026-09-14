"use client";

import React, { useState } from "react";
import {
  BrainCircuit,
  Layout,
  Server,
  Sparkles,
  Zap,
  Code2,
  Database,
  Cpu,
  Workflow,
  Radio,
  ShieldCheck,
  CheckCircle2,
  Cloud,
  Network,
  Activity,
  Layers,
  Container,
  GitMerge,
  Gauge,
} from "lucide-react";

interface SkillItem {
  name: string;
  category: "ai" | "frontend" | "backend";
  level: "Advanced" | "Core" | "Specialized";
  description: string;
  iconBg: string;
  badgeColor?: string;
  icon: string;
}

const skillsData: SkillItem[] = [
  // ================= AI & SYSTEMS =================
  {
    name: "LangGraph",
    category: "ai",
    level: "Advanced",
    description: "Stateful, cyclical multi-agent graph workflows & human-in-the-loop",
    iconBg: "bg-[#d8f966] text-[#141b16]",
    icon: "langgraph",
  },
  {
    name: "Google ADK",
    category: "ai",
    level: "Advanced",
    description: "Multi-modal agent orchestration, Gemini tool routing & function calling",
    iconBg: "bg-[#e8f0fe] text-[#1a73e8]",
    icon: "google",
  },
  {
    name: "MCP (Model Context Protocol)",
    category: "ai",
    level: "Specialized",
    description: "Standardized tool & resource orchestration for autonomous agents",
    iconBg: "bg-[#141b16] text-[#c5eb35]",
    icon: "mcp",
  },
  {
    name: "LangChain",
    category: "ai",
    level: "Core",
    description: "Composable LLM application chains, memory systems & tool ecosystem",
    iconBg: "bg-[#f0fdf4] text-[#15803d]",
    icon: "langchain",
  },
  {
    name: "LlamaCloud",
    category: "ai",
    level: "Advanced",
    description: "Managed data parsing, ingestion pipelines & production index retrieval",
    iconBg: "bg-[#f1f5f9] text-[#0f172a]",
    icon: "llamacloud",
  },
  {
    name: "DeepEval",
    category: "ai",
    level: "Specialized",
    description: "Unit testing for LLMs, hallucination benchmarking & RAG evaluation metrics",
    iconBg: "bg-[#fef2f2] text-[#dc2626]",
    icon: "deepeval",
  },
  {
    name: "Guardrails AI",
    category: "ai",
    level: "Specialized",
    description: "Deterministic structured output validation, JSON enforcement & safety filters",
    iconBg: "bg-[#ecfdf5] text-[#059669]",
    icon: "guardrails",
  },
  {
    name: "PyTorch",
    category: "ai",
    level: "Core",
    description: "Deep learning tensors, GPU training, LoRA fine-tuning & Unsloth acceleration",
    iconBg: "bg-[#fff7ed] text-[#ea580c]",
    icon: "pytorch",
  },
  {
    name: "HG Transformers",
    category: "ai",
    level: "Core",
    description: "Open-source model inference, tokenization pipelines & vector embeddings",
    iconBg: "bg-[#fffbeb] text-[#d97706]",
    icon: "huggingface",
  },
  {
    name: "Hybrid RAG & Vector DBs",
    category: "ai",
    level: "Advanced",
    description: "Dense + Sparse hybrid retrieval, Cohere reranking & semantic caching",
    iconBg: "bg-[#90caff] text-[#09284a]",
    icon: "rag",
  },
  {
    name: "Vapi & Voice AI",
    category: "ai",
    level: "Specialized",
    description: "Real-time bidirectional ultra-low latency voice agents & STT/TTS",
    iconBg: "bg-[#e5d4ff] text-[#43147f]",
    icon: "vapi",
  },
  {
    name: "Temporal.io",
    category: "ai",
    level: "Specialized",
    description: "Durable distributed execution, retry state machines & long-running jobs",
    iconBg: "bg-[#ffe082] text-[#4a3500]",
    icon: "temporal",
  },

  // ================= FRONTEND & CREATIVE =================
  {
    name: "Next.js 16 & React 19",
    category: "frontend",
    level: "Core",
    description: "App Router, Server Components, streaming SSR, and micro-frontends",
    iconBg: "bg-neutral-900 text-white",
    icon: "nextjs",
  },
  {
    name: "TypeScript",
    category: "frontend",
    level: "Core",
    description: "Strict end-to-end type safety, generic constraints & runtime schemas",
    iconBg: "bg-[#3178c6] text-white",
    icon: "typescript",
  },
  {
    name: "JavaScript (ES6+)",
    category: "frontend",
    level: "Core",
    description: "Modern ECMAScript, asynchronous event loops, closures & browser APIs",
    iconBg: "bg-[#f7df1e] text-[#141b16]",
    icon: "javascript",
  },
  {
    name: "TanStack (Query & Table)",
    category: "frontend",
    level: "Advanced",
    description: "Declarative server-state caching, optimistic mutations & headless tables",
    iconBg: "bg-[#ff4154] text-white",
    icon: "tanstack",
  },
  {
    name: "GSAP & ScrollTrigger",
    category: "frontend",
    level: "Advanced",
    description: "60fps choreography, pinned scrub timelines, and physics-driven UI",
    iconBg: "bg-[#0ae448] text-black",
    icon: "gsap",
  },
  {
    name: "Tailwind CSS & Modern UI",
    category: "frontend",
    level: "Core",
    description: "Tailwind v4, CSS variables, glassmorphism & responsive layouts",
    iconBg: "bg-[#38bdf8] text-neutral-950",
    icon: "tailwind",
  },
  {
    name: "Matter.js & 2D Physics",
    category: "frontend",
    level: "Specialized",
    description: "Rigid-body simulations, mouse constraints, and interactive canvases",
    iconBg: "bg-[#ff5c8d] text-white",
    icon: "matter",
  },
  {
    name: "Motion & UI Gestures",
    category: "frontend",
    level: "Advanced",
    description: "Fluid micro-interactions, layout morphing & spring physics",
    iconBg: "bg-[#ec4899] text-white",
    icon: "motion",
  },

  // ================= BACKEND & CLOUD =================
  {
    name: "Python (FastAPI & AsyncIO)",
    category: "backend",
    level: "Core",
    description: "High-throughput asynchronous APIs, Pydantic validation & WebSockets",
    iconBg: "bg-[#ffd43b] text-[#1d3d63]",
    icon: "python",
  },
  {
    name: "Node.js & Express",
    category: "backend",
    level: "Core",
    description: "Event-driven backend services, RESTful microservices & middleware pipelines",
    iconBg: "bg-[#339933] text-white",
    icon: "nodejs",
  },
  {
    name: "RabbitMQ",
    category: "backend",
    level: "Advanced",
    description: "Distributed message broker, AMQP protocol, dead-letter queues & event exchanges",
    iconBg: "bg-[#ff6600] text-white",
    icon: "rabbitmq",
  },
  {
    name: "PostgreSQL & Drizzle ORM",
    category: "backend",
    level: "Core",
    description: "Relational schema design, pgvector embeddings, and type-safe migrations",
    iconBg: "bg-[#336791] text-white",
    icon: "postgres",
  },
  {
    name: "Redis & Upstash Rate Limiting",
    category: "backend",
    level: "Advanced",
    description: "Distributed caching, token bucket rate limiters & session stores",
    iconBg: "bg-[#dc2626] text-white",
    icon: "redis",
  },
  {
    name: "Google Cloud (GCP)",
    category: "backend",
    level: "Advanced",
    description: "Cloud Run, Vertex AI pipelines, IAM security & cloud storage",
    iconBg: "bg-[#4285f4] text-white",
    icon: "googlecloud",
  },
  {
    name: "Docker & Containers",
    category: "backend",
    level: "Core",
    description: "Multi-stage containerization, Docker Compose & image optimization",
    iconBg: "bg-[#2496ed] text-white",
    icon: "docker",
  },
  {
    name: "CI/CD & Jenkins",
    category: "backend",
    level: "Advanced",
    description: "Automated continuous integration, test automation & deployment pipelines",
    iconBg: "bg-[#d24939] text-white",
    icon: "jenkins",
  },
  {
    name: "Grafana & Telemetry",
    category: "backend",
    level: "Specialized",
    description: "Real-time system observability, Prometheus metrics & active alerting",
    iconBg: "bg-[#f46800] text-white",
    icon: "grafana",
  },
  {
    name: "AWS & Cloud Infra",
    category: "backend",
    level: "Core",
    description: "Containerized deployments, ECS/Lambda, S3 buckets, and CI/CD",
    iconBg: "bg-[#ff9900] text-[#141b16]",
    icon: "aws",
  },
  {
    name: "Inngest & Event Queues",
    category: "backend",
    level: "Specialized",
    description: "Reliable background jobs, step-functions, and cron automations",
    iconBg: "bg-[#7c3aed] text-white",
    icon: "inngest",
  },
];

// SVG Tech Icons renderer
function TechIcon({ type }: { type: string }) {
  switch (type) {
    case "langgraph":
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      );
    case "google":
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
        </svg>
      );
    case "llamacloud":
      return <Cloud className="w-5 h-5 stroke-[2.2]" />;
    case "deepeval":
      return <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />;
    case "guardrails":
      return <ShieldCheck className="w-5 h-5 stroke-[2.2]" />;
    case "langchain":
      return <Network className="w-5 h-5 stroke-[2.2]" />;
    case "huggingface":
      return (
        <span className="text-base font-bold leading-none select-none">🤗</span>
      );
    case "mcp":
      return <Cpu className="w-5 h-5 stroke-[2.2]" />;
    case "rag":
      return <Database className="w-5 h-5 stroke-[2.2]" />;
    case "pytorch":
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M12.5 2.5a.7.7 0 0 0-.8.2l-3.9 4.3a.7.7 0 0 0 .1.9l1.6 1.4a.7.7 0 0 0 .9-.1l2.4-2.7 2.4 2.7a.7.7 0 0 0 .9.1l1.6-1.4a.7.7 0 0 0 .1-.9L14 2.7a.7.7 0 0 0-.8-.2h-.7zM6.5 10.5a.7.7 0 0 0-.5.2l-4 4.5a.7.7 0 0 0 .1.9l1.6 1.4a.7.7 0 0 0 .9-.1l2.5-2.8 2.5 2.8a.7.7 0 0 0 .9.1l1.6-1.4a.7.7 0 0 0 .1-.9l-4-4.5a.7.7 0 0 0-.5-.2h-1.3zm11 0a.7.7 0 0 0-.5.2l-4 4.5a.7.7 0 0 0 .1.9l1.6 1.4a.7.7 0 0 0 .9-.1l2.5-2.8 2.5 2.8a.7.7 0 0 0 .9.1l1.6-1.4a.7.7 0 0 0 .1-.9l-4-4.5a.7.7 0 0 0-.5-.2h-1.3z" />
        </svg>
      );
    case "vapi":
      return <Radio className="w-5 h-5 stroke-[2.2]" />;
    case "temporal":
      return <Workflow className="w-5 h-5 stroke-[2.2]" />;
    case "nextjs":
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.82 17.587l-6.195-8.083v8.083H9.84V6.413h1.785l6.195 8.165V6.413h1.785v11.174h-1.785z" />
        </svg>
      );
    case "typescript":
      return (
        <span className="font-bold font-mono text-sm tracking-tighter">TS</span>
      );
    case "javascript":
      return (
        <span className="font-bold font-mono text-sm tracking-tighter font-extrabold">JS</span>
      );
    case "tanstack":
      return <Layers className="w-5 h-5 stroke-[2.2]" />;
    case "gsap":
      return <Zap className="w-5 h-5 stroke-[2.2]" />;
    case "tailwind":
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M12 6c-3.3 0-5.3 1.7-6 5 1.3-1.7 2.9-2.3 4.8-1.7 1.1.3 1.9 1.1 2.7 2 1.4 1.4 3 3.1 6.5 3.1 3.3 0 5.3-1.7 6-5-1.3 1.7-2.9 2.3-4.8 1.7-1.1-.3-1.9-1.1-2.7-2-1.4-1.4-3-3.1-6.5-3.1zm-8 6c-3.3 0-5.3 1.7-6 5 1.3-1.7 2.9-2.3 4.8-1.7 1.1.3 1.9 1.1 2.7 2 1.4 1.4 3 3.1 6.5 3.1 3.3 0 5.3-1.7 6-5-1.3 1.7-2.9 2.3-4.8 1.7-1.1-.3-1.9-1.1-2.7-2-1.4-1.4-3-3.1-6.5-3.1z" />
        </svg>
      );
    case "matter":
      return <Sparkles className="w-5 h-5 stroke-[2.2]" />;
    case "motion":
      return <Layout className="w-5 h-5 stroke-[2.2]" />;
    case "python":
      return <Code2 className="w-5 h-5 stroke-[2.2]" />;
    case "nodejs":
      return <Server className="w-5 h-5 stroke-[2.2]" />;
    case "rabbitmq":
      return <Activity className="w-5 h-5 stroke-[2.2]" />;
    case "postgres":
      return <Database className="w-5 h-5 stroke-[2.2]" />;
    case "redis":
      return <Server className="w-5 h-5 stroke-[2.2]" />;
    case "googlecloud":
      return <Cloud className="w-5 h-5 stroke-[2.2]" />;
    case "docker":
      return <Container className="w-5 h-5 stroke-[2.2]" />;
    case "jenkins":
      return <GitMerge className="w-5 h-5 stroke-[2.2]" />;
    case "grafana":
      return <Gauge className="w-5 h-5 stroke-[2.2]" />;
    case "inngest":
      return <Workflow className="w-5 h-5 stroke-[2.2]" />;
    case "aws":
      return <BrainCircuit className="w-5 h-5 stroke-[2.2]" />;
    default:
      return <Code2 className="w-5 h-5 stroke-[2.2]" />;
  }
}

export default function TechStackSkills() {
  // Default to 'ai' as requested
  const [activeTab, setActiveTab] = useState<"ai" | "frontend" | "backend">("ai");

  const filteredSkills = skillsData.filter((skill) => skill.category === activeTab);

  return (
    <div className="mt-20 sm:mt-28 pt-12 sm:pt-16 border-t border-black/8">
      {/* Header with Title & Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-[#5a625b] text-[11px] font-mono uppercase tracking-[0.15em] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c5eb35]" />
            02 / Technical Arsenal
          </div>
          <h2
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            className="text-4xl sm:text-6xl text-[#141b16] font-normal tracking-[-0.02em] leading-[1.05]"
          >
            Skills &amp; <span className="italic font-normal">Tech Stack</span>.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#616862] max-w-xl font-sans font-normal leading-relaxed">
            Core technologies, AI agent frameworks, evaluation benchmarks, and
            battle-tested tools I use to build production-ready systems.
          </p>
        </div>

        {/* Filter Pills: Default AI & Agents, No 'All Skills' */}
        <div className="flex flex-wrap items-center gap-2 bg-black/[0.04] p-1.5 rounded-full border border-black/5 self-start md:self-auto">
          {[
            { id: "ai", label: "AI & Agents" },
            { id: "frontend", label: "Frontend & Creative" },
            { id: "backend", label: "Backend & Cloud" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as "ai" | "frontend" | "backend")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#141b16] text-[#c5eb35] shadow-sm"
                  : "text-[#5a625b] hover:text-[#141b16] hover:bg-black/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Skill Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredSkills.map((skill) => (
          <div
            key={skill.name}
            className="group relative p-5 sm:p-6 rounded-[22px] bg-white border border-black/6 shadow-xs hover:shadow-[0_12px_32px_rgba(0,0,0,0.07)] hover:border-black/12 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            {/* Top Row: Icon + Level Badge */}
            <div className="flex items-start justify-between gap-3 mb-3.5">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs transition-transform duration-300 group-hover:scale-110 ${skill.iconBg}`}
              >
                <TechIcon type={skill.icon} />
              </div>

              <span className="px-2.5 py-0.5 rounded-full bg-black/5 text-[10px] font-mono font-medium text-[#5a625b] uppercase tracking-wider">
                {skill.level}
              </span>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="font-sans font-bold text-base sm:text-lg text-[#141b16] tracking-tight group-hover:text-black transition-colors">
                {skill.name}
              </h3>
              <p className="font-sans text-xs sm:text-[13px] text-[#555d57] font-normal leading-relaxed mt-1.5">
                {skill.description}
              </p>
            </div>

            {/* Bottom Accent Bar on Hover */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#c5eb35] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
}
