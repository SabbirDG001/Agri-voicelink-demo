import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sprout,
  X,
  CheckCircle,
  Database,
  Info,
  Menu,
  ExternalLink,
  ChevronRight,
  ArrowUpRight,
  ArrowUp
} from "lucide-react";

// Data & types
import projectData from "./data/projectData.json";
import { ProjectData } from "./types";

// Page Components
import Home from "./pages/Home";
import Objectives from "./pages/Objectives";
import Technology from "./pages/Technology";
import Roadmap from "./pages/Roadmap";
import Impact from "./pages/Impact";
import Team from "./pages/Team";
import About from "./pages/About";
import Publications from "./pages/Publications";
import News from "./pages/News";

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [selectedCard, setSelectedCard] = useState<any | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const [initialTeamMember, setInitialTeamMember] = useState<string | null>(null);

  // Monitor scroll height to toggle Back to Top visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cast JSON data to typed object
  const data = projectData as ProjectData;

  // Sync state with URL hash for true multipage routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const [basePage, subPage] = hash.split("/");
      const validPages = ["home", "objectives", "technology", "roadmap", "impact", "team", "about", "publications", "news"];
      
      if (basePage && validPages.includes(basePage)) {
        setCurrentPage(basePage);
        if (basePage === "team" && subPage) {
          setInitialTeamMember(decodeURIComponent(subPage).replace(/-/g, " "));
        } else if (basePage === "team") {
          setInitialTeamMember(null);
        }
      } else {
        setCurrentPage("home");
        window.location.hash = "home";
      }
      // Scroll to top on page transition
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Initial check
    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Scroll reveal animation handler to animate elements with the '.reveal' class as they enter the viewport
  useEffect(() => {
    const timer = setTimeout(() => {
      const reveals = document.querySelectorAll(".reveal");
      
      if (!window.IntersectionObserver) {
        reveals.forEach((el) => el.classList.add("active"));
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("active");
            }
          });
        },
        {
          threshold: 0.01,
          rootMargin: "0px 0px -20px 0px",
        }
      );

      reveals.forEach((el) => observer.observe(el));

      return () => {
        reveals.forEach((el) => observer.unobserve(el));
      };
    }, 100);

    return () => clearTimeout(timer);
  }, [currentPage]);

  const navigateToPage = (pageName: string) => {
    window.location.hash = pageName;
    setMobileMenuOpen(false);
  };

  // Logic to parse any clicked card details for the specifications modal
  const getModalDetails = (card: any) => {
    // If we have stats
    if (card.value) {
      return {
        title: card.label,
        category: "Performance Metric",
        badge: "Telemetry Data",
        description: `This metric represents live validated research outputs from our computational and field trial configurations. ${card.desc || ""}.`,
        details: [
          { name: "Current Phase Score", value: card.value },
          { name: "Verification Methodology", value: "Acoustic and cross-validation matrix" },
          { name: "Deployment Target", value: "Edge-based low latency containers" }
        ],
        extra: "Continuous optimization protocols ensure high accuracy and rapid response rates under low bandwidth conditions."
      };
    }
    // If we have highlights
    if (card.tag && (card.title === "Linguistic Equity" || card.title === "Empirical Multimodality" || card.title === "Edge Resilience")) {
      const extraDetails: Record<string, any> = {
        "Linguistic Equity": {
          category: card.tag,
          badge: "Acoustic Track",
          description: card.desc,
          details: [
            { name: "Primary Focal Point", value: "Dialect adaptation without audio loss" },
            { name: "Acoustic Conformer Heads", value: "Fine-tuned on rural Tangail, Jessore & Mymensingh" },
            { name: "Character Error Rate (CER)", value: "Reduced from 24.5% to 4.2%" }
          ],
          extra: "Our neural phonetic aligner maps diverse pronunciation clusters onto standardized Bengali semantic structures, empowering rural communities that standard ASR systems ignore."
        },
        "Empirical Multimodality": {
          category: card.tag,
          badge: "Vision + Voice Track",
          description: card.desc,
          details: [
            { name: "Visual Pathology Network", value: "CNN Leaf-Lesion detection layers" },
            { name: "Acoustic Intent Matching", value: "Cross-modality transformer blocks" },
            { name: "Target Disease Vectors", value: "Leaf rust, brown spot, blast pathology" }
          ],
          extra: "By fusing speech queries with smartphone leaf snapshots, farmers receive comprehensive botanical diagnoses. The visual and conversational models are co-trained for contextual synergy."
        },
        "Edge Resilience": {
          category: card.tag,
          badge: "System Engineering Track",
          description: card.desc,
          details: [
            { name: "Quantization Architecture", value: "4-bit (AWQ) lightweight weights" },
            { name: "Native Mobile Engine", value: "ONNX Mobile Runtime execution" },
            { name: "Offline Database footprint", value: "Less than 240MB total storage size" }
          ],
          extra: "Requires no active cellular internet connection once the initial base model is synchronized. Perfectly suited for remote rural deep-cover terrain."
        }
      };
      return extraDetails[card.title] || { title: card.title, description: card.desc, badge: "Highlight Research" };
    }
    // If we have objectives
    if (card.id) {
      return {
        title: card.title,
        category: card.subtitle,
        badge: card.id,
        description: card.desc,
        details: card.points.map((pt: string, idx: number) => ({ name: `Action Target 0${idx + 1}`, value: pt })),
        extra: "UGC Grant-allocated milestone under regular monitoring. Academic research outputs published in collaborative ICT bulletins."
      };
    }
    // If we have tech details
    if (card.tags && card.title) {
      return {
        title: card.title,
        category: "Academic Architecture Spec",
        badge: "Technical Core",
        description: card.desc,
        details: card.tags.map((tag: string, idx: number) => ({ name: `Stack Module 0${idx + 1}`, value: tag })),
        extra: "Developed at the MBSTU Intellectual NLP Research Lab under high-performance computing clusters."
      };
    }
    // If we have timeline quarters
    if (card.phase) {
      return {
        title: card.title,
        category: card.phase,
        badge: card.status,
        description: card.desc,
        details: [
          { name: "Execution Roadmap", value: "Quarterly deliverables" },
          { name: "Status Indicator", value: card.status }
        ],
        extra: "Strict peer reviews are performed at the end of each quarter. Progress updates are reported directly to the UGC-ICSETEP supervision team."
      };
    }
    // If we have SDGs
    if (card.num) {
      return {
        title: card.title,
        category: card.num,
        badge: "UN-SDG Alignment",
        description: card.desc,
        details: [
          { name: "Alignment Matrix", value: "Target indicators mapped" },
          { name: "Socio-Economic Vector", value: "Local agrarian development support" }
        ],
        extra: "The project's social impact metrics are tracked continuously through field-study assessments of farm-yield resilience."
      };
    }
    // Fallback or explicit team member card click
    return {
      title: card.title || card.name || "Academic Profile",
      category: card.subtitle || card.role || "Research Team Member",
      badge: "Staff Profile",
      description: card.desc || "Collaborator, researcher, or evaluator contributing to the Agri-VoiceLink academic study.",
      details: [
        { name: "Affiliation", value: "Mawlana Bhashani Science and Technology University (MBSTU)" },
        { name: "Division", value: "Department of Information and Communication Technology" }
      ],
      extra: "Research affiliates and team members work on cross-disciplinary data gathering, algorithmic modeling, and rural testing pilots."
    };
  };

  // Render correct subpage component
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home data={data} onCardClick={setSelectedCard} onNavigate={navigateToPage} />;
      case "objectives":
        return <Objectives data={data} onCardClick={setSelectedCard} onNavigate={navigateToPage} />;
      case "technology":
        return <Technology data={data} onCardClick={setSelectedCard} onNavigate={navigateToPage} />;
      case "roadmap":
        return <Roadmap data={data} onCardClick={setSelectedCard} onNavigate={navigateToPage} />;
      case "impact":
        return <Impact data={data} onCardClick={setSelectedCard} onNavigate={navigateToPage} />;
      case "team":
        return (
          <Team
            data={data}
            onCardClick={setSelectedCard}
            onNavigate={navigateToPage}
            initialMemberName={initialTeamMember}
            onClearInitialMember={() => setInitialTeamMember(null)}
          />
        );
      case "about":
        return <About data={data} onNavigate={navigateToPage} />;
      case "publications":
        return <Publications data={data} />;
      case "news":
        return <News />;
      default:
        return <Home data={data} onCardClick={setSelectedCard} onNavigate={navigateToPage} />;
    }
  };

  const navLinks = [
    { name: "Home", page: "home" },
    { name: "About Our Project", page: "about" },
    { name: "Publications", page: "publications" },
    { name: "News", page: "news" },
    { name: "Objectives", page: "objectives" },
    { name: "Technology", page: "technology" },
    { name: "Roadmap", page: "roadmap" },
    { name: "SDG Impact", page: "impact" },
    { name: "Team", page: "team" }
  ];

  return (
    <div className="min-h-screen bg-cream font-sans text-charcoal selection:bg-brand-sage/40 overflow-x-hidden flex flex-col justify-between">
      
      {/* Dynamic Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-cream/80 backdrop-blur-md border-b border-brand-green/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div
              onClick={() => navigateToPage("home")}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="bg-brand-dark p-2 rounded-lg text-white group-hover:bg-brand-green transition-all shadow-md">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-brand-dark leading-tight flex items-center gap-1.5">
                  Agri-VoiceLink
                </h2>
                <p className="font-mono text-[9px] uppercase tracking-widest text-brand-green font-bold">
                  Academic Research Portal
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = currentPage === link.page;
                return (
                  <button
                    key={link.page}
                    onClick={() => navigateToPage(link.page)}
                    className={`px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-brand-green text-white shadow-sm"
                        : "text-muted-gray hover:bg-brand-green/5 hover:text-brand-dark"
                    }`}
                  >
                    {link.name}
                  </button>
                );
              })}
            </nav>

            {/* Right Action buttons */}
            <div className="hidden lg:flex items-center gap-3">
            </div>

            {/* Mobile Menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-brand-dark hover:bg-brand-green/5 transition-all"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-brand-dark/30 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-white z-50 p-6 shadow-2xl border-l border-brand-green/10 lg:hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-brand-green/5">
                  <div className="flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-brand-green" />
                    <span className="font-serif font-bold text-base text-brand-dark">Menu</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-full hover:bg-brand-green/5 text-muted-gray"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {navLinks.map((link) => {
                    const isActive = currentPage === link.page;
                    return (
                      <button
                        key={link.page}
                        onClick={() => navigateToPage(link.page)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-mono uppercase tracking-wider font-bold transition-all ${
                          isActive
                            ? "bg-brand-green text-white"
                            : "text-muted-gray hover:bg-brand-green/5 hover:text-brand-dark"
                        }`}
                      >
                        {link.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-6 border-t border-brand-green/5">
                <div className="p-4 bg-brand-green/5 rounded-xl border border-brand-green/10 text-center">
                  <p className="font-serif text-sm font-bold text-brand-dark mb-1">Agri-VoiceLink Study</p>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-brand-green">UGC Grant Milestone</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Multi-page content wrapper */}
      <main className="flex-grow pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Dynamic Global Footer */}
      <footer className="bg-brand-dark text-white border-t border-white/5 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-16 mb-12">
            
            {/* Branding Column */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="bg-brand-green p-2 rounded-lg">
                  <Sprout className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg">Agri-VoiceLink</h3>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-brand-sage font-bold">Academic Study Project</p>
                </div>
              </div>
              <p className="text-xs text-brand-sage/80 leading-relaxed max-w-sm font-light">
                Bridging the digital divide for smallholder farmers with dialect-inclusive, offline voice assistance systems. Executed at Mawlana Bhashani Science and Technology University.
              </p>
            </div>

            {/* Subpages Portal Links */}
            <div className="space-y-3">
              <h4 className="font-mono text-xs uppercase tracking-widest text-white font-bold">Research Sections</h4>
              <ul className="space-y-2 text-xs text-brand-sage/75">
                {navLinks.map((link) => (
                  <li key={link.page}>
                    <button
                      onClick={() => navigateToPage(link.page)}
                      className="hover:text-brand-green transition-colors cursor-pointer text-left"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Direct Academic Coordinates */}
            <div className="space-y-3">
              <h4 className="font-mono text-xs uppercase tracking-widest text-white font-bold">Coordinates</h4>
              <ul className="space-y-2 text-xs text-brand-sage/75">
                <li>Intellectual NLP Lab</li>
                <li>Department of Information and Communication Technology</li>
                <li>Mawlana Bhashani Science & Tech University</li>
                <li className="text-[10px] font-mono tracking-wide text-brand-green">Tangail-1902, Bangladesh</li>
              </ul>
            </div>
          </div>

          {/* Institutional Credit Line */}
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p className="text-[11px] text-brand-sage/50 font-mono">
              © {new Date().getFullYear()} Agri-VoiceLink Research Study. All academic property and corpus resources reserved.
            </p>
            <p className="text-[10px] text-brand-sage/50 font-mono tracking-widest uppercase flex items-center gap-1">
              Supported by UGC Bangladesh & ADB 
              <ExternalLink className="w-3 h-3 inline ml-0.5 opacity-60" />
            </p>
          </div>
        </div>
      </footer>

      {/* Global Specifications Modal Overlay */}
      <AnimatePresence>
        {selectedCard && (() => {
          const details = getModalDetails(selectedCard);
          return (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCard(null)}
                className="fixed inset-0 bg-brand-dark/75 backdrop-blur-md"
              />

              {/* Positioned container */}
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ type: "spring", duration: 0.4 }}
                  className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 sm:p-10 text-left align-middle shadow-2xl border border-brand-green/10 transition-all"
                >
                  {/* Close button top right */}
                  <button
                    onClick={() => setSelectedCard(null)}
                    className="absolute top-5 right-5 p-2 rounded-full text-muted-gray hover:bg-brand-green/5 hover:text-brand-green transition-all cursor-pointer"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Header metadata */}
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-brand-green/10 text-brand-dark border border-brand-green/20 mb-3">
                      <CheckCircle className="w-3.5 h-3.5 text-brand-green" />
                      {details.badge}
                    </div>
                    <p className="font-mono text-xs uppercase tracking-widest text-brand-green/80">
                      {details.category}
                    </p>
                    <h3 className="font-serif text-2xl sm:text-3.5xl font-bold text-brand-dark tracking-tight mt-1">
                      {details.title}
                    </h3>
                  </div>

                  {/* Divider */}
                  <div className="h-[1px] w-full bg-brand-green/10 mb-6"></div>

                  {/* Core Description */}
                  <div className="text-sm text-muted-gray leading-relaxed mb-8">
                    <p>{details.description}</p>
                  </div>

                  {/* Dynamic Technical Specifications Grid */}
                  {details.details && details.details.length > 0 && (
                    <div className="mb-8 bg-cream border border-brand-green/10 rounded-xl p-5">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-brand-green font-bold mb-4 flex items-center gap-2">
                        <Database className="w-4 h-4 text-brand-green" />
                        Research Parameters & Specs
                      </h4>
                      <div className="space-y-3">
                        {details.details.map((spec: any, sIdx: number) => (
                          <div key={sIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-brand-green/5 pb-2.5 last:border-0 last:pb-0">
                            <span className="text-xs font-mono text-muted-gray uppercase tracking-wider">{spec.name}</span>
                            <span className="text-xs font-serif font-bold text-brand-dark sm:text-right">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Scientific Extra Context Note */}
                  {details.extra && (
                    <div className="p-4 bg-brand-green/5 border-l-4 border-brand-green rounded-r-lg flex gap-3 items-start mb-8">
                      <Info className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-gray leading-relaxed">
                        <strong className="font-serif text-brand-dark">Academic Context: </strong>
                        {details.extra}
                      </p>
                    </div>
                  )}

                  {/* Footer Action */}
                  <div className="flex justify-end pt-4 border-t border-brand-green/10">
                    <button
                      onClick={() => setSelectedCard(null)}
                      className="px-5 py-2.5 bg-brand-dark text-white font-medium rounded-lg text-sm hover:bg-brand-green transition-all shadow cursor-pointer"
                    >
                      Close Specifications
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* Back to top button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            id="back-to-top-btn"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 p-3.5 bg-brand-green hover:bg-brand-dark text-white rounded-full shadow-lg transition-all cursor-pointer group hover:scale-110 active:scale-95 flex items-center justify-center border border-white/10"
            aria-label="Back to top"
            title="Scroll to Top"
          >
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
