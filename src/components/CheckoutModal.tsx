import React, { useState } from 'react';
import { CartItem, Currency, formatPrice, Order } from '../types';
import {
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Printer,
  Download,
  PackageCheck
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  packagingOption: string;
  currency: Currency;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  packagingOption,
  currency,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Info, 2: Payment, 3: Processing OTP, 4: Confirmed

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');
  const [postalCode, setPostalCode] = useState('');

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<'Standard' | 'Air' | 'Sea'>('Standard');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'LC' | 'COD'>('UPI');

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // OTP Simulation
  const [otp, setOtp] = useState('123456');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Calculations
  const subtotalINR = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const taxINR = Math.round(subtotalINR * 0.05);

  let shippingFeeINR = 350;
  if (shippingMethod === 'Air') shippingFeeINR = 1200;
  if (shippingMethod === 'Sea') shippingFeeINR = 4500;
  if (country !== 'India') shippingFeeINR += 2500;

  const grandTotalINR = subtotalINR + taxINR + shippingFeeINR;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePayNow = () => {
    setIsProcessing(true);
    // Simulate payment gateway API request
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3); // Show OTP verification
    }, 1500);
  };

  const handleVerifyOtpAndComplete = async () => {
    setIsProcessing(true);

    const orderPayload = {
      customerName,
      email,
      phone,
      companyName: companyName || undefined,
      shippingAddress: `${shippingAddress}, ${postalCode}`,
      city,
      country,
      orderType: country === 'India' ? ('Retail Domestic' as const) : ('B2B Wholesale Export' as const),
      items: cartItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        selectedTradeForm: item.selectedTradeForm,
        selectedWeight: item.selectedWeightLabel,
        quantity: item.quantity,
        pricePerUnit: item.unitPrice,
      })),
      packagingType: packagingOption,
      subtotal: subtotalINR,
      tax: taxINR,
      shippingFee: shippingFeeINR,
      grandTotal: grandTotalINR,
      currency,
      paymentMethod:
        paymentMethod === 'UPI'
          ? 'UPI / QR Code'
          : paymentMethod === 'Card'
          ? 'Credit/Debit Card (3D Secure)'
          : paymentMethod === 'NetBanking'
          ? 'NetBanking Transfer'
          : paymentMethod === 'LC'
          ? 'Irrevocable Letter of Credit (L/C)'
          : 'Cash on Delivery',
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      const data = await res.json();
      if (data.success) {
        setCreatedOrder(data.order);
        onOrderSuccess(data.order);
        setStep(4);
      }
    } catch (err) {
      console.error('Order completion failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#f9f7f2] border border-[#ebdcc9] rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative">
        {/* Header */}
        <div className="p-4 bg-[#1b4d3e] text-white flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#d97706]" />
            <h2 className="font-serif-display text-xl font-bold text-amber-100">
              Vimodaa Agro Secure Checkout
            </h2>
          </div>
          {step !== 4 && (
            <button onClick={onClose} className="p-1 hover:bg-emerald-900 rounded text-emerald-200">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Checkout Steps Progress Indicator */}
        {step !== 4 && (
          <div className="bg-[#f2ede4] px-6 py-2.5 border-b border-[#ebdcc9] flex items-center justify-between text-xs font-semibold text-slate-600">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[#1b4d3e]' : ''}`}>
              <span className="w-5 h-5 rounded-full bg-[#1b4d3e] text-white flex items-center justify-center text-[10px]">1</span> Shipping Info
            </div>
            <div className="h-px bg-slate-300 flex-1 mx-3" />
            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#1b4d3e]' : ''}`}>
              <span className="w-5 h-5 rounded-full bg-[#1b4d3e] text-white flex items-center justify-center text-[10px]">2</span> Payment Gateway
            </div>
            <div className="h-px bg-slate-300 flex-1 mx-3" />
            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-[#1b4d3e]' : ''}`}>
              <span className="w-5 h-5 rounded-full bg-[#1b4d3e] text-white flex items-center justify-center text-[10px]">3</span> Authorization
            </div>
          </div>
        )}

        {/* Step 1: Shipping & Customer Details */}
        {step === 1 && (
          <form onSubmit={handleProceedToPayment} className="p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1b4d3e] border-b border-[#ebdcc9] pb-2">
              1. Customer & Shipping Destination
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rajesh Sharma"
                  className="w-full bg-[#f2ede4] border border-[#ebdcc9] rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rajesh@spicetraders.com"
                  className="w-full bg-[#f2ede4] border border-[#ebdcc9] rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98201 44552"
                  className="w-full bg-[#f2ede4] border border-[#ebdcc9] rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Company / Organization (Optional)</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Sharma Foods LLC"
                  className="w-full bg-[#f2ede4] border border-[#ebdcc9] rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Street Address *</label>
              <input
                type="text"
                required
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Plot / Street / Industrial Area"
                className="w-full bg-[#f2ede4] border border-[#ebdcc9] rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Mumbai"
                  className="w-full bg-[#f2ede4] border border-[#ebdcc9] rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Country *</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="India"
                  className="w-full bg-[#f2ede4] border border-[#ebdcc9] rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Postal Code *</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="400001"
                  className="w-full bg-[#f2ede4] border border-[#ebdcc9] rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white"
                />
              </div>
            </div>

            {/* Shipping Method */}
            <div className="pt-2">
              <label className="text-xs font-bold text-slate-700 block mb-2">Shipping Freight Method:</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShippingMethod('Standard')}
                  className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                    shippingMethod === 'Standard'
                      ? 'bg-[#1b4d3e] text-white border-[#1b4d3e]'
                      : 'bg-[#f2ede4] text-slate-800 border-[#ebdcc9]'
                  }`}
                >
                  <div className="font-bold">Surface Express</div>
                  <div className="text-[10px] opacity-80">3-5 Business Days</div>
                </button>

                <button
                  type="button"
                  onClick={() => setShippingMethod('Air')}
                  className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                    shippingMethod === 'Air'
                      ? 'bg-[#1b4d3e] text-white border-[#1b4d3e]'
                      : 'bg-[#f2ede4] text-slate-800 border-[#ebdcc9]'
                  }`}
                >
                  <div className="font-bold">Priority Air Cargo</div>
                  <div className="text-[10px] opacity-80">1-2 Days (DHL/FedEx)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setShippingMethod('Sea')}
                  className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                    shippingMethod === 'Sea'
                      ? 'bg-[#1b4d3e] text-white border-[#1b4d3e]'
                      : 'bg-[#f2ede4] text-slate-800 border-[#ebdcc9]'
                  }`}
                >
                  <div className="font-bold">Ocean Container</div>
                  <div className="text-[10px] opacity-80">FCL / LCL Bulk Export</div>
                </button>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-[#ebdcc9]">
              <div>
                <span className="text-xs text-slate-500">Grand Total: </span>
                <span className="font-mono-num font-bold text-base text-[#1b4d3e]">
                  {formatPrice(grandTotalINR, currency)}
                </span>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#1b4d3e] hover:bg-[#12382c] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
              >
                Proceed to Payment <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Payment Gateway Selection */}
        {step === 2 && (
          <div className="p-6 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1b4d3e] border-b border-[#ebdcc9] pb-2">
              2. Select Payment Gateway Method
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'UPI'
                    ? 'bg-[#1b4d3e] text-white border-[#1b4d3e] shadow-md'
                    : 'bg-[#f2ede4] text-slate-800 border-[#ebdcc9]'
                }`}
              >
                <QrCode className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold">UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'Card'
                    ? 'bg-[#1b4d3e] text-white border-[#1b4d3e] shadow-md'
                    : 'bg-[#f2ede4] text-slate-800 border-[#ebdcc9]'
                }`}
              >
                <CreditCard className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold">Credit/Debit</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('NetBanking')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'NetBanking'
                    ? 'bg-[#1b4d3e] text-white border-[#1b4d3e] shadow-md'
                    : 'bg-[#f2ede4] text-slate-800 border-[#ebdcc9]'
                }`}
              >
                <Building2 className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold">NetBanking</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'COD'
                    ? 'bg-[#1b4d3e] text-white border-[#1b4d3e] shadow-md'
                    : 'bg-[#f2ede4] text-slate-800 border-[#ebdcc9]'
                }`}
              >
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold">Cash on Delivery</span>
              </button>
            </div>

            {/* Payment Details Container */}
            <div className="p-4 bg-[#f2ede4] border border-[#ebdcc9] rounded-xl space-y-3">
              {paymentMethod === 'UPI' && (
                <div className="text-center space-y-3 py-2">
                  <div className="p-3 bg-white border border-[#ebdcc9] rounded-xl inline-block shadow-inner">
                    <QrCode className="w-28 h-28 text-slate-900 mx-auto" />
                    <div className="text-[10px] font-mono text-slate-500 mt-1">
                      UPI ID: vimodaaagro@icici
                    </div>
                  </div>
                  <p className="text-xs text-slate-600">
                    Scan with PhonePe, Google Pay, Paytm, or BHIM to pay instantly.
                  </p>
                </div>
              )}

              {paymentMethod === 'Card' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Card Number</label>
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 •••• •••• 8821"
                      className="w-full bg-white border border-[#ebdcc9] rounded-lg px-3 py-2 text-xs font-mono text-slate-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">MM/YY</label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="08/29"
                        className="w-full bg-white border border-[#ebdcc9] rounded-lg px-3 py-2 text-xs font-mono text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full bg-white border border-[#ebdcc9] rounded-lg px-3 py-2 text-xs font-mono text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'NetBanking' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">Select Bank:</label>
                  <select className="w-full bg-white border border-[#ebdcc9] rounded-lg px-3 py-2 text-xs font-medium text-slate-900">
                    <option>State Bank of India (SBI)</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank Corporate</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                    <option>Standard Chartered / HSBC</option>
                  </select>
                </div>
              )}

              {paymentMethod === 'COD' && (
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="font-bold text-[#1b4d3e]">Cash on Delivery (COD) Pay at Doorstep:</div>
                  <p>
                    Pay cash or via UPI QR to the courier delivery partner upon receiving your package at your shipping address.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <button
                type="button"
                onClick={handlePayNow}
                disabled={isProcessing}
                className="px-6 py-2.5 bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Authorizing Gateway...
                  </>
                ) : (
                  <>
                    Authorize & Pay {formatPrice(grandTotalINR, currency)}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: 3D Secure OTP Authorization Simulation */}
        {step === 3 && (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-[#1b4d3e]/10 text-[#1b4d3e] rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-10 h-10 text-[#1b4d3e]" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#1b4d3e]">3D Secure Payment Verification</h3>
              <p className="text-xs text-slate-600 mt-1">
                Enter 6-digit authentication code sent to your registered phone & email ({email || 'customer'}).
              </p>
            </div>

            <div className="max-w-xs mx-auto space-y-2">
              <div className="p-2 bg-amber-100 text-amber-900 border border-amber-300 rounded text-xs font-mono">
                Simulated Test OTP Code: <strong className="text-sm">123456</strong>
              </div>

              <input
                type="text"
                maxLength={6}
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                placeholder="Enter 123456"
                className="w-full text-center text-xl font-mono tracking-widest bg-white border border-[#ebdcc9] rounded-xl py-3 focus:ring-2 focus:ring-[#1b4d3e]"
              />
            </div>

            <button
              onClick={handleVerifyOtpAndComplete}
              disabled={isProcessing}
              className="w-full max-w-xs py-3 bg-[#1b4d3e] hover:bg-[#12382c] text-white font-bold text-sm rounded-xl transition-colors shadow-md mx-auto flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Completing Transaction...
                </>
              ) : (
                <>
                  Verify OTP & Complete Order
                </>
              )}
            </button>
          </div>
        )}

        {/* Step 4: Order Confirmation Receipt */}
        {step === 4 && createdOrder && (
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-12 h-12 text-emerald-700" />
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#d97706]">
                Payment Successful & Order Confirmed
              </div>
              <h2 className="font-serif-display text-3xl font-bold text-[#1b4d3e] mt-1">
                Thank You for Your Order!
              </h2>
              <div className="font-mono text-sm font-bold text-slate-800 mt-1">
                Order Reference: <span className="text-[#1b4d3e]">{createdOrder.orderNumber}</span>
              </div>
            </div>

            <div className="bg-[#f2ede4] border border-[#ebdcc9] rounded-xl p-4 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-[#ebdcc9] pb-2">
                <span className="font-bold text-slate-700">Customer:</span>
                <span>{createdOrder.customerName} ({createdOrder.email})</span>
              </div>
              <div className="flex justify-between border-b border-[#ebdcc9] pb-2">
                <span className="font-bold text-slate-700">Destination:</span>
                <span>{createdOrder.city}, {createdOrder.country}</span>
              </div>
              <div className="flex justify-between border-b border-[#ebdcc9] pb-2">
                <span className="font-bold text-slate-700">Packaging:</span>
                <span>{createdOrder.packagingType}</span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-sm text-[#1b4d3e]">
                <span>Total Amount Paid:</span>
                <span className="font-mono-num">{formatPrice(createdOrder.grandTotal, currency)}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 bg-white border border-[#ebdcc9] hover:bg-[#f2ede4] text-slate-800 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4 text-[#1b4d3e]" /> Print Commercial Receipt
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#1b4d3e] hover:bg-[#12382c] text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Return to Storefront
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
