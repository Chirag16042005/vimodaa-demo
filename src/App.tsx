import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order, Currency } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './data/mockData';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer, PACKAGING_OPTIONS } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { SocialMediaSection } from './components/SocialMediaSection';
import { Footer } from './components/Footer';
import { Filter, Leaf, RefreshCw } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Currency
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTradeFormFilter, setSelectedTradeFormFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currency, setCurrency] = useState<Currency>('INR');

  // Shopping Bag
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [packagingOption, setPackagingOption] = useState<string>(PACKAGING_OPTIONS[0]);

  // Modals & Admin Auth State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, ordRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
      ]);

      if (prodRes.ok && ordRes.ok) {
        const prodData = await prodRes.json();
        const ordData = await ordRes.json();

        if (prodData.success) setProducts(prodData.products);
        else setProducts(INITIAL_PRODUCTS);

        if (ordData.success) setOrders(ordData.orders);
        else setOrders(INITIAL_ORDERS);
      } else {
        setProducts(INITIAL_PRODUCTS);
        setOrders(INITIAL_ORDERS);
      }
    } catch (err) {
      console.log('API offline (static Netlify mode), loading embedded dataset:', err);
      setProducts(INITIAL_PRODUCTS);
      setOrders(INITIAL_ORDERS);
    } finally {
      setLoading(false);
    }
  };

  // Add item to shopping bag
  const handleAddToCart = (
    product: Product,
    selectedTradeForm: string,
    selectedWeightLabel: string,
    weightInKg: number,
    quantity: number,
    unitPrice: number
  ) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedTradeForm === selectedTradeForm &&
          item.selectedWeightLabel === selectedWeightLabel
      );

      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            product,
            selectedTradeForm,
            selectedWeightLabel,
            weightInKg,
            quantity,
            unitPrice,
          },
        ];
      }
    });

    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleOrderSuccess = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
  };

  // Filter products logic
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.varieties.some((v) => v.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.tradeForms.some((tf) => tf.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTradeForm =
      selectedTradeFormFilter === 'All' ||
      p.tradeForms.some((tf) =>
        tf.toLowerCase().includes(selectedTradeFormFilter.toLowerCase())
      );

    return matchesCategory && matchesSearch && matchesTradeForm;
  });

  const featuredProducts = products.filter((p) => p.isFeatured);

  const handleToggleAdmin = () => {
    if (isAdminView) {
      setIsAdminView(false);
    } else if (isAdminAuthenticated) {
      setIsAdminView(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f7f2] text-slate-900 font-sans">
      {/* Header Bar */}
      <Header
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        currency={currency}
        onCurrencyChange={setCurrency}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onToggleAdmin={handleToggleAdmin}
        isAdminView={isAdminView}
      />

      {/* ADMIN DASHBOARD VIEW */}
      {isAdminView ? (
        <AdminDashboard
          products={products}
          orders={orders}
          currency={currency}
          onRefreshData={fetchData}
          onExitAdmin={() => setIsAdminView(false)}
        />
      ) : (
        <main className="flex-1">
          {/* Hero Section */}
          <Hero
            onExploreClick={() => {
              const el = document.getElementById('catalog-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenTracking={() => setIsTrackingOpen(true)}
          />

          {/* Featured Collections Spotlight */}
          {selectedCategory === 'All' && searchQuery === '' && featuredProducts.length > 0 && (
            <section className="py-10 bg-[#f2ede4] border-b border-[#ebdcc9]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 border-b border-[#ebdcc9] pb-3">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-[#8c501e]">
                      Export Grade Highlights
                    </div>
                    <h2 className="font-serif-display text-3xl font-bold text-[#1b4d3e]">
                      Featured Spice & Produce Harvest
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredProducts.slice(0, 4).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      currency={currency}
                      onAddToCart={handleAddToCart}
                      onViewDetails={(p) => setSelectedProductDetail(p)}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Main Catalog Section */}
          <section id="catalog-section" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Catalog Filter Header Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-[#ebdcc9] shadow-xs">
              <div>
                <h2 className="font-serif-display text-2xl font-bold text-[#1b4d3e]">
                  {selectedCategory === 'All' ? 'Complete Product Storefront' : selectedCategory}
                </h2>
                <div className="text-xs text-slate-500 font-medium">
                  Showing <span className="font-bold text-slate-800">{filteredProducts.length}</span> export quality items
                </div>
              </div>

              {/* Secondary Trade Form Segmented Controls */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-bold uppercase text-[10px] mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Form:
                </span>
                {['All', 'Whole', 'Powder', 'Flakes', 'Grain', 'Kernels'].map((form) => (
                  <button
                    key={form}
                    onClick={() => setSelectedTradeFormFilter(form)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                      selectedTradeFormFilter === form
                        ? 'bg-[#1b4d3e] text-white shadow-xs'
                        : 'bg-[#f2ede4] text-slate-700 hover:bg-[#ebdcc9]'
                    }`}
                  >
                    {form}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="py-16 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-[#1b4d3e] animate-spin mx-auto" />
                <p className="text-xs text-slate-600 font-medium">Loading Vimodaa Agro product catalog...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-xl border border-[#ebdcc9] space-y-3">
                <div className="w-12 h-12 bg-[#f2ede4] text-[#1b4d3e] rounded-full flex items-center justify-center mx-auto">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="font-serif-display text-xl font-bold text-[#1b4d3e]">
                  No products found for "{searchQuery || selectedCategory}"
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try adjusting your search keyword or resetting category filters to explore our full harvest range.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedTradeFormFilter('All');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-[#1b4d3e] text-white text-xs font-bold rounded-lg hover:bg-[#12382c] cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    currency={currency}
                    onAddToCart={handleAddToCart}
                    onViewDetails={(p) => setSelectedProductDetail(p)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Social Media Section */}
          <div id="social-section">
            <SocialMediaSection />
          </div>
        </main>
      )}

      {/* Footer */}
      <Footer />

      {/* Modals & Slide-over Drawers */}
      <ProductDetailModal
        product={selectedProductDetail}
        currency={currency}
        onClose={() => setSelectedProductDetail(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        currency={currency}
        packagingOption={packagingOption}
        onSelectPackaging={setPackagingOption}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        packagingOption={packagingOption}
        currency={currency}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        orders={orders}
        currency={currency}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdminAuthenticated(true);
          setIsAdminView(true);
        }}
      />
    </div>
  );
}
