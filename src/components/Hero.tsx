import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  Heart,
  MessageCircle,
  Share2,
  CheckCircle2,
  Play,
  ShieldCheck,
  Globe2,
  Flame,
  Leaf,
  Award,
  TrendingUp,
  ShoppingBag
} from 'lucide-react';
import { HARVEST_STORIES } from './HarvestStoryModal';

interface HeroProps {
  onExploreClick: () => void;
  onOpenStory: (storyIndex: number) => void;
  onSelectProductById?: (productId: string) => void;
}

interface SpiceMood {
  id: string;
  name: string;
  tagline: string;
  image: string;
  spec: string;
  origin: string;
  productId: string;
  badge: string;
  pricePerKg: number;
}

const SPICE_MOODS: SpiceMood[] = [
  {
    id: 'turmeric',
    name: 'Rajapuri & Alleppey Turmeric',
    tagline: 'High Curcumin 4.8%+ · Vibrant Golden Purity',
    image: '/src/assets/images/spice_turmeric_chilli_1791281639688.jpg',
    spec: '4.8% Curcumin · NABL Lab Certified',
    origin: 'Sangli & Kerala Farms',
    productId: 'sp-01',
    badge: '👑 #1 Bestseller',
    pricePerKg: 280,
  },
  {
    id: 'chilli',
    name: 'Byadgi Red Chilli Whole',
    tagline: 'Aromatic Crimson Heat · 120+ ASTA Color',
    image: '/src/assets/images/story_chilli_reel_1791294682391.jpg',
    spec: '120+ ASTA Color · Sun-Dried',
    origin: 'Byadgi, Karnataka',
    productId: 'sp-02',
    badge: '🔥 High Color Export',
    pricePerKg: 340,
  },
  {
    id: 'basmati',
    name: '1121 Parboiled Basmati Rice',
    tagline: 'Extra Long 8.35mm Grain · Fragrant Royal Feast',
    image: '/src/assets/images/grains_pulses_cereals_1791281653848.jpg',
    spec: '8.35mm Grain Length · Aged 1 Year',
    origin: 'Karnal, Haryana',
    productId: 'gr-01',
    badge: '🍚 Royal Grain Choice',
    pricePerKg: 140,
  },
  {
    id: 'wellness',
    name: 'W240 King Cashew Nuts & Sesame',
    tagline: 'Whole White Kernels · Natural High Protein',
    image: '/src/assets/images/oilseeds_herbs_1791281666870.jpg',
    spec: 'Grade W240 · Vacuum Sealed',
    origin: 'Panruti & Gujarat',
    productId: 'os-02',
    badge: '🌿 Premium Grade',
    pricePerKg: 850,
  },
];

const RECENT_ACTIVITIES = [
  { user: 'Aarav M.', location: 'Delhi', item: '2kg Rajapuri Turmeric Powder', time: '2m ago' },
  { user: 'Yusuf K.', location: 'Dubai, UAE', item: '25kg 1121 Parboiled Basmati', time: '5m ago' },
  { user: 'Meera S.', location: 'Bengaluru', item: '1kg Byadgi Crimson Chilli', time: '9m ago' },
  { user: 'Elena R.', location: 'London, UK', item: '5kg W240 Cashew Nuts', time: '14m ago' },
];

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onOpenStory,
  onSelectProductById,
}) => {
  const [activeMoodIndex, setActiveMoodIndex] = useState(0);
  const [activityIndex, setActivityIndex] = useState(0);
  const [likesCount, setLikesCount] = useState(1840);
  const [hasLiked, setHasLiked] = useState(false);

  // Cycle recent live social activity toast
  useEffect(() => {
    const timer = setInterval(() => {
      setActivityIndex((prev) => (prev + 1) % RECENT_ACTIVITIES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const activeMood = SPICE_MOODS[activeMoodIndex];
  const currentActivity = RECENT_ACTIVITIES[activityIndex];

  return (
    <section className="relative bg-[#0b231b] text-[#f2ede4] overflow-hidden border-b border-[#ebdcc9]/30 pt-4 pb-12 lg:pb-16">
      {/* Background Gradient Mesh & Subtle Pattern */}
      <div className="absolute inset-0 z-0 opacity-30 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#d97706]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 1. INTERACTIVE HARVEST STORY REELS BAR (Instagram Style) */}
        <div className="bg-emerald-950/70 border border-emerald-800/80 rounded-2xl p-3 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between gap-2 mb-2 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono">
                Live Harvest Stories & Field Reels
              </span>
            </div>
            <span className="text-[11px] text-emerald-200/70 font-medium hidden sm:inline">
              Click any story to watch live harvest video reel ➔
            </span>
          </div>

          <div className="flex items-center gap-4 overflow-x-auto pb-1 scrollbar-none">
            {HARVEST_STORIES.map((story, idx) => (
              <button
                key={story.id}
                onClick={() => onOpenStory(idx)}
                className="group flex flex-col items-center gap-1.5 shrink-0 cursor-pointer text-center"
              >
                {/* Story Circle Avatar Ring */}
                <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-emerald-400 to-amber-300 group-hover:scale-105 transition-transform duration-300 shadow-md">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#0b231b] relative">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-4 h-4 text-white fill-white" />
                    </div>
                  </div>

                  {/* Micro Live Badge */}
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[8px] font-bold font-mono px-1.5 py-0.2 rounded-full uppercase border border-white">
                    REEL
                  </span>
                </div>

                <span className="text-[10px] font-bold text-slate-200 group-hover:text-amber-300 transition-colors truncate max-w-[70px]">
                  {story.title.split(' ')[0]}
                </span>
              </button>
            ))}

            {/* Social Share Callout Ring */}
            <a
              href="#social-section"
              className="group flex flex-col items-center gap-1.5 shrink-0 cursor-pointer text-center"
            >
              <div className="w-16 h-16 rounded-full p-0.5 bg-dashed border-2 border-amber-400/60 flex items-center justify-center bg-emerald-900/40 text-amber-300 group-hover:bg-amber-500 group-hover:text-slate-900 transition-all">
                <Globe2 className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-amber-300">#VimodaaAgro</span>
            </a>
          </div>
        </div>

        {/* 2. MAIN HERO TWO-COLUMN MODERN SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Modern Social Typography & CTA */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Live Social Proof Badge Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/80 border border-amber-400/40 text-amber-200 text-xs font-semibold backdrop-blur-md shadow-md">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                ★ 4.9/5
              </span>
              <span className="opacity-40">•</span>
              <span>12,400+ Orders Dispatched</span>
              <span className="opacity-40">•</span>
              <span className="text-emerald-300 font-mono text-[11px]">100% Direct Farm Trace</span>
            </div>

            {/* Display Modern Bold Headline */}
            <div className="space-y-2">
              <h1 className="font-serif-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#fdfbf7] leading-[1.05]">
                PURE HARVEST. <br />
                <span className="text-amber-400 italic font-normal">REAL PEOPLE.</span>
              </h1>
              <div className="font-mono text-xl sm:text-2xl font-bold text-emerald-300 flex items-center gap-2">
                <span>#GoodnessTravelsFar</span>
                <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
              </div>
            </div>

            {/* Subtext */}
            <p className="text-slate-200 text-sm sm:text-base max-w-xl leading-relaxed font-sans">
              Hand-harvested Rajapuri Turmeric, Byadgi Red Chillies, 1121 Parboiled Basmati, and Ayurvedic Produce—ethically sourced straight from accredited Indian farmers to global kitchens.
            </p>

            {/* Interactive Primary Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreClick}
                className="px-8 py-4 bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 cursor-pointer group"
              >
                Explore Harvest Storefront
                <ArrowRight className="w-4 h-4 text-amber-200 group-hover:translate-x-1.5 transition-transform" />
              </button>

              {/* Social Media Heart Reaction Button */}
              <button
                onClick={() => {
                  setHasLiked(!hasLiked);
                  setLikesCount((prev) => prev + (hasLiked ? -1 : 1));
                }}
                className={`px-5 py-3.5 rounded-xl border transition-all text-xs font-bold flex items-center gap-2 cursor-pointer backdrop-blur-md ${
                  hasLiked
                    ? 'bg-red-950/80 border-red-500/80 text-red-200 shadow-md scale-105'
                    : 'bg-emerald-900/50 border-emerald-700/60 text-slate-200 hover:bg-emerald-900/80'
                }`}
              >
                <Heart className={`w-4 h-4 ${hasLiked ? 'fill-red-500 text-red-500' : 'text-amber-400'}`} />
                <span>{likesCount.toLocaleString()} Community Loves</span>
              </button>
            </div>

            {/* Unboxed Purity Badges Row */}
            <div className="pt-4 border-t border-emerald-800/60 flex flex-wrap items-center gap-4 text-xs text-amber-200/80 font-medium">
              <span className="flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-amber-400" /> Farm-to-Fork Trace
              </span>
              <span aria-hidden="true" className="opacity-30">·</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" /> NABL & ISO Certified
              </span>
              <span aria-hidden="true" className="opacity-30">·</span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" /> 100% Fair Farmer Trade
              </span>
            </div>
          </div>

          {/* Right Column: INTERACTIVE SPICE MOOD & HARVEST SPOTLIGHT CARD */}
          <div className="lg:col-span-5 space-y-3">
            {/* Interactive Mood Selector Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-emerald-950/80 p-1.5 rounded-xl border border-emerald-800/80">
              {SPICE_MOODS.map((mood, idx) => (
                <button
                  key={mood.id}
                  onClick={() => setActiveMoodIndex(idx)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all text-left cursor-pointer flex items-center gap-2 ${
                    activeMoodIndex === idx
                      ? 'bg-[#d97706] text-white shadow-md'
                      : 'text-slate-300 hover:bg-emerald-900/60'
                  }`}
                >
                  <span className="truncate">{mood.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Featured Interactive Spotlight Glass Card */}
            <div className="bg-[#12382c]/90 backdrop-blur-md border border-amber-400/30 rounded-2xl p-5 shadow-2xl space-y-4 transition-all duration-500 relative overflow-hidden">
              <div className="relative rounded-xl overflow-hidden aspect-4/3 border border-emerald-800/80">
                <img
                  src={activeMood.image}
                  alt={activeMood.name}
                  className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
                />

                {/* Badge Overlay */}
                <div className="absolute top-2.5 left-2.5 bg-[#0b231b]/90 text-amber-300 text-[11px] font-bold font-mono px-2.5 py-1 rounded-md backdrop-blur-xs border border-amber-400/40">
                  {activeMood.badge}
                </div>

                <div className="absolute bottom-2.5 right-2.5 bg-black/70 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
                  {activeMood.origin}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-300 font-bold uppercase tracking-wider text-xs">
                    {activeMood.name}
                  </span>
                  <span className="text-emerald-300 font-mono text-[11px] font-bold">
                    ₹{activeMood.pricePerKg}/kg
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {activeMood.tagline}
                </p>

                <div className="pt-2 border-t border-emerald-800/60 flex items-center justify-between text-xs">
                  <span className="text-emerald-200 font-mono text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    {activeMood.spec}
                  </span>

                  <button
                    onClick={() => {
                      if (onSelectProductById) {
                        onSelectProductById(activeMood.productId);
                      } else {
                        onExploreClick();
                      }
                    }}
                    className="px-3 py-1.5 bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> View Harvest
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. LIVE SOCIAL ACTIVITY TOAST (Bottom Floating Pill) */}
        <div className="inline-flex items-center gap-3 bg-emerald-950/90 border border-amber-500/40 px-4 py-2 rounded-2xl backdrop-blur-md shadow-lg text-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <div className="flex items-center gap-1 text-slate-200">
            <span className="font-bold text-amber-300">{currentActivity.user}</span>
            <span className="text-slate-400">({currentActivity.location})</span>
            <span>ordered</span>
            <span className="font-bold text-white">{currentActivity.item}</span>
            <span className="text-[10px] text-slate-400 font-mono">· {currentActivity.time}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
