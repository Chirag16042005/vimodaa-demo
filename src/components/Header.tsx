import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  Globe,
  Truck,
  Sparkles,
  Phone,
  Mail,
  UserCheck,
  FileText,
  Menu,
  X
} from 'lucide-react';
import { Currency, CURRENCY_RATES } from '../types';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  currency: Currency;
  onCurrencyChange: (curr: Currency) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenTracking: () => void;
  onToggleAdmin: () => void;
  isAdminView: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  currency,
  onCurrencyChange,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onOpenTracking,
  onToggleAdmin,
  isAdminView,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    'All',
    'Spices & Herbs',
    'Cereals & Grains',
    'Pulses & Legumes',
    'Oilseeds & Nuts',
    'Mushrooms & Fungi',
    'Processed Foods',
    'Ayurvedic & Herbal',
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#f9f7f2]/95 backdrop-blur-md border-b border-[#ebdcc9] transition-all">
      {/* Top Quiet Utility Bar */}
      <div className="bg-[#1b4d3e] text-[#f2ede4] text-xs py-1.5 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4 text-emerald-100/90 font-medium text-[11px]">
          <span className="flex items-center gap-1">
            <Phone className="w-3 h-3 text-[#d97706]" /> +91 77188 12732
          </span>
          <span className="hidden sm:inline opacity-40">•</span>
          <span className="hidden sm:flex items-center gap-1">
            <Mail className="w-3 h-3 text-[#d97706]" /> info@vimodaaagro.com
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <button
            onClick={() => {
              const el = document.getElementById('social-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1"
          >
            Social Media
          </button>

          <span className="opacity-30">•</span>

          <button
            onClick={onOpenTracking}
            className="hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Truck className="w-3 h-3" /> Track Order
          </button>

          <span className="opacity-30">•</span>

          <button
            onClick={onToggleAdmin}
            className={`px-2 py-0.5 rounded font-medium cursor-pointer transition-colors ${
              isAdminView
                ? 'bg-amber-400 text-slate-900 font-bold'
                : 'text-emerald-100 hover:text-white'
            }`}
          >
            {isAdminView ? 'Exit Admin' : 'Admin'}
          </button>

          {/* Currency Selector */}
          <div className="flex items-center gap-1 bg-emerald-900/60 px-1.5 py-0.5 rounded border border-emerald-700/50">
            <Globe className="w-3 h-3 text-emerald-300" />
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as Currency)}
              className="bg-transparent text-white font-mono text-[11px] focus:outline-hidden cursor-pointer"
            >
              {(Object.keys(CURRENCY_RATES) as Currency[]).map((curr) => (
                <option key={curr} value={curr} className="bg-[#1b4d3e] text-white">
                  {curr}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Top Bar - Clean 3-Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Title Wordmark */}
        <a href="#" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 rounded-full bg-[#1b4d3e] text-amber-400 flex items-center justify-center font-serif-display text-xl font-bold shadow-xs border border-[#d97706]">
            V
          </div>
          <div>
            <div className="font-serif-display text-xl sm:text-2xl font-bold tracking-tight text-[#1b4d3e] leading-none">
              VIMODAA AGRO
            </div>
            <div className="text-[9px] tracking-widest uppercase font-semibold text-[#8c501e] mt-0.5">
              Natural Goodness · Export Quality
            </div>
          </div>
        </a>

        {/* Zone 2: Navigation Links or Inline Search */}
        <div className="hidden md:flex items-center gap-1 flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search spices, rice, pulses, herbs..."
              className="w-full bg-[#f2ede4] border border-[#ebdcc9] rounded-full py-1.5 pl-9 pr-8 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-[#1b4d3e] focus:bg-white transition-all"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 bg-[#1b4d3e] hover:bg-[#12382c] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Bag</span>
            {cartCount > 0 && (
              <span className="bg-[#d97706] text-white text-[11px] font-mono font-bold px-1.5 py-0.5 rounded-full ml-0.5">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-[#1b4d3e] hover:bg-[#ebdcc9]/50 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="hidden md:block bg-[#f4f0e6] border-t border-[#ebdcc9]/60 py-1.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto scrollbar-none">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-[#1b4d3e] text-white shadow-xs'
                    : 'text-slate-700 hover:text-[#1b4d3e] hover:bg-[#ebdcc9]/60'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#f9f7f2] border-t border-[#ebdcc9] p-4 space-y-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-[#f2ede4] border border-[#ebdcc9] rounded-lg py-2 pl-9 pr-3 text-xs text-slate-900"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          </div>

          <div className="grid grid-cols-2 gap-1 pt-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-1.5 rounded-md text-xs font-medium ${
                  selectedCategory === cat
                    ? 'bg-[#1b4d3e] text-white'
                    : 'text-slate-800 hover:bg-[#ebdcc9]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
