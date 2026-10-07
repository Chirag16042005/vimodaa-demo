import React from 'react';
import { Phone, Mail, MapPin, Globe, Leaf, Award, ShieldCheck, Instagram, Linkedin, Facebook, Youtube, Send } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#12382c] text-[#f2ede4] border-t border-[#ebdcc9] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1b4d3e] text-amber-400 flex items-center justify-center font-serif-display text-xl font-bold border border-[#d97706]">
                V
              </div>
              <div>
                <div className="font-serif-display text-2xl font-bold tracking-wider text-amber-100">
                  VIMODAA AGRO LLP
                </div>
                <div className="text-[10px] tracking-widest uppercase font-semibold text-amber-400/90">
                  Global Roots · Natural Goodness
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm font-sans">
              Export-grade Indian Spices, Cereals, Pulses, Oilseeds, Mushrooms, Dehydrated Produce, and Ayurvedic Botanicals. Farm-direct sourcing with full lab analysis and export compliance.
            </p>

            <div className="text-xs font-serif-display italic text-amber-300">
              "Goodness Travels Far — From Farms to Kitchens Around the World"
            </div>

            {/* Social Links Bar in Footer */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">Follow Us:</span>
              <div className="flex items-center gap-2">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-1.5 bg-[#1b4d3e] hover:bg-[#d97706] text-amber-200 rounded-lg transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-1.5 bg-[#1b4d3e] hover:bg-[#d97706] text-amber-200 rounded-lg transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-1.5 bg-[#1b4d3e] hover:bg-[#d97706] text-amber-200 rounded-lg transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-1.5 bg-[#1b4d3e] hover:bg-[#d97706] text-amber-200 rounded-lg transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
                <a href="https://wa.me/917718812732" target="_blank" rel="noopener noreferrer" className="p-1.5 bg-[#1b4d3e] hover:bg-[#d97706] text-amber-200 rounded-lg transition-colors">
                  <Send className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Category Links */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Product Categories
            </div>
            <ul className="text-xs space-y-2 text-slate-300 font-medium">
              <li>Spices & Seasonings (Turmeric, Chilli, Cardamom)</li>
              <li>Grains, Cereals & Basmati Rice</li>
              <li>Pulses & Legumes (Chickpeas, Toor, Moong)</li>
              <li>Oilseeds & Nuts (Sesame, Groundnuts, Cashew)</li>
              <li>Fresh & Dried Mushrooms (Oyster, Button)</li>
              <li>Dehydrated Garlic, Onion & Processed Foods</li>
              <li>Ayurvedic & Herbal (Ashwagandha, Moringa)</li>
            </ul>
          </div>

          {/* Contact Details from Brochure */}
          <div className="md:col-span-4 space-y-3 bg-[#1b4d3e]/80 p-5 rounded-2xl border border-amber-500/20">
            <div className="text-xs font-bold uppercase tracking-widest text-amber-400 border-b border-amber-500/20 pb-2">
              Global Export Desk
            </div>

            <div className="text-xs space-y-2 text-slate-200">
              <div className="font-bold text-amber-200">
                Ms. Yogita C. Thakur (Managing Partner)
              </div>

              <div className="flex items-center gap-2 font-mono">
                <Phone className="w-3.5 h-3.5 text-[#d97706]" /> +91 77188 12732 / +91 91371 09996
              </div>

              <div className="flex items-center gap-2 font-mono">
                <Mail className="w-3.5 h-3.5 text-[#d97706]" /> info@vimodaaagro.com
              </div>

              <div className="flex items-center gap-2 font-mono">
                <Globe className="w-3.5 h-3.5 text-[#d97706]" /> www.vimodaaagro.com
              </div>

              <div className="flex items-start gap-2 pt-1 border-t border-emerald-800 text-[11px] text-slate-300">
                <MapPin className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />
                <span>
                  Plot No. 2, Sector 9, Khanda Colony, New Panvel (W), Maharashtra - 410206, India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Separator & Footer Bottom */}
        <div className="pt-6 border-t border-emerald-900/80 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-mono">
          <div>
            © {new Date().getFullYear()} VIMODAA AGRO LLP. All rights reserved.
          </div>

          <div className="flex items-center gap-3">
            <span>PEOPLE</span>
            <span>·</span>
            <span>PLANET</span>
            <span>·</span>
            <span className="text-amber-400 font-bold">PURE POSSIBILITIES</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
