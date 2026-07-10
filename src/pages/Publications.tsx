import { useState, useMemo } from "react";
import { FileText, Search, Tag, Calendar, ArrowUpRight, BookOpen } from "lucide-react";
import { ProjectData } from "../types";

interface PublicationsProps {
  data: ProjectData;
}

export default function Publications({ data }: PublicationsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const filteredPublications = useMemo(() => {
    const pubs = data.publications || [];
    return pubs.filter((pub) => {
      const matchesSearch =
        pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pub.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pub.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pub.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = selectedType === "All" || pub.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [data.publications, searchQuery, selectedType]);

  const publicationTypes = useMemo(() => {
    const pubs = data.publications || [];
    const types = new Set(pubs.map((p) => p.type));
    return ["All", ...Array.from(types)];
  }, [data.publications]);

  const hasPublications = data.publications && data.publications.length > 0;

  return (
    <div className="py-12 md:py-20 bg-cream text-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title / Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 reveal active">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-green bg-brand-green/10 px-3.5 py-1.5 rounded-full">
            Our Research Output
          </span>
          <h1 className="font-serif font-extrabold text-3xl md:text-5xl text-brand-dark mt-4 tracking-tight leading-tight">
            Scientific Publications
          </h1>
          <p className="text-sm md:text-base text-muted-gray mt-4 leading-relaxed">
            Discover peer-reviewed articles, journal publications, and conference proceedings detailing our research findings as they are released.
          </p>
        </div>

        {!hasPublications ? (
          /* Status Notice / Placeholder */
          <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-8">
            <div className="inline-flex p-4 rounded-full bg-brand-green/10 text-brand-green">
              <FileText className="w-10 h-10 animate-pulse" />
            </div>

            <div className="space-y-3">
              <h2 className="font-serif font-extrabold text-2xl text-slate-900">
                Publications Under Preparation
              </h2>
              <p className="text-sm text-muted-gray max-w-xl mx-auto leading-relaxed text-left sm:text-center">
                As an active research project supported by the <strong>University Grants Commission (UGC) of Bangladesh</strong> and hosted at <strong>Mawlana Bhashani Science and Technology University (MBSTU)</strong>, our manuscripts and datasets are currently undergoing rigorous field evaluation, validation, and peer review.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Filters and Search Bar */}
            <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search bar */}
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by title, author, venue, tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green transition-all"
                />
              </div>

              {/* Type filters */}
              <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 mr-2 hidden md:inline">Filter by Type:</span>
                {publicationTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      selectedType === type
                        ? "bg-brand-green text-white shadow-sm"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Publications List */}
            <div className="space-y-6">
              {filteredPublications.length > 0 ? (
                filteredPublications.map((pub, idx) => (
                  <div
                    key={idx}
                    className="reveal active bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-6 justify-between items-start"
                  >
                    <div className="flex-grow space-y-4 max-w-4xl text-left">
                      {/* Metadata Row */}
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {pub.type}
                        </span>
                        <span className="text-xs text-muted-gray flex items-center gap-1.5 font-mono">
                          <Calendar className="w-3.5 h-3.5" />
                          {pub.year}
                        </span>
                        <span className="text-xs text-brand-green font-bold flex items-center gap-1.5 font-sans">
                          <BookOpen className="w-3.5 h-3.5" />
                          {pub.venue}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-sans font-extrabold text-lg md:text-xl text-slate-900 leading-snug">
                        {pub.title}
                      </h3>

                      {/* Authors */}
                      <p className="text-xs font-medium text-slate-700">
                        <span className="text-slate-400 mr-1">Authors:</span> {pub.authors}
                      </p>

                      {/* Abstract */}
                      {pub.abstract && (
                        <p className="text-xs text-muted-gray leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100 italic">
                          {pub.abstract}
                        </p>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {pub.tags.map((tag) => (
                          <span key={tag} className="text-[10px] font-mono font-semibold text-slate-500 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Tag className="w-2.5 h-2.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* External Link Button */}
                    {pub.link && (
                      <a
                        href={pub.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full md:w-auto shrink-0 inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-brand-green text-white text-xs uppercase tracking-widest font-extrabold py-3 px-5 rounded-xl transition-all duration-200 shadow-sm hover:scale-[1.01] cursor-pointer"
                      >
                        <span>Source</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4 animate-pulse" />
                  <p className="text-sm font-semibold text-slate-700">No publications match your filter criteria.</p>
                  <p className="text-xs text-muted-gray mt-1">Try resetting your filters or adjusting your search query.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
