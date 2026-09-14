"use client";

import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import gsap from "gsap";
import {
  Bot,
  Brain,
  Cpu,
  Database,
  GitBranch,
  Network,
  Sparkles,
  Zap,
  Layers,
  Server,
  Code2,
  Terminal,
  Activity,
  Workflow,
  RotateCcw,
  Sparkle,
  Search,
} from "lucide-react";

interface BadgeItem {
  id: string;
  type: "pill" | "circle";
  label?: string;
  icon: React.ComponentType<{ className?: string }>;
  width: number;
  height: number;
  bgClass: string;
  textClass: string;
  borderClass?: string;
}

const BADGE_PRESETS: BadgeItem[] = [
  {
    id: "autonomous-agents",
    type: "pill",
    label: "Autonomous Agents",
    icon: Bot,
    width: 200,
    height: 50,
    bgClass: "bg-[#d8f966]",
    textClass: "text-[#1c2411]",
  },
  {
    id: "system-design",
    type: "pill",
    label: "System Design",
    icon: Cpu,
    width: 165,
    height: 50,
    bgClass: "bg-[#f5ba14]",
    textClass: "text-[#231a00]",
  },
  {
    id: "rag-vector-search",
    type: "pill",
    label: "RAG & Vector Search",
    icon: Search,
    width: 210,
    height: 50,
    bgClass: "bg-[#ff7640]",
    textClass: "text-[#2a1105]",
  },
  {
    id: "llm-orchestration",
    type: "pill",
    label: "LLM Orchestration",
    icon: Workflow,
    width: 200,
    height: 50,
    bgClass: "bg-[#d4c6fd]",
    textClass: "text-[#221345]",
  },
  {
    id: "distributed-systems",
    type: "pill",
    label: "Distributed Systems",
    icon: Network,
    width: 205,
    height: 50,
    bgClass: "bg-[#f3f3f0]",
    textClass: "text-[#222220]",
    borderClass: "border border-black/10",
  },
  {
    id: "fullstack-ai",
    type: "pill",
    label: "Full-Stack AI",
    icon: Code2,
    width: 160,
    height: 50,
    bgClass: "bg-[#3fd89f]",
    textClass: "text-[#0d2f21]",
  },
  {
    id: "high-throughput",
    type: "pill",
    label: "High-Throughput Queues",
    icon: Activity,
    width: 235,
    height: 50,
    bgClass: "bg-[#90caff]",
    textClass: "text-[#09284a]",
  },
  {
    id: "semantic-caching",
    type: "pill",
    label: "Semantic Caching",
    icon: Layers,
    width: 190,
    height: 50,
    bgClass: "bg-[#fbcfe8]",
    textClass: "text-[#3f132c]",
  },
  {
    id: "event-driven",
    type: "pill",
    label: "Event-Driven Arch",
    icon: Server,
    width: 190,
    height: 50,
    bgClass: "bg-[#fed7aa]",
    textClass: "text-[#3e2008]",
  },
  {
    id: "circle-brain",
    type: "circle",
    icon: Brain,
    width: 50,
    height: 50,
    bgClass: "bg-[#ff7640]",
    textClass: "text-[#2a1105]",
  },
  {
    id: "circle-sparkle",
    type: "circle",
    icon: Sparkle,
    width: 50,
    height: 50,
    bgClass: "bg-[#f5ba14]",
    textClass: "text-[#231a00]",
  },
  {
    id: "circle-db",
    type: "circle",
    icon: Database,
    width: 50,
    height: 50,
    bgClass: "bg-[#90caff]",
    textClass: "text-[#09284a]",
  },
  {
    id: "circle-terminal",
    type: "circle",
    icon: Terminal,
    width: 50,
    height: 50,
    bgClass: "bg-[#d4c6fd]",
    textClass: "text-[#221345]",
  },
  {
    id: "circle-zap",
    type: "circle",
    icon: Zap,
    width: 50,
    height: 50,
    bgClass: "bg-[#d8f966]",
    textClass: "text-[#1c2411]",
  },
  {
    id: "circle-stars",
    type: "circle",
    icon: Sparkles,
    width: 50,
    height: 50,
    bgClass: "bg-[#f3f3f0]",
    textClass: "text-[#222220]",
    borderClass: "border border-black/10",
  },
];

// 5 Curated Playful Badges for compact mobile screens
const MOBILE_BADGE_PRESETS: BadgeItem[] = [
  BADGE_PRESETS[0], // Autonomous Agents (pill)
  BADGE_PRESETS[1], // System Design (pill)
  BADGE_PRESETS[3], // LLM Orchestration (pill)
  BADGE_PRESETS[5], // Full-Stack AI (pill)
  BADGE_PRESETS[9], // Circle Brain (circle)
];

interface PlayfulPhysicsCanvasProps {
  className?: string;
}

export default function PlayfulPhysicsCanvas({
  className = "",
}: PlayfulPhysicsCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const bodiesRef = useRef<Map<string, Matter.Body>>(new Map());
  const engineRef = useRef<Matter.Engine | null>(null);
  const wallsRef = useRef<{
    ground?: Matter.Body;
    leftWall?: Matter.Body;
    rightWall?: Matter.Body;
  }>({});
  const isDraggingRef = useRef(false);
  const [activeItems, setActiveItems] = useState<BadgeItem[]>(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return MOBILE_BADGE_PRESETS;
    }
    return BADGE_PRESETS;
  });

  useEffect(() => {
    const handleCheckMobile = () => {
      const isMobile = window.innerWidth < 768;
      const targetList = isMobile ? MOBILE_BADGE_PRESETS : BADGE_PRESETS;
      setActiveItems((prev) =>
        prev.length !== targetList.length ? targetList : prev
      );
    };

    handleCheckMobile();
    window.addEventListener("resize", handleCheckMobile);
    return () => window.removeEventListener("resize", handleCheckMobile);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Create Matter Engine
    const { Engine, Bodies, Composite, Mouse, MouseConstraint } = Matter;
    const engine = Engine.create({
      gravity: { x: 0, y: 1.15, scale: 0.001 },
      constraintIterations: 4,
      positionIterations: 8,
      velocityIterations: 8,
    });
    engineRef.current = engine;

    // Create Floor & Walls (invisible boundary bodies)
    const wallThickness = 120;
    const ground = Bodies.rectangle(
      width / 2,
      height + wallThickness / 2 - 4, // cushion above bottom
      width * 3,
      wallThickness,
      {
        isStatic: true,
        friction: 0.8,
        restitution: 0.35,
        render: { visible: false },
      }
    );

    const leftWall = Bodies.rectangle(
      -wallThickness / 2,
      height / 2,
      wallThickness,
      height * 4,
      {
        isStatic: true,
        friction: 0.2,
        restitution: 0.4,
        render: { visible: false },
      }
    );

    const rightWall = Bodies.rectangle(
      width + wallThickness / 2,
      height / 2,
      wallThickness,
      height * 4,
      {
        isStatic: true,
        friction: 0.2,
        restitution: 0.4,
        render: { visible: false },
      }
    );

    wallsRef.current = { ground, leftWall, rightWall };
    Composite.add(engine.world, [ground, leftWall, rightWall]);

    // Create Matter Bodies for each badge
    const bodiesMap = new Map<string, Matter.Body>();

    activeItems.forEach((item, index) => {
      // Stagger spawn x across width and spawn above the top boundary
      const spreadX = 80 + Math.random() * Math.max(width - 160, 200);
      const startY = -60 - index * 65 - Math.random() * 80;
      const startAngle = (Math.random() - 0.5) * 0.8; // Random tilt

      let body: Matter.Body;

      if (item.type === "circle") {
        body = Bodies.circle(spreadX, startY, item.width / 2, {
          restitution: 0.7, // Bouncy feel
          friction: 0.2,
          frictionAir: 0.015,
          density: 0.002,
          render: { visible: false },
        });
      } else {
        // Capsule / rounded rectangle pill
        body = Bodies.rectangle(spreadX, startY, item.width, item.height, {
          chamfer: { radius: item.height / 2 },
          restitution: 0.55, // Nice rubbery bounce
          friction: 0.3,
          frictionAir: 0.018,
          density: 0.002,
          render: { visible: false },
        });
      }

      Matter.Body.setAngle(body, startAngle);
      // Give a tiny random initial velocity/spin for organic dropping
      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 4,
        y: Math.random() * 2,
      });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.08);

      bodiesMap.set(item.id, body);
    });

    bodiesRef.current = bodiesMap;
    Composite.add(engine.world, Array.from(bodiesMap.values()));

    // Setup Mouse Constraint for Drag & Drop with Collision Clashing
    const mouse = Mouse.create(container);
    
    // Completely unbind Matter's wheel listener so native window wheel scrolling works 100% naturally
    if (mouse.element) {
      mouse.element.removeEventListener("wheel", (mouse as any).mousewheel);
      mouse.element.removeEventListener("mousewheel", (mouse as any).mousewheel);
      mouse.element.removeEventListener("DOMMouseScroll", (mouse as any).mousewheel);
      (mouse as any).mousewheel = () => {};
    }

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.3,
        damping: 0.1,
        render: { visible: false },
      },
    });

    Composite.add(engine.world, mouseConstraint);

    Matter.Events.on(mouseConstraint, "startdrag", () => {
      isDraggingRef.current = true;
      document.body.style.cursor = "grabbing";
    });

    Matter.Events.on(mouseConstraint, "enddrag", () => {
      isDraggingRef.current = false;
      document.body.style.cursor = "default";
    });

    // High performance GSAP Ticker synchronization loop
    const tickerUpdate = () => {
      Engine.update(engine, 1000 / 60);

      // Sync every physics body's position & angle to its DOM node
      bodiesMap.forEach((body, id) => {
        const domEl = elementsRef.current.get(id);
        if (domEl) {
          gsap.set(domEl, {
            x: body.position.x,
            y: body.position.y,
            rotation: (body.angle * 180) / Math.PI,
            xPercent: -50,
            yPercent: -50,
            force3D: true,
          });
        }
      });
    };

    gsap.ticker.add(tickerUpdate);

    // Responsive Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;

      if (wallsRef.current.ground) {
        Matter.Body.setPosition(wallsRef.current.ground, {
          x: newWidth / 2,
          y: newHeight + wallThickness / 2 - 4,
        });
      }
      if (wallsRef.current.leftWall) {
        Matter.Body.setPosition(wallsRef.current.leftWall, {
          x: -wallThickness / 2,
          y: newHeight / 2,
        });
      }
      if (wallsRef.current.rightWall) {
        Matter.Body.setPosition(wallsRef.current.rightWall, {
          x: newWidth + wallThickness / 2,
          y: newHeight / 2,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      gsap.ticker.remove(tickerUpdate);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
      document.body.style.cursor = "default";
    };
  }, [activeItems]);

  // Fun Shockwave / Jump impulse
  const handleNudgeAll = () => {
    if (!engineRef.current) return;
    bodiesRef.current.forEach((body) => {
      Matter.Body.applyForce(
        body,
        { x: body.position.x, y: body.position.y },
        {
          x: (Math.random() - 0.5) * 0.1,
          y: -0.06 - Math.random() * 0.08,
        }
      );
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.2);
    });
  };

  // Reset to top to watch them drop and tumble again
  const handleResetDrop = () => {
    const container = containerRef.current;
    const width = container?.clientWidth || window.innerWidth;

    let index = 0;
    bodiesRef.current.forEach((body) => {
      const spreadX = 80 + Math.random() * Math.max(width - 160, 200);
      const startY = -60 - index * 60 - Math.random() * 70;
      Matter.Body.setPosition(body, { x: spreadX, y: startY });
      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 4,
        y: Math.random() * 2,
      });
      Matter.Body.setAngle(body, (Math.random() - 0.5) * 0.8);
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.1);
      index++;
    });
  };

  return (
    <div className={`absolute inset-0 w-full h-full pointer-events-auto overflow-hidden z-20 ${className}`}>
      {/* Physics World Canvas / Interaction Layer */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing select-none"
      >
        {activeItems.map((item) => {
          const Icon = item.icon;
          const isCircle = item.type === "circle";

          return (
            <div
              key={item.id}
              ref={(el) => {
                if (el) elementsRef.current.set(item.id, el);
                else elementsRef.current.delete(item.id);
              }}
              style={{
                width: `${item.width}px`,
                height: `${item.height}px`,
                position: "absolute",
                top: 0,
                left: 0,
                transform: "translate3d(-500px, -500px, 0)", // Offscreen until physics ticker sets position
              }}
              className={`flex items-center justify-center font-sans text-[12px] sm:text-[13px] font-normal tracking-[0.02em] rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-shadow will-change-transform select-none touch-none ${
                item.bgClass
              } ${item.textClass} ${item.borderClass || ""}`}
            >
              {isCircle ? (
                <Icon className="w-4 h-4 stroke-[1.75]" />
              ) : (
                <div className="flex items-center gap-2 px-3.5">
                  <span className="whitespace-nowrap font-normal tracking-tight">
                    {item.label}
                  </span>
                  <Icon className="w-3.5 h-3.5 stroke-[1.75] opacity-80 shrink-0" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Physics Controls */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={handleNudgeAll}
          title="Jump / Shockwave"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 hover:bg-black/10 text-[#141b16] backdrop-blur-sm border border-black/5 text-[11px] font-normal transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          <span>Bounce</span>
        </button>

        <button
          type="button"
          onClick={handleResetDrop}
          title="Reset and Drop from top"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 hover:bg-black/10 text-[#141b16] backdrop-blur-sm border border-black/5 text-[11px] font-normal transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Drop Again</span>
        </button>
      </div>

      {/* Subtle Bottom Interaction Hint */}
      <div className="absolute bottom-24 sm:bottom-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none opacity-40 hover:opacity-100 transition-opacity text-center">
        <span className="text-[10px] sm:text-[11px] tracking-[0.15em] font-sans font-normal text-[#5a625b]">
          • Drag &amp; toss pills to clash •
        </span>
      </div>
    </div>
  );
}
