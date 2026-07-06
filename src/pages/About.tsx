import { Target, Compass, Milestone, Building, ChevronRight, Award } from "lucide-react";
import { ProjectData } from "../types";

interface AboutProps {
  data: ProjectData;
  onNavigate: (page: string) => void;
}

export default function About({ data, onNavigate }: AboutProps) {
  const { aboutUs } = data;

  return (
    <div className="py-12 md:py-20 bg-cream text-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title / Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 reveal active">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-green bg-brand-green/10 px-3.5 py-1.5 rounded-full">
            Who We Are
          </span>
          <h1 className="font-serif font-extrabold text-3xl md:text-5xl text-brand-dark mt-4 tracking-tight leading-tight">
            About Our Research Group
          </h1>
          <p className="text-sm md:text-base text-muted-gray mt-4 leading-relaxed">
            {aboutUs.introduction}
          </p>
        </div>

        {/* Vision & Mission Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="reveal active bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <h2 className="font-serif font-bold text-xl md:text-2xl text-brand-dark mb-4">
                Our Vision
              </h2>
              <p className="text-sm text-muted-gray leading-relaxed">
                {aboutUs.vision}
              </p>
            </div>
          </div>

          <div className="reveal active bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
            <div>
              <div className="w-12 h-12 rounded-xl bg-harvest-gold/10 text-brand-green flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="font-serif font-bold text-xl md:text-2xl text-brand-dark mb-4">
                Our Mission
              </h2>
              <p className="text-sm text-muted-gray leading-relaxed">
                {aboutUs.mission}
              </p>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-2xl md:text-3xl text-brand-dark">
              Our Core Scientific Values
            </h2>
            <p className="text-xs text-muted-gray mt-1">The fundamental principles guiding our NLP and Agronomic exploration</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aboutUs.coreValues.map((value, idx) => (
              <div key={idx} className="reveal active bg-white p-6 rounded-xl border border-slate-100 hover:border-brand-green/20 transition-all duration-300 shadow-sm hover:shadow-md">
                <div className="w-8 h-8 rounded-full bg-slate-50 text-brand-green flex items-center justify-center font-bold text-sm mb-4 border border-slate-100">
                  0{idx + 1}
                </div>
                <h3 className="font-sans font-bold text-base text-slate-950 mb-2">
                  {value.title}
                </h3>
                <p className="text-xs text-muted-gray leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Institutional & Funding Partners */}
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand-green bg-brand-green/10 px-3 py-1 rounded-full">
                Partnerships
              </span>
              <h3 className="font-serif font-bold text-2xl text-brand-dark mt-3 mb-4">
                Research Collaboration
              </h3>
              <p className="text-xs text-muted-gray leading-relaxed max-w-sm">
                ALPRG operates with strategic support from leading governmental agencies, agricultural institutes, and public policy organizations across the country.
              </p>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {aboutUs.partners.map((partner, idx) => (
                <div key={idx} className="p-5 rounded-xl border border-slate-100 bg-slate-50 flex flex-col justify-between">
                  <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-brand-green mb-4 border border-slate-100/50">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-xs text-slate-900 leading-snug mb-1">
                      {partner.name}
                    </h4>
                    <p className="text-[10px] text-muted-gray">
                      {partner.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action Row */}
        <div className="text-center">
          <button
            onClick={() => onNavigate("team")}
            className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#222222] text-white text-xs uppercase tracking-widest font-extrabold py-3.5 px-8 rounded-xl transition-all duration-200 shadow-md cursor-pointer"
          >
            <span>Meet Our Investigators</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
