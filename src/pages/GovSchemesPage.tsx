import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Search } from 'lucide-react';
import { GOV_SCHEMES, SCHEME_CATEGORIES, type GovScheme } from '../data/govSchemes';
import { GlassCard, FadeIn } from '../components/ui/primitives';

export default function GovSchemesPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = GOV_SCHEMES.filter((s) => {
    const matchCat = activeCategory === 'all' || s.category === activeCategory;
    const matchSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-text-primary">Government Schemes</h1>
          <p className="text-xs text-text-muted mt-1">Discover subsidies, insurance, credit & training programs for farmers</p>
        </div>
        <Link to="/marketplace" className="flex items-center gap-1 text-[10px] font-bold text-soil-gold hover:underline">
          <ArrowLeft className="w-3 h-3" /> Back
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-soil-gold absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search schemes..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm focus:outline-none focus:ring-2 focus:ring-soil-emerald placeholder:text-text-muted/50"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition cursor-pointer ${
            activeCategory === 'all' ? 'bg-soil-gold/25 text-soil-gold' : 'bg-white/5 text-text-muted hover:bg-white/10'
          }`}
        >
          All Schemes
        </button>
        {SCHEME_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition cursor-pointer flex items-center gap-1 ${
              activeCategory === cat.id ? 'bg-soil-gold/25 text-soil-gold' : 'bg-white/5 text-text-muted hover:bg-white/10'
            }`}
          >
            <span>{cat.icon}</span> {cat.label}
          </button>
        ))}
      </div>

      {/* Schemes */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <p className="text-sm text-text-muted">No schemes found matching your criteria.</p>
          </GlassCard>
        ) : (
          filtered.map((scheme, i) => (
            <FadeIn key={scheme.id} delay={i * 0.03}>
              <GlassCard className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display font-bold text-sm text-text-primary">{scheme.name}</h3>
                      <span className="text-[8px] font-bold bg-soil-gold/15 text-soil-gold px-2 py-0.5 rounded-full uppercase">
                        {scheme.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-text-muted mt-0.5">{scheme.ministry}</p>
                  </div>
                  <a
                    href={scheme.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-soil-emerald/20 text-emerald-300 hover:bg-soil-emerald/40 transition shrink-0"
                    title="Visit Official Website"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed">{scheme.description}</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  <div className="glass-panel-sm p-2 space-y-1">
                    <div className="text-[9px] font-bold text-soil-gold uppercase">Benefits</div>
                    {scheme.benefits.map((b, j) => (
                      <div key={j} className="text-[10px] text-text-primary flex items-start gap-1">
                        <span className="text-emerald-400 mt-0.5">•</span> {b}
                      </div>
                    ))}
                  </div>
                  <div className="glass-panel-sm p-2 space-y-1">
                    <div className="text-[9px] font-bold text-soil-gold uppercase">Eligibility</div>
                    <div className="text-[10px] text-text-primary">{scheme.eligibility}</div>
                    <div className="text-[9px] font-bold text-soil-gold uppercase mt-1">Deadline</div>
                    <div className="text-[10px] text-text-primary">{scheme.deadline}</div>
                  </div>
                </div>
              </GlassCard>
            </FadeIn>
          ))
        )}
      </div>
    </div>
  );
}
