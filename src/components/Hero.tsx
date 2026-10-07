import React from 'react';
import { Leaf, ArrowRight, ShieldCheck, Award, Globe2, Sparkles, CheckCircle2, Truck } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onOpenTracking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onOpenTracking }) => {
  return (
    <section className="relative bg-[#12382c] text-[#f2ede4] py-14 sm:py-16 md:py-20 overflow-hidden border-b border-[#ebdcc9]">
      {/* Background Hero Image with Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero_vimodaa_farm_1791281625779.jpg"
          alt="Vimodaa Agro Farm Sourcing"
          className="w-full h-full object-cover opacity-25"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#12382c] via-[#12382c]/90 to-[#12382c]/75" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Top Subtitle Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/90 border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Rooted in India · Sourced for Global Excellence</span>
            </div>

            {/* Display Headline */}
            <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-amber-100 leading-tight">
              GOODNESS <span className="text-[#d97706] italic font-normal">TRAVELS</span> FAR
            </h1>

            <p className="font-serif-display text-xl sm:text-2xl text-amber-200/90 italic font-medium">
              From Indian Farms to Kitchens Around the World
            </p>

            <p className="text-slate-200 text-xs sm:text-sm max-w-xl leading-relaxed font-sans">
              Discover export-quality Rajapuri Turmeric, Byadgi Chillies, Tellicherry Black Pepper, 1121 Basmati Rice, Pulses, and Botanical Herbs sourced directly from verified farming cooperatives with lab purity certification.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="px-6 py-3.5 bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer group"
              >
                Explore Product Catalog
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-200" />
              </button>

              <button
                onClick={onOpenTracking}
                className="px-6 py-3.5 bg-emerald-950/80 hover:bg-emerald-900 text-amber-200 border border-amber-500/30 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <Truck className="w-4 h-4 text-amber-400" /> Track Shipment
              </button>
            </div>

            {/* Quality Badges Row */}
            <div className="pt-6 border-t border-emerald-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-amber-200/90 font-medium">
              <div className="flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-amber-400 shrink-0" />
                <span>100% Farm Traced</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Lab Certified Pure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>40+ Global Markets</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>FSSAI & APEDA</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase Floating Card */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="bg-[#1b4d3e]/90 border border-amber-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between text-xs border-b border-amber-500/20 pb-2">
                <span className="font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" /> Harvest Spotlight
                </span>
                <span className="font-mono text-amber-200 text-[10px]">HS 0910.30</span>
              </div>

              <div className="relative rounded-xl overflow-hidden aspect-4/3 border border-amber-500/20">
                <img
                  src="/images/spice_turmeric_chilli_1791281639688.jpg"
                  alt="Vimodaa Rajapuri Turmeric"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-[#12382c]/90 text-amber-300 text-[10px] font-bold font-mono px-2 py-1 rounded border border-amber-400/30">
                  4.5%+ Curcumin Verified
                </div>
              </div>

              <div>
                <h3 className="font-serif-display text-xl font-bold text-amber-100">
                  Rajapuri & Alleppey Turmeric
                </h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                  Hand-selected turmeric rhizomes with vibrant natural aroma and zero chemical dye additive.
                </p>
              </div>

              <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between text-xs">
                <span className="text-amber-200 font-mono font-bold">Starts @ ₹180 / kg</span>
                <button
                  onClick={onExploreClick}
                  className="px-3 py-1.5 bg-[#d97706] hover:bg-[#b45309] text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Order Sample
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
