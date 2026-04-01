import React, { useState, useEffect } from 'react';
import { jsPDF } from "jspdf";
import { FileText, Plus, Send, Trash2, User, MapPin, Phone, ShoppingBag, Building2, ShieldCheck } from 'lucide-react';
import { InventoryItem } from './Inventory';
import { Customer } from './CustomerManager';

interface InvoiceGeneratorProps {
  inventory: InventoryItem[];
  customers: Customer[];
}

const BRAND_COLOR = '#0056b3';
const DELIVERY_FEE = 350;

// Shop Details
const SHOP_DETAILS = {
  name: "F&F MART",
  address: "No. 123, Main Street, Colombo 03, Sri Lanka",
  phone: "+94 77 123 4567",
  email: "orders@ffmart.lk",
  logo: "https://raw.githubusercontent.com/F-F-Mart-Official/F-F-Mart-Official/main/images/fish%20mart%20logo.png",
  refundPolicy: "Refund Policy: Items must be returned within 24 hours of delivery. Perishable goods are only eligible for refund if damaged upon arrival. Proof of purchase is required."
};

interface CartItem extends InventoryItem {
  qty: number;
}

export const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({ inventory, customers }) => {
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' });
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [qty, setQty] = useState(1);

  // Auto-fill customer details when a customer is selected from CRM
  useEffect(() => {
    if (selectedCustomerId) {
      const found = customers.find(c => c.id.toString() === selectedCustomerId);
      if (found) {
        setCustomer({
          name: found.name,
          phone: found.phone,
          address: found.address
        });
      }
    }
  }, [selectedCustomerId, customers]);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const total = subtotal > 0 ? subtotal + DELIVERY_FEE : 0;

  const addToCart = () => {
    const product = inventory.find(p => p.id.toString() === selectedProduct);
    if (product) {
      const existing = cart.find(item => item.id === product.id);
      if (existing) {
        setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + Number(qty) } : item));
      } else {
        setCart([...cart, { ...product, qty: Number(qty) }]);
      }
      setSelectedProduct('');
      setQty(1);
    }
  };

  const removeFromCart = (idx: number) => {
    setCart(cart.filter((_, i) => i !== idx));
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    
    // Header Background
    doc.setFillColor(0, 86, 179); // #0056b3
    doc.rect(0, 0, 210, 50, 'F');
    
    // Try to add logo
    try {
      const img = new Image();
      img.src = SHOP_DETAILS.logo;
      img.crossOrigin = "Anonymous";
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      // Draw a white circle background for the logo
      doc.setFillColor(255, 255, 255);
      doc.circle(30, 25, 15, 'F');
      doc.addImage(img, 'PNG', 18, 13, 24, 24);
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.text(SHOP_DETAILS.name, 50, 25);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(SHOP_DETAILS.address, 50, 32);
      doc.text(`Phone: ${SHOP_DETAILS.phone} | Email: ${SHOP_DETAILS.email}`, 50, 38);
    } catch (e) {
      // Fallback if logo fails to load
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.text(SHOP_DETAILS.name, 15, 25);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(SHOP_DETAILS.address, 15, 32);
      doc.text(`Phone: ${SHOP_DETAILS.phone} | Email: ${SHOP_DETAILS.email}`, 15, 38);
    }

    // Invoice Meta
    doc.setFontSize(12);
    doc.text("INVOICE", 150, 20, { align: "right" });
    doc.setFontSize(10);
    doc.text(`Invoice #: ${Date.now().toString().slice(-6)}`, 150, 28, { align: "right" });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 34, { align: "right" });

    // Customer Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO:", 15, 65);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`${customer.name}`, 15, 72);
    doc.text(`${customer.phone}`, 15, 79);
    doc.text(`${customer.address}`, 15, 86, { maxWidth: 80 });

    // Table Header
    doc.setFillColor(245, 247, 250);
    doc.rect(15, 100, 180, 10, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("DESCRIPTION", 20, 106.5);
    doc.text("QTY", 120, 106.5);
    doc.text("PRICE (Rs)", 145, 106.5);
    doc.text("TOTAL (Rs)", 175, 106.5);

    // Table Items
    let y = 117;
    doc.setFont("helvetica", "normal");
    cart.forEach(item => {
      doc.text(item.name, 20, y);
      doc.text(item.qty.toString(), 120, y);
      doc.text(item.price.toLocaleString(), 145, y);
      doc.text((item.price * item.qty).toLocaleString(), 175, y);
      y += 10;
      
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
    });

    // Totals
    y += 5;
    doc.setDrawColor(230, 230, 230);
    doc.line(15, y, 195, y);
    y += 10;
    doc.setFontSize(11);
    doc.text("Subtotal:", 140, y);
    doc.text(`Rs. ${subtotal.toLocaleString()}`, 175, y);
    y += 8;
    doc.text("Delivery Fee:", 140, y);
    doc.text(`Rs. ${DELIVERY_FEE.toLocaleString()}`, 175, y);
    y += 10;
    doc.setFillColor(0, 86, 179);
    doc.rect(135, y - 6, 60, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL:", 140, y);
    doc.text(`Rs. ${total.toLocaleString()}`, 175, y);

    // Refund Policy
    y += 30;
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("REFUND POLICY:", 15, y);
    doc.setFont("helvetica", "normal");
    doc.text(SHOP_DETAILS.refundPolicy, 15, y + 5, { maxWidth: 180 });

    // Footer
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for shopping with F&F Mart!", 105, 285, { align: "center" });

    doc.save(`Invoice_${customer.name.replace(/\s+/g, '_')}.pdf`);
  };

  const sendWhatsApp = () => {
    let phone = customer.phone.replace(/^0/, '94').replace(/\D/g, '');
    let text = `Hello ${customer.name},%0A%0AHere is your order summary from *F&F Mart*:%0A`;
    cart.forEach(item => {
      text += `- ${item.name} x${item.qty} (Rs. ${item.price * item.qty})%0A`;
    });
    text += `%0ADelivery: Rs. ${DELIVERY_FEE}%0A*Total: Rs. ${total}*%0A%0AWe will deliver to: ${customer.address}.`;
    
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Form Section */}
      <div className="xl:col-span-2 space-y-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-brand-sky text-brand-blue rounded-2xl">
                <User size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Customer Details</h2>
            </div>
            
            {/* CRM Selection */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Select from CRM:</label>
              <select 
                className="px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-sky"
                value={selectedCustomerId}
                onChange={e => setSelectedCustomerId(e.target.value)}
              >
                <option value="">New Customer</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-sky outline-none"
                  value={customer.name}
                  onChange={e => setCustomer({...customer, name: e.target.value})} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">WhatsApp Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="0771234567" 
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-sky outline-none"
                  value={customer.phone}
                  onChange={e => setCustomer({...customer, phone: e.target.value})} 
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Delivery Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
                <textarea 
                  placeholder="Enter full delivery address in Colombo..." 
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-sky outline-none min-h-[100px]"
                  value={customer.address}
                  onChange={e => setCustomer({...customer, address: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-brand-sky text-brand-blue rounded-2xl">
              <ShoppingBag size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Add Items</h2>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Select Product</label>
              <select 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-sky outline-none appearance-none"
                value={selectedProduct}
                onChange={e => setSelectedProduct(e.target.value)}
              >
                <option value="">Choose a product...</option>
                {inventory.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} - Rs. {item.price}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="w-full md:w-32 space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Qty</label>
              <input 
                type="number" 
                min="1" 
                value={qty} 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-sky outline-none"
                onChange={e => setQty(Number(e.target.value))} 
              />
            </div>

            <div className="flex items-end">
              <button 
                onClick={addToCart}
                className="w-full md:w-auto px-8 py-3 bg-brand-blue text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
              >
                <Plus size={20} /> Add to List
              </button>
            </div>
          </div>
        </div>

        {/* Shop Info Preview */}
        <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50">
          <div className="flex items-center gap-2 mb-4 text-brand-blue">
            <Building2 size={20} />
            <h3 className="font-bold">Shop Information (on Invoice)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 font-bold uppercase text-[10px]">Shop Name</p>
              <p className="text-gray-700 font-medium">{SHOP_DETAILS.name}</p>
            </div>
            <div>
              <p className="text-gray-400 font-bold uppercase text-[10px]">Contact</p>
              <p className="text-gray-700 font-medium">{SHOP_DETAILS.phone} | {SHOP_DETAILS.email}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-400 font-bold uppercase text-[10px]">Address</p>
              <p className="text-gray-700 font-medium">{SHOP_DETAILS.address}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-100/50">
            <div className="flex items-center gap-2 mb-2 text-green-600">
              <ShieldCheck size={18} />
              <p className="text-xs font-bold uppercase">Refund Policy Included</p>
            </div>
            <p className="text-xs text-gray-500 italic">{SHOP_DETAILS.refundPolicy}</p>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col min-h-[500px]">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
          
          <div className="flex-1 space-y-4 overflow-auto max-h-[400px] pr-2 no-scrollbar">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 text-center">
                <ShoppingBag size={48} className="mb-4 opacity-20" />
                <p className="font-medium italic">No items added to invoice yet.</p>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group">
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.qty} x Rs. {item.price}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-brand-blue">Rs. {item.price * item.qty}</span>
                    <button 
                      onClick={() => removeFromCart(idx)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
            <div className="flex justify-between text-gray-500 font-medium">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-500 font-medium">
              <span>Delivery Fee</span>
              <span>Rs. {DELIVERY_FEE.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-2xl font-bold text-brand-blue pt-2">
              <span>Total</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3">
            <button 
              onClick={generatePDF}
              disabled={cart.length === 0 || !customer.name}
              className="w-full py-4 bg-brand-blue text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText size={20} /> Generate PDF Invoice
            </button>
            <button 
              onClick={sendWhatsApp}
              disabled={cart.length === 0 || !customer.phone}
              className="w-full py-4 bg-green-500 text-white rounded-2xl font-bold hover:bg-green-600 transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} /> Send via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
