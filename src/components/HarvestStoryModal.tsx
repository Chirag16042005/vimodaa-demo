import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  CheckCircle2,
  Sparkles,
  MapPin,
  Eye,
  Award
} from 'lucide-react';

export interface HarvestStory {
  id: string;
  title: string;
  category: string;
  location: string;
  image: string;
  avatar: string;
  username: string;
  timeAgo: string;
  caption: string;
  curcuminOrSpec: string;
  productId: string;
  likesCount: number;
}

export const HARVEST_STORIES: HarvestStory[] = [
  {
    id: 'story-1',
    title: 'Sangli Turmeric Harvest',
    category: 'Spices & Herbs',
    location: 'Sangli, Maharashtra',
    image: '/src/assets/images/story_turmeric_reel_1791294666037.jpg',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    username: 'vimodaa_harvest',
    timeAgo: '15m ago',
    caption: 'Fresh Rajapuri turmeric rhizomes harvested today! Rich natural aroma with 4.8% tested curcumin purity. 100% organic soil nourished.',
    curcuminOrSpec: '4.8% Curcumin · Lab Grade A',
    productId: 'sp-01',
    likesCount: 1240,
  },
  {
    id: 'story-2',
    title: 'Byadgi Sun-Drying Yard',
    category: 'Red Chillies',
    location: 'Byadgi, Karnataka',
    image: '/src/assets/images/story_chilli_reel_1791294682391.jpg',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    username: 'vimodaa_spices',
    timeAgo: '1h ago',
    caption: 'Sun-drying thousands of kilos of deep crimson Byadgi chillies. Mild heat with brilliant 120+ ASTA red color value.',
    curcuminOrSpec: '120+ ASTA Color · Stemless',
    productId: 'sp-02',
    likesCount: 980,
  },
  {
    id: 'story-3',
    title: '1121 Parboiled Basmati',
    category: 'Cereals & Grains',
    location: 'Karnal, Haryana',
    image: '/src/assets/images/grains_pulses_cereals_1791281653848.jpg',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    username: 'vimodaa_grains',
    timeAgo: '3h ago',
    caption: 'Extra-long 8.35mm grain length Basmati rice bagged for global shipment. Fluffy non-sticky elongation after cooking.',
    curcuminOrSpec: '8.35mm Grain · 100% Pure',
    productId: 'gr-01',
    likesCount: 1560,
  },
  {
    id: 'story-4',
    title: 'ISO & NABL Lab Purity Test',
    category: 'Quality Assurance',
    location: 'Mumbai Export Lab',
    image: '/src/assets/images/social_lab_quality_1791292495424.jpg',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    username: 'vimodaa_qa',
    timeAgo: '5h ago',
    caption: 'Every batch undergoes rigorous HPLC testing for chemical residue, moisture control (<10%), and heavy metal screening.',
    curcuminOrSpec: 'ISO 22000 · FSSAI Approved',
    productId: 'sp-01',
    likesCount: 840,
  },
];

interface HarvestStoryModalProps {
  isOpen: boolean;
  initialIndex: number;
  onClose: () => void;
  onSelectProduct: (productId: string) => void;
}

export const HarvestStoryModal: React.FC<HarvestStoryModalProps> = ({
  isOpen,
  initialIndex,
  onClose,
  onSelectProduct,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [userLiked, setUserLiked] = useState<Record<string, boolean>>({});
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; left: number }[]>([]);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setProgress(0);
  }, [initialIndex, isOpen]);

  // Story progress timer
  useEffect(() => {
    if (!isOpen || isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < HARVEST_STORIES.length - 1) {
            setCurrentIndex((i) => i + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2; // 5 seconds total duration per story
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, isPaused, currentIndex, onClose]);

  if (!isOpen) return null;

  const story = HARVEST_STORIES[currentIndex];
  const currentLikes = (likes[story.id] ?? story.likesCount) + (userLiked[story.id] ? 1 : 0);

  const handleLike = () => {
    const isLiked = !userLiked[story.id];
    setUserLiked((prev) => ({ ...prev, [story.id]: isLiked }));

    if (isLiked) {
      // Spawn animated floating heart effect
      const newHeart = { id: Date.now(), left: Math.random() * 60 + 20 };
      setFloatingHearts((prev) => [...prev, newHeart]);
      setTimeout(() => {
        setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
      }, 1200);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < HARVEST_STORIES.length - 1) {
      setCurrentIndex((i) => i + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4">
      <div
        className="relative w-full max-w-sm h-[85vh] max-h-[720px] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-amber-500/30 flex flex-col justify-between"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Story Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={story.image}
            alt={story.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90" />
        </div>

        {/* Floating Heart Particles */}
        {floatingHearts.map((heart) => (
          <div
            key={heart.id}
            style={{ left: `${heart.left}%` }}
            className="absolute bottom-24 z-30 pointer-events-none animate-bounce text-red-500 text-3xl transition-all duration-1000 transform -translate-y-24 opacity-0"
          >
            ❤️
          </div>
        ))}

        {/* Top Story Header & Progress Bars */}
        <div className="relative z-20 p-4 space-y-3">
          {/* Progress Indicators */}
          <div className="flex gap-1.5">
            {HARVEST_STORIES.map((s, idx) => (
              <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-all duration-100 ease-linear"
                  style={{
                    width:
                      idx < currentIndex
                        ? '100%'
                        : idx === currentIndex
                        ? `${progress}%`
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* User Info Bar */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-emerald-500 to-amber-300">
                <img
                  src={story.avatar}
                  alt={story.username}
                  className="w-full h-full object-cover rounded-full border border-black"
                />
              </div>
              <div>
                <div className="font-bold text-xs flex items-center gap-1.5 text-white">
                  <span>@{story.username}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                  <span className="text-[10px] text-white/70 font-mono">• {story.timeAgo}</span>
                </div>
                <div className="text-[10px] text-amber-300 flex items-center gap-1 font-medium">
                  <MapPin className="w-2.5 h-2.5" /> {story.location}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 bg-black/40 hover:bg-black/70 rounded-full text-white backdrop-blur-xs cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tap Nav Click Areas */}
        <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={handlePrev} />
        <div className="absolute inset-y-0 right-0 w-1/3 z-10" onClick={handleNext} />

        {/* Story Bottom Interactive Drawer */}
        <div className="relative z-20 p-4 space-y-3">
          {/* Harvest Spec Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/90 border border-amber-400/50 text-amber-300 text-[11px] font-bold font-mono backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>{story.curcuminOrSpec}</span>
          </div>

          {/* Title & Caption */}
          <div>
            <h3 className="font-serif-display text-2xl font-bold text-white leading-tight">
              {story.title}
            </h3>
            <p className="text-xs text-slate-200 mt-1 leading-relaxed font-sans line-clamp-3">
              {story.caption}
            </p>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-between gap-2 border-t border-white/20">
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className="flex items-center gap-1.5 text-xs text-white font-bold bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl backdrop-blur-md cursor-pointer transition-all"
              >
                <Heart
                  className={`w-4 h-4 ${
                    userLiked[story.id] ? 'fill-red-500 text-red-500 scale-110' : 'text-white'
                  }`}
                />
                <span className="font-mono">{currentLikes}</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Story link copied to clipboard!');
                }}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => {
                onClose();
                onSelectProduct(story.productId);
              }}
              className="flex-1 max-w-[160px] py-2.5 bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-bold rounded-xl shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Shop Harvest</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
