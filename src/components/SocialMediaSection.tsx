import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
  Send,
  ExternalLink,
  CheckCircle2,
  Globe2
} from 'lucide-react';

interface SocialPost {
  id: string;
  platform: 'Instagram' | 'LinkedIn' | 'Facebook';
  image: string;
  author: string;
  handle: string;
  date: string;
  caption: string;
  hashtags: string[];
  initialLikes: number;
  commentsCount: number;
}

const INITIAL_POSTS: SocialPost[] = [
  {
    id: 'post-1',
    platform: 'Instagram',
    image: '/images/social_farm_harvest_1791292432241.jpg',
    author: 'Vimodaa Agro LLP',
    handle: '@vimodaaagro',
    date: '2 hours ago',
    caption: 'Fresh Rajapuri turmeric harvest underway in Sangli & Kerala farms! Every rhizome hand-selected for high curcumin content (4.5%+). Rooted in India, Relished Globally.',
    hashtags: ['#FarmToFork', '#VimodaaAgro', '#TurmericExport', '#PureSourcing'],
    initialLikes: 248,
    commentsCount: 18,
  },
  {
    id: 'post-2',
    platform: 'Instagram',
    image: '/images/social_spice_market_1791292463130.jpg',
    author: 'Vimodaa Agro LLP',
    handle: '@vimodaaagro',
    date: '1 day ago',
    caption: 'Sun-drying premium Byadgi red chillies in Karnataka. Renowned for rich natural crimson color (120+ ASTA) and mild aromatic heat.',
    hashtags: ['#ByadgiChilli', '#SpicesExport', '#IndianSpices', '#NaturalGoodness'],
    initialLikes: 412,
    commentsCount: 34,
  },
  {
    id: 'post-3',
    platform: 'LinkedIn',
    image: '/images/social_export_loading_1791292478198.jpg',
    author: 'Vimodaa Agro LLP',
    handle: 'vimodaa-agro-llp',
    date: '2 days ago',
    caption: 'Milestone Dispatch: 20 Metric Tons (1 x 20ft FCL) of 1121 Parboiled Basmati Rice packed in eco-friendly 25kg export jute bags en route to Jebel Ali Port, Dubai.',
    hashtags: ['#AgroExport', '#BasmatiRice', '#GlobalTrade', '#JebelAliPort'],
    initialLikes: 589,
    commentsCount: 42,
  },
  {
    id: 'post-4',
    platform: 'Facebook',
    image: '/images/social_lab_quality_1791292495424.jpg',
    author: 'Vimodaa Agro LLP',
    handle: '@vimodaaagroofficial',
    date: '3 days ago',
    caption: 'Quality Assurance First: Rigorous ASTA color, moisture, and chemical residue testing in our lab prior to container sealing. Certified ISO 22000 & FSSAI.',
    hashtags: ['#QualityAssurance', '#ISO22000', '#PurityGuaranteed', '#AgroProduce'],
    initialLikes: 320,
    commentsCount: 22,
  },
];

export const SocialMediaSection: React.FC = () => {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [sharedPostId, setSharedPostId] = useState<string | null>(null);

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = (id: string) => {
    setSharedPostId(id);
    setTimeout(() => setSharedPostId(null), 2000);
  };

  return (
    <section className="py-14 bg-[#f2ede4] border-t border-b border-[#ebdcc9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header & Social Handles Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#ebdcc9] pb-4">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-widest text-[#8c501e] flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-[#d97706]" /> Join Our Global Agro Community
            </div>
            <h2 className="font-serif-display text-3xl font-bold text-[#1b4d3e]">
              Follow Our Journey @VimodaaAgro
            </h2>
            <p className="text-xs text-slate-600 max-w-lg">
              Behind the scenes at our harvest farms, spice drying yards, lab quality checks, and international container dispatches.
            </p>
          </div>

          {/* Social Platform Direct Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-bold text-xs rounded-xl shadow-xs hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <Instagram className="w-4 h-4" /> Instagram
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#0077b5] text-white font-bold text-xs rounded-xl shadow-xs hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#1877f2] text-white font-bold text-xs rounded-xl shadow-xs hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <Facebook className="w-4 h-4" /> Facebook
            </a>

            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#ff0000] text-white font-bold text-xs rounded-xl shadow-xs hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <Youtube className="w-4 h-4" /> YouTube
            </a>

            <a
              href="https://wa.me/917718812732"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#25d366] text-white font-bold text-xs rounded-xl shadow-xs hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" /> WhatsApp Desk
            </a>
          </div>
        </div>

        {/* Social Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post) => {
            const isLiked = !!likedPosts[post.id];
            const currentLikes = post.initialLikes + (isLiked ? 1 : 0);

            return (
              <div
                key={post.id}
                className="bg-[#fdfbf7] border border-[#ebdcc9] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Post Author Header */}
                  <div className="p-3 border-b border-[#ebdcc9]/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#1b4d3e] text-amber-400 font-bold font-serif-display text-xs flex items-center justify-center border border-amber-500/30">
                        V
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 leading-none">
                          {post.author}
                        </div>
                        <div className="text-[10px] text-slate-500">{post.handle}</div>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono">{post.date}</span>
                  </div>

                  {/* Post Image */}
                  <div className="relative aspect-square bg-[#f2ede4] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.caption}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                      {post.platform}
                    </div>
                  </div>

                  {/* Post Caption */}
                  <div className="p-3 space-y-2">
                    <p className="text-xs text-slate-800 leading-relaxed line-clamp-3">
                      {post.caption}
                    </p>

                    <div className="flex flex-wrap gap-1 text-[10px] font-bold text-[#1b4d3e]">
                      {post.hashtags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Social Interaction Bar */}
                <div className="p-3 bg-[#f2ede4]/60 border-t border-[#ebdcc9]/80 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1 font-mono text-xs cursor-pointer transition-colors ${
                        isLiked ? 'text-red-600 font-bold' : 'hover:text-slate-900'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-600 text-red-600' : ''}`} />
                      <span>{currentLikes}</span>
                    </button>

                    <div className="flex items-center gap-1 font-mono text-xs text-slate-500">
                      <MessageCircle className="w-4 h-4 text-slate-400" />
                      <span>{post.commentsCount}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleShare(post.id)}
                    className="p-1 hover:text-[#1b4d3e] text-slate-500 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                  >
                    {sharedPostId === post.id ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Copied
                      </span>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" /> Share
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Social Banner Callout */}
        <div className="bg-[#1b4d3e] text-white rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 border border-amber-500/20 shadow-md">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-amber-400 font-bold text-xs uppercase tracking-widest">
              Tag Us On Your Harvest & Kitchen Creations
            </div>
            <h3 className="font-serif-display text-2xl font-bold text-amber-100">
              #VimodaaAgro #GoodnessTravelsFar
            </h3>
            <p className="text-xs text-slate-200">
              Tag us in your agricultural export stories or kitchen creations to be featured on our official channels!
            </p>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer shrink-0"
          >
            Follow @VimodaaAgro <ExternalLink className="w-3.5 h-3.5 text-amber-200" />
          </a>
        </div>
      </div>
    </section>
  );
};
