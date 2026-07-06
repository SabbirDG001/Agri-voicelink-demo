import { Cpu, ArrowUpRight, Database, Network, Mic, Eye } from "lucide-react";
import { ProjectData, TechDetailItem } from "../types";

interface TechnologyProps {
  data: ProjectData;
  onCardClick: (card: any) => void;
  onNavigate: (page: string) => void;
}

export default function Technology({ data, onCardClick, onNavigate }: TechnologyProps) {
  // Helper to dynamically render Lucide icons in the JSX
  const renderIcon = (iconName: string) => {
    const iconClass = "w-6 h-6 text-brand-green";
    switch (iconName) {
      case "Mic":
        return <Mic className={iconClass} />;
      case "Cpu":
        return <Cpu className={iconClass} />;
      case "Network":
        return <Network className={iconClass} />;
      case "Eye":
        return <Eye className={iconClass} />;
      default:
        return <Cpu className={iconClass} />;
    }
  };

  return (
    <div className="py-12 md:py-20 bg-cream text-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="reveal mb-12 border-b border-slate-200 pb-8 text-left">
          <div className="font-mono text-xs uppercase tracking-widest text-brand-green mb-2">03 // Technical Blueprint</div>
          <h1 className="font-serif text-4xl font-extrabold tracking-tight text-brand-dark">
            Multi-Modal AI Architecture
          </h1>
          <p className="text-sm text-muted-gray mt-2 max-w-2xl leading-relaxed font-light">
            An advanced, low-latency framework designed for regional speech recognition, botanical disease identification, and structural agricultural logic graphs.
          </p>
        </div>

        {/* 4-Column Grid of Architecture modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {data.techDetails.map((tech, idx) => (
            <div
              key={idx}
              className="reveal bg-white border border-slate-200 p-8 rounded-xl hover:shadow-md hover:border-brand-green/30 transition-all flex flex-col justify-between group cursor-pointer hover:scale-[1.01]"
              onClick={() => onCardClick(tech)}
              title={`Click to view architectural parameters for ${tech.title}`}
            >
              <div className="text-left">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-brand-green/10 p-3 rounded-lg group-hover:bg-brand-green/20 transition-colors">
                    {renderIcon(tech.icon)}
                  </div>
                  <span className="font-mono text-[10px] tracking-wider text-muted-gray opacity-60 flex items-center gap-1 group-hover:opacity-100 transition-opacity">
                    [ TECH-0{idx + 1} ]
                    <ArrowUpRight className="w-3 h-3 text-brand-green" />
                  </span>
                </div>
                
                <h3 className="font-serif text-2xl font-bold mb-3 text-brand-dark group-hover:text-brand-green transition-colors">
                  {tech.title}
                </h3>
                <p className="text-xs text-muted-gray leading-relaxed font-light mb-6">
                  {tech.desc}
                </p>
              </div>

              {/* Tag Stack */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="flex flex-wrap gap-2">
                  {tech.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded bg-slate-50 border border-slate-200/60 text-slate-600 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-right text-[10px] font-mono text-brand-green uppercase tracking-wider font-semibold group-hover:text-brand-dark transition-colors">
                  Click to Expand Specs »
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Model Optimization Deep-Dive Info Box */}
        <div className="reveal bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm text-left">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-serif text-2xl font-bold text-brand-dark">
                Quantum Quantization & Mobile Inference
              </h3>
              <p className="text-sm text-muted-gray font-light leading-relaxed">
                To guarantee remote rural deployment, the neural network models are compiled using post-training 4-bit (AWQ) weight quantization rules. This drops the network parameters footprint below 240MB while retaining 96.5% of the primary language model diagnostic quality, executing directly via ONNX Mobile Runtime on legacy hand-held devices without network delay.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-5 flex flex-col justify-between">
              <div className="font-mono text-xs text-brand-green uppercase tracking-widest font-bold mb-4">Hardware Specs</div>
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs border-b border-slate-100 pb-2 font-mono">
                  <span className="text-slate-400">Base Framework</span>
                  <span className="text-slate-800 font-medium">PyTorch / ONNX</span>
                </div>
                <div className="flex justify-between text-xs border-b border-slate-100 pb-2 font-mono">
                  <span className="text-slate-400">Model Footprint</span>
                  <span className="text-slate-800 font-medium">&lt; 240MB Total</span>
                </div>
                <div className="flex justify-between text-xs pb-1 font-mono">
                  <span className="text-slate-400">Target Device RAM</span>
                  <span className="text-slate-800 font-medium">&gt;= 2GB Required</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
