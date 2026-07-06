import { Calendar, CheckCircle2, ArrowUpRight } from "lucide-react";
import { ProjectData, TimelineQuarterItem } from "../types";

interface RoadmapProps {
  data: ProjectData;
  onCardClick: (card: any) => void;
  onNavigate: (page: string) => void;
}

export default function Roadmap({ data, onCardClick, onNavigate }: RoadmapProps) {
  return (
    <div className="py-12 md:py-20 bg-cream text-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="reveal mb-12 border-b border-brand-green/10 pb-8 text-left">
          <div className="font-mono text-xs uppercase tracking-widest text-brand-green mb-2">04 // Development Milestones</div>
          <h1 className="font-serif text-4xl font-medium text-brand-dark tracking-tight">
            Research & Implementation Roadmap
          </h1>
          <p className="text-sm text-muted-gray mt-2 max-w-2xl leading-relaxed">
            A 24-month structured layout targeting high-impact deliverables, from localized dataset harvesting to wide scale open API distributions.
          </p>
        </div>

        {/* Timeline Quarters list */}
        <div className="relative border-l border-brand-green/20 ml-6 pl-8 sm:ml-8 sm:pl-10 space-y-12 mb-16">
          {data.timelineQuarters.map((q, idx) => {
            const isActive = q.status === "Active Research";
            return (
              <div key={idx} className="relative group">
                
                {/* Custom node marker */}
                <div
                  className={`absolute top-1.5 left-[-41px] sm:left-[-49px] w-6 h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center ${
                    isActive ? "bg-brand-green animate-pulse" : "bg-brand-sage"
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-white" />
                </div>

                {/* Timeline Card */}
                <div
                  onClick={() => onCardClick(q)}
                  className={`bg-white p-6 md:p-8 rounded-xl border border-brand-green/10 shadow-sm hover:shadow-md hover:border-brand-green/30 transition-all cursor-pointer hover:scale-[1.01] ${
                    isActive ? "ring-2 ring-brand-green/20 border-brand-green/40" : ""
                  }`}
                  title={`Click to view deliverables for ${q.phase}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <span className="font-mono text-xs font-bold text-brand-green uppercase tracking-wide block sm:inline-block">
                        {q.phase}
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-dark mt-1 group-hover:text-brand-green transition-colors">
                        {q.title}
                      </h3>
                    </div>
                    <span
                      className={`inline-flex self-start px-2.5 py-1 rounded font-mono text-[9px] sm:text-xs font-bold uppercase tracking-wider ${
                        isActive ? "bg-brand-green/10 text-brand-green" : "bg-brand-dark/5 text-muted-gray"
                      }`}
                    >
                      {q.status}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-gray leading-relaxed max-w-3xl mb-6 font-light">
                    {q.desc}
                  </p>

                  <div className="pt-4 border-t border-brand-green/5 flex items-center justify-between text-[10px] font-mono font-bold tracking-widest uppercase text-muted-gray group-hover:text-brand-green transition-colors">
                    <span>Deliverable Specifications</span>
                    <span className="flex items-center gap-1">
                      Expand Specs <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Call to Action or Institutional Assurance */}
        <div className="reveal bg-white border border-brand-green/10 rounded-2xl p-6 sm:p-10 shadow-sm">
          <div className="max-w-3xl space-y-4">
            <h3 className="font-serif text-2xl font-bold text-brand-dark">
              UGC Supervisory Audit Framework
            </h3>
            <p className="text-sm text-muted-gray leading-relaxed">
              Academic research projects funded under the ICSETEP initiatives are bound to strict, quarterly peer-reviews and validation checks. Status checks are monitored by the University Grants Commission (UGC) executive group to verify model precision, corpus diversity, and transparent budget management before subsequent phases commence.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
