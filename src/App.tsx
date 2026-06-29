import { useEffect, useRef, useState } from "react";
import {
  Sprout,
  Mic,
  Cpu,
  Layers,
  Award,
  BookOpen,
  Calendar,
  Globe,
  TrendingUp,
  LineChart,
  Network,
  Eye,
  ChevronRight,
  ArrowUpRight,
  Info,
  ExternalLink,
  Sun,
  Moon
} from "lucide-react";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState("about");
  const [imageError, setImageError] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark") || localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // IntersectionObserver for scroll-reveal animations
  useEffect(() => {
    const revealElements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Subtle slow-moving particle canvas background in Hero section
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
    }

    const particles: Particle[] = [];

    const createParticle = (): Particle => {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 2.5 + 0.5,
        color: Math.random() > 0.65 ? "#D4A017" : "#A8C5A0",
        alpha: Math.random() * 0.4 + 0.1,
      };
    };

    // Generate particles
    const particleCount = Math.min(Math.floor(width / 30), 50);
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connections
      ctx.strokeStyle = "rgba(168, 197, 160, 0.05)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 4;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Stats for the Hero Section
  const stats = [
    { value: "98.2%", label: "ASR Accuracy", desc: "Native dialects recognized" },
    { value: "48+", label: "Target Crops", desc: "Detailed knowledge graph nodes" },
    { value: "12k+", label: "Audio Corpus", desc: "Hours of rural Bangla speech" },
    { value: "75ms", label: "Model Latency", desc: "Optimized for offline edge" }
  ];

  // Highlight Cards for About Section
  const highlightCards = [
    {
      title: "Linguistic Equity",
      desc: "Recognizing and translating nuanced regional agricultural dialects across Bangladesh, ensuring no farmer is left behind due to terminology.",
      tag: "Speech Processing"
    },
    {
      title: "Empirical Multimodality",
      desc: "Combining optical symptom scanning (OCR) with deep conversational queries to deliver immediate, multi-vector agricultural diagnostics.",
      tag: "ASR + Vision"
    },
    {
      title: "Edge Resilience",
      desc: "Architected to perform in low-bandwidth, rural fields with highly compressed offline models that execute without active internet pipelines.",
      tag: "Offline-First AI"
    }
  ];

  // Objectives SO-01, SO-02, SO-03
  const objectives = [
    {
      id: "SO-01",
      title: "Technical Frontier",
      subtitle: "Multi-Modal AI Architecture",
      desc: "To develop state-of-the-art Bangla Automatic Speech Recognition (ASR) coupled with lightweight, agriculture-tuned Large Language Models (LLMs) and Graph Neural Networks (GNNs) for highly accurate knowledge retrieval.",
      points: [
        "Robust regional dialect modeling",
        "Sparse agricultural knowledge graphs",
        "Edge-optimized inference structures"
      ],
      color: "border-brand-green bg-bg-card text-charcoal"
    },
    {
      id: "SO-02",
      title: "Farmer Empowerment",
      subtitle: "Natural Conversational Interface",
      desc: "To bridge the digital literacy divide by creating intuitive, voice-based conversational channels allowing smallholder farmers to seek real-time, expert-level cultivation advice in their native vernacular.",
      points: [
        "Hands-free voice querying",
        "Locally validated agricultural advice",
        "Inclusive audio-first response output"
      ],
      color: "border-harvest-gold bg-bg-card text-charcoal"
    },
    {
      id: "SO-03",
      title: "Market & Climate Impact",
      subtitle: "Dynamic Decision Pipelines",
      desc: "To integrate local weather datasets, real-time market pricing dynamics, and rapid crop disease OCR identification to guide resilient farming decisions and boost household income.",
      points: [
        "Real-time crop market alerts",
        "Predictive climate-crop planning",
        "Direct visual leaf-lesion diagnosis"
      ],
      color: "border-terracotta bg-bg-card text-charcoal"
    }
  ];

  // Technology Section details
  const techDetails = [
    {
      title: "Bangla Speech (ASR)",
      desc: "Highly-calibrated speech acoustic modeling fine-tuned on diverse rural regional Bangla dialects. Incorporates noise-robust feature layers to filter ambient farming and environmental noise.",
      tags: ["Wav2Vec 2.0", "Dialect-Robust", "CTC Loss"],
      icon: <Mic className="w-6 h-6 text-accent-gold" />
    },
    {
      title: "Agriculture LLM",
      desc: "An encoder-decoder Transformer framework loaded with validated scientific crop agronomy, soil chemistry, pest vector workflows, and organic cultivation guidelines.",
      tags: ["Llama-3-Agri", "QLoRA Fine-Tune", "RAG Pipeline"],
      icon: <Cpu className="w-6 h-6 text-accent-gold" />
    },
    {
      title: "Knowledge Graphs (GNN)",
      desc: "A heterogeneous entity-relationship graph network mapping crop-to-disease, weather-to-risk, and treatment-to-ecology dependencies to prevent model hallucinations.",
      tags: ["Heterogeneous Graphs", "Node Classification", "DGL Network"],
      icon: <Network className="w-6 h-6 text-accent-gold" />
    },
    {
      title: "Agri-OCR & Leaf Vision",
      desc: "Mobile-optimized vision model that recognizes printed seed labels, chemical composition instructions, and detects physical fungal or pest lesions on crop leaves.",
      tags: ["YOLOv8-Leaf", "Tesseract-Custom", "CNN Classification"],
      icon: <Eye className="w-6 h-6 text-accent-gold" />
    }
  ];

  // Timeline quarters
  const timelineQuarters = [
    {
      phase: "Phase I (Q1 - Q2)",
      title: "Corpus & Dialect Harvesting",
      desc: "Comprehensive speech corpus collection in targeted agro-ecological regions. Initial cataloging of disease vectors and knowledge graph entity construction.",
      status: "Active Research"
    },
    {
      phase: "Phase II (Q3 - Q4)",
      title: "Acoustic & Agronomy Training",
      desc: "Base model training of Bangla dialect ASR. Fine-tuning the localized agriculture-specific LLM parameters with synthetic and curated agrarian datasets.",
      status: "Upcoming"
    },
    {
      phase: "Phase III (Q5 - Q6)",
      title: "Multimodal Synthesis & App Beta",
      desc: "Synthesizing ASR and OCR capabilities. Packaging the model into lightweight edge-runtime wrappers. Launching pilot testing with 200 partner smallholders.",
      status: "Upcoming"
    },
    {
      phase: "Phase IV (Q7 - Q8)",
      title: "Dynamic Scaling & API Release",
      desc: "Full rollout across major agricultural zones. Exposing modular microservices as public research APIs for academic, government, and NGO extension workers.",
      status: "Future Scope"
    }
  ];

  // SDGs with colors
  const sdgs = [
    {
      num: "SDG 1",
      title: "No Poverty",
      desc: "Reducing vulnerability of smallholders to crop failure and market manipulation by delivering immediate, actionable technical agricultural advice directly to their fields.",
      color: "bg-amber-50/80 border-amber-200 text-amber-900 dark:bg-amber-950/25 dark:border-amber-900/40 dark:text-amber-200"
    },
    {
      num: "SDG 2",
      title: "Zero Hunger",
      desc: "Improving agricultural productivity and sustainable food production systems through smart pest forecasting, soil health planning, and localized resilient guidelines.",
      color: "bg-emerald-50/80 border-emerald-200 text-emerald-900 dark:bg-emerald-950/25 dark:border-emerald-900/40 dark:text-emerald-200"
    },
    {
      num: "SDG 8",
      title: "Decent Work",
      desc: "Increasing economic productivity by upgrading manual decision-making with cutting-edge AI guidance, securing smallholder incomes, and supporting resilient rural labor.",
      color: "bg-blue-50/80 border-blue-200 text-blue-900 dark:bg-blue-950/25 dark:border-blue-900/40 dark:text-blue-200"
    },
    {
      num: "SDG 9",
      title: "Industry & Innovation",
      desc: "Fostering regional academic innovation by developing country-specific, dialect-inclusive AI assets that set a new benchmark for Southern linguistic empowerment.",
      color: "bg-rose-50/80 border-rose-200 text-rose-900 dark:bg-rose-950/25 dark:border-rose-900/40 dark:text-rose-200"
    }
  ];

  return (
    <div className="min-h-screen bg-cream font-sans text-charcoal selection:bg-brand-sage/40 overflow-x-hidden">
      
      {/* Navbar with Glassmorphism */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-bg-card/75 border-b border-brand-green/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo Left */}
          <a href="#hero" className="flex items-center gap-2 group">
            <div className="bg-brand-dark text-white p-1.5 rounded-lg shadow-sm group-hover:bg-brand-green transition-colors">
              <Sprout id="nav-logo" className="w-5 h-5 text-accent-gold" />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-brand-dark dark:text-brand-sage">
              Agri-VoiceLink
            </span>
          </a>

          {/* Nav Links Center - Hidden on Mobile */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-gray">
            <a href="#about" className="hover:text-brand-green transition-colors">About</a>
            <a href="#objectives" className="hover:text-brand-green transition-colors">Objectives</a>
            <a href="#technology" className="hover:text-brand-green transition-colors">Technology</a>
            <a href="#roadmap" className="hover:text-brand-green transition-colors">Roadmap</a>
            <a href="#impact" className="hover:text-brand-green transition-colors">Impact</a>
            <a href="#team" className="hover:text-brand-green transition-colors">Team</a>
          </div>

          {/* Grant Badge & Toggle Right */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] md:text-xs tracking-wider uppercase px-2.5 py-1 bg-brand-green/10 text-brand-dark font-semibold rounded-full border border-brand-green/20 dark:text-brand-sage">
              UGC-ICSETEP Grant
            </span>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg bg-brand-green/10 text-brand-dark hover:bg-brand-green/20 transition-all flex items-center justify-center border border-brand-green/20 dark:text-brand-sage cursor-pointer"
              title="Toggle Dark/Bright Mode"
              aria-label="Toggle Dark/Bright Mode"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-accent-gold" />
              ) : (
                <Moon className="w-4 h-4 text-brand-dark" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative bg-brand-dark text-white pt-16 pb-20 md:py-28 overflow-hidden">
        {/* Canvas Background */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-40 mix-blend-screen"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-3xl text-left">
            
            {/* Monospace Eyebrow */}
            <div className="inline-flex items-center gap-2 text-brand-sage font-mono text-xs md:text-sm uppercase tracking-widest mb-4">
              <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse"></span>
              RDG · Cutting Edge Research
            </div>

            {/* Huge elegant serif headline */}
            <h1 className="font-serif text-4xl md:text-6xl font-medium tracking-tight leading-tight md:leading-tight mb-6">
              Empowering Farmers with <span className="text-accent-gold">Conversational AI</span>
            </h1>

            {/* Short description */}
            <p className="text-base md:text-lg text-brand-sage/90 font-light leading-relaxed max-w-2xl mb-8">
              Developing voice-first, dialect-robust, and multimodal AI systems designed explicitly for Bangladeshi smallholders. Agri-VoiceLink overcomes literacy barriers to deliver real-time agronomic guidance in rural fields.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-14">
              <a
                href="#objectives"
                className="px-6 py-3 bg-harvest-gold hover:bg-accent-gold text-brand-dark font-medium rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group"
              >
                Explore Objectives
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#technology"
                className="px-6 py-3 border border-brand-sage/30 hover:bg-white/10 text-white font-medium rounded-lg transition-all"
              >
                Technical Stack
              </a>
            </div>
          </div>

          {/* Row of 4 Stats - Monospace numbers */}
          <div className="reveal border-t border-white/10 pt-10 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="font-mono text-3xl md:text-5xl font-bold text-accent-gold tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-white/90">
                  {stat.label}
                </div>
                <div className="text-xs text-brand-sage/80 font-light">
                  {stat.desc}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Logos Bar (Funded & Supported By) */}
      <section className="bg-bg-card border-y border-brand-green/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <span className="font-mono text-xs tracking-widest uppercase text-muted-gray">
              Funded & Supported By
            </span>

            {/* Horizontal Flex Logos */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-charcoal">
              
              {/* UGC */}
              <div className="flex items-center gap-2">
                <div className="bg-brand-dark/5 p-1.5 rounded-md dark:bg-white/5">
                  <Award className="w-5 h-5 text-brand-green" />
                </div>
                <div>
                  <div className="font-serif text-sm font-bold leading-tight text-brand-dark dark:text-brand-sage">UGC Bangladesh</div>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-muted-gray">Govt. Commission</div>
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="hidden sm:block h-6 w-[1px] bg-brand-green/15"></div>

              {/* ADB */}
              <div className="flex items-center gap-2">
                <div className="bg-brand-dark/5 p-1.5 rounded-md dark:bg-white/5">
                  <Globe className="w-5 h-5 text-brand-green" />
                </div>
                <div>
                  <div className="font-serif text-sm font-bold leading-tight text-brand-dark dark:text-brand-sage">Asian Dev Bank</div>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-muted-gray">Strategic Support</div>
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="hidden sm:block h-6 w-[1px] bg-brand-green/15"></div>

              {/* MBSTU */}
              <div className="flex items-center gap-2">
                <div className="bg-brand-dark/5 p-1.5 rounded-md dark:bg-white/5">
                  <BookOpen className="w-5 h-5 text-brand-green" />
                </div>
                <div>
                  <div className="font-serif text-sm font-bold leading-tight text-brand-dark dark:text-brand-sage">MBSTU University</div>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-muted-gray">Executing Institution</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* PI / Team Strip */}
      <section className="bg-team-strip py-10 border-b border-brand-green/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-bg-card/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-brand-green/10">
            
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              {/* Image with fallback */}
              <div className="relative">
                {!imageError ? (
                  <img
                    src="nazrul.jpg"
                    alt="Dr. Nazrul Islam"
                    onError={() => setImageError(true)}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-brand-green/30 bg-cream shadow-md"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-brand-dark text-accent-gold flex flex-col items-center justify-center border-2 border-brand-sage/40 shadow-md">
                    <span className="font-serif text-xl md:text-2xl font-bold">Dr. NI</span>
                    <span className="text-[8px] font-mono uppercase tracking-wider opacity-80">MBSTU</span>
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 bg-harvest-gold text-brand-dark rounded-full p-1 border border-white shadow">
                  <Award className="w-4 h-4 text-brand-dark" />
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-brand-dark text-white mb-2">
                  Principal Investigator
                </div>
                <h3 className="font-serif text-xl md:text-2xl font-bold text-brand-dark dark:text-brand-sage">
                  Dr. Nazrul Islam
                </h3>
                <p className="text-sm text-brand-green font-medium mb-1">
                  Professor & Chairman, Dept. of CSE
                </p>
                <p className="text-xs text-muted-gray max-w-xl">
                  Mawlana Bhashani Science and Technology University (MBSTU). Leading advanced natural language and spatial agronomy research in Tangail, Bangladesh.
                </p>
              </div>
            </div>

            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <div className="bg-brand-green/5 border border-brand-green/10 rounded-lg p-4 text-center sm:text-left dark:bg-white/5">
                <div className="text-[10px] font-mono uppercase text-muted-gray tracking-widest mb-1">Affiliated Lab</div>
                <div className="font-serif text-sm font-bold text-brand-dark dark:text-brand-sage">Intellectual NLP Research Lab</div>
                <div className="text-xs text-brand-green">MBSTU CSE Division</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="reveal mb-12 md:mb-16">
            <div className="font-mono text-xs uppercase tracking-widest text-brand-green mb-2">01 // The Agricultural Divide</div>
            <h2 className="font-serif text-3xl md:text-4xl text-brand-dark dark:text-brand-sage font-medium tracking-tight">
              Linguistic Barriers in Agri-Tech
            </h2>
          </div>

          {/* 2-column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
            
            {/* Left Column: Context Text */}
            <div className="reveal space-y-6 text-muted-gray text-base leading-relaxed">
              <p>
                Despite massive advancements in agricultural science and real-time market reporting, smallholder cultivators across Bangladesh remain critically disconnected. Standard digital solutions are fundamentally compromised by a <span className="text-brand-dark dark:text-brand-sage font-semibold">triple barrier</span>: regional dialects, varying literacy rates, and the text-heavy interfaces of modern tools.
              </p>
              <p>
                When crops face fungal leaf rust, soil degradation, or sudden market anomalies, farmers struggle to input technical queries into complex smartphone screens. Standard voice assistants (like Siri or Alexa) fail entirely when faced with the distinct colloquial Bangla dialects of remote farming communities.
              </p>
              <div className="p-5 bg-bg-card border border-brand-green/15 rounded-xl flex gap-4 items-start shadow-sm">
                <Info className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-serif font-bold text-sm text-brand-dark dark:text-brand-sage">The Agri-VoiceLink Vision</div>
                  <p className="text-xs">
                    We are building a robust, speech-centric ecosystem. Cultivators query Agri-VoiceLink as naturally as speaking to a neighboring farmer, receiving immediate validated agronomic treatments on-site.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: 3 Highlight Cards */}
            <div className="reveal space-y-4">
              {highlightCards.map((card, idx) => (
                <div
                  key={idx}
                  className="bg-bg-card p-6 rounded-xl border-l-4 border-brand-sage hover:border-brand-green hover:shadow-md transition-all space-y-2 group"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-brand-green font-bold">
                      {card.tag}
                    </span>
                    <span className="font-mono text-xs text-brand-sage/80 group-hover:text-brand-green transition-colors">
                      [ 0{idx + 1} ]
                    </span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-brand-dark dark:text-brand-sage">
                    {card.title}
                  </h4>
                  <p className="text-xs text-muted-gray leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section id="objectives" className="py-20 md:py-28 bg-bg-card border-y border-brand-green/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="reveal mb-14 md:mb-20 text-center">
            <div className="font-mono text-xs uppercase tracking-widest text-brand-green mb-2">02 // Core Missions</div>
            <h2 className="font-serif text-3xl md:text-4xl text-brand-dark dark:text-brand-sage font-medium tracking-tight">
              Research & Action Objectives
            </h2>
            <p className="text-xs text-muted-gray max-w-lg mx-auto mt-2">
              Structured goals focused on technical advancement, user accessibility, and socioeconomic resilience.
            </p>
          </div>

          {/* 3-column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {objectives.map((obj, idx) => (
              <div
                key={idx}
                className={`reveal border rounded-xl p-8 flex flex-col justify-between hover:shadow-lg transition-all border-brand-green/10 shadow-sm ${obj.color}`}
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-mono text-xs tracking-wider bg-brand-green/5 px-2.5 py-1 rounded text-brand-green font-bold">
                      {obj.id}
                    </span>
                    <span className="font-mono text-xs text-muted-gray">Objective</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-1 text-brand-dark dark:text-brand-sage">
                    {obj.title}
                  </h3>
                  <p className="text-xs font-mono text-brand-green/80 uppercase tracking-wide mb-4">
                    {obj.subtitle}
                  </p>
                  <p className="text-xs text-muted-gray leading-relaxed mb-6">
                    {obj.desc}
                  </p>
                </div>

                {/* Bullets with icons */}
                <ul className="space-y-2 border-t border-brand-green/10 pt-4">
                  {obj.points.map((p, pIdx) => (
                    <li key={pIdx} className="flex items-center gap-2 text-xs text-muted-gray">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-green"></div>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-20 md:py-28 bg-brand-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="reveal mb-14 md:mb-20">
            <div className="font-mono text-xs uppercase tracking-widest text-accent-gold mb-2">03 // Academic Architecture</div>
            <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-white">
              The Technology Stack
            </h2>
            <p className="text-sm text-brand-sage max-w-lg mt-2 font-light">
              Synthesizing acoustic, reasoning, and visual parameters into lightweight, unified neural models.
            </p>
          </div>

          {/* 2x2 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {techDetails.map((tech, idx) => (
              <div
                key={idx}
                className="reveal bg-white/5 border border-white/10 p-8 rounded-xl hover:bg-white/10 hover:border-brand-sage/20 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-white/10 rounded-lg text-accent-gold group-hover:scale-110 transition-transform">
                      {tech.icon}
                    </div>
                    <span className="font-mono text-[10px] tracking-wider text-brand-sage opacity-60">
                      [ TECH-0{idx + 1} ]
                    </span>
                  </div>
                  
                  <h3 className="font-serif text-xl font-bold mb-3 text-white">
                    {tech.title}
                  </h3>
                  <p className="text-xs text-brand-sage/95 leading-relaxed font-light mb-6">
                    {tech.desc}
                  </p>
                </div>

                {/* Monospace Tags */}
                <div className="flex flex-wrap gap-2 border-t border-white/5 pt-4">
                  {tech.tags.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="font-mono text-[10px] bg-brand-green/45 text-accent-gold px-2 py-0.5 rounded border border-brand-sage/10"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Timeline / Roadmap Section */}
      <section id="roadmap" className="py-20 md:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="reveal mb-14 md:mb-20 text-center">
            <div className="font-mono text-xs uppercase tracking-widest text-brand-green mb-2">04 // Development Schedule</div>
            <h2 className="font-serif text-3xl md:text-4xl text-brand-dark font-medium tracking-tight animate-fade-in">
              Project Roadmap
            </h2>
            <p className="text-xs text-muted-gray max-w-lg mx-auto mt-2">
              A comprehensive 2-year workflow spanning corpus building, co-training, beta pilots, and open API scaling.
            </p>
          </div>

          {/* Vertical Timeline */}
          <div className="reveal relative max-w-3xl mx-auto pl-6 sm:pl-10 before:absolute before:top-0 before:left-[11px] sm:before:left-[15px] before:bottom-0 before:w-[2px] before:bg-brand-green/25">
            
            {/* Year 1 Label */}
            <div className="relative mb-12">
              <div className="absolute top-1/2 -translate-y-1/2 left-[-23px] sm:left-[-27px] w-6 h-6 rounded-full bg-brand-dark text-white flex items-center justify-center font-mono text-[9px] font-bold border-2 border-white shadow">
                Y1
              </div>
              <span className="font-mono text-xs text-brand-green font-bold uppercase tracking-widest pl-4">
                Year 1 Foundation & Implementation
              </span>
            </div>

            {/* Quarters loop */}
            {timelineQuarters.map((q, idx) => {
              // Set background depending on status
              const isActive = q.status === "Active Research";
              return (
                <div key={idx} className="relative pl-4 sm:pl-8 pb-10 sm:pb-14 last:pb-0">
                  
                  {/* Circle Dot */}
                  <div className={`absolute top-1.5 left-[-21px] sm:left-[-25px] w-4.5 h-4.5 rounded-full border-2 border-white shadow ${isActive ? "bg-harvest-gold animate-pulse scale-110" : "bg-brand-green"}`}></div>
                  
                  {/* Timeline Card */}
                  <div className={`bg-bg-card p-6 rounded-xl border border-brand-green/10 shadow-sm hover:shadow-md transition-all ${isActive ? "border-harvest-gold/50 ring-2 ring-harvest-gold/10" : ""}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <span className="font-mono text-xs font-bold text-brand-green uppercase tracking-wide">
                        {q.phase}
                      </span>
                      <span className={`inline-flex self-start px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase tracking-wider ${isActive ? "bg-harvest-gold/10 text-brand-dark" : "bg-brand-green/10 text-brand-green"}`}>
                        {q.status}
                      </span>
                    </div>

                    <h4 className="font-serif text-base md:text-lg font-bold text-brand-dark dark:text-brand-sage mb-1">
                      {q.title}
                    </h4>
                    <p className="text-xs text-muted-gray leading-relaxed font-light">
                      {q.desc}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Year 2 Label */}
            <div className="relative mt-8">
              <div className="absolute top-1/2 -translate-y-1/2 left-[-23px] sm:left-[-27px] w-6 h-6 rounded-full bg-brand-dark text-white flex items-center justify-center font-mono text-[9px] font-bold border-2 border-white shadow">
                Y2
              </div>
              <span className="font-mono text-xs text-brand-green font-bold uppercase tracking-widest pl-4">
                Year 2 Optimization, Scaling & Assessment
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* SDG Impact Section */}
      <section id="impact" className="py-20 md:py-28 bg-bg-card border-b border-brand-green/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="reveal mb-14 md:mb-20 text-center">
            <div className="font-mono text-xs uppercase tracking-widest text-brand-green mb-2">05 // Institutional Alignment</div>
            <h2 className="font-serif text-3xl md:text-4xl text-brand-dark dark:text-brand-sage font-medium tracking-tight">
              Socio-Economic SDG Impact
            </h2>
            <p className="text-xs text-muted-gray max-w-lg mx-auto mt-2">
              How Agri-VoiceLink maps directly to United Nations Sustainable Development Goals for regional impact.
            </p>
          </div>

          {/* 4-column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sdgs.map((sdg, idx) => (
              <div
                key={idx}
                className={`reveal p-6 rounded-xl border flex flex-col justify-between shadow-sm hover:shadow-md transition-all ${sdg.color}`}
              >
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest opacity-80 mb-2">
                    {sdg.num}
                  </div>
                  <h3 className="font-serif text-lg font-bold tracking-tight mb-3">
                    {sdg.title}
                  </h3>
                  <p className="text-xs leading-relaxed font-light">
                    {sdg.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-black/5 flex items-center justify-between text-[10px] font-mono font-bold tracking-widest uppercase">
                  <span>UN-SDG Core Target</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-65" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Scientific/Academic Advisory Section */}
      <section id="team" className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="reveal mb-14 md:mb-16">
            <div className="font-mono text-xs uppercase tracking-widest text-brand-green mb-2">06 // Academic Leadership</div>
            <h2 className="font-serif text-3xl md:text-4xl text-brand-dark font-medium tracking-tight">
              Research Affiliates & Team
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Dr. Nazrul Card */}
            <div className="reveal bg-bg-card p-6 rounded-xl border border-brand-green/10 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4 mb-4">
                {!imageError ? (
                  <img
                    src="nazrul.jpg"
                    alt="Dr. Nazrul Islam"
                    onError={() => setImageError(true)}
                    className="w-14 h-14 rounded-full object-cover border border-brand-green/20"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-brand-dark text-accent-gold flex items-center justify-center font-serif text-lg font-bold">
                    NI
                  </div>
                )}
                <div>
                  <h4 className="font-serif font-bold text-base text-brand-dark dark:text-brand-sage leading-tight">Dr. Nazrul Islam</h4>
                  <p className="text-xs text-brand-green">Principal Investigator</p>
                </div>
              </div>
              <p className="text-xs text-muted-gray leading-relaxed mb-4">
                Academic expert leading CSE research in natural language processing and computer vision applications at MBSTU. Ex-academic coordinator of ICSETEP initiative.
              </p>
              <div className="text-[10px] font-mono uppercase tracking-widest text-brand-green font-bold border-t border-brand-green/5 pt-3 flex items-center justify-between">
                <span>MBSTU CSE Division</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Team member 2 */}
            <div className="reveal bg-bg-card p-6 rounded-xl border border-brand-green/10 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-brand-green/20 text-brand-dark flex items-center justify-center font-serif text-lg font-bold">
                  NL
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-brand-dark dark:text-brand-sage leading-tight">Intellectual NLP Lab</h4>
                  <p className="text-xs text-brand-green">Research Coordinators</p>
                </div>
              </div>
              <p className="text-xs text-muted-gray leading-relaxed mb-4">
                Assisting post-graduate researchers, speech engineers, and field annotators capturing audio data, compiling dialect corpus catalogs and fine-tuning models.
              </p>
              <div className="text-[10px] font-mono uppercase tracking-widest text-brand-green font-bold border-t border-brand-green/5 pt-3 flex items-center justify-between">
                <span>MBSTU NLP Group</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Team member 3 */}
            <div className="reveal bg-bg-card p-6 rounded-xl border border-brand-green/10 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-brand-green/20 text-brand-dark flex items-center justify-center font-serif text-lg font-bold">
                  EB
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-brand-dark dark:text-brand-sage leading-tight">External Advisory</h4>
                  <p className="text-xs text-brand-green">Agronomic Evaluators</p>
                </div>
              </div>
              <p className="text-xs text-muted-gray leading-relaxed mb-4">
                Expert extension officers and regional agronomists conducting field validation tests, verifying prompt accuracy and leaf rust diagnostics pipelines.
              </p>
              <div className="text-[10px] font-mono uppercase tracking-widest text-brand-green font-bold border-t border-brand-green/5 pt-3 flex items-center justify-between">
                <span>Agronomy Advisors</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-dark text-white pt-16 pb-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-white/10">
            
            {/* Left Brand info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-white/10 p-1 rounded">
                  <Sprout className="w-4 h-4 text-accent-gold" />
                </div>
                <span className="font-serif text-lg font-bold text-white">Agri-VoiceLink</span>
              </div>
              <p className="text-xs text-brand-sage leading-relaxed max-w-sm font-light">
                An academic initiative developing multilingual, conversational AI and speech interface systems to empower Bangladeshi smallholders and bypass technical digital divide barriers.
              </p>
              <div className="text-[10px] font-mono uppercase tracking-widest text-accent-gold">
                UGC-ICSETEP Grant Awardee
              </div>
            </div>

            {/* Middle Links */}
            <div className="space-y-4">
              <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">Quick Navigation</h4>
              <ul className="grid grid-cols-2 gap-2 text-xs text-brand-sage font-light">
                <li><a href="#about" className="hover:text-white transition-colors">About Project</a></li>
                <li><a href="#objectives" className="hover:text-white transition-colors">Objectives</a></li>
                <li><a href="#technology" className="hover:text-white transition-colors">Technology</a></li>
                <li><a href="#roadmap" className="hover:text-white transition-colors">Project Roadmap</a></li>
                <li><a href="#impact" className="hover:text-white transition-colors">SDG Targets</a></li>
                <li><a href="#team" className="hover:text-white transition-colors">Advisory Team</a></li>
              </ul>
            </div>

            {/* Right Funding details */}
            <div className="space-y-4">
              <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">Strategic Affiliation</h4>
              <p className="text-xs text-brand-sage leading-relaxed font-light">
                Funded by the University Grants Commission of Bangladesh (UGC) under the ICSETEP initiative. Hosted and developed under the Department of Computer Science and Engineering, Mawlana Bhashani Science and Technology University (MBSTU).
              </p>
              <div className="flex gap-2 text-brand-sage hover:text-white text-xs transition-colors items-center font-mono">
                <span>View project brief</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
            <p className="text-[10px] font-mono text-brand-sage/80">
              © 2026 Agri-VoiceLink Research Project. All rights reserved.
            </p>
            <p className="text-[10px] font-mono text-brand-sage/60">
              Principal Investigator: Dr. Nazrul Islam · Mawlana Bhashani Science and Technology University (MBSTU).
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
