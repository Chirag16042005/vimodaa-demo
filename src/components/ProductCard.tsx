import React from 'react';
import { Product, Currency, formatPrice } from '../types';
import {
  ArrowRight,
  Leaf,
  ShieldCheck,
  HeartHandshake,
  Award,
  CheckCircle2,
  Recycle
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  onAddToCart: (
    product: Product,
    tradeForm: string,
    weightLabel: string,
    weightInKg: number,
    quantity: number,
    unitPrice: number
  ) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onViewDetails,
}) => {
  // Default sustainability badges if not explicitly set
  const sustainabilityBadges = product.sustainabilityBadges || [
    { label: 'Farm-to-Fork', type: 'farm-to-fork', description: 'Direct origin trace from farm harvest to table' },
    { label: 'Ethical Sourcing', type: 'ethical-sourcing', description: '100% Fair trade paid directly to Indian farmers' },
    { label: 'Lab Tested Pure', type: 'lab-tested', description: 'NABL & ISO 22000 lab purity certified' },
  ];

  return (
    <div
      onClick={() => onViewDetails(product)}
      className="bg-[#fdfbf7] border border-[#ebdcc9] rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group cursor-pointer"
    >
      {/* Product Image Box */}
      <div className="relative h-48 bg-[#f2ede4] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Stock status tag */}
        <div className="absolute top-2.5 left-2.5 bg-[#1b4d3e]/90 backdrop-blur-xs text-amber-300 text-[10px] font-bold font-mono px-2 py-0.5 rounded shadow-xs">
          {product.stockStatus}
        </div>

        {/* Visual Farm-to-Fork Certification Stamp */}
        <div className="absolute bottom-2.5 left-2.5 bg-[#12382c]/90 text-emerald-100 text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-xs flex items-center gap-1 border border-amber-400/40 shadow-xs">
          <Leaf className="w-3 h-3 text-amber-400 animate-pulse" />
          <span>Farm-to-Fork Certified</span>
        </div>

        {/* HS Code callout */}
        <div className="absolute top-2.5 right-2.5 bg-black/50 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
          HS {product.hsCode}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Category & Origin Unboxed Text */}
          <div className="text-[11px] text-[#8c501e] font-semibold tracking-wide">
            {product.category} · {product.origin.split(',')[0]}
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-slate-900 text-sm group-hover:text-[#1b4d3e] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Trade Forms Tags */}
          <div className="text-xs text-slate-500 line-clamp-1 font-medium">
            {product.tradeForms.join(' · ')}
          </div>

          {/* Farm-to-Fork & Sustainability Micro Badge Icons Bar */}
          <div className="pt-2 border-t border-[#ebdcc9]/60 flex items-center gap-2 text-[10px] font-semibold text-slate-700">
            <span
              title="Farm-to-Fork Direct Harvest Tracing"
              className="inline-flex items-center gap-1 bg-emerald-900/10 text-emerald-900 px-1.5 py-0.5 rounded border border-emerald-800/20"
            >
              <Leaf className="w-3 h-3 text-emerald-700" /> Farm Trace
            </span>

            <span
              title="100% Fair Trade Ethical Sourcing"
              className="inline-flex items-center gap-1 bg-amber-900/10 text-amber-900 px-1.5 py-0.5 rounded border border-amber-800/20"
            >
              <HeartHandshake className="w-3 h-3 text-[#d97706]" /> Fair Trade
            </span>

            <span
              title="Lab Tested & Non-GMO"
              className="inline-flex items-center gap-1 bg-blue-900/10 text-blue-900 px-1.5 py-0.5 rounded border border-blue-800/20"
            >
              <ShieldCheck className="w-3 h-3 text-blue-700" /> Pure Lab
            </span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-[#ebdcc9]/80 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Starting from:</div>
            <div className="font-mono-num text-base font-bold text-[#1b4d3e]">
              {formatPrice(product.pricePerKg, currency)}{' '}
              <span className="text-[10px] font-normal text-slate-500">/ kg</span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="px-3 py-1.5 bg-[#1b4d3e] group-hover:bg-[#12382c] text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1 shadow-xs"
          >
            Select & Order <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
