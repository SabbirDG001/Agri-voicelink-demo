import { useState, useMemo, useEffect } from "react";
import { 
  Newspaper, 
  Search, 
  Calendar, 
  User, 
  ArrowLeft, 
  ArrowRight, 
  Tag, 
  Clock, 
  BookOpen,
  ChevronRight
} from "lucide-react";
import { NewsItem } from "../types";
import newsData from "../data/newsData.json";

export default function News() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  // Cast JSON data
  const articles = newsData as NewsItem[];

  // Synchronize hash with specific article if requested
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#news/")) {
        const id = hash.replace("#news/", "");
        if (articles.some(a => a.id === id)) {
          setSelectedArticleId(id);
        } else {
          setSelectedArticleId(null);
        }
      } else {
        setSelectedArticleId(null);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [articles]);

  const handleSelectArticle = (id: string | null) => {
    if (id) {
      window.location.hash = `news/${id}`;
    } else {
      window.location.hash = "news";
    }
  };

  // Categories list
  const categories = ["All", "Milestone", "Publication", "Field Trial"];

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch = 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = 
        selectedCategory === "All" || 
        article.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [articles, searchQuery, selectedCategory]);

  const activeArticle = useMemo(() => {
    return articles.find((a) => a.id === selectedArticleId) || null;
  }, [articles, selectedArticleId]);

  // Format date helper
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Simple renderer to style the article content beautifully
  const renderArticleContent = (content: string) => {
    return content.split("\n\n").map((block, index) => {
      // Check if block is a heading
      if (block.startsWith("### ")) {
        return (
          <h3 
            key={index} 
            className="font-serif text-lg md:text-xl font-bold text-brand-dark mt-8 mb-4 border-l-4 border-brand-green pl-3"
          >
            {block.replace("### ", "")}
          </h3>
        );
      }
      
      // Check if block is a bullet list
      if (block.startsWith("- ") || block.startsWith("1. ")) {
        const items = block.split("\n");
        return (
          <ul key={index} className="space-y-2.5 my-5 pl-5 list-none">
            {items.map((item, itemIdx) => {
              const cleanedItem = item.replace(/^(-\s*|\d+\.\s*)/, "");
              // Check for bold parts e.g. **Text:**
              const parts = cleanedItem.split("**");
              return (
                <li key={itemIdx} className="text-sm text-slate-600 leading-relaxed flex items-start gap-2">
                  <span className="text-brand-green font-bold text-base select-none mt-[-2px]">•</span>
                  <span>
                    {parts.map((part, partIdx) => 
                      partIdx % 2 === 1 ? <strong key={partIdx} className="font-semibold text-brand-dark">{part}</strong> : part
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        );
      }

      // Check if block is a quote
      if (block.startsWith("*") && block.endsWith("*")) {
        return (
          <blockquote 
            key={index} 
            className="my-6 p-5 rounded-2xl bg-brand-green/5 border-l-4 border-brand-green font-serif text-sm italic text-slate-700 leading-relaxed"
          >
            {block.replace(/\*/g, "")}
          </blockquote>
        );
      }

      // Standard paragraph
      // Check for bold parts e.g. **Text**
      const parts = block.split("**");
      return (
        <p key={index} className="text-sm text-slate-600 leading-relaxed font-sans font-medium mb-4">
          {parts.map((part, partIdx) => 
            partIdx % 2 === 1 ? <strong key={partIdx} className="font-semibold text-brand-dark">{part}</strong> : part
          )}
        </p>
      );
    });
  };

  // Detail Page View
  if (activeArticle) {
    // Filter related articles (excluding the active one)
    const relatedArticles = articles
      .filter((a) => a.id !== activeArticle.id)
      .slice(0, 2);

    return (
      <div className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back button and page status info */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <button
              onClick={() => handleSelectArticle(null)}
              className="group flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-slate-500 hover:text-brand-green transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>← Back to News Directory</span>
            </button>
            <span className="text-xs font-mono text-slate-400">
              News / {activeArticle.category} // ID-{activeArticle.id.slice(0, 6)}
            </span>
          </div>

          {/* Article Header Container */}
          <article className="bg-white rounded-3xl border border-brand-green/10 shadow-sm overflow-hidden p-6 md:p-10 mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                activeArticle.category === "Milestone" ? "bg-amber-100 text-amber-800" :
                activeArticle.category === "Publication" ? "bg-indigo-100 text-indigo-800" :
                activeArticle.category === "Event" ? "bg-teal-100 text-teal-800" :
                "bg-emerald-100 text-emerald-800"
              }`}>
                {activeArticle.category}
              </span>
              <span className="text-slate-300 select-none">•</span>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(activeArticle.date)}</span>
              </div>
            </div>

            <h1 className="font-serif text-2xl md:text-4xl font-extrabold text-brand-dark tracking-tight leading-tight mb-6">
              {activeArticle.title}
            </h1>

            <div className="flex items-center gap-3 py-4 border-y border-slate-100 mb-8 text-xs text-slate-500 font-mono">
              <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green font-bold text-sm">
                {activeArticle.author.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-slate-700">{activeArticle.author}</p>
                <p className="text-[10px] text-slate-400">Project Contributor</p>
              </div>
            </div>

            {/* Banner/Thumbnail Image */}
            <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8 border border-slate-100 relative shadow-sm">
              <img 
                src={activeArticle.thumbnail} 
                alt={activeArticle.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            </div>

            {/* Core Article Body Content */}
            <div className="prose prose-slate max-w-none mb-10 text-slate-700">
              {renderArticleContent(activeArticle.content)}
            </div>

            {/* Tags footer */}
            <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-2 items-center">
              <Tag className="w-3.5 h-3.5 text-slate-400 mr-1" />
              {activeArticle.tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="bg-slate-50 border border-slate-200 text-slate-500 font-mono text-[10px] uppercase font-bold py-1 px-2.5 rounded-lg"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </article>

          {/* Related News Sidebar/Section */}
          <div className="mt-12">
            <h3 className="font-serif text-lg md:text-xl font-bold text-brand-dark mb-6 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-brand-green" />
              <span>Other News & Announcements</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map((article) => (
                <div 
                  key={article.id}
                  onClick={() => handleSelectArticle(article.id)}
                  className="bg-white rounded-2xl border border-brand-green/10 p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    <div className="aspect-[16/10] w-full rounded-xl overflow-hidden mb-4 border border-slate-100 relative">
                      <img 
                        src={article.thumbnail} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-[9px] font-mono font-bold uppercase text-brand-green tracking-wider block mb-2">
                      {article.category}
                    </span>
                    <h4 className="font-serif text-base font-bold text-brand-dark group-hover:text-brand-green transition-colors line-clamp-2 leading-snug mb-2">
                      {article.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 font-sans font-medium">
                      {article.summary}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-50 text-[10px] text-slate-400 font-mono">
                    <span>{formatDate(article.date)}</span>
                    <span className="text-brand-green group-hover:translate-x-1 transition-transform flex items-center gap-1 font-bold uppercase tracking-wider">
                      Read
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // News Directory Page View
  return (
    <div className="pt-28 pb-20 bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Headings */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-widest bg-brand-dark text-white mb-4 shadow-sm">
            <BookOpen className="w-3.5 h-3.5 text-brand-sage" />
            <span>Research Announcements</span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-extrabold text-brand-dark tracking-tight leading-tight">
            Project News & Media
          </h1>
          <p className="mt-4 text-sm text-slate-600 leading-relaxed font-sans font-medium max-w-xl mx-auto">
            Stay informed with real-time progress summaries, scholarly achievements, computational milestones, and direct field diagnostics reports from the Agri-VoiceLink research team.
          </p>
        </div>

        {/* Interactive Search & Filter Bar */}
        <div className="bg-white border border-brand-green/10 rounded-2xl p-4 shadow-sm mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Categories select pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-brand-green text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-brand-dark border border-transparent hover:border-slate-100"
                }`}
              >
                {cat === "All" ? "All Updates" : cat + "s"}
              </button>
            ))}
          </div>

          {/* Search box input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search news & tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 focus:border-brand-green rounded-xl py-2 pl-9 pr-4 text-xs font-medium placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-green transition-all"
            />
          </div>
        </div>

        {/* News Directory Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <article 
                key={article.id}
                className="bg-white rounded-3xl border border-brand-green/10 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full group"
              >
                {/* Thumbnail Header */}
                <div className="aspect-[16/10] w-full overflow-hidden border-b border-slate-100 relative shrink-0">
                  <img 
                    src={article.thumbnail} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider shadow-sm ${
                      article.category === "Milestone" ? "bg-amber-100 text-amber-800 border border-amber-200" :
                      article.category === "Publication" ? "bg-indigo-100 text-indigo-800 border border-indigo-200" :
                      article.category === "Event" ? "bg-teal-100 text-teal-800 border border-teal-200" :
                      "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    }`}>
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    {/* Metadata */}
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(article.date)}</span>
                    </div>

                    {/* Title */}
                    <h3 
                      onClick={() => handleSelectArticle(article.id)}
                      className="font-serif text-lg font-bold text-brand-dark group-hover:text-brand-green transition-colors cursor-pointer line-clamp-2 leading-snug mb-3"
                    >
                      {article.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed font-sans font-medium mb-6">
                      {article.summary}
                    </p>
                  </div>

                  {/* Footer links */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider truncate max-w-[60%]">
                      <User className="w-3 h-3 text-brand-green" />
                      <span className="truncate">{article.author}</span>
                    </div>
                    <button 
                      onClick={() => handleSelectArticle(article.id)}
                      className="text-xs font-mono font-extrabold uppercase tracking-widest text-brand-dark group-hover:text-brand-green transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Read Article</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-brand-green/10 rounded-3xl p-12 text-center max-w-md mx-auto">
            <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-serif text-lg font-bold text-brand-dark">No Articles Found</h3>
            <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
              We couldn't find any articles matching "{searchQuery}" under the category "{selectedCategory}". Try refining your keywords.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-6 bg-brand-dark text-white text-[10px] font-mono font-bold uppercase tracking-widest py-2.5 px-4 rounded-xl hover:bg-brand-green transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
