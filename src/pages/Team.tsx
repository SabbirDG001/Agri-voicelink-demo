import { useState, FormEvent, useEffect } from "react";
import { ExternalLink, Award, Users, BookOpen, Facebook, Twitter, Linkedin, Globe, ArrowLeft, Mail, Phone, MapPin, Send, Check, Sparkles, MessageSquare, ArrowUpRight, Search } from "lucide-react";
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

  // Sync state when initialMemberName prop updates (e.g. on direct navigation)
  useEffect(() => {
    if (initialMemberName) {
      const found = data.teamMembers.find(
        (m) => m.title.toLowerCase() === initialMemberName.toLowerCase()
      );
      if (found) {
        setSelectedMember(found);
        setActiveProfileTab("about");
        return;
      }
    }
    setSelectedMember(null);
  }, [initialMemberName, data.teamMembers]);

  const handleSelectMember = (member: TeamMemberItem) => {
    setSelectedMember(member);
    setActiveProfileTab("about");
    setProfileSearchQuery("");
    const slug = encodeURIComponent(member.title.replace(/\s+/g, "-"));
    onNavigate(`team/${slug}`);
  };

  const handleBackToDirectory = () => {
    setSelectedMember(null);
    if (onClearInitialMember) {
      onClearInitialMember();
    }
    onNavigate("team");
  };

  // If a member profile is selected, render their beautiful, dynamic detailed page
  if (selectedMember) {
    if (selectedMember.title === "Dr. Nazrul Islam") {
      const filteredDrPubs = drNazrulProfile.publications.filter(pub => 
        pub.title.toLowerCase().includes(profileSearchQuery.toLowerCase()) ||
        pub.authors.toLowerCase().includes(profileSearchQuery.toLowerCase()) ||
        pub.venue.toLowerCase().includes(profileSearchQuery.toLowerCase())
      );

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
              <span className="text-xs font-mono text-slate-400">University Faculty // {drNazrulProfile.name}</span>
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
                    {drNazrulProfile.name}
                  </h1>
                  <p className="text-xs font-mono font-bold text-brand-green uppercase tracking-wider">
                    {drNazrulProfile.designation}
                  </p>
                  <p className="text-xs text-slate-500 font-sans font-medium">
                    Department of {drNazrulProfile.department}
                  </p>
                  <p className="text-xs text-slate-400 font-sans">
                    Mawlana Bhashani Science & Technology University
                  </p>
                </div>

                {/* Contact Card */}
                <div className="w-full mt-6 pt-6 border-t border-slate-100 space-y-3.5 text-left text-xs text-slate-600">
                  <a href={`mailto:${drNazrulProfile.email}`} className="flex items-center gap-3 hover:text-brand-green transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-brand-green group-hover:bg-brand-green/10 transition-colors">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-mono text-[9px] uppercase text-slate-400 font-bold">Email Address</div>
                      <span className="font-sans font-semibold select-all text-slate-700">{drNazrulProfile.email}</span>
                    </div>
                  </a>

                  <a href={`tel:${drNazrulProfile.phone}`} className="flex items-center gap-3 hover:text-brand-green transition-colors group flex-nowrap">
                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-brand-green group-hover:bg-brand-green/10 transition-colors shrink-0">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-mono text-[9px] uppercase text-slate-400 font-bold">Phone Connection</div>
                      <span className="font-sans font-semibold select-all text-slate-700">{drNazrulProfile.phone}</span>
                    </div>
                  </a>

                  <div className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-brand-green shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-mono text-[9px] uppercase text-slate-400 font-bold">Office Location</div>
                      <span className="font-sans font-semibold text-slate-700">{drNazrulProfile.location}</span>
                    </div>
                  </div>
                </div>

                {/* Academic Networks Links */}
                <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-slate-100 w-full">
                  <a href="https://scholar.google.com/citations?user=L-2Y7aUAAAAJ" target="_blank" rel="noopener noreferrer" title="Google Scholar Profile" className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 hover:bg-[#DB4437] hover:text-white hover:scale-105 transition-all flex items-center justify-center text-slate-500 shadow-sm cursor-pointer">
                    <Globe className="w-4 h-4" />
                  </a>
                  <a href="https://www.researchgate.net/profile/Nazrul-Islam-22" target="_blank" rel="noopener noreferrer" title="ResearchGate Profile" className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 hover:bg-brand-green hover:text-white hover:scale-105 transition-all flex items-center justify-center text-slate-500 shadow-sm cursor-pointer">
                    <BookOpen className="w-4 h-4" />
                  </a>
                  <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn Profile" className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 hover:bg-[#0077B5] hover:text-white hover:scale-105 transition-all flex items-center justify-center text-slate-500 shadow-sm cursor-pointer">
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* RIGHT COLUMN: Interactive Tabs */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Custom Tab Navigation */}
                <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm flex flex-wrap gap-1">
                  {[
                    { id: "about", label: "About Me" },
                    { id: "publications", label: "Publications (" + drNazrulProfile.publications.length + ")" },
                    { id: "projects", label: "Projects" },
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
                          {drNazrulProfile.longBio}
                        </p>
                      </div>

                      {/* Research Interests (dynamic linking) */}
                      <div className="space-y-4">
                        <h3 className="font-serif text-lg font-bold text-brand-dark pb-3 border-b border-slate-100 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-brand-green" />
                          Primary Research Interests
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Click any research interest card below to dynamically redirect to Dr. Nazrul Islam's relevant research publications and papers on Google Scholar:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {drNazrulProfile.researchInterests.map((interest, idx) => {
                            const scholarQuery = `https://scholar.google.com/scholar?q=Nazrul+Islam+MBSTU+${encodeURIComponent(interest)}`;
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

                      {/* Education Details */}
                      <div className="space-y-4">
                        <h3 className="font-serif text-lg font-bold text-brand-dark pb-3 border-b border-slate-100 flex items-center gap-2">
                          <Award className="w-4 h-4 text-brand-green" />
                          Academic Credentials
                        </h3>
                        <div className="relative border-l border-slate-200 pl-6 ml-2 space-y-6">
                          {drNazrulProfile.education.map((edu, idx) => (
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
                    </div>
                  )}

                  {activeProfileTab === "publications" && (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-100">
                        <h2 className="font-serif text-xl font-bold text-brand-dark">Complete Publication List</h2>
                        
                        {/* Search input for filter */}
                        <div className="relative w-full sm:max-w-xs">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                          <input
                            type="text"
                            placeholder="Filter publications..."
                            value={profileSearchQuery}
                            onChange={(e) => setProfileSearchQuery(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 pl-9 pr-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
                          />
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
                        {drNazrulProfile.projects.map((proj, idx) => (
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
                          Courses instructed by Dr. Nazrul Islam within the undergraduate and postgraduate curriculum of the Department of ICT at MBSTU:
                        </p>
                      </div>

                      {/* Graduate Section */}
                      <div className="space-y-3">
                        <h3 className="text-xs font-mono font-bold text-brand-green uppercase tracking-widest">Postgraduate Programs (M.Sc.)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {drNazrulProfile.teaching.graduate.map((course, idx) => (
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
                          {drNazrulProfile.teaching.undergraduate.map((course, idx) => (
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
                    Dr. Nazrul Islam directs core computing assets and field data collections. All local vocal annotations and sensory crop trials are conducted in strict compliance with university scientific evaluation ethics.
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

    return (
      <div className="py-12 md:py-20 bg-cream text-charcoal min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs and back button */}
          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={handleBackToDirectory}
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-slate-500 hover:text-brand-green transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>← Back to Team Directory</span>
            </button>
            <span className="text-xs font-mono text-slate-400">Researcher Profile // {selectedMember.title}</span>
          </div>

          {/* Premium Profile Header Container */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm mb-10 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-green via-brand-sage to-harvest-gold"></div>
            
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
              {/* Profile Avatar */}
              <div className="relative">
                <TeamAvatar member={selectedMember} size="w-52 h-52" />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-brand-green text-white font-mono text-[10px] uppercase tracking-widest px-4 py-2 rounded-full font-extrabold shadow-md whitespace-nowrap z-10 border border-white">
                  {selectedMember.tag || selectedMember.role}
                </div>
              </div>

              {/* Header Info */}
              <div className="flex-grow space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-brand-green uppercase tracking-widest">{selectedMember.subtitle}</span>
                  <h1 className="font-serif text-3xl md:text-4xl text-brand-dark font-extrabold tracking-tight">
                    {selectedMember.title}
                  </h1>
                  <p className="text-sm text-slate-500 font-sans font-medium flex items-center justify-center md:justify-start gap-1.5">
                    <Award className="w-4 h-4 text-brand-green" />
                    {selectedMember.org || "Mawlana Bhashani Science & Tech University (MBSTU)"}
                  </p>
                </div>

                <p className="text-sm text-muted-gray leading-relaxed max-w-2xl">
                  {extraDetails.longBio}
                </p>

                {/* Direct Contact Links */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100 text-xs text-slate-600 justify-center md:justify-start">
                  <a href={`mailto:${selectedMember.email}`} className="flex items-center justify-center md:justify-start gap-2 hover:text-brand-green transition-colors">
                    <Mail className="w-4 h-4 text-brand-green shrink-0" />
                    <span className="font-mono font-bold uppercase">Email:</span>
                    <span className="font-sans font-medium select-all">{selectedMember.email || "nazrul_cse@mbstu.ac.bd"}</span>
                  </a>
                  <div className="hidden sm:block text-slate-200">|</div>
                  <a href={`tel:${selectedMember.phone}`} className="flex items-center justify-center md:justify-start gap-2 hover:text-brand-green transition-colors">
                    <Phone className="w-4 h-4 text-brand-green shrink-0" />
                    <span className="font-mono font-bold uppercase">Phone:</span>
                    <span className="font-sans font-medium select-all">{selectedMember.phone || "+880 1712-345678"}</span>
                  </a>
                </div>

                {/* Social Networks Icons */}
                <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
                  <a href="#facebook" title="Facebook Profile" className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 hover:bg-[#3B5998] hover:text-white hover:scale-105 transition-all flex items-center justify-center text-slate-500 shadow-sm">
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href="#twitter" title="Twitter Profile" className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 hover:bg-[#1DA1F2] hover:text-white hover:scale-105 transition-all flex items-center justify-center text-slate-500 shadow-sm">
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a href="#google" title="Google Scholar" className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 hover:bg-[#DB4437] hover:text-white hover:scale-105 transition-all flex items-center justify-center text-slate-500 shadow-sm">
                    <Globe className="w-4 h-4" />
                  </a>
                  <a href="#linkedin" title="LinkedIn Profile" className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 hover:bg-[#0077B5] hover:text-white hover:scale-105 transition-all flex items-center justify-center text-slate-500 shadow-sm">
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Core Content Layout */}
          <div className="max-w-4xl mx-auto space-y-8">
              
              {/* project role card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 text-left">
                <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                  <Sparkles className="w-5 h-5 text-brand-green" />
                  <h3 className="font-serif text-lg font-bold text-brand-dark">Agri-VoiceLink Project Role</h3>
                </div>
                
                {/* Responsibilities list */}
                <div className="space-y-4">
                  <p className="text-xs text-muted-gray">Specific tasks, deliverables, and investigative components managed by this member under our current research roadmap:</p>
                  <ul className="space-y-3">
                    {extraDetails.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex gap-3 items-start text-xs text-slate-700">
                        <span className="w-5 h-5 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed font-medium">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mini Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  {extraDetails.stats.map((st, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
                      <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">{st.label}</span>
                      <span className="font-serif text-lg font-bold text-brand-dark mt-1">{st.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* academic background card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm text-left space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <Users className="w-5 h-5 text-brand-green" />
                  <h3 className="font-serif text-lg font-bold text-brand-dark">Academic & Scientific Affiliation</h3>
                </div>
                <ul className="space-y-2 text-xs text-slate-600">
                  {extraDetails.academicBackground.map((bg, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-brand-green font-bold shrink-0 mt-0.5">•</span>
                      <span>{bg}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* associated publications */}
              {extraDetails.publications.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm text-left space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                    <BookOpen className="w-5 h-5 text-brand-green" />
                    <h3 className="font-serif text-lg font-bold text-brand-dark">Primary Connected Research</h3>
                  </div>
                  <div className="space-y-4">
                    {extraDetails.publications.map((pub: any, idx: number) => {
                      const paperLink = pub.link || `https://scholar.google.com/scholar?q=${encodeURIComponent(pub.title)}`;
                      return (
                        <a
                          key={idx}
                          href={paperLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-brand-green hover:bg-slate-100/50 transition-all duration-200 group/pub cursor-pointer"
                          title={`Click to view paper on Google Scholar: ${pub.title}`}
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="space-y-1.5 flex-grow">
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-mono font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded group-hover/pub:bg-brand-green/10 group-hover/pub:text-brand-green transition-colors">
                                  {pub.type}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400">{pub.year}</span>
                              </div>
                              <h4 className="font-sans font-bold text-xs text-slate-900 leading-snug group-hover/pub:text-brand-green transition-colors">
                                {pub.title}
                              </h4>
                              <p className="text-[10px] text-brand-green font-bold flex items-center gap-1">
                                <BookOpen className="w-3 h-3" />
                                {pub.venue}
                              </p>
                            </div>
                            <div className="text-slate-400 group-hover/pub:text-brand-green group-hover/pub:translate-x-1 group-hover/pub:-translate-y-1 transition-all shrink-0">
                              <ArrowUpRight className="w-4 h-4" />
                            </div>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            {/* Research integrity notice */}
            <div className="p-5 rounded-2xl bg-cream border border-slate-200/80 text-[11px] text-slate-500 leading-relaxed text-left flex gap-3">
              <Award className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
              <p>
                As an academic group host at Mawlana Bhashani Science and Technology University, all scientific submissions are audited for data compliance and ethical human-annotation standards.
              </p>
            </div>

          </div>

        </div>
      </div>
    );
  }

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

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {data.teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="reveal bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group/team cursor-pointer"
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
                  <div className="flex items-center justify-center gap-3 mb-5" onClick={(e) => e.stopPropagation()}>
                    <a href="#facebook" title="Facebook Profile" className="w-9 h-9 rounded-full bg-[#3B5998] hover:opacity-90 hover:scale-105 transition-all flex items-center justify-center text-white shadow-sm">
                      <Facebook className="w-4 h-4" />
                    </a>
                    <a href="#twitter" title="Twitter Profile" className="w-9 h-9 rounded-full bg-[#1DA1F2] hover:opacity-90 hover:scale-105 transition-all flex items-center justify-center text-white shadow-sm">
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a href="#google" title="Google Scholar" className="w-9 h-9 rounded-full bg-[#DB4437] hover:opacity-90 hover:scale-105 transition-all flex items-center justify-center text-white shadow-sm">
                      <Globe className="w-4 h-4" />
                    </a>
                    <a href="#linkedin" title="LinkedIn Profile" className="w-9 h-9 rounded-full bg-[#0077B5] hover:opacity-90 hover:scale-105 transition-all flex items-center justify-center text-white shadow-sm">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Contact details */}
                  <div className="space-y-1 text-xs text-slate-600 font-sans mt-1 mb-5 border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-semibold text-slate-900">Email:</span>
                      <span className="truncate text-slate-700 hover:text-brand-green select-all">{member.email || "nagis_ict@mbstu.ac.bd"}</span>
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

        {/* Institutional Affiliations info box */}
        <div className="reveal bg-white border border-brand-green/10 rounded-2xl p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-brand-green/10 text-brand-dark border border-brand-green/20">
                <Users className="w-4 h-4 text-brand-green" />
                Academic Cooperation
              </div>
              <h3 className="font-serif text-2xl font-bold text-brand-dark">
                MBSTU Intellectual NLP Research Lab
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

      </div>
    </div>
  );
}

