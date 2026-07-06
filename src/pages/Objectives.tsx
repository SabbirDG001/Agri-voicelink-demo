import { Target, CheckCircle2, ArrowUpRight, ChevronRight } from "lucide-react";
import { ProjectData, ObjectiveItem } from "../types";

interface ObjectivesProps {
  data: ProjectData;
  onCardClick: (card: any) => void;
  onNavigate: (page: string) => void;
}

export default function Objectives({ data, onCardClick, onNavigate }: ObjectivesProps) {
  return (
    <div className="py-12 md:py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="reveal mb-12 border-b border-brand-green/10 pb-8 text-left">
          <div className="font-mono text-xs uppercase tracking-widest text-brand-green mb-2">02 // Core Intentions</div>
          <h1 className="font-serif text-4xl font-medium text-brand-dark tracking-tight">
            Research & Action Objectives
          </h1>
          <p className="text-sm text-muted-gray mt-2 max-w-2xl leading-relaxed">
            Funded under specific national academic grants, Agri-VoiceLink is structured into three multi-disciplinary objectives bridging machine learning, crop physiology, and rural economics.
          </p>
        </div>

        {/* Detailed Grid of Objectives */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {data.objectives.map((obj, idx) => (
            <div
              key={idx}
              className={`reveal border rounded-xl p-8 flex flex-col justify-between hover:shadow-lg hover:border-brand-green/30 transition-all border-brand-green/10 shadow-sm cursor-pointer hover:scale-[1.02] group/obj ${obj.color}`}
              onClick={() => onCardClick(obj)}
              title={`Click to view details for ${obj.id}`}
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="font-mono text-xs tracking-wider bg-brand-green/5 px-2.5 py-1 rounded text-brand-green font-bold group-hover/obj:bg-brand-green group-hover/obj:text-white transition-colors">
                    {obj.id}
                  </span>
                  <span className="font-mono text-xs text-muted-gray flex items-center gap-1">
                    Objective Specs
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-45 group-hover/obj:opacity-100 transition-opacity" />
                  </span>
                </div>
                
                <h3 className="font-serif text-2xl font-bold mb-1 text-brand-dark group-hover/obj:text-brand-green transition-colors">
                  {obj.title}
                </h3>
                <p className="text-xs font-mono text-brand-green/80 uppercase tracking-wide mb-4">
                  {obj.subtitle}
                </p>
                <p className="text-xs text-muted-gray leading-relaxed mb-6">
                  {obj.desc}
                </p>
              </div>

              {/* Targets List */}
              <div className="space-y-3 pt-6 border-t border-brand-green/5">
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-brand-dark font-bold">Key Focus Indicators:</h4>
                <div className="space-y-2">
                  {obj.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2 text-xs text-muted-gray">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 text-right text-[10px] font-mono text-brand-green uppercase tracking-wider font-semibold">
                  Click to Expand Research Specifications »
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Academic Grounding Banner */}
        <div className="reveal bg-white border border-brand-green/10 rounded-2xl p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-brand-green/10 text-brand-dark border border-brand-green/20">
                <Target className="w-4 h-4 text-brand-green" />
                Interdisciplinary Alignment
              </div>
              <h3 className="font-serif text-2xl font-bold text-brand-dark">
                Rigorous Agronomic Verification & Peer-Reviews
              </h3>
              <p className="text-sm text-muted-gray max-w-3xl leading-relaxed">
                Every objective is backed by active field test pipelines. In partnership with extension specialists, regional agronomists verify model outputs for treatment efficacy, crop disease leaf symptom identification accuracy, and dynamic fertilizer dosage specifications.
              </p>
            </div>
            <button
              onClick={() => onNavigate("technology")}
              className="px-6 py-3 bg-brand-dark hover:bg-brand-green text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 shrink-0 self-stretch sm:self-start lg:self-center justify-center cursor-pointer"
            >
              View Scientific Stack
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
