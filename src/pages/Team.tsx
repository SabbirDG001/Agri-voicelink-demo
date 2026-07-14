import { useState, FormEvent, useEffect } from "react";
import { ExternalLink, Award, Users, BookOpen, Facebook, Twitter, Linkedin, Globe, ArrowLeft, Mail, Phone, MapPin, Send, Check, Sparkles, MessageSquare, ArrowUpRight, Search, Github, Fingerprint } from "lucide-react";
import { ProjectData, TeamMemberItem } from "../types";
import ppNiImage from "../images/nazrul.jpg";

interface TeamProps {
  data: ProjectData;
  onCardClick: (card: any) => void;
  onNavigate: (page: string) => void;
  initialMemberName?: string | null;
  onClearInitialMember?: () => void;
}

// Custom detail registries for dynamic profile views
import memberDetailsMapData from "../data/memberDetails.json";
import drNazrulProfile from "../data/drNazrulProfile.json";
import nargisAkterProfile from "../data/nargisAkterProfile.json";

const memberDetailsMap = memberDetailsMapData as Record<string, {
  longBio: string;
  stats: { label: string; value: string }[];
  responsibilities: string[];
  publications: { title: string; venue: string; year: string; type: string }[];
  academicBackground: string[];
}>;

function getAvatarUrl(avatarPath: string | undefined): string | undefined {
  if (!avatarPath) return undefined;
  
  // If it's already an imported module or full URL, return it
  if (avatarPath.startsWith("data:") || avatarPath.startsWith("http:") || avatarPath.startsWith("https:")) {
    return avatarPath;
  }
  
  // Extract filename from path (e.g. "./images/PP_NI.jpg" -> "PP_NI.jpg")
  const filename = avatarPath.split("/").pop() || avatarPath;
  
  // Try to find it in the eager-loaded glob
  try {
    const images = import.meta.glob("../images/*", { eager: true });
    for (const key of Object.keys(images)) {
      if (key.endsWith("/" + filename)) {
        return (images[key] as any)?.default || images[key];
      }
    }
  } catch (e) {
    console.error("Error matching dynamic image in glob", e);
  }
  
  // Fallback to standard imported ppNiImage for Nazrul
  if (filename.toLowerCase().includes("nazrul") || filename.toLowerCase().includes("pp_ni")) {
    return ppNiImage;
  }
  
  return avatarPath;
}

// Self-contained component to handle individual image loading state & fallback
function TeamAvatar({ member, size = "w-48 h-48" }: { member: TeamMemberItem; size?: string }) {
  const [error, setError] = useState(false);

  const avatarSrc = getAvatarUrl(member.avatar);

  if (avatarSrc && !error) {
    return (
      <div className={`relative ${size} rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100 shrink-0`}>
        <img
          src={avatarSrc}
          alt={member.title}
          onError={() => setError(true)}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <div className={`relative ${size} rounded-full overflow-hidden border-4 border-white shadow-lg bg-[#EBF1F5] shrink-0`}>
      <svg className="w-full h-full text-slate-300" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        {/* Sun/Moon */}
        <circle cx="35" cy="40" r="8" fill="#FFFFFF"/>
        {/* Mountain 1 (Back, darker) */}
        <path d="M-20 100 C 15 40, 45 70, 80 100 Z" fill="#D3DBE2" opacity="0.75"/>
        {/* Mountain 2 (Front, lighter) */}
        <path d="M10 100 C 50 30, 75 60, 120 100 Z" fill="#DEE5EA"/>
        {/* Mountain 3 (Right overlap) */}
        <path d="M45 100 C 70 50, 90 70, 130 100 Z" fill="#CBD5E1" opacity="0.6"/>
      </svg>
    </div>
  );
}

export default function Team({ data, onCardClick, onNavigate, initialMemberName, onClearInitialMember }: TeamProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMemberItem | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState<string>("about");
  const [profileSearchQuery, setProfileSearchQuery] = useState<string>("");
  
  const [queryName, setQueryName] = useState<string>("");
  const [queryEmail, setQueryEmail] = useState<string>("");
  const [queryMessage, setQueryMessage] = useState<string>("");
  const [querySubmitted, setQuerySubmitted] = useState<boolean>(false);

  // Publication filtering states
  const [pubTypeFilter, setPubTypeFilter] = useState<string>("all"); // "all" | "conference" | "journal"
  const [pubStartMonth, setPubStartMonth] = useState<string>("");
  const [pubStartYear, setPubStartYear] = useState<string>("");
  const [pubEndMonth, setPubEndMonth] = useState<string>("");
  const [pubEndYear, setPubEndYear] = useState<string>("");

  const resetPubFilters = () => {
    setProfileSearchQuery("");
    setPubTypeFilter("all");
    setPubStartMonth("");
    setPubStartYear("");
    setPubEndMonth("");
    setPubEndYear("");
  };

  // Sync state when initialMemberName prop updates (e.g. on direct navigation)
  useEffect(() => {
    if (initialMemberName) {
      const found = data.teamMembers.find(
        (m) => m.title.toLowerCase() === initialMemberName.toLowerCase()
      );
      if (found) {
        setSelectedMember(found);
        setActiveProfileTab("about");
        setQueryName("");
        setQueryEmail("");
        setQueryMessage("");
        setQuerySubmitted(false);
        resetPubFilters();
        return;
      }
    }
    setSelectedMember(null);
  }, [initialMemberName, data.teamMembers]);

  const handleSelectMember = (member: TeamMemberItem) => {
    setSelectedMember(member);
    setActiveProfileTab("about");
    resetPubFilters();
    setQueryName("");
    setQueryEmail("");
    setQueryMessage("");
    setQuerySubmitted(false);
    const slug = encodeURIComponent(member.title.replace(/\s+/g, "-"));
    onNavigate(`team/${slug}`);
  };

  const handleBackToDirectory = () => {
    setSelectedMember(null);
    setQueryName("");
    setQueryEmail("");
    setQueryMessage("");
    setQuerySubmitted(false);
    resetPubFilters();
    if (onClearInitialMember) {
      onClearInitialMember();
    }
    onNavigate("team");
  };

  // If a member profile is selected, render their beautiful, dynamic detailed page
  if (selectedMember) {
    const isCustomProfile = selectedMember.title === "Professor Dr. Nazrul Islam" || selectedMember.title === "Professor Dr. Mst. Nargis Akter";
    if (isCustomProfile) {
      const activeProfile = selectedMember.title === "Professor Dr. Nazrul Islam" ? drNazrulProfile : nargisAkterProfile;
      const filteredDrPubs = activeProfile.publications.filter(pub => {
        // 1. Search filter
        const matchesSearch = !profileSearchQuery ||
          pub.title.toLowerCase().includes(profileSearchQuery.toLowerCase()) ||
          (pub.authors && pub.authors.toLowerCase().includes(profileSearchQuery.toLowerCase())) ||
          (pub.venue && pub.venue.toLowerCase().includes(profileSearchQuery.toLowerCase()));

        // 2. Type filter
        const typeLower = pub.type ? pub.type.toLowerCase() : "";
        const isConference = (
          typeLower.includes("conference") || 
          typeLower.includes("proceeding") || 
          typeLower.includes("submission") || 
          typeLower.includes("paper") ||
          typeLower === "proceedings-article"
        ) && !typeLower.includes("journal");

        const isJournal = (
          typeLower.includes("journal") || 
          typeLower.includes("article") ||
          typeLower === "journal-article"
        ) && !typeLower.includes("conference") && !typeLower.includes("proceeding");
        
        let matchesType = true;
        if (pubTypeFilter === "conference") {
          matchesType = isConference;
        } else if (pubTypeFilter === "journal") {
          matchesType = isJournal;
        }

        // 3. Date range filter
        const pubYear = pub.date ? parseInt(pub.date.substring(0, 4), 10) : 0;
        const pubMonth = pub.date ? parseInt(pub.date.substring(5, 7), 10) : 1;
        const pubScore = pubYear * 12 + pubMonth;

        const startScore = pubStartYear 
          ? (parseInt(pubStartYear, 10) * 12 + (pubStartMonth ? parseInt(pubStartMonth, 10) : 1))
          : 0;
        const endScore = pubEndYear
          ? (parseInt(pubEndYear, 10) * 12 + (pubEndMonth ? parseInt(pubEndMonth, 10) : 12))
          : 999999;

        const matchesDateRange = pubScore >= startScore && pubScore <= endScore;

        return matchesSearch && matchesType && matchesDateRange;
      });

      return (
        <div className="py-12 md:py-20 bg-cream text-charcoal min-h-screen">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Breadcrumbs and back button */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <button
                onClick={handleBackToDirectory}
                className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-slate-500 hover:text-brand-green transition-colors cursor-pointer group self-start"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>← Back to Team Directory</span>
              </button>
              <span className="text-xs font-mono text-slate-400">University Faculty // {activeProfile.name}</span>
            </div>

            {/* Main Profile Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: Profile info card */}
              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-green via-brand-sage to-harvest-gold"></div>
                
                {/* Avatar with status indicator */}
                <div className="relative mt-4">
                  <TeamAvatar member={selectedMember} size="w-44 h-44" />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-brand-green text-white font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full font-extrabold shadow-md whitespace-nowrap z-10 border border-white">
                    {selectedMember.tag || "Principal Investigator"}
                  </div>
                </div>

                {/* Profile Details */}
                <div className="mt-6 space-y-2 w-full">
                  <h1 className="font-serif text-2xl font-extrabold text-brand-dark tracking-tight">
                    {activeProfile.name}
                  </h1>
                  <p className="text-xs font-mono font-bold text-brand-green uppercase tracking-wider">
                    {activeProfile.designation}
                  </p>
                  <p className="text-xs text-slate-500 font-sans font-medium">
                    Department of {activeProfile.department}
                  </p>
                  <p className="text-xs text-slate-400 font-sans">
                    Mawlana Bhashani Science & Technology University
                  </p>
                </div>

                {/* Contact Card */}
                <div className="w-full mt-6 pt-6 border-t border-slate-100 space-y-3.5 text-left text-xs text-slate-600">
                  <a href={`mailto:${activeProfile.email}`} className="flex items-center gap-3 hover:text-brand-green transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-brand-green group-hover:bg-brand-green/10 transition-colors">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-mono text-[9px] uppercase text-slate-400 font-bold">Email Address</div>
                      <span className="font-sans font-semibold select-all text-slate-700">{activeProfile.email}</span>
                    </div>
                  </a>

                  <a href={`tel:${activeProfile.phone}`} className="flex items-center gap-3 hover:text-brand-green transition-colors group flex-nowrap">
                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-brand-green group-hover:bg-brand-green/10 transition-colors shrink-0">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-mono text-[9px] uppercase text-slate-400 font-bold">Phone Connection</div>
                      <span className="font-sans font-semibold select-all text-slate-700">{activeProfile.phone}</span>
                    </div>
                  </a>

                  <div className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-brand-green shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-mono text-[9px] uppercase text-slate-400 font-bold">Office Location</div>
                      <span className="font-sans font-semibold text-slate-700">{activeProfile.location}</span>
                    </div>
                  </div>
                </div>

                {/* Academic Networks Links */}
                <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-slate-100 w-full">
                  <a href={activeProfile.scholar || (activeProfile.name.includes("Nazrul") ? "https://scholar.google.com/citations?user=L-2Y7aUAAAAJ" : `https://scholar.google.com/scholar?q=${encodeURIComponent(activeProfile.name)}`)} target="_blank" rel="noopener noreferrer" title="Google Scholar Profile" className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 hover:bg-[#DB4437] hover:text-white hover:scale-105 transition-all flex items-center justify-center text-slate-500 shadow-sm cursor-pointer">
                    <Globe className="w-4 h-4" />
                  </a>
                  <a href={activeProfile.linkedin || "https://www.linkedin.com"} target="_blank" rel="noopener noreferrer" title="LinkedIn Profile" className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 hover:bg-[#0077B5] hover:text-white hover:scale-105 transition-all flex items-center justify-center text-slate-500 shadow-sm cursor-pointer">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href={activeProfile.orcid || `https://orcid.org/orcid-search/search?searchQuery=${encodeURIComponent(activeProfile.name)}`} target="_blank" rel="noopener noreferrer" title="ORCID Profile" className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 hover:bg-[#A6CE39] hover:text-white hover:scale-105 transition-all flex items-center justify-center text-slate-500 shadow-sm cursor-pointer">
                    <Fingerprint className="w-4 h-4" />
                  </a>
                  <a href={activeProfile.github || `https://github.com/search?q=${encodeURIComponent(activeProfile.name)}&type=users`} target="_blank" rel="noopener noreferrer" title="GitHub Profile" className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 hover:bg-[#24292e] hover:text-white hover:scale-105 transition-all flex items-center justify-center text-slate-500 shadow-sm cursor-pointer">
                    <Github className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* RIGHT COLUMN: Interactive Tabs */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Custom Tab Navigation */}
                <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm flex flex-wrap gap-1">
                  {[
                    { id: "about", label: "About Me" },
                    { id: "education", label: "Education" },
                    { id: "publications", label: "Publications (" + activeProfile.publications.length + ")" },
                    { id: "projects", label: "Projects (" + activeProfile.projects.length + ")" },
                    { id: "teaching", label: "Teaching" },
                    { id: "contact", label: "Contact" }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveProfileTab(tab.id);
                        setProfileSearchQuery("");
                      }}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex-grow md:flex-grow-0 ${
                        activeProfileTab === tab.id
                          ? "bg-brand-green text-white shadow-sm"
                          : "bg-transparent text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Dynamic Tab Content rendering */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm text-left min-h-[400px]">
                  
                  {activeProfileTab === "about" && (
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <h2 className="font-serif text-xl font-bold text-brand-dark pb-3 border-b border-slate-100">Academic & Research Bio</h2>
                        <p className="text-sm text-slate-600 leading-relaxed font-sans font-medium whitespace-pre-line">
                          {activeProfile.longBio}
                        </p>
                      </div>

                      {/* Research Interests (dynamic linking) */}
                      <div className="space-y-4">
                        <h3 className="font-serif text-lg font-bold text-brand-dark pb-3 border-b border-slate-100 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-brand-green" />
                          Primary Research Interests
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Click any research interest card below to dynamically redirect to {activeProfile.name}'s relevant research publications and papers on Google Scholar:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {activeProfile.researchInterests.map((interest, idx) => {
                            const scholarQuery = `https://scholar.google.com/scholar?q=${encodeURIComponent(activeProfile.name)}+MBSTU+${encodeURIComponent(interest)}`;
                            return (
                              <a
                                key={idx}
                                href={scholarQuery}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-green hover:bg-brand-green/5 transition-all flex flex-col justify-between group cursor-pointer"
                                title={`Explore research on Google Scholar for: ${interest}`}
                              >
                                <span className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider">Research Area</span>
                                <div className="flex items-center justify-between gap-2 mt-2">
                                  <span className="font-serif text-sm font-extrabold text-slate-800 group-hover:text-brand-green transition-colors">{interest}</span>
                                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-brand-green group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeProfileTab === "education" && (
                    <div className="space-y-6">
                      <div className="pb-3 border-b border-slate-100 text-left">
                        <h2 className="font-serif text-xl font-bold text-brand-dark flex items-center gap-2">
                          <Award className="w-5 h-5 text-brand-green" />
                          Academic Credentials
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">Detailed academic and educational background of {activeProfile.name}.</p>
                      </div>

                      <div className="relative border-l border-slate-200 pl-6 ml-2 space-y-6">
                        {activeProfile.education.map((edu, idx) => (
                          <div key={idx} className="relative">
                            <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-brand-green border-4 border-white shadow-sm"></div>
                            {edu.year && (
                              <span className="font-mono text-[10px] text-brand-green font-bold bg-brand-green/10 px-2 py-0.5 rounded">
                                {edu.year}
                              </span>
                            )}
                            <h4 className="font-sans font-bold text-sm text-slate-900 mt-1 leading-snug">
                              {edu.degree}
                            </h4>
                            <p className="text-xs text-slate-700 font-medium mt-0.5">{edu.institute}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5 font-sans leading-relaxed">{edu.address}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeProfileTab === "publications" && (
                    <div className="space-y-6">
                      <div className="pb-3 border-b border-slate-100 text-left">
                        <h2 className="font-serif text-xl font-bold text-brand-dark">Complete Publication List</h2>
                        <p className="text-xs text-slate-500 mt-1">Filter {activeProfile.name}'s research publications and conference proceedings by type, date, or title keywords.</p>
                      </div>

                      {/* Interactive Filter Panel */}
                      <div className="bg-slate-50/60 border border-slate-150 rounded-2xl p-4 space-y-3.5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Search Bar */}
                          <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                            <input
                              type="text"
                              placeholder="Search publications by title, authors, venue..."
                              value={profileSearchQuery}
                              onChange={(e) => setProfileSearchQuery(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
                            />
                          </div>

                          {/* Type Filters Button style */}
                          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-1.5 flex-wrap sm:flex-nowrap">
                            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider shrink-0">Type:</span>
                            <div className="flex bg-slate-100 p-0.5 rounded-lg w-full sm:w-auto">
                              <button
                                type="button"
                                onClick={() => setPubTypeFilter("all")}
                                className={`flex-1 sm:flex-initial px-4 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                                  pubTypeFilter === "all"
                                    ? "bg-brand-green text-white shadow-sm"
                                    : "text-slate-600 hover:text-slate-950 hover:bg-white/40"
                                }`}
                              >
                                All
                              </button>
                              <button
                                type="button"
                                onClick={() => setPubTypeFilter("conference")}
                                className={`flex-1 sm:flex-initial px-4 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                                  pubTypeFilter === "conference"
                                    ? "bg-brand-green text-white shadow-sm"
                                    : "text-slate-600 hover:text-slate-950 hover:bg-white/40"
                                }`}
                              >
                                Conference
                              </button>
                              <button
                                type="button"
                                onClick={() => setPubTypeFilter("journal")}
                                className={`flex-1 sm:flex-initial px-4 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                                  pubTypeFilter === "journal"
                                    ? "bg-brand-green text-white shadow-sm"
                                    : "text-slate-600 hover:text-slate-950 hover:bg-white/40"
                                }`}
                              >
                                Journal
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Date Range selectors and Reset */}
                        <div className="flex flex-wrap items-center gap-3 bg-white border border-slate-200 rounded-xl p-3 text-xs">
                          <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">Date Range:</span>
                          
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
                              <select 
                                value={pubStartMonth} 
                                onChange={(e) => setPubStartMonth(e.target.value)}
                                className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
                              >
                                <option value="">MM</option>
                                {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map(m => (
                                  <option key={m} value={m}>{m}</option>
                                ))}
                              </select>
                              <span className="text-slate-300">/</span>
                              <select 
                                value={pubStartYear} 
                                onChange={(e) => setPubStartYear(e.target.value)}
                                className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
                              >
                                <option value="">YYYY</option>
                                {Array.from({ length: 18 }, (_, i) => String(2010 + i)).map(y => (
                                  <option key={y} value={y}>{y}</option>
                                ))}
                              </select>
                            </div>

                            <span className="text-slate-400 font-medium font-sans">to</span>

                            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
                              <select 
                                value={pubEndMonth} 
                                onChange={(e) => setPubEndMonth(e.target.value)}
                                className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
                              >
                                <option value="">MM</option>
                                {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map(m => (
                                  <option key={m} value={m}>{m}</option>
                                ))}
                              </select>
                              <span className="text-slate-300">/</span>
                              <select 
                                value={pubEndYear} 
                                onChange={(e) => setPubEndYear(e.target.value)}
                                className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
                              >
                                <option value="">YYYY</option>
                                {Array.from({ length: 18 }, (_, i) => String(2010 + i)).map(y => (
                                  <option key={y} value={y}>{y}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Reset & active filters info */}
                          {(pubStartYear || pubEndYear || pubTypeFilter !== "all" || profileSearchQuery) && (
                            <button 
                              onClick={resetPubFilters}
                              className="text-xs font-mono font-bold text-brand-green hover:text-brand-green/80 hover:underline cursor-pointer ml-auto"
                            >
                              Clear Filters
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredDrPubs.length > 0 ? (
                          filteredDrPubs.map((pub) => {
                            const scholarLink = `https://scholar.google.com/scholar?q=${encodeURIComponent(pub.title)}`;
                            return (
                              <a
                                key={pub.id}
                                href={scholarLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-brand-green hover:bg-slate-100/50 transition-all duration-200 group/pub cursor-pointer text-left"
                                title={`Click to view paper on Google Scholar: ${pub.title}`}
                              >
                                <div className="flex justify-between items-start gap-4">
                                  <div className="space-y-1.5 flex-grow">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[9px] font-mono font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded group-hover/pub:bg-brand-green/10 group-hover/pub:text-brand-green transition-colors uppercase">
                                        {pub.type.replace("-", " ")}
                                      </span>
                                      <span className="text-[10px] font-mono text-slate-400">{pub.date.substring(0,4)}</span>
                                    </div>
                                    <h4 className="font-sans font-bold text-xs text-slate-900 leading-snug group-hover/pub:text-brand-green transition-colors">
                                      [{pub.id}] {pub.title}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                      {pub.authors}
                                    </p>
                                    <p className="text-[10px] text-brand-green font-bold flex items-center gap-1">
                                      <BookOpen className="w-3 h-3" />
                                      {pub.venue}
                                    </p>
                                  </div>
                                  <div className="text-slate-400 group-hover/pub:text-brand-green group-hover/pub:translate-x-1 group-hover/pub:-translate-y-1 transition-all shrink-0 mt-0.5">
                                    <ArrowUpRight className="w-4 h-4" />
                                  </div>
                                </div>
                              </a>
                            );
                          })
                        ) : (
                          <div className="text-center py-12 text-slate-400 font-medium text-xs">
                            No publications match your search query.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeProfileTab === "projects" && (
                    <div className="space-y-6">
                      <h2 className="font-serif text-xl font-bold text-brand-dark pb-3 border-b border-slate-100">Funded & Academic Research Projects</h2>
                      <div className="space-y-5">
                        {activeProfile.projects.map((proj, idx) => (
                          <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-150 relative overflow-hidden text-left">
                            <div className="absolute top-0 left-0 h-full w-1 bg-brand-green"></div>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="font-mono text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded bg-slate-200 text-slate-600">
                                {proj.funding}
                              </span>
                              <span className="font-mono text-[9px] font-bold text-brand-green uppercase bg-brand-green/10 px-2 py-0.5 rounded">
                                {proj.role}
                              </span>
                            </div>
                            <h3 className="font-serif text-base font-extrabold text-slate-900 mt-2.5 leading-snug">
                              {proj.title}
                            </h3>
                            <p className="text-xs text-slate-600 font-sans mt-2 leading-relaxed">
                              {proj.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeProfileTab === "teaching" && (
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <h2 className="font-serif text-xl font-bold text-brand-dark pb-3 border-b border-slate-100">Academic Lecture Allocations</h2>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Courses instructed by {activeProfile.name} within the undergraduate and postgraduate curriculum of the Department of ICT at MBSTU:
                        </p>
                      </div>

                      {/* Graduate Section */}
                      <div className="space-y-3">
                        <h3 className="text-xs font-mono font-bold text-brand-green uppercase tracking-widest">Postgraduate Programs (M.Sc.)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {activeProfile.teaching.graduate.map((course, idx) => (
                            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-left">
                              <span className="font-mono text-[10px] text-slate-400 font-bold">{course.code}</span>
                              <h4 className="font-serif text-sm font-bold text-slate-800 mt-1 leading-snug">{course.title}</h4>
                              <p className="text-[11px] text-brand-green font-medium mt-1 uppercase tracking-wider font-mono">{course.level}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Undergraduate Section */}
                      <div className="space-y-3 pt-4">
                        <h3 className="text-xs font-mono font-bold text-brand-green uppercase tracking-widest">Undergraduate Programs (B.Sc. Engg.)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {activeProfile.teaching.undergraduate.map((course, idx) => (
                            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-left">
                              <span className="font-mono text-[10px] text-slate-400 font-bold">{course.code}</span>
                              <h4 className="font-serif text-sm font-bold text-slate-800 mt-1 leading-snug">{course.title}</h4>
                              <p className="text-[11px] text-brand-green font-medium mt-1 uppercase tracking-wider font-mono">{course.level}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeProfileTab === "contact" && (
                    <div className="space-y-6">
                      <h2 className="font-serif text-xl font-bold text-brand-dark pb-3 border-b border-slate-100">Contact & Affiliation Details</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        {/* Interactive Info Cards */}
                        <div className="space-y-4 text-left">
                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                            <span className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider">Office Address</span>
                            <p className="font-serif text-sm font-bold text-slate-800 leading-snug">Room #213, 2nd Floor, 1st Academic Building</p>
                            <p className="text-xs text-slate-500">Mawlana Bhashani Science and Technology University, Santosh, Tangail-1902, Bangladesh.</p>
                          </div>

                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                            <span className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider">Deputy Director Role</span>
                            <p className="font-serif text-sm font-bold text-slate-800 leading-snug">Students' Welfare & Counseling Centre</p>
                            <p className="text-xs text-slate-500">Advising administrative bodies on student welfare initiatives, counseling drives, and local community outreach.</p>
                          </div>

                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                            <span className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider">Office Contact Hours</span>
                            <p className="font-sans text-xs font-bold text-slate-700">Saturday - Wednesday: 09:30 AM - 04:30 PM (BST)</p>
                            <p className="text-xs text-slate-400">Appointment requests can be initiated by writing directly to official university emails.</p>
                          </div>
                        </div>

                        {/* Visual Location card styled map mock */}
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-150 flex flex-col justify-between self-stretch text-left">
                          <div>
                            <span className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider">Campus Geographic Coords</span>
                            <h3 className="font-serif text-base font-bold text-slate-800 mt-1 leading-snug">1st Academic Building, MBSTU</h3>
                            <p className="font-mono text-[10px] text-brand-green font-bold mt-1">24.237622° N, 89.890777° E</p>
                            <p className="text-xs text-slate-500 mt-1">Located at Santosh, Tangail-1902, Bangladesh. 2nd Floor, Room #213.</p>
                          </div>

                          {/* Beautiful Interactive Google Maps iframe */}
                          <div className="h-44 w-full rounded-xl overflow-hidden border border-slate-200 mt-4 relative bg-slate-100 shadow-inner group/map">
                            <iframe
                              title="MBSTU 1st Academic Building Map"
                              width="100%"
                              height="100%"
                              style={{ border: 0 }}
                              src="https://maps.google.com/maps?q=24.237622071869325,89.890777008193&z=17&t=m&hl=en&output=embed"
                              allowFullScreen
                              loading="lazy"
                            ></iframe>
                            <a 
                              href="https://www.google.com/maps/search/?api=1&query=24.237622071869325,89.890777008193"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg px-2.5 py-1 text-[10px] font-mono font-bold text-slate-700 hover:text-brand-green hover:bg-white transition-all shadow-sm flex items-center gap-1"
                            >
                              <span>Open in Maps</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Research integrity notice */}
                <div className="p-5 rounded-2xl bg-cream border border-slate-200/80 text-[11px] text-slate-500 leading-relaxed flex gap-3 text-left">
                  <Award className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                  <p>
                    {activeProfile.name} directs core computing assets and field data collections. All local vocal annotations and sensory crop trials are conducted in strict compliance with university scientific evaluation ethics.
                  </p>
                </div>

              </div>

            </div>

          </div>
        </div>
      );
    }

    const extraDetails = memberDetailsMap[selectedMember.title] || {
      longBio: selectedMember.desc,
      stats: [
        { label: "Affiliation", value: selectedMember.org || "MBSTU" },
        { label: "Involvement", value: selectedMember.tag || "Active Researcher" }
      ],
      responsibilities: ["Contribute to speech-to-text annotation and field evaluation drives."],
      publications: [],
      academicBackground: ["Graduate affiliation at Mawlana Bhashani Science and Technology University"]
    };

    const scholarLink = selectedMember.scholar || `https://scholar.google.com/scholar?q=${encodeURIComponent(selectedMember.title)}`;
    const linkedinLink = selectedMember.linkedin || `https://www.linkedin.com/pub/dir?firstName=${encodeURIComponent(selectedMember.title.split(' ')[0])}&lastName=${encodeURIComponent(selectedMember.title.split(' ').slice(1).join(' '))}`;
    const orcidLink = selectedMember.orcid || `https://orcid.org/orcid-search/search?searchQuery=${encodeURIComponent(selectedMember.title)}`;
    const githubLink = selectedMember.github || `https://github.com/search?q=${encodeURIComponent(selectedMember.title)}&type=users`;

    const profileTabs = [
      { id: "about", label: "About Me" },
      { id: "education", label: "Education" },
      { id: "role", label: "Project Role" }
    ];
    if (extraDetails.publications && extraDetails.publications.length > 0) {
      profileTabs.push({ id: "publications", label: `Publications (${extraDetails.publications.length})` });
    }
    profileTabs.push({ id: "contact", label: "Contact" });

    const filteredPubs = (extraDetails.publications || []).filter((pub: any) => {
      // 1. Search filter
      const matchesSearch = !profileSearchQuery ||
        pub.title.toLowerCase().includes(profileSearchQuery.toLowerCase()) ||
        (pub.venue && pub.venue.toLowerCase().includes(profileSearchQuery.toLowerCase())) ||
        (pub.authors && pub.authors.toLowerCase().includes(profileSearchQuery.toLowerCase()));

      // 2. Type filter
      const typeLower = pub.type ? pub.type.toLowerCase() : "";
      const isConference = (
        typeLower.includes("conference") || 
        typeLower.includes("proceeding") || 
        typeLower.includes("submission") || 
        typeLower.includes("paper") ||
        typeLower === "proceedings-article"
      ) && !typeLower.includes("journal");

      const isJournal = (
        typeLower.includes("journal") || 
        typeLower.includes("article") ||
        typeLower === "journal-article"
      ) && !typeLower.includes("conference") && !typeLower.includes("proceeding");

      let matchesType = true;
      if (pubTypeFilter === "conference") {
        matchesType = isConference;
      } else if (pubTypeFilter === "journal") {
        matchesType = isJournal;
      }

      // 3. Date range filter
      const pubYear = pub.date ? parseInt(pub.date.substring(0, 4), 10) : (pub.year ? parseInt(pub.year, 10) : 0);
      const pubMonth = pub.date ? parseInt(pub.date.substring(5, 7), 10) : 1;
      const pubScore = pubYear * 12 + pubMonth;

      const startScore = pubStartYear 
        ? (parseInt(pubStartYear, 10) * 12 + (pubStartMonth ? parseInt(pubStartMonth, 10) : 1))
        : 0;
      const endScore = pubEndYear
        ? (parseInt(pubEndYear, 10) * 12 + (pubEndMonth ? parseInt(pubEndMonth, 10) : 12))
        : 999999;

      const matchesDateRange = pubScore >= startScore && pubScore <= endScore;

      return matchesSearch && matchesType && matchesDateRange;
    });

    return (
      <div className="py-12 md:py-20 bg-cream text-charcoal min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs and back button */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <button
              onClick={handleBackToDirectory}
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-slate-500 hover:text-brand-green transition-colors cursor-pointer group self-start"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>← Back to Team Directory</span>
            </button>
            <span className="text-xs font-mono text-slate-400">Researcher Profile // {selectedMember.title}</span>
          </div>

          {/* Main Profile Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Profile info card */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-green via-brand-sage to-harvest-gold"></div>
              
              {/* Avatar with status indicator */}
              <div className="relative mt-4">
                <TeamAvatar member={selectedMember} size="w-44 h-44" />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-brand-green text-white font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full font-extrabold shadow-md whitespace-nowrap z-10 border border-white">
                  {selectedMember.tag || selectedMember.role || "Research Assistant"}
                </div>
              </div>

              {/* Profile Details */}
              <div className="mt-6 space-y-2 w-full">
                <h1 className="font-serif text-2xl font-extrabold text-brand-dark tracking-tight">
                  {selectedMember.title}
                </h1>
                <p className="text-xs font-mono font-bold text-brand-green uppercase tracking-wider">
                  {selectedMember.subtitle}
                </p>
                <p className="text-xs text-slate-500 font-sans font-medium">
                  {selectedMember.org || "Mawlana Bhashani Science & Tech University (MBSTU)"}
                </p>
              </div>

              {/* Contact Card */}
              <div className="w-full mt-6 pt-6 border-t border-slate-100 space-y-3.5 text-left text-xs text-slate-600">
                <a href={`mailto:${selectedMember.email || "nagis_ict@mbstu.ac.bd"}`} className="flex items-center gap-3 hover:text-brand-green transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-brand-green group-hover:bg-brand-green/10 transition-colors shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-[9px] uppercase text-slate-400 font-bold">Email Address</div>
                    <span className="font-sans font-semibold select-all text-slate-700 block truncate">{selectedMember.email || "nagis_ict@mbstu.ac.bd"}</span>
                  </div>
                </a>

                <a href={`tel:${selectedMember.phone || "+8801701876194"}`} className="flex items-center gap-3 hover:text-brand-green transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-brand-green group-hover:bg-brand-green/10 transition-colors shrink-0">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-mono text-[9px] uppercase text-slate-400 font-bold">Phone Connection</div>
                    <span className="font-sans font-semibold select-all text-slate-700">{selectedMember.phone || "01701876194"}</span>
                  </div>
                </a>

                <div className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-brand-green shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-mono text-[9px] uppercase text-slate-400 font-bold">Office Location</div>
                    <span className="font-sans font-semibold text-slate-700">Room #213, 2nd Floor, 1st Academic Building, MBSTU</span>
                  </div>
                </div>
              </div>

              {/* Academic Networks Links */}
              <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-slate-100 w-full">
                <a href={scholarLink} target="_blank" rel="noopener noreferrer" title="Google Scholar Search" className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 hover:bg-[#DB4437] hover:text-white hover:scale-105 transition-all flex items-center justify-center text-slate-500 shadow-sm cursor-pointer">
                  <Globe className="w-4 h-4" />
                </a>
                <a href={linkedinLink} target="_blank" rel="noopener noreferrer" title="LinkedIn Search" className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 hover:bg-[#0077B5] hover:text-white hover:scale-105 transition-all flex items-center justify-center text-slate-500 shadow-sm cursor-pointer">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href={orcidLink} target="_blank" rel="noopener noreferrer" title="ORCID Profile" className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 hover:bg-[#A6CE39] hover:text-white hover:scale-105 transition-all flex items-center justify-center text-slate-500 shadow-sm cursor-pointer">
                  <Fingerprint className="w-4 h-4" />
                </a>
                <a href={githubLink} target="_blank" rel="noopener noreferrer" title="GitHub Profile" className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 hover:bg-[#24292e] hover:text-white hover:scale-105 transition-all flex items-center justify-center text-slate-500 shadow-sm cursor-pointer">
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Tabs */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Custom Tab Navigation */}
              <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm flex flex-wrap gap-1">
                {profileTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveProfileTab(tab.id);
                      setProfileSearchQuery("");
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex-grow md:flex-grow-0 ${
                      activeProfileTab === tab.id
                        ? "bg-brand-green text-white shadow-sm"
                        : "bg-transparent text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Tab Content rendering */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm text-left min-h-[400px]">
                
                {activeProfileTab === "about" && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h2 className="font-serif text-xl font-bold text-brand-dark pb-3 border-b border-slate-100">Academic & Research Bio</h2>
                      <p className="text-sm text-slate-600 leading-relaxed font-sans font-medium whitespace-pre-line">
                        {extraDetails.longBio}
                      </p>
                    </div>
                  </div>
                )}

                {activeProfileTab === "education" && (
                  <div className="space-y-6">
                    <div className="pb-3 border-b border-slate-100 text-left">
                      <h2 className="font-serif text-xl font-bold text-brand-dark flex items-center gap-2">
                        <Award className="w-5 h-5 text-brand-green" />
                        Academic & Professional Background
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">Detailed educational history and academic affiliations of {selectedMember.title}.</p>
                    </div>

                    <div className="relative border-l border-slate-200 pl-6 ml-2 space-y-6">
                      {extraDetails.academicBackground.map((bg: string, idx: number) => (
                        <div key={idx} className="relative">
                          <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-brand-green border-4 border-white shadow-sm"></div>
                          <h4 className="font-sans font-bold text-sm text-slate-900 leading-relaxed">
                            {bg}
                          </h4>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeProfileTab === "role" && (
                  <div className="space-y-8">
                    <div className="space-y-6">
                      <h2 className="font-serif text-xl font-bold text-brand-dark pb-3 border-b border-slate-100 flex items-center gap-2">
                        <Sparkles className="w-4.5 h-4.5 text-brand-green" />
                        Project Role & Responsibilities
                      </h2>
                      <div className="space-y-4">
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Specific deliverables, investigative targets, and operations conducted by this researcher under our multi-modal research roadmap:
                        </p>
                        <ul className="space-y-3.5">
                          {extraDetails.responsibilities.map((resp: string, idx: number) => (
                            <li key={idx} className="flex gap-3.5 items-start text-xs text-slate-700 text-left">
                              <span className="w-6 h-6 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span className="leading-relaxed font-medium pt-0.5">{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Stats details */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <h3 className="text-xs font-mono font-bold text-brand-green uppercase tracking-widest">Key Academic & Research Metrics</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {extraDetails.stats.map((st: any, idx: number) => (
                          <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between text-left">
                            <span className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider">{st.label}</span>
                            <span className="font-serif text-base font-extrabold text-brand-dark mt-1.5 leading-snug">{st.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeProfileTab === "publications" && (
                  <div className="space-y-6">
                    <div className="pb-3 border-b border-slate-100 text-left">
                      <h2 className="font-serif text-xl font-bold text-brand-dark">Connected Publications & Thesis</h2>
                      <p className="text-xs text-slate-500 mt-1">Filter {selectedMember.title}'s publications and thesis papers by type, date, or keywords.</p>
                    </div>

                    {/* Interactive Filter Panel */}
                    <div className="bg-slate-50/60 border border-slate-150 rounded-2xl p-4 space-y-3.5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search Bar */}
                        <div className="relative">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                          <input
                            type="text"
                            placeholder="Search publications by title, authors, venue..."
                            value={profileSearchQuery}
                            onChange={(e) => setProfileSearchQuery(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
                          />
                        </div>

                        {/* Type Filters Button style */}
                        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-1.5 flex-wrap sm:flex-nowrap">
                          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider shrink-0">Type:</span>
                          <div className="flex bg-slate-100 p-0.5 rounded-lg w-full sm:w-auto">
                            <button
                              type="button"
                              onClick={() => setPubTypeFilter("all")}
                              className={`flex-1 sm:flex-initial px-4 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                                pubTypeFilter === "all"
                                  ? "bg-brand-green text-white shadow-sm"
                                  : "text-slate-600 hover:text-slate-950 hover:bg-white/40"
                              }`}
                            >
                              All
                            </button>
                            <button
                              type="button"
                              onClick={() => setPubTypeFilter("conference")}
                              className={`flex-1 sm:flex-initial px-4 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                                pubTypeFilter === "conference"
                                  ? "bg-brand-green text-white shadow-sm"
                                  : "text-slate-600 hover:text-slate-950 hover:bg-white/40"
                              }`}
                            >
                              Conference
                            </button>
                            <button
                              type="button"
                              onClick={() => setPubTypeFilter("journal")}
                              className={`flex-1 sm:flex-initial px-4 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                                pubTypeFilter === "journal"
                                  ? "bg-brand-green text-white shadow-sm"
                                  : "text-slate-600 hover:text-slate-950 hover:bg-white/40"
                              }`}
                            >
                              Journal
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Date Range selectors and Reset */}
                      <div className="flex flex-wrap items-center gap-3 bg-white border border-slate-200 rounded-xl p-3 text-xs">
                        <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">Date Range:</span>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
                            <select 
                              value={pubStartMonth} 
                              onChange={(e) => setPubStartMonth(e.target.value)}
                              className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
                            >
                              <option value="">MM</option>
                              {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map(m => (
                                <option key={m} value={m}>{m}</option>
                              ))}
                            </select>
                            <span className="text-slate-300">/</span>
                            <select 
                              value={pubStartYear} 
                              onChange={(e) => setPubStartYear(e.target.value)}
                              className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
                            >
                              <option value="">YYYY</option>
                              {Array.from({ length: 18 }, (_, i) => String(2010 + i)).map(y => (
                                  <option key={y} value={y}>{y}</option>
                              ))}
                            </select>
                          </div>

                          <span className="text-slate-400 font-medium font-sans">to</span>

                          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
                            <select 
                              value={pubEndMonth} 
                              onChange={(e) => setPubEndMonth(e.target.value)}
                              className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
                            >
                              <option value="">MM</option>
                              {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map(m => (
                                <option key={m} value={m}>{m}</option>
                              ))}
                            </select>
                            <span className="text-slate-300">/</span>
                            <select 
                              value={pubEndYear} 
                              onChange={(e) => setPubEndYear(e.target.value)}
                              className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
                            >
                              <option value="">YYYY</option>
                              {Array.from({ length: 18 }, (_, i) => String(2010 + i)).map(y => (
                                  <option key={y} value={y}>{y}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Reset & active filters info */}
                        {(pubStartYear || pubEndYear || pubTypeFilter !== "all" || profileSearchQuery) && (
                          <button 
                            onClick={resetPubFilters}
                            className="text-xs font-mono font-bold text-brand-green hover:text-brand-green/80 hover:underline cursor-pointer ml-auto"
                          >
                            Clear Filters
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
                      {filteredPubs.length > 0 ? (
                        filteredPubs.map((pub: any, idx: number) => {
                          const scholarLink = pub.link || `https://scholar.google.com/scholar?q=${encodeURIComponent(pub.title)}`;
                          return (
                            <a
                              key={idx}
                              href={scholarLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-brand-green hover:bg-slate-100/50 transition-all duration-200 group/pub cursor-pointer text-left"
                              title={`Click to view paper on Google Scholar: ${pub.title}`}
                            >
                              <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1.5 flex-grow">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-mono font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded group-hover/pub:bg-brand-green/10 group-hover/pub:text-brand-green transition-colors uppercase">
                                      {pub.type || "Research"}
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-400">{pub.year}</span>
                                  </div>
                                  <h4 className="font-sans font-bold text-xs text-slate-900 leading-snug group-hover/pub:text-brand-green transition-colors">
                                    {pub.title}
                                  </h4>
                                  {pub.authors && (
                                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                      {pub.authors}
                                    </p>
                                  )}
                                  {pub.venue && (
                                    <p className="text-[10px] text-brand-green font-bold flex items-center gap-1">
                                      <BookOpen className="w-3 h-3" />
                                      {pub.venue}
                                    </p>
                                  )}
                                </div>
                                <div className="text-slate-400 group-hover/pub:text-brand-green group-hover/pub:translate-x-1 group-hover/pub:-translate-y-1 transition-all shrink-0 mt-0.5">
                                  <ArrowUpRight className="w-4 h-4" />
                                </div>
                              </div>
                            </a>
                          );
                        })
                      ) : (
                        <div className="text-center py-12 text-slate-400 font-medium text-xs">
                          No publications match your search query.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeProfileTab === "contact" && (
                  <div className="space-y-6">
                    <h2 className="font-serif text-xl font-bold text-brand-dark pb-3 border-b border-slate-100">Contact & Affiliation Details</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      {/* Interactive Query Form */}
                      <div>
                        {querySubmitted ? (
                          <div className="p-6 rounded-2xl bg-brand-green/10 border border-brand-green/20 text-center space-y-3 flex flex-col items-center justify-center h-full min-h-[280px]">
                            <div className="w-12 h-12 rounded-full bg-brand-green text-white flex items-center justify-center shadow-md">
                              <Check className="w-6 h-6" />
                            </div>
                            <h3 className="font-serif text-base font-bold text-brand-dark">Query Submitted Successfully</h3>
                            <p className="text-xs text-slate-600 max-w-xs leading-relaxed">
                              Thank you for your message. Your research query has been recorded and routed directly to <strong>{selectedMember.title}</strong>'s academic queue. A response will be issued soon.
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setQuerySubmitted(false);
                                setQueryName("");
                                setQueryEmail("");
                                setQueryMessage("");
                              }}
                              className="text-xs font-mono font-bold text-brand-green hover:underline cursor-pointer pt-2"
                            >
                              Send another query
                            </button>
                          </div>
                        ) : (
                          <form 
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (queryName && queryEmail && queryMessage) {
                                setQuerySubmitted(true);
                              }
                            }}
                            className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4"
                          >
                            <div className="space-y-1 text-left">
                              <h3 className="font-serif text-base font-bold text-slate-800">Submit a Research Query</h3>
                              <p className="text-[11px] text-slate-500">Have a question or collaboration proposal for {selectedMember.title}? Send a direct message.</p>
                            </div>

                            <div className="space-y-3">
                              <div className="space-y-1 text-left">
                                <label className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Full Name</label>
                                <input
                                  type="text"
                                  required
                                  value={queryName}
                                  onChange={(e) => setQueryName(e.target.value)}
                                  placeholder="e.g. John Doe"
                                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
                                />
                              </div>

                              <div className="space-y-1 text-left">
                                <label className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Email Address</label>
                                <input
                                  type="email"
                                  required
                                  value={queryEmail}
                                  onChange={(e) => setQueryEmail(e.target.value)}
                                  placeholder="e.g. john@example.com"
                                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
                                />
                              </div>

                              <div className="space-y-1 text-left">
                                <label className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Message / Proposal</label>
                                <textarea
                                  required
                                  rows={3}
                                  value={queryMessage}
                                  onChange={(e) => setQueryMessage(e.target.value)}
                                  placeholder="Describe your query, research request, or proposal..."
                                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green resize-none"
                                />
                              </div>
                            </div>

                            <button
                              type="submit"
                              className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-mono text-[10px] font-bold uppercase tracking-widest py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer hover:shadow"
                            >
                              <span>Send Query</span>
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </form>
                        )}
                      </div>

                      {/* Visual Location card with iframe Google Maps */}
                      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-150 flex flex-col justify-between self-stretch text-left">
                        <div>
                          <span className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider">Campus Geographic Coords</span>
                          <h3 className="font-serif text-base font-bold text-slate-800 mt-1 leading-snug">1st Academic Building, MBSTU</h3>
                          <p className="font-mono text-[10px] text-brand-green font-bold mt-1">24.237622° N, 89.890777° E</p>
                          <p className="text-xs text-slate-500 mt-1">Located at Santosh, Tangail-1902, Bangladesh. 2nd Floor, Room #213.</p>
                        </div>

                        {/* Beautiful Interactive Google Maps iframe */}
                        <div className="h-44 w-full rounded-xl overflow-hidden border border-slate-200 mt-4 relative bg-slate-100 shadow-inner group/map">
                          <iframe
                            title="MBSTU 1st Academic Building Map"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            src="https://maps.google.com/maps?q=24.237622071869325,89.890777008193&z=17&t=m&hl=en&output=embed"
                            allowFullScreen
                            loading="lazy"
                          ></iframe>
                          <a 
                            href="https://www.google.com/maps/search/?api=1&query=24.237622071869325,89.890777008193"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg px-2.5 py-1 text-[10px] font-mono font-bold text-slate-700 hover:text-brand-green hover:bg-white transition-all shadow-sm flex items-center gap-1"
                          >
                            <span>Open in Maps</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Research integrity notice */}
              <div className="p-5 rounded-2xl bg-cream border border-slate-200/80 text-[11px] text-slate-500 leading-relaxed flex gap-3 text-left">
                <Award className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                <p>
                  All NLP dataset compilations, voice recording annotation phases, and field evaluation programs are conducted under direct supervisions of senior lab faculty in strict alignment with MBSTU academic evaluation rules.
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>
    );
  }

  // Categorise members
  const professors = data.teamMembers.filter(m => 
    m.title.toLowerCase().includes("nazrul") || m.title.toLowerCase().includes("nargis")
  );

  const phdStudents = data.teamMembers.filter(m => 
    m.role === "PhD" || m.title.toLowerCase().includes("tasnim") || m.title.toLowerCase().includes("tanvir")
  );

  const researchAssistants = data.teamMembers.filter(m => 
    m.title.toLowerCase().includes("sagor") || m.title.toLowerCase().includes("alamin")
  );

  const mscStudents = data.teamMembers.filter(m => 
    m.title.toLowerCase().includes("shafi") || m.title.toLowerCase().includes("mim") || m.title.toLowerCase().includes("lutfor") || m.title.toLowerCase().includes("swapnil")
  );

  const dataCollectors = data.teamMembers.filter(m => 
    m.title.toLowerCase().includes("nafis") || m.title.toLowerCase().includes("nadim")
  );

  const alumni = data.teamMembers.filter(m => 
    m.role === "Alumni" || m.title.toLowerCase().includes("anika") || m.title.toLowerCase().includes("faisal")
  );

  // Helper to render grids with up to 4 cards in a row
  const renderMemberGrid = (members: typeof data.teamMembers) => (
    <div className="flex flex-wrap gap-6 justify-center">
      {members.map((member, idx) => (
        <div
          key={member.title}
          className="reveal bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group/team cursor-pointer w-full sm:w-[calc(50%-12px)] md:w-[calc(33.33%-16px)] lg:w-[calc(25%-18px)] max-w-sm"
          onClick={() => handleSelectMember(member)}
          title={`Click to view research bio for ${member.title}`}
        >
          {/* Centered Circle Avatar Header */}
          <div className="relative w-full bg-slate-50 border-b border-slate-100 py-10 flex justify-center items-center shrink-0">
            <div className="relative">
              <TeamAvatar member={member} />
              
              {/* Title Badge positioned at bottom-center of the profile image */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-brand-green text-white font-mono text-[9px] uppercase tracking-widest px-3.5 py-1.5 rounded-full font-extrabold shadow-md whitespace-nowrap z-10 border border-white">
                {member.tag || member.role}
              </div>
            </div>
          </div>

          {/* Info section */}
          <div className="p-6 flex flex-col flex-grow text-center justify-between">
            <div>
              {/* Title (Bold, uppercase) */}
              <h3 className="font-sans font-extrabold text-lg text-slate-900 uppercase tracking-tight leading-snug group-hover/team:text-brand-green transition-colors duration-200">
                {member.title}
              </h3>
              
              {/* Subtitle / Role (Muted uppercase) */}
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mt-1 mb-4">
                {member.subtitle}
              </p>

              {/* Social Icons row */}
              {(() => {
                const isNazrul = member.title.toLowerCase().includes("nazrul");
                const cardScholarLink = member.scholar || (isNazrul
                  ? "https://scholar.google.com/citations?user=L-2Y7aUAAAAJ"
                  : `https://scholar.google.com/scholar?q=${encodeURIComponent(member.title)}`);
                
                const cardLinkedinLink = member.linkedin || (isNazrul
                  ? "https://www.linkedin.com"
                  : `https://www.linkedin.com/pub/dir?firstName=${encodeURIComponent(member.title.split(' ')[0])}&lastName=${encodeURIComponent(member.title.split(' ').slice(1).join(' '))}`);
                
                const cardOrcidLink = member.orcid || `https://orcid.org/orcid-search/search?searchQuery=${encodeURIComponent(member.title)}`;
                const cardGithubLink = member.github || `https://github.com/search?q=${encodeURIComponent(member.title)}&type=users`;

                return (
                  <div className="flex items-center justify-center gap-3 mb-5" onClick={(e) => e.stopPropagation()}>
                    <a href={cardScholarLink} target="_blank" rel="noopener noreferrer" title="Google Scholar" className="w-9 h-9 rounded-full bg-[#DB4437] hover:opacity-95 hover:scale-105 transition-all flex items-center justify-center text-white shadow-sm">
                      <Globe className="w-4 h-4" />
                    </a>
                    <a href={cardLinkedinLink} target="_blank" rel="noopener noreferrer" title="LinkedIn Profile" className="w-9 h-9 rounded-full bg-[#0077B5] hover:opacity-95 hover:scale-105 transition-all flex items-center justify-center text-white shadow-sm">
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a href={cardOrcidLink} target="_blank" rel="noopener noreferrer" title="ORCID Profile" className="w-9 h-9 rounded-full bg-[#A6CE39] hover:opacity-95 hover:scale-105 transition-all flex items-center justify-center text-white shadow-sm">
                      <Fingerprint className="w-4 h-4" />
                    </a>
                    <a href={cardGithubLink} target="_blank" rel="noopener noreferrer" title="GitHub Profile" className="w-9 h-9 rounded-full bg-[#24292e] hover:opacity-95 hover:scale-105 transition-all flex items-center justify-center text-white shadow-sm">
                      <Github className="w-4 h-4" />
                    </a>
                  </div>
                );
              })()}

              {/* Contact details */}
              <div className="space-y-1 text-xs text-slate-600 font-sans mt-1 mb-5 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="font-semibold text-slate-900">Email:</span>
                  <span className="truncate text-slate-700 hover:text-brand-green select-all">{member.email || "nargis_ict@mbstu.ac.bd"}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-semibold text-slate-900">Phone:</span>
                  <span className="text-slate-700 select-all">{member.phone || "01701876194"}</span>
                </div>
              </div>
            </div>

            {/* View Profile Button at the bottom */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedMember(member);
              }}
              className="mt-2 w-full bg-[#111111] hover:bg-[#222222] active:bg-[#000000] text-white uppercase text-xs tracking-widest font-extrabold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2 group-hover/team:shadow-md hover:scale-[1.01] cursor-pointer"
            >
              <span>View Profile</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover/team:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // Fallback default view: Grid of Team members
  return (
    <div className="py-12 md:py-20 bg-cream text-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="reveal mb-12 border-b border-brand-green/10 pb-8 text-left">
          <div className="font-mono text-xs uppercase tracking-widest text-brand-green mb-2">06 // Academic Alliance</div>
          <h1 className="font-serif text-4xl font-medium text-brand-dark tracking-tight">
            Research Investigators & Coordinators
          </h1>
          <p className="text-sm text-muted-gray mt-2 max-w-2xl leading-relaxed">
            Leading experts from Mawlana Bhashani Science and Technology University (MBSTU) collaborating with regional extension agents and speech engineers.
          </p>
        </div>

        {/* Categorized Team Sections */}
        <div className="space-y-16 mb-16">
          {/* Professors Category */}
          {professors.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-brand-green/10 pb-3">
                <h2 className="font-serif text-2xl font-bold text-brand-dark tracking-tight">Principal Investigators</h2>
                <span className="text-xs font-mono font-bold bg-brand-green/10 text-brand-green px-2.5 py-1 rounded-full">{professors.length}</span>
              </div>
              {renderMemberGrid(professors)}
            </div>
          )}

          {/* PhD Students Category */}
          {phdStudents.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-brand-green/10 pb-3">
                <h2 className="font-serif text-2xl font-bold text-brand-dark tracking-tight">PhD Students</h2>
                <span className="text-xs font-mono font-bold bg-brand-green/10 text-brand-green px-2.5 py-1 rounded-full">{phdStudents.length}</span>
              </div>
              {renderMemberGrid(phdStudents)}
            </div>
          )}

          {/* Research Assistants Category */}
          {researchAssistants.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-brand-green/10 pb-3">
                <h2 className="font-serif text-2xl font-bold text-brand-dark tracking-tight">Research Assistants</h2>
                <span className="text-xs font-mono font-bold bg-brand-green/10 text-brand-green px-2.5 py-1 rounded-full">{researchAssistants.length}</span>
              </div>
              {renderMemberGrid(researchAssistants)}
            </div>
          )}

          {/* MSc Students Category */}
          {mscStudents.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-brand-green/10 pb-3">
                <h2 className="font-serif text-2xl font-bold text-brand-dark tracking-tight">Research Graduate Students(MSc Engg. Students)</h2>
                <span className="text-xs font-mono font-bold bg-brand-green/10 text-brand-green px-2.5 py-1 rounded-full">{mscStudents.length}</span>
              </div>
              {renderMemberGrid(mscStudents)}
            </div>
          )}

          {/* Data Collectors Category */}
          {dataCollectors.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-brand-green/10 pb-3">
                <h2 className="font-serif text-2xl font-bold text-brand-dark tracking-tight">Data Collectors</h2>
                <span className="text-xs font-mono font-bold bg-brand-green/10 text-brand-green px-2.5 py-1 rounded-full">{dataCollectors.length}</span>
              </div>
              {renderMemberGrid(dataCollectors)}
            </div>
          )}

          {/* Alumni Category */}
          {alumni.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-brand-green/10 pb-3">
                <h2 className="font-serif text-2xl font-bold text-brand-dark tracking-tight">Alumni</h2>
                <span className="text-xs font-mono font-bold bg-brand-green/10 text-brand-green px-2.5 py-1 rounded-full">{alumni.length}</span>
              </div>
              {renderMemberGrid(alumni)}
            </div>
          )}
        </div>

        {/* Institutional Affiliations info box */}
        {/* 
        <div className="reveal bg-white border border-brand-green/10 rounded-2xl p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-brand-green/10 text-brand-dark border border-brand-green/20">
                <Users className="w-4 h-4 text-brand-green" />
                Academic Cooperation
              </div>
              <h3 className="font-serif text-2xl font-bold text-brand-dark">
                MBSTU Research lab
              </h3>
              <p className="text-sm text-muted-gray max-w-3xl leading-relaxed">
                Our lab brings together postgraduate researchers, senior data engineers, and linguistic advisors. We operate computing assets funded by academic allocations, focusing on localized acoustic transcription protocols and language adaptation modules.
              </p>
            </div>
            <div className="bg-brand-green/5 border border-brand-green/15 rounded-xl p-5 shrink-0 self-stretch sm:self-start lg:self-center font-mono text-[11px] space-y-2">
              <div className="font-serif font-bold text-brand-dark text-xs mb-1">Key Directives:</div>
              <div className="flex gap-2 items-center"><div className="w-1.5 h-1.5 rounded-full bg-brand-green"></div> Dialect Acoustic Transcription</div>
              <div className="flex gap-2 items-center"><div className="w-1.5 h-1.5 rounded-full bg-brand-green"></div> Multi-modal Agri Translation</div>
              <div className="flex gap-2 items-center"><div className="w-1.5 h-1.5 rounded-full bg-brand-green"></div> Local extension training modules</div>
            </div>
          </div>
        </div>
        */}

      </div>
    </div>
  );
}

