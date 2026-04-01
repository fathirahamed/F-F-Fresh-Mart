import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Menu, 
  X, 
  Home, 
  Package, 
  History, 
  PhoneCall, 
  HelpCircle, 
  User,
  LayoutDashboard,
  LogOut,
  ClipboardList,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { products } from './data/products';
import ProductCard from './components/ProductCard';
import CartModal from './components/CartModal';
import AuthModal from './components/AuthModal';
import ContactModal from './components/ContactModal';
import PolicyModal from './components/PolicyModal';
import { Inventory, InventoryItem } from './components/Inventory';
import { InvoiceGenerator } from './components/InvoiceGenerator';
import { CustomerManager, Customer } from './components/CustomerManager';
import Footer from './components/Footer';

export interface Order {
  id: string;
  items: any[];
  total: number;
  status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
  date: string;
  customer: {
    name: string;
    address: string;
    slot: string;
  };
}

const LOGO_URL = 'https://raw.githubusercontent.com/F-F-Mart-Official/F-F-Mart/main/images/fish%20mart%20logo.png';
const SHEETDB_URL = import.meta.env.VITE_SHEETDB_URL || 'https://sheetdb.io/api/v1/YOUR_API_ID'; 
const BRAND_COLOR = '#0056b3';

export default function App() {
  // App State
  const [showWelcome, setShowWelcome] = useState(true);
  const [view, setView] = useState<'client' | 'admin'>('client');
  const [activeTab, setActiveTab] = useState('home');
  const [adminTab, setAdminTab] = useState('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Products State
  const [allProducts, setAllProducts] = useState(products);
  
  // Customers State (CRM)
  const [customers, setCustomers] = useState<Customer[]>([
    { id: 1, name: 'Walking Customer', phone: '0000000000', address: 'Colombo', createdAt: new Date().toISOString() },
    { id: 2, name: 'Regular Client', phone: '0771234567', address: 'Dehiwala', createdAt: new Date().toISOString() }
  ]);

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Modal States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [policyType, setPolicyType] = useState<'terms' | 'privacy' | null>(null);
  
  // Cart State
  const [cart, setCart] = useState<any[]>([]);
  
  // Admin State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Welcome Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Cart Functions
  const addToCart = (product: any, variant: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.variant.id === variant.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id && item.variant.id === variant.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, variant, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (cartItem: any, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === cartItem.product.id && item.variant.id === cartItem.variant.id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (cartItem: any) => {
    setCart(prev => prev.filter(item => 
      !(item.product.id === cartItem.product.id && item.variant.id === cartItem.variant.id)
    ));
  };

  const handleCheckoutComplete = (userDetails: any) => {
    const subtotal = cart.reduce((sum, item) => sum + (item.variant.price * item.quantity), 0);
    const newOrder: Order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      items: [...cart],
      total: subtotal,
      status: 'Pending',
      date: new Date().toISOString(),
      customer: userDetails
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setActiveTab('orders');
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, allProducts]);

  const categories = ['All', ...new Set(allProducts.map(p => p.category))];

  // Admin CRUD Functions
  const handleAddProduct = (newProd: Omit<InventoryItem, 'id'>) => {
    const productToAdd = {
      ...newProd,
      id: Date.now(),
      variants: [{ id: `${Date.now()}-default`, name: 'Standard', price: newProd.price }]
    };
    setAllProducts(prev => [productToAdd, ...prev]);
  };

  const handleDeleteProduct = (id: string | number) => {
    setAllProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdateProduct = (id: string | number, updates: Partial<InventoryItem>) => {
    setAllProducts(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, ...updates };
        // If price updated, update the first variant as well
        if (updates.price !== undefined) {
          updated.variants = p.variants.map((v, i) => i === 0 ? { ...v, price: updates.price! } : v);
        }
        return updated;
      }
      return p;
    }));
  };

  // Customer CRUD Functions
  const handleAddCustomer = (newCust: Omit<Customer, 'id' | 'createdAt'>) => {
    const customerToAdd = {
      ...newCust,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    setCustomers(prev => [customerToAdd, ...prev]);
  };

  const handleDeleteCustomer = (id: string | number) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const handleUpdateCustomer = (id: string | number, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  // Render Client Portal
  if (view === 'client') {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <AnimatePresence>
          {showWelcome && (
            <motion.div 
              id="welcome-screen"
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="welcome-content">
                <img src={LOGO_URL} className="w-32 h-32 mx-auto mb-6 object-contain" alt="Logo" referrerPolicy="no-referrer" />
                <h1 className="text-4xl font-bold text-brand-blue mb-2">F&F Mart</h1>
                <p className="text-gray-500 mb-8">Freshness Delivered To Your Door Step</p>
                <div className="loader"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu size={24} />
              </button>
              <img src={LOGO_URL} alt="Logo" className="w-10 h-10 object-contain" referrerPolicy="no-referrer" />
              <h1 className="text-xl font-bold text-brand-blue hidden sm:block">F&F Mart</h1>
            </div>

            <div className="flex-1 max-w-2xl relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search fish, meat, or groceries..."
                className="w-full pl-12 pr-4 py-3 bg-gray-100 border-transparent focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-sky rounded-2xl transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-3 bg-brand-sky text-brand-blue rounded-2xl hover:bg-brand-blue hover:text-white transition-all group"
              >
                <ShoppingCart size={24} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setIsAuthOpen(true)}
                className="p-3 bg-gray-100 text-gray-600 rounded-2xl hover:bg-brand-blue hover:text-white transition-all"
              >
                <User size={24} />
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto flex relative">
          {/* Sidebar Backdrop */}
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              />
            )}
          </AnimatePresence>

          {/* Sidebar Navigation */}
          <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="h-full flex flex-col p-6">
              <div className="flex items-center justify-between mb-8 lg:hidden">
                <div className="flex items-center gap-2">
                  <img src={LOGO_URL} alt="Logo" className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
                  <span className="font-bold text-brand-blue">F&F Mart</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <nav className="space-y-2 flex-1">
                {[
                  { id: 'home', icon: Home, label: 'Home' },
                  { id: 'products', icon: Package, label: 'All Products' },
                  { id: 'orders', icon: ShoppingCart, label: 'My Orders' },
                  { id: 'history', icon: History, label: 'Order History' },
                  { id: 'contact', icon: PhoneCall, label: 'Contact Us' },
                  { id: 'help', icon: HelpCircle, label: 'Help & FAQ' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'contact') setIsContactOpen(true);
                      else setActiveTab(item.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === item.id ? 'bg-brand-blue text-white shadow-lg shadow-blue-100' : 'text-gray-500 hover:bg-brand-sky hover:text-brand-blue'}`}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="mt-8 p-6 bg-brand-blue rounded-3xl text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="font-bold mb-1">Need Help?</h4>
                  <p className="text-xs text-brand-sky opacity-80 mb-4">Our support team is available 24/7</p>
                  <button 
                    onClick={() => setIsContactOpen(true)}
                    className="w-full py-2 bg-white text-brand-blue rounded-xl text-sm font-bold hover:bg-brand-sky transition-colors"
                  >
                    Chat With Us
                  </button>
                </div>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full" />
              </div>
              
              <div className="mt-6 flex flex-col gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest px-4">
                <button onClick={() => setPolicyType('terms')} className="hover:text-brand-blue text-left">Terms & Conditions</button>
                <button onClick={() => setPolicyType('privacy')} className="hover:text-brand-blue text-left">Privacy Policy</button>
                <p className="mt-4 opacity-50">© 2026 F&F Mart</p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-8">
            {activeTab === 'home' && (
              <div className="space-y-8">
                {/* Hero Section */}
                <div className="bg-brand-blue rounded-[2rem] p-8 lg:p-12 text-white relative overflow-hidden shadow-2xl shadow-blue-100">
                  <div className="relative z-10 max-w-lg">
                    <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest mb-4">Fresh & Fast</span>
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">Premium Grocery Delivered to Your Door</h2>
                    <p className="text-brand-sky opacity-90 mb-8 text-lg">Experience the best quality fish, meat, and groceries in Colombo. Freshness guaranteed.</p>
                    <button 
                      onClick={() => setActiveTab('products')}
                      className="px-8 py-4 bg-white text-brand-blue rounded-2xl font-bold hover:bg-brand-sky transition-all shadow-lg"
                    >
                      Shop Now
                    </button>
                  </div>
                  <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-20 pointer-events-none">
                    <ShoppingCart size={300} className="translate-x-1/4 translate-y-1/4 rotate-12" />
                  </div>
                </div>

                {/* Featured Categories */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Popular Categories</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Fish', 'Meat', 'Grocery', 'Bakery'].map(cat => (
                      <button 
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setActiveTab('products');
                        }}
                        className="p-6 bg-white rounded-3xl border border-gray-100 hover:border-brand-blue hover:shadow-xl transition-all text-center group"
                      >
                        <div className="w-12 h-12 bg-brand-sky text-brand-blue rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-blue group-hover:text-white transition-all">
                          <Package size={24} />
                        </div>
                        <span className="font-bold text-gray-700">{cat}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {(activeTab === 'products' || activeTab === 'home') && (
              <div className={activeTab === 'home' ? 'mt-12' : ''}>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {activeTab === 'home' ? 'Featured Products' : 'All Products'}
                  </h3>
                  {activeTab === 'products' && (
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                      {filteredProducts.length} Items Found
                    </span>
                  )}
                </div>

                {/* Category Filter */}
                <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-brand-blue text-white shadow-md' : 'bg-white text-gray-500 hover:bg-brand-sky hover:text-brand-blue border border-gray-100'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAddToCart={addToCart} 
                    />
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className="col-span-full py-20 text-center text-gray-400">
                      <Package size={64} className="mx-auto mb-4 opacity-20" />
                      <p className="text-xl font-medium">No products found matching your search.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {(activeTab === 'orders' || activeTab === 'history') && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-gray-800">
                    {activeTab === 'orders' ? 'Current Orders' : 'Order History'}
                  </h2>
                  <div className="p-2 bg-brand-sky text-brand-blue rounded-xl font-bold text-xs uppercase">
                    {orders.length} Total
                  </div>
                </div>

                {orders.length === 0 ? (
                  <div className="py-20 text-center">
                    <div className="w-24 h-24 bg-gray-100 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                      <History size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h2>
                    <p className="text-gray-500 mb-8">You haven't placed any orders with us yet. Start shopping to see your orders here!</p>
                    <button 
                      onClick={() => setActiveTab('products')}
                      className="px-8 py-4 bg-brand-blue text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-50">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-brand-sky text-brand-blue rounded-2xl flex items-center justify-center font-bold">
                              #
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-800">{order.id}</h4>
                              <p className="text-xs text-gray-400">{new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                              order.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' :
                              order.status === 'Delivered' ? 'bg-green-50 text-green-600' :
                              'bg-blue-50 text-brand-blue'
                            }`}>
                              {order.status}
                            </span>
                            <span className="text-xl font-bold text-brand-blue">Rs. {order.total.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Items</p>
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span className="text-gray-600">{item.quantity}x {item.product.name} ({item.variant.name})</span>
                                  <span className="font-bold text-gray-800">Rs. {(item.variant.price * item.quantity).toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-3">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delivery Details</p>
                            <div className="p-4 bg-gray-50 rounded-2xl text-sm space-y-1">
                              <p className="font-bold text-gray-800">{order.customer.name}</p>
                              <p className="text-gray-500">{order.customer.address}</p>
                              <p className="text-brand-blue font-medium mt-2">Slot: {order.customer.slot}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'help' && (
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Help & FAQ</h2>
                  <p className="text-gray-500">Everything you need to know about F&F Mart.</p>
                </div>

                <div className="space-y-4">
                  {[
                    { q: "How do I place an order?", a: "Simply browse our products, add them to your cart, and click 'Order via WhatsApp'. This will send your order details directly to our team." },
                    { q: "What are your delivery areas?", a: "We currently deliver to all major areas in Colombo and suburbs including Dehiwala, Mount Lavinia, Rajagiriya, and Nugegoda." },
                    { q: "What is your refund policy?", a: "Items must be returned within 24 hours of delivery. Perishable goods are only eligible for refund if damaged upon arrival." },
                    { q: "How can I pay?", a: "We currently accept Cash on Delivery and Bank Transfers. Details will be shared once your order is confirmed via WhatsApp." },
                  ].map((faq, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 hover:border-brand-blue transition-all">
                      <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <HelpCircle size={18} className="text-brand-blue" />
                        {faq.q}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-brand-sky/30 p-8 rounded-[2rem] border border-brand-sky flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h4 className="text-xl font-bold text-brand-blue mb-1">Still have questions?</h4>
                    <p className="text-gray-600">Can't find the answer you're looking for? Please chat with our friendly team.</p>
                  </div>
                  <button 
                    onClick={() => setIsContactOpen(true)}
                    className="px-8 py-4 bg-brand-blue text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 whitespace-nowrap"
                  >
                    Contact Support
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>

        <Footer 
          onOpenPolicy={(type) => setPolicyType(type)}
          onOpenContact={() => setIsContactOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenHistory={() => setActiveTab('history')}
        />

        {/* Modals */}
        <CartModal 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          onCheckoutComplete={handleCheckoutComplete}
        />
        <AuthModal 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)} 
          onGuestLogin={() => setIsAuthOpen(false)}
          onAdminLogin={() => {
            setIsAuthOpen(false);
            setView('admin');
          }}
        />
        <ContactModal 
          isOpen={isContactOpen} 
          onClose={() => setIsContactOpen(false)} 
        />
        <PolicyModal 
          isOpen={!!policyType} 
          onClose={() => setPolicyType(null)} 
          type={policyType || 'terms'} 
        />
      </div>
    );
  }

  // Render Admin Portal
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {!isAdminAuthenticated ? (
        <div className="flex-1 flex items-center justify-center bg-brand-blue/5">
          <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
            <img src={LOGO_URL} alt="Logo" className="w-20 h-20 mx-auto mb-6 object-contain" referrerPolicy="no-referrer" />
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Staff Authentication</h2>
            <div className="space-y-4">
              <input 
                type="password" 
                placeholder="Enter Staff Access Key" 
                className="w-full p-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setIsAdminAuthenticated(true);
                }}
              />
              <button 
                onClick={() => setIsAdminAuthenticated(true)}
                className="w-full py-4 bg-brand-blue text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
              >
                Access Portal
              </button>
              <button 
                onClick={() => setView('client')}
                className="w-full py-2 text-sm font-bold text-gray-400 hover:text-brand-blue transition-colors"
              >
                Back to Client View
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Admin Sidebar */}
          <aside className="w-72 bg-white shadow-xl flex flex-col z-10">
            <div className="p-8 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <img src={LOGO_URL} alt="Logo" className="w-10 h-10 object-contain" referrerPolicy="no-referrer" />
                <span className="text-xl font-bold text-brand-blue">F&F Mart</span>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Agent Portal</span>
            </div>
            
            <nav className="flex-1 p-6 space-y-2">
              {[
                { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                { id: 'inventory', icon: Package, label: 'Inventory' },
                { id: 'customers', icon: User, label: 'CRM / Customers' },
                { id: 'invoice', icon: ClipboardList, label: 'Invoice Gen' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setAdminTab(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all ${adminTab === item.id ? 'bg-brand-blue text-white shadow-lg shadow-blue-100' : 'text-gray-500 hover:bg-brand-sky hover:text-brand-blue'}`}
                >
                  <item.icon size={20} />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="p-6 space-y-3">
              <button 
                onClick={() => setView('client')}
                className="w-full py-3 bg-brand-sky text-brand-blue rounded-2xl font-bold hover:bg-brand-blue hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Home size={18} /> Client View
              </button>
              <button 
                onClick={() => setIsAdminAuthenticated(false)} 
                className="w-full py-3 bg-red-50 text-red-500 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </aside>

          {/* Admin Main Content */}
          <main className="flex-1 p-8 overflow-auto bg-gray-50/50">
            {adminTab === 'inventory' && (
              <Inventory 
                inventory={allProducts.map(p => ({
                  id: p.id,
                  name: p.name,
                  category: p.category,
                  image: p.image,
                  price: p.variants[0]?.price || 0,
                  stock: 50, // Default stock for demo
                  aiTag: p.aiTag
                }))} 
                onAddProduct={handleAddProduct}
                onDeleteProduct={handleDeleteProduct}
                onUpdateProduct={handleUpdateProduct}
              />
            )}
            {adminTab === 'invoice' && (
              <InvoiceGenerator 
                inventory={allProducts.map(p => ({
                  id: p.id,
                  name: p.name,
                  category: p.category,
                  image: p.image,
                  price: p.variants[0]?.price || 0,
                  stock: 50
                }))} 
                customers={customers}
              />
            )}
            {adminTab === 'customers' && (
              <CustomerManager 
                customers={customers}
                onAddCustomer={handleAddCustomer}
                onDeleteCustomer={handleDeleteCustomer}
                onUpdateCustomer={handleUpdateCustomer}
              />
            )}
            {adminTab === 'dashboard' && (
              <div className="space-y-8">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <h1 className="text-3xl font-bold text-gray-800">Welcome back, Admin.</h1>
                  <p className="text-gray-500 mt-2">Here's what's happening in your store today.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100 group hover:border-brand-blue transition-all">
                    <div className="w-12 h-12 bg-blue-50 text-brand-blue rounded-2xl flex items-center justify-center mb-4 group-hover:bg-brand-blue group-hover:text-white transition-all">
                      <Package size={24} />
                    </div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Products</h3>
                    <p className="text-4xl font-bold text-gray-800 mt-2">{allProducts.length}</p>
                  </div>
                  
                  <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100 group hover:border-red-400 transition-all">
                    <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-red-500 group-hover:text-white transition-all">
                      <ClipboardList size={24} />
                    </div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Low Stock Items</h3>
                    <p className="text-4xl font-bold text-gray-800 mt-2">
                      {allProducts.filter(p => (p.stock || 50) < 10).length}
                    </p>
                  </div>
                  
                  <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100 group hover:border-green-400 transition-all">
                    <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-green-500 group-hover:text-white transition-all">
                      <DollarSign size={24} />
                    </div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Daily Revenue</h3>
                    <p className="text-4xl font-bold text-gray-800 mt-2">Rs. 42,500</p>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button onClick={() => setAdminTab('inventory')} className="p-4 bg-gray-50 rounded-2xl hover:bg-brand-sky hover:text-brand-blue transition-all font-bold text-gray-600">Manage Inventory</button>
                    <button onClick={() => setAdminTab('customers')} className="p-4 bg-gray-50 rounded-2xl hover:bg-brand-sky hover:text-brand-blue transition-all font-bold text-gray-600">Customer CRM</button>
                    <button onClick={() => setAdminTab('invoice')} className="p-4 bg-gray-50 rounded-2xl hover:bg-brand-sky hover:text-brand-blue transition-all font-bold text-gray-600">Generate Invoice</button>
                    <button onClick={() => setView('client')} className="p-4 bg-gray-50 rounded-2xl hover:bg-brand-sky hover:text-brand-blue transition-all font-bold text-gray-600">View Storefront</button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </>
      )}
    </div>
  );
}

