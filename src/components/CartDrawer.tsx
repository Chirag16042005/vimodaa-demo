import React from 'react';
import { CartItem, Currency, formatPrice } from '../types';
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Package } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  currency: Currency;
  packagingOption: string;
  onSelectPackaging: (opt: string) => void;
  onProceedToCheckout: () => void;
}

export const PACKAGING_OPTIONS = [
  'Standard Food Grade Pouch',
  'Vacuum Sealed Barrier Pack',
  'Eco Jute Craft Bag (25 kg)',
];

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  currency,
  packagingOption,
  onSelectPackaging,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotalINR = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const taxINR = Math.round(subtotalINR * 0.05); // 5% GST/Tax
  const grandTotalINR = subtotalINR + taxINR;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-[#f9f7f2] border-l border-[#ebdcc9] h-full shadow-2xl flex flex-col relative animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 bg-[#1b4d3e] text-white flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#d97706]" />
            <h2 className="font-serif-display text-xl font-bold text-amber-100">
              Your Shopping Bag
            </h2>
            <span className="bg-[#d97706] text-white text-xs font-mono font-bold px-2 py-0.5 rounded-full">
              {cartItems.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-emerald-900 rounded-lg text-emerald-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 bg-[#f2ede4] text-[#1b4d3e] rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8 opacity-60" />
              </div>
              <p className="text-slate-600 font-medium text-sm">
                Your shopping bag is currently empty.
              </p>
              <p className="text-xs text-slate-400">
                Explore our premium Indian spices, grains, and Ayurvedic produce.
              </p>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#f2ede4] border border-[#ebdcc9] rounded-xl p-3 flex gap-3 items-center relative"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-lg bg-white shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 text-xs truncate">
                    {item.product.name}
                  </h4>
                  <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                    Form: {item.selectedTradeForm} · {item.selectedWeightLabel}
                  </div>
                  <div className="font-mono-num font-bold text-xs text-[#1b4d3e] mt-1">
                    {formatPrice(item.unitPrice * item.quantity, currency)}
                  </div>
                </div>

                {/* Quantity Controls & Delete */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() => onRemoveItem(idx)}
                    className="text-slate-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center bg-white border border-[#ebdcc9] rounded text-xs">
                    <button
                      onClick={() =>
                        onUpdateQuantity(idx, Math.max(1, item.quantity - 1))
                      }
                      className="px-2 py-0.5 text-slate-700 hover:bg-slate-100 font-bold"
                    >
                      -
                    </button>
                    <span className="px-2 font-mono font-bold">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                      className="px-2 py-0.5 text-slate-700 hover:bg-slate-100 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Export Packaging Selection */}
          {cartItems.length > 0 && (
            <div className="mt-4 p-3 bg-white border border-[#ebdcc9] rounded-xl space-y-2">
              <label className="text-xs font-bold text-[#1b4d3e] flex items-center gap-1">
                <Package className="w-3.5 h-3.5 text-[#d97706]" /> Export Packaging Preference:
              </label>
              <select
                value={packagingOption}
                onChange={(e) => onSelectPackaging(e.target.value)}
                className="w-full bg-[#f2ede4] border border-[#ebdcc9] text-xs font-medium text-slate-800 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-[#1b4d3e]"
              >
                {PACKAGING_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-[#f2ede4] border-t border-[#ebdcc9] space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono-num font-semibold">
                  {formatPrice(subtotalINR, currency)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Est. Tax / GST (5%):</span>
                <span className="font-mono-num font-semibold">
                  {formatPrice(taxINR, currency)}
                </span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold text-sm pt-1 border-t border-[#ebdcc9]">
                <span>Grand Total:</span>
                <span className="font-mono-num text-[#1b4d3e] text-lg">
                  {formatPrice(grandTotalINR, currency)}
                </span>
              </div>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="w-full py-3 bg-[#1b4d3e] hover:bg-[#12382c] text-white font-bold text-sm rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              Proceed to Secure Checkout
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> 256-Bit SSL Encrypted Secure Gateway
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
