import React, { useState } from 'react';
import { Product, Order, B2BInquiry, Currency, formatPrice } from '../types';
import {
  Package,
  Truck,
  TrendingUp,
  FileText,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Sparkles,
  Printer,
  X,
  Search,
  Loader2,
  ShieldAlert,
  Send
} from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  currency: Currency;
  onRefreshData: () => void;
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  orders,
  currency,
  onRefreshData,
  onExitAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');

  // Filter Order Status
  const [orderFilter, setOrderFilter] = useState<string>('All');
  const [orderSearch, setOrderSearch] = useState<string>('');

  // Dispatch Order Modal
  const [dispatchingOrder, setDispatchingOrder] = useState<Order | null>(null);
  const [carrier, setCarrier] = useState('BlueDart Express');
  const [trackingNo, setTrackingNo] = useState(`TRACK-${Math.floor(1000000 + Math.random() * 9000000)}`);
  const [estimatedDelivery, setEstimatedDelivery] = useState(
    new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0]
  );
  const [containerNo, setContainerNo] = useState('');
  const [dispatchNotes, setDispatchNotes] = useState('');
  const [isSubmittingDispatch, setIsSubmittingDispatch] = useState(false);

  // Product Add/Edit Modal
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [isAiGeneratingSpec, setIsAiGeneratingSpec] = useState(false);

  // Calculate Metrics
  const totalRevenueINR = orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const pendingDispatchesCount = orders.filter(
    (o) => o.orderStatus === 'Pending' || o.orderStatus === 'Processing'
  ).length;

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = orderFilter === 'All' || o.orderStatus === orderFilter;
    const matchesSearch =
      orderSearch === '' ||
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.email.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Handle Dispatch Order API
  const handleConfirmDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchingOrder) return;
    setIsSubmittingDispatch(true);

    try {
      const res = await fetch(`/api/orders/${dispatchingOrder.id}/dispatch`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carrier,
          trackingOrBillNumber: trackingNo,
          estimatedDeliveryDate: estimatedDelivery,
          containerOrSealNo: containerNo,
          dispatchNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onRefreshData();
        setDispatchingOrder(null);
      }
    } catch (err) {
      console.error('Dispatch failed:', err);
    } finally {
      setIsSubmittingDispatch(false);
    }
  };

  // AI Spec Generator for Product Form
  const handleGenerateAiProductSpec = async () => {
    if (!editingProduct?.name) {
      alert('Please enter a product name first.');
      return;
    }
    setIsAiGeneratingSpec(true);
    try {
      const res = await fetch('/api/ai/describe-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingProduct.name,
          category: editingProduct.category || 'Spices & Herbs',
          varieties: editingProduct.varieties || ['Grade A'],
          tradeForms: editingProduct.tradeForms || ['Whole', 'Powder'],
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingProduct({
          ...editingProduct,
          notes: data.text,
        });
      }
    } catch (err) {
      console.error('AI Spec generation failed:', err);
    } finally {
      setIsAiGeneratingSpec(false);
    }
  };

  // Save Product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const endpoint = isNewProduct ? '/api/products' : `/api/products/${editingProduct.id}`;
      const method = isNewProduct ? 'POST' : 'PUT';

      const payload = {
        name: editingProduct.name || 'New Agro Product',
        category: editingProduct.category || 'Spices & Herbs',
        pricePerKg: Number(editingProduct.pricePerKg) || 200,
        varieties: typeof editingProduct.varieties === 'string' ? (editingProduct.varieties as string).split(',').map(s=>s.trim()) : editingProduct.varieties || ['Standard'],
        tradeForms: typeof editingProduct.tradeForms === 'string' ? (editingProduct.tradeForms as string).split(',').map(s=>s.trim()) : editingProduct.tradeForms || ['Whole', 'Powder'],
        notes: editingProduct.notes || '',
        hsCode: editingProduct.hsCode || '0904.11.00',
        minOrderQty: editingProduct.minOrderQty || '50 kg',
        origin: editingProduct.origin || 'Maharashtra, India',
        image: editingProduct.image || '/src/assets/images/spice_turmeric_chilli_1791281639688.jpg',
        stockStatus: editingProduct.stockStatus || 'In Stock',
        isFeatured: editingProduct.isFeatured || false,
      };

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        onRefreshData();
        setEditingProduct(null);
      }
    } catch (err) {
      console.error('Save product failed:', err);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        onRefreshData();
      }
    } catch (err) {
      console.error('Delete product failed:', err);
    }
  };

  return (
    <div className="bg-[#f9f7f2] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="bg-[#1b4d3e] text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-amber-400">
              VIMODAA AGRO LLP Portal
            </div>
            <h1 className="font-serif-display text-3xl font-bold text-amber-100">
              Admin & Dispatch Command Center
            </h1>
            <p className="text-xs text-slate-200 mt-1">
              Manage client orders, dispatch shipments, update product pricing, and respond to B2B bulk export inquiries.
            </p>
          </div>

          <button
            onClick={onExitAdmin}
            className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-amber-200 border border-amber-500/30 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            ← Back to Customer Storefront
          </button>
        </div>

        {/* Metric KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-[#ebdcc9] rounded-xl p-4 shadow-xs">
            <div className="text-xs font-semibold text-slate-500 uppercase">Total Revenue</div>
            <div className="font-mono-num text-2xl font-bold text-[#1b4d3e] mt-1">
              {formatPrice(totalRevenueINR, currency)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-600" /> Across all channels
            </div>
          </div>

          <div className="bg-white border border-[#ebdcc9] rounded-xl p-4 shadow-xs">
            <div className="text-xs font-semibold text-slate-500 uppercase">Total Orders</div>
            <div className="font-mono-num text-2xl font-bold text-[#1b4d3e] mt-1">
              {orders.length}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Domestic & International</div>
          </div>

          <div className="bg-white border border-[#ebdcc9] rounded-xl p-4 shadow-xs">
            <div className="text-xs font-semibold text-slate-500 uppercase">Pending Dispatch</div>
            <div className="font-mono-num text-2xl font-bold text-[#d97706] mt-1">
              {pendingDispatchesCount}
            </div>
            <div className="text-[10px] text-amber-700 mt-1 font-semibold">Requires packaging</div>
          </div>

          <div className="bg-white border border-[#ebdcc9] rounded-xl p-4 shadow-xs">
            <div className="text-xs font-semibold text-slate-500 uppercase">Active Catalog</div>
            <div className="font-mono-num text-2xl font-bold text-[#1b4d3e] mt-1">
              {products.length}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">PDF & Custom Products</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#ebdcc9] gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-[#1b4d3e] text-white'
                : 'bg-[#f2ede4] text-slate-700 hover:bg-[#ebdcc9]'
            }`}
          >
            <Truck className="w-4 h-4 text-amber-400" /> Orders & Dispatch ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'products'
                ? 'bg-[#1b4d3e] text-white'
                : 'bg-[#f2ede4] text-slate-700 hover:bg-[#ebdcc9]'
            }`}
          >
            <Package className="w-4 h-4 text-amber-400" /> Products Catalog ({products.length})
          </button>
        </div>

        {/* TAB 1: ORDERS & DISPATCH MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white border border-[#ebdcc9] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#ebdcc9]">
              <div className="flex items-center gap-2">
                {['All', 'Pending', 'Processing', 'Dispatched', 'In Transit', 'Delivered'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setOrderFilter(status)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      orderFilter === status
                        ? 'bg-[#1b4d3e] text-white'
                        : 'bg-[#f2ede4] text-slate-700 hover:bg-[#ebdcc9]'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search order #, customer, email..."
                  className="w-full bg-[#f2ede4] border border-[#ebdcc9] rounded-lg py-1.5 pl-8 pr-3 text-xs"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#f2ede4] text-[#1b4d3e] font-bold uppercase border-b border-[#ebdcc9]">
                    <th className="p-3">Order Ref</th>
                    <th className="p-3">Customer & Address</th>
                    <th className="p-3">Items & Packaging</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Dispatch Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ebdcc9]/60">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500 italic">
                        No orders matching filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-[#f9f7f2]">
                        <td className="p-3 font-mono">
                          <div className="font-bold text-[#1b4d3e]">{order.orderNumber}</div>
                          <div className="text-[10px] text-slate-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-[10px] text-amber-800 font-semibold mt-0.5">
                            {order.orderType}
                          </div>
                        </td>

                        <td className="p-3">
                          <div className="font-bold text-slate-900">{order.customerName}</div>
                          <div className="text-slate-500 text-[11px]">{order.email}</div>
                          <div className="text-slate-500 text-[10px]">{order.city}, {order.country}</div>
                        </td>

                        <td className="p-3">
                          <div className="font-semibold text-slate-800">
                            {order.items.map((i) => `${i.productName} (${i.selectedWeight}) × ${i.quantity}`).join(', ')}
                          </div>
                          <div className="text-[10px] text-[#8c501e] mt-0.5">
                            Pack: {order.packagingType}
                          </div>
                        </td>

                        <td className="p-3 font-mono-num font-bold text-sm text-[#1b4d3e]">
                          {formatPrice(order.grandTotal, currency)}
                          <div className="text-[10px] text-slate-500 font-sans font-normal">
                            {order.paymentMethod} ({order.paymentStatus})
                          </div>
                        </td>

                        <td className="p-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                              order.orderStatus === 'Dispatched'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : order.orderStatus === 'Pending'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-blue-100 text-blue-800 border border-blue-300'
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </td>

                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setDispatchingOrder(order);
                              setTrackingNo(`TRACK-${Math.floor(1000000 + Math.random() * 9000000)}`);
                            }}
                            className="px-3 py-1.5 bg-[#1b4d3e] hover:bg-[#12382c] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
                          >
                            Dispatch Order
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS CATALOG MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="bg-white border border-[#ebdcc9] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#ebdcc9]">
              <h3 className="font-bold text-[#1b4d3e] text-sm uppercase">
                Catalog Inventory Management ({products.length} Products)
              </h3>

              <button
                onClick={() => {
                  setEditingProduct({
                    name: '',
                    category: 'Spices & Herbs',
                    pricePerKg: 200,
                    varieties: ['Standard'],
                    tradeForms: ['Whole', 'Powder'],
                    notes: '',
                    hsCode: '0904.11.00',
                    minOrderQty: '50 kg',
                    origin: 'Maharashtra, India',
                    stockStatus: 'In Stock',
                  });
                  setIsNewProduct(true);
                }}
                className="px-4 py-2 bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add New Product
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#f2ede4] text-[#1b4d3e] font-bold uppercase border-b border-[#ebdcc9]">
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price / kg</th>
                    <th className="p-3">Trade Forms</th>
                    <th className="p-3">HS Code & Origin</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ebdcc9]/60">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-[#f9f7f2]">
                      <td className="p-3 font-semibold text-slate-900 flex items-center gap-2">
                        <img src={p.image} className="w-10 h-10 object-cover rounded border border-[#ebdcc9]" />
                        <div>
                          <div>{p.name}</div>
                          <div className="text-[10px] text-slate-500 italic">{p.notes.substring(0, 45)}...</div>
                        </div>
                      </td>
                      <td className="p-3 font-medium text-slate-700">{p.category}</td>
                      <td className="p-3 font-mono-num font-bold text-[#1b4d3e]">
                        {formatPrice(p.pricePerKg, currency)}
                      </td>
                      <td className="p-3 text-slate-600">{p.tradeForms.join(', ')}</td>
                      <td className="p-3 font-mono text-[11px] text-slate-600">
                        {p.hsCode} ({p.origin.split(',')[0]})
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setIsNewProduct(false);
                          }}
                          className="p-1.5 bg-[#f2ede4] hover:bg-[#ebdcc9] text-slate-800 rounded cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL: DISPATCH ORDER */}
        {dispatchingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[#f9f7f2] border border-[#ebdcc9] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
              <button
                onClick={() => setDispatchingOrder(null)}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="font-serif-display text-2xl font-bold text-[#1b4d3e] border-b border-[#ebdcc9] pb-2">
                Dispatch Order #{dispatchingOrder.orderNumber}
              </div>

              <form onSubmit={handleConfirmDispatch} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Shipping Line / Carrier *</label>
                  <select
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    className="w-full bg-[#f2ede4] border border-[#ebdcc9] rounded-lg px-3 py-2 text-xs font-medium"
                  >
                    <option>BlueDart Express</option>
                    <option>DHL Express Worldwide</option>
                    <option>FedEx Priority Freight</option>
                    <option>Maersk Ocean Container Line</option>
                    <option>MSC Mediterranean Shipping</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Tracking Number / Bill of Lading *</label>
                  <input
                    type="text"
                    required
                    value={trackingNo}
                    onChange={(e) => setTrackingNo(e.target.value)}
                    className="w-full bg-[#f2ede4] border border-[#ebdcc9] rounded-lg px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Estimated Delivery Date *</label>
                  <input
                    type="date"
                    required
                    value={estimatedDelivery}
                    onChange={(e) => setEstimatedDelivery(e.target.value)}
                    className="w-full bg-[#f2ede4] border border-[#ebdcc9] rounded-lg px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Container / Seal Number (Optional)</label>
                  <input
                    type="text"
                    value={containerNo}
                    onChange={(e) => setContainerNo(e.target.value)}
                    placeholder="e.g. MSKU-882019 / SEAL-002"
                    className="w-full bg-[#f2ede4] border border-[#ebdcc9] rounded-lg px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Dispatch & Packaging Notes</label>
                  <textarea
                    rows={2}
                    value={dispatchNotes}
                    onChange={(e) => setDispatchNotes(e.target.value)}
                    placeholder="e.g. Dispatched in 2 fumigated pallets with phytosanitary certificate..."
                    className="w-full bg-[#f2ede4] border border-[#ebdcc9] rounded-lg p-2.5 text-xs"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setDispatchingOrder(null)}
                    className="px-4 py-2 bg-slate-200 text-slate-800 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingDispatch}
                    className="px-6 py-2 bg-[#1b4d3e] text-white font-bold text-xs rounded-xl hover:bg-[#12382c] shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    {isSubmittingDispatch ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Truck className="w-4 h-4 text-amber-400" />
                    )}
                    Confirm & Dispatch
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD/EDIT PRODUCT WITH AI SPEC GENERATOR */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-[#f9f7f2] border border-[#ebdcc9] rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setEditingProduct(null)}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="font-serif-display text-2xl font-bold text-[#1b4d3e] border-b border-[#ebdcc9] pb-2">
                {isNewProduct ? 'Add New Agro Product' : `Edit ${editingProduct.name}`}
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full bg-[#f2ede4] border border-[#ebdcc9] rounded-lg px-3 py-2 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Category *</label>
                    <select
                      value={editingProduct.category || 'Spices & Herbs'}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full bg-[#f2ede4] border border-[#ebdcc9] rounded-lg px-3 py-2 text-xs font-bold"
                    >
                      <option>Spices & Herbs</option>
                      <option>Cereals & Grains</option>
                      <option>Pulses & Legumes</option>
                      <option>Oilseeds & Nuts</option>
                      <option>Mushrooms & Fungi</option>
                      <option>Processed & Dehydrated Foods</option>
                      <option>Ayurvedic & Herbal</option>
                      <option>Animal Feed & Agri By-products</option>
                      <option>Natural & Rural Products</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Price / kg (INR) *</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.pricePerKg || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, pricePerKg: Number(e.target.value) })}
                      className="w-full bg-[#f2ede4] border border-[#ebdcc9] rounded-lg px-3 py-2 text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">HS Code</label>
                    <input
                      type="text"
                      value={editingProduct.hsCode || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, hsCode: e.target.value })}
                      className="w-full bg-[#f2ede4] border border-[#ebdcc9] rounded-lg px-3 py-2 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Min Order Qty</label>
                    <input
                      type="text"
                      value={editingProduct.minOrderQty || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, minOrderQty: e.target.value })}
                      className="w-full bg-[#f2ede4] border border-[#ebdcc9] rounded-lg px-3 py-2 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Product Notes & Export Specs */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Product Notes & Export Specs</label>
                  <textarea
                    rows={3}
                    value={editingProduct.notes || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, notes: e.target.value })}
                    placeholder="Enter export specifications and product notes..."
                    className="w-full bg-[#f2ede4] border border-[#ebdcc9] rounded-lg p-2.5 text-xs"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 bg-slate-200 text-slate-800 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#1b4d3e] text-white font-bold text-xs rounded-xl hover:bg-[#12382c] shadow-md cursor-pointer"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
