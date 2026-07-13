import { useState } from "react";
import { Sprout, ChevronRight, Info, Award, Globe, BookOpen, ArrowUpRight, CheckCircle, Target, Cpu, Calendar, FileText, Activity, Users } from "lucide-react";
import { ProjectData, StatItem, HighlightCardItem } from "../types";
import ppNiImage from "../images/nazrul.jpg";
import bgHeroImage from "../images/bgimg.jpg";

interface HomeProps {
  data: ProjectData;
  onCardClick: (card: any) => void;
  onNavigate: (page: string) => void;
}

export default function Home({ data, onCardClick, onNavigate }: HomeProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="space-y-0">
      
      {/* Hero Section */}
      <section className="relative bg-brand-dark text-white pt-20 pb-24 md:py-32 overflow-hidden">
        {/* Background Image with agricultural vibe & dark overlay for high readability */}
        <div className="absolute inset-0 z-0">
          <img
            src={bgHeroImage}
            alt="Agri-VoiceLink agricultural background"
            className="w-full h-full object-cover opacity-35 object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/90 via-brand-dark/70 to-brand-dark" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-3xl text-left">
            {/* Monospace Eyebrow */}
            <div className="inline-flex items-center gap-2 text-brand-sage font-mono text-xs md:text-sm uppercase tracking-widest mb-4">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
              RDG · Cutting Edge Research
            </div>

            {/* Huge elegant serif headline */}
            <h1 className="font-serif text-4xl md:text-6xl font-medium tracking-tight leading-tight md:leading-tight mb-6">
              Empowering Farmers with <span className="text-brand-green">Conversational AI</span>
            </h1>

            {/* Short description */}
            <p className="text-base md:text-lg text-brand-sage/90 font-light leading-relaxed max-w-2xl mb-8">
              Developing voice-first, dialect-robust, and multimodal AI systems designed explicitly for Bangladeshi smallholders. Agri-VoiceLink overcomes literacy barriers to deliver real-time agronomic guidance in rural fields.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-14">
              <button
                onClick={() => onNavigate("objectives")}
                className="px-6 py-3 bg-brand-green hover:bg-brand-green/90 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group cursor-pointer"
              >
                Explore Objectives
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate("technology")}
                className="px-6 py-3 border border-brand-sage/30 hover:bg-white/10 text-white font-medium rounded-lg transition-all cursor-pointer"
              >
                Technical Stack
              </button>
            </div>
          </div>

          {/* Row of 4 Stats - Monospace numbers */}
          <div className="reveal border-t border-white/10 pt-10 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {data.stats.map((stat, idx) => (
              <div
                key={idx}
                className="space-y-1 hover:bg-white/5 hover:scale-[1.02] p-4 rounded-xl border border-transparent hover:border-white/10 transition-all group/stat relative overflow-hidden"
              >
                <div className="font-mono text-3xl md:text-5xl font-bold text-brand-green tracking-tight group-hover/stat:text-white transition-colors">
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
      <section className="bg-white border-y border-brand-green/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="font-mono text-xs tracking-widest uppercase text-muted-gray">
              Funded & Supported By
            </span>

            {/* Horizontal Flex Logos */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-charcoal">
              {/* UGC */}
              <div className="flex items-center gap-2">
                <div className="bg-brand-dark/5 p-1.5 rounded-md">
                  <Award className="w-5 h-5 text-brand-green" />
                </div>
                <div>
                  <div className="font-serif text-sm font-bold leading-tight">University Grants Commission, Bangladesh</div>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-muted-gray">Govt. Commission</div>
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="hidden sm:block h-6 w-[1px] bg-brand-green/15"></div>

              {/* ADB */}
              <div className="flex items-center gap-2">
                <div className="bg-brand-dark/5 p-1.5 rounded-md">
                  <Globe className="w-5 h-5 text-brand-green" />
                </div>
                <div>
                  <div className="font-serif text-sm font-bold leading-tight">Asian Development Bank</div>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-muted-gray">Strategic Support</div>
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="hidden sm:block h-6 w-[1px] bg-brand-green/15"></div>

              {/* MBSTU */}
              <div className="flex items-center gap-2">
                <div className="bg-brand-dark/5 p-1.5 rounded-md">
                  <BookOpen className="w-5 h-5 text-brand-green" />
                </div>
                <div>
                  <div className="font-serif text-sm font-bold leading-tight">Mawlana Bhashani Science & Technology University</div>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-muted-gray">Executing Institution</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PI / Team Strip */}
      <section className="bg-brand-green/5 py-10 border-b border-brand-green/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Dr. Nazrul Islam Card */}
            <div className="flex flex-col justify-between bg-white p-6 md:p-8 rounded-2xl border border-brand-green/10 shadow-sm transition-all duration-300 hover:shadow-md h-full">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left mb-6">
                <div className="relative shrink-0">
                  {!imageError ? (
                    <img
                      src={ppNiImage}
                      alt="Professor Dr. Nazrul Islam"
                      onError={() => setImageError(true)}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-brand-green/30 bg-cream shadow-md"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-brand-dark text-white flex flex-col items-center justify-center border-2 border-brand-green/30 shadow-md">
                      <span className="font-serif text-xl md:text-2xl font-bold">Prof. NI</span>
                      <span className="text-[8px] font-mono uppercase tracking-wider opacity-80">MBSTU</span>
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 bg-brand-green text-white rounded-full p-1 border border-white shadow">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-brand-dark text-white mb-2">
                    Principal Investigator
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-brand-dark">
                    Professor Dr. Nazrul Islam
                  </h3>
                  <p className="text-sm text-brand-green font-medium mb-1">
                    Associate Professor, Department of ICT
                  </p>
                  <p className="text-xs text-muted-gray leading-relaxed">
                    Mawlana Bhashani Science and Technology University (MBSTU). Leading advanced natural language and spatial agronomy research in MBSTU, Tangail, Bangladesh.
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-start">
                <button
                  onClick={() => onNavigate("team/Professor-Dr.-Nazrul-Islam")}
                  className="bg-brand-dark hover:bg-brand-green hover:scale-[1.02] text-white text-xs uppercase tracking-widest font-extrabold py-3 px-5 rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto shrink-0"
                >
                  <span>View Bio</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Nargis Akter Card */}
            <div className="flex flex-col justify-between bg-white p-6 md:p-8 rounded-2xl border border-brand-green/10 shadow-sm transition-all duration-300 hover:shadow-md h-full">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left mb-6">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#EBF1F5] text-brand-dark flex flex-col items-center justify-center border-2 border-brand-green/30 shadow-md">
                    <span className="font-serif text-xl md:text-2xl font-bold text-brand-dark">NA</span>
                    <span className="text-[8px] font-mono uppercase tracking-wider opacity-85 text-brand-green font-semibold">MBSTU</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-brand-green text-white rounded-full p-1 border border-white shadow">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-brand-green text-white mb-2">
                    Co-Principal Investigator
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-brand-dark">
                    Professor Dr. Mst. Nargis Akter
                  </h3>
                  <p className="text-sm text-brand-green font-medium mb-1">
                    Professor, Department of ICT
                  </p>
                  <p className="text-xs text-muted-gray leading-relaxed">
                    Mawlana Bhashani Science and Technology University (MBSTU). Expert in machine learning, data science, and advanced spatial agricultural model architectures.
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-start">
                <button
                  onClick={() => onNavigate("team/Professor-Dr.-Mst.-Nargis-Akter")}
                  className="bg-brand-dark hover:bg-brand-green hover:scale-[1.02] text-white text-xs uppercase tracking-widest font-extrabold py-3 px-5 rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto shrink-0"
                >
                  <span>View Bio</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Alternating Sequential Page Sections */}
      
      {/* 1. ABOUT OUR PROJECT */}
      <section className="py-20 md:py-24 bg-cream border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-left">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-green bg-brand-green/10 px-3.5 py-1.5 rounded-full">
                01 // Who We Are
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-brand-dark font-extrabold tracking-tight leading-tight">
                About Our Research Group
              </h2>
              <p className="text-sm md:text-base text-muted-gray leading-relaxed font-light">
                The Agricultural Language Processing Research Group (ALPRG) at Mawlana Bhashani Science and Technology University (MBSTU) specializes in developing dialect-robust speech resources, multi-modal systems, and localized AI interfaces to empower rural agrarian communities across Bangladesh.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => onNavigate("about")}
                  className="inline-flex items-center gap-2 bg-brand-dark hover:bg-[#1c2e24] text-white text-xs uppercase tracking-widest font-extrabold py-3.5 px-8 rounded-xl transition-all duration-200 shadow-md cursor-pointer"
                >
                  <span>Learn More About Project</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex gap-4 items-start text-left">
                <div className="w-10 h-10 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-sm text-slate-900">Academic Pioneers</h4>
                  <p className="text-xs text-muted-gray mt-1">Housed within the Department of Information and Communication Technology at MBSTU, Tangail.</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex gap-4 items-start text-left">
                <div className="w-10 h-10 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-sm text-slate-900">Linguistic Empowerment</h4>
                  <p className="text-xs text-muted-gray mt-1">Collecting speech corpora to support region-specific accents and agricultural vocabularies.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PUBLICATIONS */}
      <section className="py-20 md:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4 order-last lg:order-first">
              <div className="bg-cream/50 p-6 rounded-2xl border border-slate-150 text-left space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                  <FileText className="w-5 h-5 text-brand-green" />
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-brand-green">Selected Scientific Paper</span>
                </div>
                <h4 className="font-sans font-bold text-sm text-slate-900 leading-snug">
                  "Dialect-Robust Automatic Speech Recognition for Rural Bangla Agrarian Communities"
                </h4>
                <p className="text-xs text-muted-gray leading-relaxed italic">
                  Published in IEEE Transactions on Audio, Speech, and Language Processing (2025). Introduces model weights trained on over 12,000 hours of spontaneous regional rural audio.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[9px] font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">ASR</span>
                  <span className="text-[9px] font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Bilingual Speech</span>
                  <span className="text-[9px] font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Wav2Vec 2.0</span>
                </div>
              </div>
            </div>

            <div className="space-y-6 text-left">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-green bg-brand-green/10 px-3.5 py-1.5 rounded-full">
                02 // Research Work
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-brand-dark font-extrabold tracking-tight leading-tight">
                Scientific Publications
              </h2>
              <p className="text-sm md:text-base text-muted-gray leading-relaxed font-light">
                Our scientific group regularly contributes peer-reviewed journal articles and conference proceedings spanning deep speech, leaf image segmentation, computer vision networks, and edge inference.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => onNavigate("publications")}
                  className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white text-xs uppercase tracking-widest font-extrabold py-3.5 px-8 rounded-xl transition-all duration-200 shadow-md cursor-pointer"
                >
                  <span>Explore Publications</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OBJECTIVES */}
      <section className="py-20 md:py-24 bg-cream border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-left">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-green bg-brand-green/10 px-3.5 py-1.5 rounded-full">
                03 // Our Mission
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-brand-dark font-extrabold tracking-tight leading-tight">
                Strategic Research Objectives
              </h2>
              <p className="text-sm md:text-base text-muted-gray leading-relaxed font-light">
                We have laid down three foundational, inter-linked pillars to guide our scientific exploration. We address local dialect processing, dual-language acoustic optimization, and offline disease diagnostics.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => onNavigate("objectives")}
                  className="inline-flex items-center gap-2 bg-brand-dark hover:bg-[#1c2e24] text-white text-xs uppercase tracking-widest font-extrabold py-3.5 px-8 rounded-xl transition-all duration-200 shadow-md cursor-pointer"
                >
                  <span>View Our Objectives</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200/70 text-left">
                <div className="w-8 h-8 rounded-lg bg-brand-green/10 text-brand-green flex items-center justify-center font-bold text-xs mb-3">01</div>
                <h4 className="font-sans font-bold text-xs text-slate-900 mb-1">Dialect Collection</h4>
                <p className="text-[10px] text-muted-gray leading-relaxed">Systematic compilation of spontaneous, rural speech corpora across divisions.</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200/70 text-left">
                <div className="w-8 h-8 rounded-lg bg-brand-green/10 text-brand-green flex items-center justify-center font-bold text-xs mb-3">02</div>
                <h4 className="font-sans font-bold text-xs text-slate-900 mb-1">Bilingual Models</h4>
                <p className="text-[10px] text-muted-gray leading-relaxed">Developing acoustic models incorporating varying agricultural vocabularies.</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200/70 text-left">
                <div className="w-8 h-8 rounded-lg bg-brand-green/10 text-brand-green flex items-center justify-center font-bold text-xs mb-3">03</div>
                <h4 className="font-sans font-bold text-xs text-slate-900 mb-1">Edge Diagnostics</h4>
                <p className="text-[10px] text-muted-gray leading-relaxed">Running lightweight convolutional and GNN inferences with zero internet pipeline.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TECHNOLOGY */}
      <section className="py-20 md:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4 order-last lg:order-first">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/60 text-left space-y-1">
                  <Cpu className="w-5 h-5 text-brand-green mb-2" />
                  <h4 className="font-sans font-bold text-xs text-slate-900">ASR Architecture</h4>
                  <p className="text-[10px] text-muted-gray">Wav2Vec 2.0 XLS-R fine-tuned with phonetic dictionary.</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/60 text-left space-y-1">
                  <Sprout className="w-5 h-5 text-brand-green mb-2" />
                  <h4 className="font-sans font-bold text-xs text-slate-900">Crop Pathology</h4>
                  <p className="text-[10px] text-muted-gray">Pruned Mobile-YOLOv8 networks for instant leaf diagnosis.</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/60 text-left space-y-1">
                  <Globe className="w-5 h-5 text-brand-green mb-2" />
                  <h4 className="font-sans font-bold text-xs text-slate-900">Knowledge Graph</h4>
                  <p className="text-[10px] text-muted-gray">Structured multi-vector disease inference schemas.</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/60 text-left space-y-1">
                  <Info className="w-5 h-5 text-brand-green mb-2" />
                  <h4 className="font-sans font-bold text-xs text-slate-900">Edge Hardware</h4>
                  <p className="text-[10px] text-muted-gray">Optimized to run fully offline on low-resource mobile platforms.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 text-left">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-green bg-brand-green/10 px-3.5 py-1.5 rounded-full">
                04 // Our Engine
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-brand-dark font-extrabold tracking-tight leading-tight">
                Our Technology Stack
              </h2>
              <p className="text-sm md:text-base text-muted-gray leading-relaxed font-light">
                Discover the state-of-the-art architectures powering Agri-VoiceLink. We customize neural networks for bilingual speech transcription and deploy offline, local models that run inside remote fields.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => onNavigate("technology")}
                  className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white text-xs uppercase tracking-widest font-extrabold py-3.5 px-8 rounded-xl transition-all duration-200 shadow-md cursor-pointer"
                >
                  <span>Explore Technology</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ROADMAP */}
      <section className="py-20 md:py-24 bg-cream border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-left">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-green bg-brand-green/10 px-3.5 py-1.5 rounded-full">
                05 // Project Plan
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-brand-dark font-extrabold tracking-tight leading-tight">
                Execution Roadmap & Timeline
              </h2>
              <p className="text-sm md:text-base text-muted-gray leading-relaxed font-light">
                We are following a highly detailed, peer-reviewed 2-year timeline. Track our milestones from baseline speech corpus collation to public beta pilots and national NGO integrations.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => onNavigate("roadmap")}
                  className="inline-flex items-center gap-2 bg-brand-dark hover:bg-[#1c2e24] text-white text-xs uppercase tracking-widest font-extrabold py-3.5 px-8 rounded-xl transition-all duration-200 shadow-md cursor-pointer"
                >
                  <span>Track Our Roadmap</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200/60 text-left flex gap-4 items-center">
                <span className="font-mono text-xs font-bold text-brand-green bg-brand-green/10 px-2.5 py-1 rounded">Q1-Q2</span>
                <span className="text-xs font-semibold text-slate-800">Spontaneous corpus annotation & acoustic dictionary mapping.</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200/60 text-left flex gap-4 items-center">
                <span className="font-mono text-xs font-bold text-brand-green bg-brand-green/10 px-2.5 py-1 rounded">Q3-Q4</span>
                <span className="text-xs font-semibold text-slate-800">Bilingual model optimization & mobile leaf pathogenesis.</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200/60 text-left flex gap-4 items-center">
                <span className="font-mono text-xs font-bold text-brand-green bg-brand-green/10 px-2.5 py-1 rounded">Q5-Q6</span>
                <span className="text-xs font-semibold text-slate-800">Agronomic field test validation & union-level pilots.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SDG IMPACT */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4 order-last lg:order-first">
              <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 text-left space-y-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-600" />
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-emerald-600">Socio-Economic Contribution</span>
                </div>
                <p className="text-xs text-muted-gray leading-relaxed">
                  Our core research directly contributes to solving UN Sustainable Development Goals (SDGs) by empowering underrepresented smallholders, maximizing crop yields, and reinforcing digital linguistic inclusion in the Global South.
                </p>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono font-bold text-emerald-700">
                  <span className="bg-white border border-emerald-100 p-2 rounded">SDG 1: No Poverty</span>
                  <span className="bg-white border border-emerald-100 p-2 rounded">SDG 2: Zero Hunger</span>
                  <span className="bg-white border border-emerald-100 p-2 rounded">SDG 9: Industry & Innovation</span>
                  <span className="bg-white border border-emerald-100 p-2 rounded">SDG 15: Life on Land</span>
                </div>
              </div>
            </div>

            <div className="space-y-6 text-left">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full">
                06 // Global Goals
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-brand-dark font-extrabold tracking-tight leading-tight">
                SDG Impact & Social Value
              </h2>
              <p className="text-sm md:text-base text-muted-gray leading-relaxed font-light">
                Discover how Agri-VoiceLink maps local technology to global aspirations. We bridge communication barriers to protect crop health, scale knowledge equity, and secure livelihoods.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => onNavigate("impact")}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-widest font-extrabold py-3.5 px-8 rounded-xl transition-all duration-200 shadow-md cursor-pointer"
                >
                  <span>Review SDG Impact</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
