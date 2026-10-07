import React, { useState } from 'react';
import { X, Search, Truck, CheckCircle2, Package, Clock, MapPin } from 'lucide-react';
import { Order, Currency, formatPrice } from '../types';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  currency: Currency;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders,
  currency,
}) => {
  if (!isOpen) return null;

  const [searchNo, setSearchNo] = useState('VMD-2026-8801');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(
    orders.find((o) => o.orderNumber === 'VMD-2026-8801') || orders[0] || null
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === searchNo.trim().toLowerCase() ||
        o.email.toLowerCase() === searchNo.trim().toLowerCase()
    );
    setSearchedOrder(found || null);
  };

  const getStatusStep = (status: Order['orderStatus']) => {
    switch (status) {
      case 'Pending':
        return 1;
      case 'Processing':
        return 2;
      case 'Dispatched':
        return 3;
      case 'In Transit':
        return 4;
      case 'Delivered':
        return 5;
      default:
        return 1;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#f9f7f2] border border-[#ebdcc9] rounded-2xl max-w-2xl w-full shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#1b4d3e] text-white flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#d97706]" />
            <h2 className="font-serif-display text-xl font-bold text-amber-100">
              Track Order & Shipment Status
            </h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-emerald-900 rounded text-emerald-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchNo}
                onChange={(e) => setSearchNo(e.target.value)}
                placeholder="Enter Order # (e.g. VMD-2026-8801) or Email..."
                className="w-full bg-[#f2ede4] border border-[#ebdcc9] rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono font-medium text-slate-900 focus:bg-white"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#1b4d3e] hover:bg-[#12382c] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              Search Status
            </button>
          </form>

          {searchedOrder ? (
            <div className="space-y-5">
              {/* Overview Box */}
              <div className="bg-[#f2ede4] border border-[#ebdcc9] rounded-xl p-4 text-xs space-y-2">
                <div className="flex flex-wrap items-center justify-between border-b border-[#ebdcc9] pb-2 font-mono">
                  <div>
                    <span className="text-slate-500">Order ID: </span>
                    <span className="font-bold text-[#1b4d3e]">{searchedOrder.orderNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Date: </span>
                    <span>{new Date(searchedOrder.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Type: </span>
                    <span className="font-semibold text-amber-800">{searchedOrder.orderType}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-slate-700">
                  <div>
                    <span className="font-bold">Customer:</span> {searchedOrder.customerName}
                  </div>
                  <div>
                    <span className="font-bold">Destination:</span> {searchedOrder.city}, {searchedOrder.country}
                  </div>
                  <div>
                    <span className="font-bold">Packaging:</span> {searchedOrder.packagingType}
                  </div>
                  <div>
                    <span className="font-bold">Payment:</span> {searchedOrder.paymentMethod} ({searchedOrder.paymentStatus})
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="p-4 bg-white border border-[#ebdcc9] rounded-xl space-y-4">
                <div className="text-xs font-bold uppercase text-[#1b4d3e] border-b border-[#ebdcc9] pb-2">
                  Shipment Progress Timeline
                </div>

                {(() => {
                  const currentStep = getStatusStep(searchedOrder.orderStatus);
                  const steps = [
                    { label: 'Order Placed', desc: 'Received & verified' },
                    { label: 'Processing', desc: 'Quality inspection & packaging' },
                    { label: 'Dispatched', desc: 'Handed to carrier / port' },
                    { label: 'In Transit', desc: 'En route to destination' },
                    { label: 'Delivered', desc: 'Safely received' },
                  ];

                  return (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        {steps.map((s, idx) => {
                          const stepNum = idx + 1;
                          const active = stepNum <= currentStep;
                          return (
                            <div key={s.label} className="text-center flex-1">
                              <div
                                className={`w-7 h-7 rounded-full mx-auto flex items-center justify-center font-mono font-bold text-xs mb-1 ${
                                  active
                                    ? 'bg-[#1b4d3e] text-amber-300 shadow-sm'
                                    : 'bg-slate-200 text-slate-500'
                                }`}
                              >
                                {active ? '✓' : stepNum}
                              </div>
                              <div className={`text-[11px] ${active ? 'text-[#1b4d3e] font-bold' : 'text-slate-400'}`}>
                                {s.label}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* Dispatch Details callout if dispatched */}
                {searchedOrder.dispatchInfo && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs space-y-1.5 text-amber-950">
                    <div className="font-bold text-[#1b4d3e] flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-[#d97706]" /> Carrier & Tracking Details:
                    </div>
                    <div className="grid grid-cols-2 gap-2 font-mono">
                      <div>
                        <span className="text-amber-800 font-bold">Shipping Line / Carrier:</span>{' '}
                        {searchedOrder.dispatchInfo.carrier}
                      </div>
                      <div>
                        <span className="text-amber-800 font-bold">Tracking / Bill # :</span>{' '}
                        {searchedOrder.dispatchInfo.trackingOrBillNumber}
                      </div>
                      <div>
                        <span className="text-amber-800 font-bold">Dispatch Date:</span>{' '}
                        {searchedOrder.dispatchInfo.dispatchDate}
                      </div>
                      <div>
                        <span className="text-amber-800 font-bold">Est. Delivery:</span>{' '}
                        {searchedOrder.dispatchInfo.estimatedDeliveryDate}
                      </div>
                    </div>
                    {searchedOrder.dispatchInfo.dispatchNotes && (
                      <div className="text-[11px] text-slate-700 pt-1 border-t border-amber-200/80">
                        <strong>Dispatch Note:</strong> {searchedOrder.dispatchInfo.dispatchNotes}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="p-3 bg-[#f2ede4] border border-[#ebdcc9] rounded-xl space-y-2">
                <div className="text-xs font-bold text-slate-800">Order Contents:</div>
                <div className="space-y-1 text-xs">
                  {searchedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-slate-700 py-1 border-b border-[#ebdcc9]/60 last:border-none">
                      <span>
                        {item.productName} ({item.selectedTradeForm}, {item.selectedWeight}) × {item.quantity}
                      </span>
                      <span className="font-mono-num font-bold">
                        {formatPrice(item.pricePerUnit * item.quantity, currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              No order found matching "{searchNo}". Try searching with "VMD-2026-8801" or "VMD-2026-8802".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
