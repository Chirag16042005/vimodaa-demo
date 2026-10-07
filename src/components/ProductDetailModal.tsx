import React, { useState, useEffect } from 'react';
import { Product, Currency, formatPrice } from '../types';
import {
  X,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Globe,
  CheckCircle,
  FileText,
  Loader2,
  Package,
  Leaf,
  HeartHandshake,
  Recycle
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  currency: Currency;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    tradeForm: string,
    weightLabel: string,
    weightInKg: number,
    quantity: number,
    unitPrice: number
  ) => void;
}

const WEIGHT_OPTIONS = [
  { label: '500g Pouch', multiplier: 0.5 },
  { label: '1 kg Pouch', multiplier: 1.0 },
  { label: '5 kg Bag', multiplier: 5.0 },
  { label: '25 kg Jute Export Bag', multiplier: 25.0 },
  { label: '1 Metric Ton (Bulk Container)', multiplier: 1000.0 },
];

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  currency,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [selectedTradeForm, setSelectedTradeForm] = useState(
    product.tradeForms[0] || 'Whole'
  );
  const [selectedWeight, setSelectedWeight] = useState(WEIGHT_OPTIONS[1]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // AI Botanical Insights state
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    if (product) {
      fetchAiInsights();
    }
  }, [product]);

  const fetchAiInsights = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/ai/botanical-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: product.name,
          category: product.category,
          variety: product.varieties[0] || '',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAiInsights(data.text);
      }
    } catch (err) {
      console.error('Failed to fetch AI insights:', err);
    } finally {
      setLoadingAi(false);
    }
  };

  const calculatedUnitPriceINR = product.pricePerKg * selectedWeight.multiplier;
  const totalPriceINR = calculatedUnitPriceINR * quantity;

  const handleAddToCart = () => {
    onAddToCart(
      product,
      selectedTradeForm,
      selectedWeight.label,
      selectedWeight.multiplier,
      quantity,
      calculatedUnitPriceINR
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#f9f7f2] border border-[#ebdcc9] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-700 flex items-center justify-center shadow-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
          {/* Image & Quick Highlights */}
          <div className="md:col-span-5 space-y-4">
            <div className="relative rounded-xl overflow-hidden bg-[#f2ede4] border border-[#ebdcc9] aspect-4/3">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-[#1b4d3e] text-amber-300 text-xs font-mono font-semibold px-2.5 py-1 rounded">
                {product.stockStatus}
              </div>
            </div>

            {/* Quality Specs Box */}
            <div className="bg-[#f2ede4] border border-[#ebdcc9] rounded-xl p-4 text-xs space-y-2 text-slate-700">
              <div className="font-bold uppercase text-[#1b4d3e] flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#d97706]" /> Export Specifications
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono">
                <div>
                  <span className="text-slate-500">HS Code:</span> {product.hsCode}
                </div>
                <div>
                  <span className="text-slate-500">Origin:</span> {product.origin}
                </div>
                <div>
                  <span className="text-slate-500">MOQ:</span> {product.minOrderQty}
                </div>
                <div>
                  <span className="text-slate-500">Inspection:</span> SGS / Geo-Chem
                </div>
              </div>
            </div>
          </div>

          {/* Product Details & Selection */}
          <div className="md:col-span-7 space-y-5">
            <div>
              <div className="text-xs font-semibold text-[#8c501e] uppercase tracking-wider mb-1">
                {product.category}
              </div>
              <h2 className="font-serif-display text-3xl font-bold text-[#1b4d3e]">
                {product.name}
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {product.notes}
              </p>
            </div>

            {/* Farm-to-Fork & Sustainability Proof Box */}
            <div className="bg-emerald-950/10 border border-emerald-800/20 rounded-xl p-3 space-y-2 text-xs text-emerald-950">
              <div className="font-bold text-[#1b4d3e] uppercase text-[11px] flex items-center gap-1.5 tracking-wider">
                <Leaf className="w-4 h-4 text-[#d97706]" /> Farm-to-Fork & Sustainability Guarantee
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-start gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>100% Farm Traced:</strong> Direct origin tracking from harvest yard to shipping port</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Ethical Sourcing:</strong> Fair prices paid directly to regional farming families</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Pesticide Compliant:</strong> EU & US FDA chemical residue compliant</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <Recycle className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Eco Packaging:</strong> Recyclable food-grade jute & biodegradable barrier foils</span>
                </div>
              </div>
            </div>

            {/* Trade Forms Selector */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase block mb-1">
                  Trade Form:
                </label>
                <select
                  value={selectedTradeForm}
                  onChange={(e) => setSelectedTradeForm(e.target.value)}
                  className="w-full bg-[#f2ede4] border border-[#ebdcc9] rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#1b4d3e]"
                >
                  {product.tradeForms.map((tf) => (
                    <option key={tf} value={tf}>
                      {tf}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 uppercase block mb-1">
                  Packaging / Pack Size:
                </label>
                <select
                  value={selectedWeight.label}
                  onChange={(e) => {
                    const found = WEIGHT_OPTIONS.find((w) => w.label === e.target.value);
                    if (found) setSelectedWeight(found);
                  }}
                  className="w-full bg-[#f2ede4] border border-[#ebdcc9] rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#1b4d3e]"
                >
                  {WEIGHT_OPTIONS.map((w) => (
                    <option key={w.label} value={w.label}>
                      {w.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quantity Stepper & Price Calculation */}
            <div className="p-4 bg-[#f2ede4] border border-[#ebdcc9] rounded-xl flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-medium">Total Amount:</div>
                <div className="font-mono-num text-2xl font-bold text-[#1b4d3e]">
                  {formatPrice(totalPriceINR, currency)}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  ({formatPrice(calculatedUnitPriceINR, currency)} / pack)
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white border border-[#ebdcc9] rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-slate-700 hover:bg-[#f2ede4] font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-bold font-mono text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-slate-700 hover:bg-[#f2ede4] font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                onClick={handleAddToCart}
                className={`w-full py-3.5 px-4 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                  added
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#1b4d3e] hover:bg-[#12382c] text-white'
                }`}
              >
                {added ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-amber-300" /> Added to Shopping Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-amber-400" /> Add to Shopping Bag
                  </>
                )}
              </button>
            </div>

            {/* Quality & Lab Test Summary Box */}
            <div className="mt-4 p-4 rounded-xl bg-[#f2ede4] border border-[#ebdcc9] space-y-1.5 text-xs text-slate-700">
              <div className="font-bold text-[#1b4d3e] uppercase flex items-center gap-1.5 tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#d97706]" /> Export Quality & Phytosanitary Assurance
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600">
                All Vimodaa Agro batches undergo mandatory ASTA color/purity testing, fumigation, and APEDA phytosanitary certification prior to dispatch. Pre-shipment sample inspection reports available upon request.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
