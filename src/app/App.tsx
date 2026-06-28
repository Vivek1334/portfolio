import { useState, useEffect } from "react";
import { Github, Linkedin, Twitter, ArrowUpRight, Send, Coffee, Leaf, Code2, Database, Network, Flame, GitBranch, Box } from "lucide-react";

/* ─── types ─── */
type Tab = "All" | "Backend" | "Frontend" | "DevOps";
type Shape = "circle" | "grid" | "lines" | "dots";
type Project = {
  title: string;
  category: Tab;
  year: string;
  desc: string;
  stack: string[];
  accent: string;
  shape: Shape;
  url?: string;
};
type Skill = {
  name: string;
  level: number;
};
type PortfolioData = {
  projects: Project[];
  skills: Skill[];
};

/* ─── data ─── */
const NAV = ["About", "Projects", "Skills", "Contact"];

const DEFAULT_PROJECTS: Project[] = [
  {
    title: "Form-Craft",
    category: "Frontend",
    year: "2025",
    desc: "An interactive, visual form builder application built with React. Allows users to create dynamic schema-based forms with live validation.",
    stack: ["React", "JavaScript", "HTML5", "CSS3"],
    accent: "#d4ff00",
    shape: "lines",
    url: "https://survey-builder-ll65.onrender.com",
  },
];

const DEFAULT_SKILLS: Skill[] = [
  { name: "Java SE / Core Java", level: 88 },
  { name: "Spring Boot / Hibernate", level: 82 },
  { name: "React / TypeScript", level: 80 },
  { name: "SQL (PostgreSQL & MySQL)", level: 85 },
  { name: "RESTful Web Services", level: 85 },
  { name: "HTML5 / CSS3 (Tailwind)", level: 85 },
  { name: "Git & Version Control", level: 80 },
  { name: "Docker (Containerization)", level: 70 },
];

/* ─── abstract shape components ─── */
function ShapeGrid({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full transition-opacity duration-300">
      {Array.from({ length: 5 }).map((_, r) =>
        Array.from({ length: 5 }).map((_, c) => (
          <rect
            key={`${r}-${c}`}
            x={c * 18 + 2}
            y={r * 18 + 2}
            width="12"
            height="12"
            rx="2"
            fill={color}
            className="origin-center transition-all duration-500 ease-out opacity-20 group-hover:opacity-95 group-hover:scale-125"
            style={{
              transformOrigin: `${c * 18 + 8}px ${r * 18 + 8}px`,
              transitionDelay: `${(r + c) * 45}ms`,
            }}
          />
        ))
      )}
    </svg>
  );
}

function ShapeLines({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full transition-opacity duration-300">
      {Array.from({ length: 8 }).map((_, i) => (
        <line
          key={i}
          x1={i * 12}
          y1="0"
          x2={i * 12 + 40}
          y2="80"
          stroke={color}
          strokeWidth={i % 2 === 0 ? 3 : 1}
          className="transition-all duration-500 ease-out opacity-20 group-hover:opacity-90 group-hover:translate-x-3 group-hover:stroke-[1.5]"
          style={{
            transitionDelay: `${i * 35}ms`,
          }}
        />
      ))}
    </svg>
  );
}

function ShapeCircle({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full transition-opacity duration-300">
      {[32, 22, 12, 4].map((r, i) => (
        <circle
          key={i}
          cx="40"
          cy="40"
          r={r}
          stroke={color}
          strokeWidth={i === 0 ? 8 : 2}
          className="origin-center transition-all duration-700 ease-out opacity-25 group-hover:opacity-90 group-hover:scale-110"
          style={{
            transformOrigin: "40px 40px",
            transitionDelay: `${i * 60}ms`,
          }}
        />
      ))}
      <circle
        cx="40"
        cy="40"
        r="5"
        fill={color}
        className="origin-center transition-all duration-500 ease-out opacity-30 group-hover:opacity-100 group-hover:scale-150"
        style={{
          transformOrigin: "40px 40px",
        }}
      />
    </svg>
  );
}

function ShapeDots({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full transition-opacity duration-300">
      {Array.from({ length: 6 }).map((_, r) =>
        Array.from({ length: 6 }).map((_, c) => (
          <circle
            key={`${r}-${c}`}
            cx={c * 14 + 7}
            cy={r * 14 + 7}
            r={2}
            fill={color}
            className="origin-center transition-all duration-500 ease-out opacity-20 group-hover:opacity-100 group-hover:scale-175"
            style={{
              transformOrigin: `${c * 14 + 7}px ${r * 14 + 7}px`,
              transitionDelay: `${(r + c) * 35}ms`,
            }}
          />
        ))
      )}
    </svg>
  );
}

function ProjectShape({ shape, color }: { shape: Shape; color: string }) {
  if (shape === "circle") return <ShapeCircle color={color} />;
  if (shape === "grid") return <ShapeGrid color={color} />;
  if (shape === "lines") return <ShapeLines color={color} />;
  return <ShapeDots color={color} />;
}

/* ─── hero abstract graphic ─── */
function HeroGraphic() {
  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center select-none animate-float">
      {/* large glowing background blur */}
      <div className="absolute rounded-full w-[clamp(280px,50vw,450px)] h-[clamp(280px,50vw,450px)] bg-[#d4ff00]/10 blur-[60px] animate-pulse-slow pointer-events-none" />
      
      {/* large lime circle -> gradient lime-cyan-emerald */}
      <div className="absolute rounded-full w-[clamp(200px,38vw,340px)] h-[clamp(200px,38vw,340px)] bg-gradient-to-tr from-[#d4ff00] via-[#00f2fe] to-[#4facfe] shadow-[0_20px_50px_rgba(212,255,0,0.3)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hover:scale-[1.05] hover:rotate-12 transition-all duration-700 ease-out" />
      
      {/* dark ring -> floating rotating outline */}
      <div className="absolute rounded-full border-4 border-foreground w-[clamp(240px,45vw,400px)] h-[clamp(240px,45vw,400px)] top-1/2 left-1/2 -translate-x-[46%] -translate-y-[46%] animate-float-reverse hover:scale-95 transition-all duration-700 pointer-events-none" />
      
      {/* small accent square 1 -> neon pink glow */}
      <div className="absolute w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff007f] to-[#ff007f]/40 shadow-[0_0_20px_rgba(255,0,127,0.4)] top-[18%] right-[22%] rotate-[15deg] hover:rotate-[45deg] hover:translate-y-[-10px] transition-all duration-500 cursor-pointer" />
      
      {/* small accent square 2 -> neon purple glow */}
      <div className="absolute w-8 h-8 rounded-lg bg-gradient-to-br from-[#7b61ff] to-[#7b61ff]/40 shadow-[0_0_20px_rgba(123,97,255,0.4)] bottom-[22%] left-[18%] -rotate-[10deg] hover:rotate-[-45deg] hover:translate-y-[10px] transition-all duration-500 cursor-pointer" />
      
      {/* text overlay -> frosted glass badge */}
      <div className="relative z-10 text-center bg-white/80 dark:bg-black/80 backdrop-blur-md border border-white/20 dark:border-white/10 px-8 py-5 rounded-3xl shadow-2xl hover:scale-115 transition-transform duration-300 cursor-default">
        <span className="text-4xl font-extrabold tracking-tight font-['Bricolage_Grotesque',sans-serif] text-[#0a0a0a] dark:text-[#d4ff00] flex gap-1 justify-center">
          {"</>".split("").map((char, index) => (
            <span
              key={index}
              className="inline-block hover:scale-150 hover:-translate-y-3 hover:rotate-[20deg] transition-all duration-300 cursor-default hover:text-[#ff007f] dark:hover:text-[#ff007f] hover:drop-shadow-[0_4px_10px_rgba(255,0,127,0.5)]"
            >
              {char}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

/* ─── about graphic ─── */
function AboutGraphic() {
  return (
    <div className="relative w-full aspect-square max-w-sm mx-auto select-none animate-float-reverse">
      {/* stacked color blocks */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-4 p-3">
        {/* Cell 1: Lime to cyan gradient with lift and glow */}
        <div className="rounded-3xl bg-gradient-to-tr from-[#d4ff00] via-[#00f2fe] to-[#4facfe] shadow-[0_10px_25px_rgba(212,255,0,0.25)] hover:scale-105 hover:-rotate-3 hover:shadow-[0_15px_35px_rgba(212,255,0,0.4)] transition-all duration-300 cursor-pointer" />
        
        {/* Cell 2: Glowing dark/glassmorphic block */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0a0a0a] to-[#202020] border border-white/10 shadow-xl hover:scale-105 hover:rotate-3 hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)] transition-all duration-300 cursor-pointer flex items-center justify-center text-white/10 hover:text-white/40">
          <span className="text-3xl font-extrabold font-['Bricolage_Grotesque',sans-serif] flex gap-0.5">
            <span className="inline-block hover:scale-150 hover:-translate-y-2 hover:rotate-[15deg] transition-all duration-300 cursor-default hover:text-[#d4ff00] hover:drop-shadow-[0_2px_8px_rgba(212,255,0,0.5)]">V</span>
            <span className="inline-block hover:scale-150 hover:-translate-y-2 hover:-rotate-[15deg] transition-all duration-300 cursor-default hover:text-[#00f2fe] hover:drop-shadow-[0_2px_8px_rgba(0,242,254,0.5)]">O</span>
          </span>
        </div>
        
        {/* Cell 3: Dashed colored outline rotating/pulsing style */}
        <div className="rounded-3xl border-2 border-dashed border-[#7b61ff] bg-transparent hover:scale-105 hover:border-solid hover:border-[#ff007f] transition-all duration-300 cursor-pointer" />
        
        {/* Cell 4: Glassmorphic interactive cell with rotating inner shape */}
        <div className="group rounded-3xl flex items-center justify-center bg-[#f4f4f4] dark:bg-[#1a1a1a] shadow-lg hover:scale-105 hover:bg-[#eaeaea] dark:hover:bg-[#252525] transition-all duration-300 cursor-pointer">
          <svg viewBox="0 0 48 48" className="w-12 h-12 transition-transform duration-500 group-hover:rotate-[90deg]">
            <circle cx="24" cy="24" r="20" className="stroke-[#0a0a0a] dark:stroke-white" strokeWidth="2.5" fill="none" />
            <path d="M16 24 L24 16 L32 24 L24 32 Z" fill="#d4ff00" className="drop-shadow-[0_2px_4px_rgba(212,255,0,0.5)]" />
          </svg>
        </div>
      </div>
      
      {/* floating badge with pulsing status dot */}
      <div className="absolute -bottom-4 -right-4 flex items-center gap-3 px-5 py-2.5 rounded-full border-2 border-foreground bg-background shadow-2xl font-['JetBrains_Mono',monospace] text-[0.7rem] hover:scale-105 transition-all duration-200 cursor-default">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        Open to work
      </div>
    </div>
  );
}

/* ─── dancing text helper component ─── */
function DancingText({ text, className, hoverClass = "hover:text-[#7b61ff]" }: { text: string; className?: string; hoverClass?: string }) {
  return (
    <span className={className}>
      {text.split("").map((char, index) => (
        <span
          key={index}
          className={`inline-block transition-all duration-300 hover:scale-125 hover:-translate-y-2 hover:rotate-[8deg] cursor-default ${hoverClass}`}
          style={{ transitionDelay: `${index * 15}ms` }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

/* ─── background engineering grid lines ─── */
function BackgroundGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03] dark:opacity-[0.05] select-none z-0">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="bg-grid-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg-grid-pattern)" />
      </svg>
    </div>
  );
}

/* ─── interactive pattern grid ─── */
function InteractivePatternGrid() {
  const skills = [
    { name: "Java", icon: Coffee, color: "#f89820", desc: "Core Java" },
    { name: "Spring Boot", icon: Leaf, color: "#6db33f", desc: "Enterprise APIs" },
    { name: "React / TS", icon: Code2, color: "#00d8ff", desc: "Frontends" },
    { name: "SQL", icon: Database, color: "#336791", desc: "Databases" },
    { name: "REST APIs", icon: Network, color: "#7b61ff", desc: "Web Services" },
    { name: "HTML & CSS", icon: Flame, color: "#ff007b", desc: "Tailwind" },
    { name: "Git", icon: GitBranch, color: "#f05032", desc: "Git & GitHub" },
    { name: "Docker", icon: Box, color: "#2496ed", desc: "Containers" }
  ];

  return (
    <div className="mt-12 p-6 rounded-3xl border border-border bg-card/30 backdrop-blur-sm relative overflow-hidden max-w-md">
      <div className="absolute top-3 right-4 text-[0.65rem] font-mono text-muted-foreground uppercase tracking-wider">
        Interactive Canvas
      </div>
      
      <div className="grid grid-cols-4 gap-3 mt-4">
        {skills.map((skill) => {
          const Icon = skill.icon;
          return (
            <div
              key={skill.name}
              className="group relative aspect-square rounded-xl border border-border/80 bg-background/50 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 hover:border-foreground/30 hover:scale-105 hover:shadow-md cursor-default p-2"
            >
              {/* Hover background color transition */}
              <div 
                className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-10 pointer-events-none"
                style={{ background: skill.color }}
              />
              
              {/* Icon */}
              <div 
                className="transition-all duration-500 scale-90 group-hover:scale-110 mb-1"
                style={{ color: skill.color }}
              >
                <Icon size={20} strokeWidth={2} />
              </div>
              
              {/* Skill Name */}
              <span className="text-[0.6rem] font-bold text-center text-muted-foreground group-hover:text-foreground transition-colors leading-none font-mono">
                {skill.name}
              </span>
              
              {/* Subtle accent corner element */}
              <div className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-foreground/10 group-hover:bg-foreground/50 transition-colors" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── main component ─── */
export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [portfolio, setPortfolio] = useState<PortfolioData>({
    projects: DEFAULT_PROJECTS,
    skills: DEFAULT_SKILLS,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((response) => {
        if (!response.ok) throw new Error("Portfolio API unavailable");
        return response.json();
      })
      .then((data: PortfolioData) => setPortfolio(data))
      .catch(() => {
        setPortfolio({ projects: DEFAULT_PROJECTS, skills: DEFAULT_SKILLS });
      });
  }, []);

  const filtered = activeTab === "All" ? portfolio.projects : portfolio.projects.filter((p) => p.category === activeTab);

  function scrollTo(id: string) {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }

  async function submitContact(form: HTMLFormElement) {
    const data = Object.fromEntries(new FormData(form).entries());
    setSending(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Contact API unavailable");
      setSent(true);
      form.reset();
    } catch {
      setSent(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-transparent text-foreground font-plus">
      {/* ── NAV ── */}
      <header
        className={
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 " +
          (scrolled
            ? "bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-border"
            : "bg-transparent")
        }
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-extrabold text-lg tracking-tight font-bricolage"
          >
            Vivek<span className="text-[#d4ff00 judgment-ignore]">.</span>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {NAV.map((link) => (
              <button
                key={link}
                type="button"
                onClick={() => scrollTo(link)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link}
              </button>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => scrollTo("Contact")}
            className="hidden md:flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200 hover:scale-105 bg-[#0a0a0a] text-white"
          >
            Get in Touch
          </button>

          {/* Mobile toggle */}
          <button type="button" className="md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
            <div className="flex flex-col gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`block h-px w-6 bg-foreground transition-all duration-200 ${
                    menuOpen && i === 0
                      ? "rotate-45 translate-x-[3px] translate-y-[3px]"
                      : menuOpen && i === 2
                      ? "-rotate-45 translate-x-[3px] -translate-y-[3px]"
                      : "rotate-0 translate-x-0 translate-y-0"
                  } ${menuOpen && i === 1 ? "opacity-0" : "opacity-100"}`}
                />
              ))}
            </div>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-background border-t border-border px-6 py-4 flex flex-col gap-4">
            {NAV.map((link) => (
              <button
                key={link}
                type="button"
                onClick={() => scrollTo(link)}
                className="text-left text-sm font-medium text-muted-foreground"
              >
                {link}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="min-h-screen flex items-center pt-16 relative overflow-hidden">
        <BackgroundGrid />
        <div className="max-w-6xl mx-auto w-full px-6 grid md:grid-cols-2 gap-12 items-center py-24 relative z-10">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-xs font-medium mb-8 font-mono text-[#777]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Bengaluru,India· Available now
            </div>

            <h1 className="leading-[1.05] tracking-tight mb-6 font-extrabold text-[clamp(2.8rem,7vw,5.5rem)]">
              <DancingText text="Myself" />
              <br />
              <span
                className="relative inline-block bg-[#d4ff00] px-1.5 -ml-1"
              >
                <DancingText text="Vivek" hoverClass="hover:text-[#0e1105] dark:hover:text-white hover:scale-110" />
              </span>
              <br />
              <DancingText text="Odugoudar" />
              <br />
            </h1>

            <p className="text-muted-foreground text-lg leading-relaxed font-light mb-10 max-w-md">
              Full stack developer specializing in Java, Spring Boot, and React. Driven to build scalable
              enterprise systems with microservices, REST APIs, and event-driven architectures.
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={() => scrollTo("Projects")}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg bg-black text-white"
              >
                See My Work <ArrowUpRight size={14} />
              </button>
              <button
                onClick={() => scrollTo("Contact")}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border-2 border-foreground transition-all duration-200 hover:bg-foreground hover:text-background"
              >
                Hire Me
              </button>
            </div>

            {/* social strip */}
            <div className="flex items-center gap-5 mt-10 pt-10 border-t border-border">
              {([
                { icon: <Github size={18} />, href: "https://github.com/Vivek1334", label: "GitHub" },
                { icon: <Linkedin size={18} />, href: "https://www.linkedin.com/in/vivek1334/", label: "LinkedIn" },
                { icon: <Twitter size={18} />, href: "https://x.com/Vivek13VO", label: "Twitter" },
              ]).map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={label}
                >
                  {icon}
                </a>
              ))}
              <a
                href="mailto:vivek130304@gmail.com"
                className="ml-4 text-xs text-muted-foreground hover:text-foreground transition-colors font-jetbrains-mono"
              >
                vivek130304@gmail.com
              </a>
            </div>
          </div>

          {/* Right — abstract graphic */}
          <HeroGraphic />
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-28 border-t border-border relative overflow-hidden">
        <BackgroundGrid />
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
          <AboutGraphic />

          <div>
            <span
              className="text-xs uppercase tracking-widest text-muted-foreground mb-4 block"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              About me
            </span>
            <h2
              className="leading-tight mb-6"
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
              }}
            >
              Crafting systems that
              <span
                style={{
                  textDecoration: "underline",
                  textDecorationColor: "#d4ff00",
                  textDecorationThickness: "4px",
                  textUnderlineOffset: "4px",
                }}
              >
                   hold under pressure.
              </span>
            </h2>
            <p className="text-muted-foreground leading-relaxed font-light mb-5">
              I started my journey as a computer science student passionate about building clean, efficient software.
              Java and JavaScript became my primary languages, allowing me to explore the full depth of software development—from robust backends to interactive user interfaces. As a recent graduate, I have focused on mastering modern web development patterns, solidifying my foundations in data structures, databases, and system design.
            </p>
            <p className="text-muted-foreground leading-relaxed font-light mb-8">
              My academic and personal project experience spans the full stack: building RESTful APIs using Spring Boot, designing responsive user interfaces with React and TypeScript, and deploying applications locally. I am deeply interested in learning about distributed systems, writing clean and maintainable code, and contributing to collaborative engineering teams.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {([
                { num: "B.E.", label: "Computer Science" },
                { num: "1", label: "Project built" },
                { num: "100%", label: "Fast learner" },
              ]).map(({ num, label }) => (
                <div key={label} className="p-4 rounded-2xl" style={{ background: "#f4f4f4" }}>
                  <div
                    className="text-2xl font-extrabold mb-0.5"
                    style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                  >
                    {num}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" className="py-28 border-t border-border relative overflow-hidden">
        <BackgroundGrid />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span
                className="text-xs uppercase tracking-widest text-muted-foreground mb-4 block"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Portfolio
              </span>
              <h2
                className="leading-tight"
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.8rem, 4vw, 3rem)",
                }}
              >
                My Projects
              </h2>
            </div>

            {/* Tab filters */}
            <div className="flex items-center gap-2 flex-wrap">
              {(["All", "Backend", "Frontend", "DevOps"] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
                  style={{
                    background: activeTab === tab ? "#0a0a0a" : "#f4f4f4",
                    color: activeTab === tab ? "#fff" : "#777",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((project) => (
              <div
                key={project.title}
                onClick={() => {
                  if (project.url) {
                    window.open(project.url, "_blank", "noopener,noreferrer");
                  }
                }}
                className="group rounded-2xl overflow-hidden border border-border hover:border-foreground/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer bg-card/60 dark:bg-card/40 backdrop-blur-sm"
              >
                {/* card top — abstract shape area */}
                <div
                  className="relative h-40 flex items-center justify-center overflow-hidden transition-all duration-300"
                  style={{ background: project.accent === "#0a0a0a" ? "#0a0a0a" : `${project.accent}18` }}
                >
                  {/* Hover background glow layer */}
                  {project.accent !== "#0a0a0a" && (
                    <div
                      className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-10 pointer-events-none"
                      style={{ background: project.accent }}
                    />
                  )}
                  <div className="absolute inset-0">
                    <ProjectShape shape={project.shape} color={project.accent} />
                  </div>
                  {/* big initial */}
                  <span
                    className="relative z-10 text-6xl font-extrabold opacity-20 select-none"
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      color: project.accent === "#0a0a0a" ? "#fff" : project.accent,
                    }}
                  >
                    {project.title[0]}
                  </span>
                  {/* category pill */}
                  <span
                    className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full font-medium"
                    style={{
                      background: project.accent === "#0a0a0a" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)",
                      color: project.accent === "#0a0a0a" ? "#fff" : "#0a0a0a",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {project.category}
                  </span>
                  {/* arrow */}
                  <div
                    className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: "#0a0a0a" }}
                  >
                    <ArrowUpRight size={12} color="#fff" />
                  </div>
                </div>

                {/* card body */}
                <div className="p-5">
                  <div className="flex items-baseline justify-between mb-2">
                    <h3
                      className="font-bold text-lg"
                      style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                    >
                      {project.title}
                    </h3>
                    <span
                      className="text-xs text-muted-foreground"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {project.year}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed font-light mb-4">
                    {project.desc}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: "#f4f4f4",
                          color: "#555",
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTE BAND ── */}
      <section className="py-28 bg-foreground text-background overflow-hidden relative">
        {/* background pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cross" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <line x1="20" y1="0" x2="20" y2="40" stroke="white" strokeWidth="1" />
                <line x1="0" y1="20" x2="40" y2="20" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cross)" />
          </svg>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <p
            className="text-xs uppercase tracking-widest mb-8 opacity-50"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Philosophy
          </p>
          <blockquote
            className="leading-tight mb-10"
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2rem, 6vw, 5rem)",
            }}
          >
            Nothing great is
            <br />
            <span style={{ color: "#d4ff00" }}>made alone.</span>
          </blockquote>
          <p className="text-background/60 text-lg font-light max-w-xl mx-auto mb-10">
            The best systems I build will be products of clear communication, honest code review,
            and a team that trusts each other.
          </p>
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm transition-all duration-200 hover:scale-105"
            style={{ background: "#d4ff00", color: "#0a0a0a" }}
          >
            Work together <ArrowUpRight size={14} />
          </button>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" className="py-28 border-t border-border relative overflow-hidden">
        <BackgroundGrid />
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <span
              className="text-xs uppercase tracking-widest text-muted-foreground mb-4 block"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Expertise
            </span>
            <h2
              className="leading-tight mb-4"
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
              }}
            >
              Tech I work with
            </h2>
            <p className="text-muted-foreground font-light leading-relaxed">
              Comfort levels based on daily usage and production experience — not tutorials.
            </p>
            <InteractivePatternGrid />
          </div>

          <div className="space-y-5">
            {portfolio.skills.map((skill, i) => (
              <div key={skill.name}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium">{skill.name}</span>
                  <span
                    className="text-xs text-muted-foreground"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {skill.level}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full" style={{ background: "#f4f4f4" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${skill.level}%`,
                      background: i % 3 === 0 ? "#d4ff00" : i % 3 === 1 ? "#0a0a0a" : "#d0d0d0",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-28 border-t border-border relative overflow-hidden">
        <BackgroundGrid />
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-start relative z-10">
          <div>
            <span
              className="text-xs uppercase tracking-widest text-muted-foreground mb-4 block"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Get in touch
            </span>
            <h2
              className="leading-tight mb-6"
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
              }}
            >
              Have a project
              <br />
              in mind?
            </h2>
            <p className="text-muted-foreground font-light leading-relaxed max-w-sm mb-8">
              I&apos;m open to entry-level software engineer and full-stack developer roles. Passionate about learning new technologies and contributing to collaborative teams.
              Response time: usually same day.
            </p>

            <div className="space-y-3">
              {([
                { label: "Email", value: "vivek130304@gmail.com" },
                { label: "Location", value: "Bengaluru, Karnataka" },
                { label: "Availability", value: "Immediately" },
              ]).map(({ label, value }) => (
                <div key={label} className="flex items-center gap-4">
                  <span
                    className="text-xs text-muted-foreground w-24 shrink-0"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {label}
                  </span>
                  <span className="text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          {sent ? (
            <div
              className="rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-4 border-2"
              style={{ borderColor: "#d4ff00", background: "#d4ff0010", minHeight: "360px" }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "#d4ff00" }}
              >
                <Send size={18} color="#0a0a0a" />
              </div>
              <h3
                className="text-xl font-bold"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Message sent!
              </h3>
              <p className="text-muted-foreground text-sm font-light">
                I&apos;ll be in touch within 24 hours.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitContact(e.currentTarget);
              }}
              className="rounded-2xl p-8 border border-border space-y-5 bg-card/40 dark:bg-card/20 backdrop-blur-sm"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                {([
                  { label: "First Name", name: "firstName", type: "text", placeholder: "Vivek" },
                  { label: "Last Name", name: "lastName", type: "text", placeholder: "Odugoudar" },
                ]).map((f) => (
                  <div key={f.label}>
                    <label className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wide">
                      {f.label}
                    </label>
                    <input
                      name={f.name}
                      type={f.type}
                      required
                      placeholder={f.placeholder}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent transition"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wide">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wide">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell me about your project..."
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent transition resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 hover:scale-[1.01]"
                style={{ background: "#0a0a0a", color: "#fff" }}
              >
                {sending ? "Sending..." : "Send Message"} <Send size={14} />
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border py-10">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[1fr_auto_auto_auto] gap-8 items-start">
          <div>
            <div
              className="text-xl font-extrabold mb-2"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Vivek<span style={{ color: "#d4ff00" }}>.</span>
            </div>
            <p className="text-sm text-muted-foreground font-light max-w-xs">
              Full stack developer building fast, observable, and maintainable systems.
            </p>
            <div className="flex gap-4 mt-4">
              {([
                { Icon: Github, href: "https://github.com/Vivek1334", label: "GitHub" },
                { Icon: Linkedin, href: "https://www.linkedin.com/in/vivek1334/", label: "LinkedIn" },
                { Icon: Twitter, href: "https://x.com/Vivek13VO", label: "Twitter" },
              ]).map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {([
            {
              heading: "Pages",
              links: [
                { name: "About", href: "#about", action: () => scrollTo("About") },
                { name: "Projects", href: "#projects", action: () => scrollTo("Projects") },
                { name: "Skills", href: "#skills", action: () => scrollTo("Skills") },
                { name: "Contact", href: "#contact", action: () => scrollTo("Contact") },
              ],
            },
            {
              heading: "Connect",
              links: [
                { name: "GitHub", href: "https://github.com/Vivek1334", external: true },
                { name: "LinkedIn", href: "https://www.linkedin.com/in/vivek1334/", external: true },
                { name: "Twitter", href: "https://x.com/Vivek13VO", external: true },
                { name: "Email", href: "mailto:vivek130304@gmail.com", external: false },
              ],
            },
          ]).map(({ heading, links }) => (
            <div key={heading}>
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-4 text-muted-foreground">
                {heading}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.action ? (
                      <button
                        onClick={link.action}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors font-light text-left"
                      >
                        {link.name}
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors font-light"
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-6xl mx-auto px-6 mt-10 pt-6 border-t border-border flex flex-col md:flex-row justify-between gap-2">
          <span className="text-xs text-muted-foreground">© 2026 Vivek . All rights reserved.</span>
          <span
            className="text-xs text-muted-foreground"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Built with React · India
          </span>
        </div>
      </footer>
    </div>
  );
}
