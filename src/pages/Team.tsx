import { useState, FormEvent } from "react";
import { ExternalLink, Award, Users, BookOpen, Facebook, Twitter, Linkedin, Globe, ArrowLeft, Mail, Phone, MapPin, Send, Check, Sparkles, MessageSquare } from "lucide-react";
import { ProjectData, TeamMemberItem } from "../types";

interface TeamProps {
  data: ProjectData;
  onCardClick: (card: any) => void;
  onNavigate: (page: string) => void;
}

// Custom detail registries for dynamic profile views
import memberDetailsMapData from "../data/memberDetails.json";

const memberDetailsMap = memberDetailsMapData as Record<string, {
  longBio: string;
  stats: { label: string; value: string }[];
  responsibilities: string[];
  publications: { title: string; venue: string; year: string; type: string }[];
  academicBackground: string[];
}>;

// Self-contained component to handle individual image loading state & fallback
function TeamAvatar({ member, size = "w-48 h-48" }: { member: TeamMemberItem; size?: string }) {
  const [error, setError] = useState(false);

  if (member.avatar && !error) {
    return (
      <div className={`relative ${size} rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100 shrink-0`}>
        <img
          src={member.avatar}
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

export default function Team({ data, onCardClick, onNavigate }: TeamProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMemberItem | null>(null);

  // If a member profile is selected, render their beautiful, dynamic detailed page
  if (selectedMember) {
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
              onClick={() => {
                setSelectedMember(null);
              }}
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
                    {extraDetails.publications.map((pub, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded">
                              {pub.type}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">{pub.year}</span>
                          </div>
                          <h4 className="font-sans font-bold text-xs text-slate-900 leading-snug">
                            {pub.title}
                          </h4>
                          <p className="text-[10px] text-brand-green font-bold flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {pub.venue}
                          </p>
                        </div>
                      </div>
                    ))}
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
              onClick={() => setSelectedMember(member)}
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

