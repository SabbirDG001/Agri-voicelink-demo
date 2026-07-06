import { Globe, ArrowUpRight, ShieldCheck, HelpCircle } from "lucide-react";
import { ProjectData, SdgItem } from "../types";

interface ImpactProps {
  data: ProjectData;
  onCardClick: (card: any) => void;
  onNavigate: (page: string) => void;
}

export default function Impact({ data, onCardClick, onNavigate }: ImpactProps) {
  return (
    <div className="py-12 md:py-20 bg-cream text-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="reveal mb-12 border-b border-brand-green/10 pb-8 text-left">
          <div className="font-mono text-xs uppercase tracking-widest text-brand-green mb-2">05 // Social & Economic Footprint</div>
          <h1 className="font-serif text-4xl font-medium text-brand-dark tracking-tight">
            Socio-Economic & UN-SDG Alignment
          </h1>
          <p className="text-sm text-muted-gray mt-2 max-w-2xl leading-relaxed">
            Fostering agricultural resilience, direct household security, and regional digital autonomy mapped clearly onto global developmental frameworks.
          </p>
        </div>

        {/* SDG Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {data.sdgs.map((sdg, idx) => (
            <div
              key={idx}
              className={`reveal p-6 rounded-xl border flex flex-col justify-between shadow-sm hover:shadow-md hover:border-brand-green/30 transition-all cursor-pointer hover:scale-[1.02] group/sdg ${sdg.color}`}
              onClick={() => onCardClick(sdg)}
              title={`Click to view indicators for ${sdg.num}`}
            >
              <div>
                <div className="font-mono text-xs uppercase tracking-widest opacity-80 mb-2 flex justify-between items-center">
                  <span>{sdg.num}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover/sdg:opacity-100 transition-all" />
                </div>
                <h3 className="font-serif text-xl font-bold tracking-tight mb-3">
                  {sdg.title}
                </h3>
                <p className="text-xs opacity-90 leading-relaxed font-light">
                  {sdg.desc}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-black/5 flex items-center justify-between text-[10px] font-mono font-bold tracking-widest uppercase">
                <span>UN-SDG Core Target</span>
                <span className="text-xs group-hover/sdg:translate-x-1 transition-transform">»</span>
              </div>
            </div>
          ))}
        </div>

        {/* Extended Research impact stats */}
        <div className="reveal bg-white border border-brand-green/10 rounded-2xl p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="font-mono text-xs text-brand-green font-bold uppercase tracking-wider">Metrics 01</div>
              <h4 className="font-serif text-lg font-bold text-brand-dark">Yield Loss Mitigation</h4>
              <p className="text-xs text-muted-gray leading-relaxed font-light">
                Early voice diagnostics for rust pathology and fungal outbreaks are designed to preserve up to 25% of affected smallholder crop fields before systemic damage spreads.
              </p>
            </div>
            <div className="space-y-2">
              <div className="font-mono text-xs text-brand-green font-bold uppercase tracking-wider">Metrics 02</div>
              <h4 className="font-serif text-lg font-bold text-brand-dark">Input Optimization</h4>
              <p className="text-xs text-muted-gray leading-relaxed font-light">
                Voice guided chemical instructions help smallholders understand soil nutrition requirements accurately, preventing costly fertilizer runoff or chemical overdoses.
              </p>
            </div>
            <div className="space-y-2">
              <div className="font-mono text-xs text-brand-green font-bold uppercase tracking-wider">Metrics 03</div>
              <h4 className="font-serif text-lg font-bold text-brand-dark">Direct Income Protection</h4>
              <p className="text-xs text-muted-gray leading-relaxed font-light">
                Providing local dial-in alerts on fair market pricing shields rural agricultural merchants from predatory middleman markup rates.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
