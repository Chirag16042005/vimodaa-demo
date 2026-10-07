import React from 'react';
import { Leaf, ArrowRight, ShieldCheck, Award, Globe2, Sparkles } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  return (
    <section className="relative bg-[#1b4d3e] text-[#f2ede4] py-12 md:py-16 overflow-hidden border-b border-[#ebdcc9]">
      {/* Subtle Background Overlay Image */}
      <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay">
        <img
          src="/src/assets/images/hero_vimodaa_farm_1791281625779.jpg"
          alt="Vimodaa Agro Sourcing"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        {/* Quiet Subtitle Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/80 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Leaf className="w-3.5 h-3.5 text-amber-400" /> Export-Quality Indian Spices, Grains & Botanicals
        </div>

        {/* Display Headline */}
        <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-amber-100 leading-tight">
          GOODNESS <span className="text-[#d97706] italic font-normal">TRAVELS</span> FAR
        </h1>

        <p className="font-serif-display text-lg sm:text-2xl text-amber-200/90 italic max-w-2xl mx-auto">
          From Farms to Kitchens Around the World
        </p>

        <p className="text-slate-200 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Rooted in India. Relished Globally. Direct farm sourcing of Turmeric, Byadgi Chilli, Basmati Rice, Pulses, Oilseeds, and Ayurvedic produce with full lab compliance.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onExploreClick}
            className="px-6 py-3 bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer group"
          >
            Explore Catalog
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-200" />
          </button>
        </div>

        {/* Clean Unboxed Quality Trust Markers */}
        <div className="pt-6 border-t border-emerald-800/80 max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-4 text-xs text-amber-200/90 font-medium">
          <span className="flex items-center gap-1">
            <Leaf className="w-3.5 h-3.5 text-amber-400" /> Pure Sourcing
          </span>
          <span aria-hidden="true" className="opacity-40">·</span>
          <span className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-400" /> Trusted Quality
          </span>
          <span aria-hidden="true" className="opacity-40">·</span>
          <span className="flex items-center gap-1">
            <Globe2 className="w-3.5 h-3.5 text-amber-400" /> Global Reach
          </span>
          <span aria-hidden="true" className="opacity-40">·</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> ISO & FSSAI Certified
          </span>
        </div>
      </div>
    </section>
  );
};
