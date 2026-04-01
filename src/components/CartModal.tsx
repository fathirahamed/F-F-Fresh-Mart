import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { generateWhatsAppMessage } from '../utils/whatsapp';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: any[];
  updateQuantity: (cartItem: any, delta: number) => void;
  removeFromCart: (cartItem: any) => void;
  onCheckoutComplete: (userDetails: any) => void;
}

export default function CartModal({ isOpen, onClose, cart, updateQuantity, removeFromCart, onCheckoutComplete }: CartModalProps) {
  const [userDetails, setUserDetails] = useState({ name: '', address: '', slot: 'ASAP' });
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');

  const subtotal = cart.reduce((sum, item) => sum + (item.variant.price * item.quantity), 0);

  const handleCheckout = () => {
    if (step === 'cart') {
      setStep('checkout');
    } else {
      if (!userDetails.name || !userDetails.address) {
        alert("Please fill in your details.");
        return;
      }
      generateWhatsAppMessage(cart, userDetails);
      onCheckoutComplete(userDetails);
      onClose();
      setStep('cart'); // Reset for next time
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col"
          >
            <div className="p-6 bg-brand-blue text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ShoppingBag size={24} />
                <h2 className="text-xl font-bold">{step === 'cart' ? 'Your Cart' : 'Checkout Details'}</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {step === 'cart' ? (
                cart.length > 0 ? (
                  <div className="space-y-6">
                    {cart.map((item, idx) => (
                      <div key={`${item.product.id}-${item.variant.id}`} className="flex gap-4 items-center">
                        <img src={item.product.image} className="w-16 h-16 object-cover rounded-lg" alt={item.product.name} />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800">{item.product.name}</h4>
                          <p className="text-xs text-gray-500">{item.variant.name}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <button onClick={() => updateQuantity(item, -1)} className="p-1 bg-gray-100 rounded hover:bg-gray-200"><Minus size={14} /></button>
                            <span className="font-bold text-sm">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item, 1)} className="p-1 bg-gray-100 rounded hover:bg-gray-200"><Plus size={14} /></button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-brand-blue">Rs. {item.variant.price * item.quantity}</p>
                          <button onClick={() => removeFromCart(item)} className="text-red-500 hover:text-red-700 mt-1"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <ShoppingBag size={64} className="mb-4 opacity-20" />
                    <p>Your cart is empty</p>
                  </div>
                )
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-brand-sky outline-none"
                      placeholder="Enter your name"
                      value={userDetails.name}
                      onChange={e => setUserDetails({...userDetails, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Delivery Address</label>
                    <textarea 
                      className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-brand-sky outline-none h-24"
                      placeholder="Enter full address"
                      value={userDetails.address}
                      onChange={e => setUserDetails({...userDetails, address: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Delivery Slot</label>
                    <select 
                      className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-brand-sky outline-none"
                      value={userDetails.slot}
                      onChange={e => setUserDetails({...userDetails, slot: e.target.value})}
                    >
                      <option value="ASAP">As soon as possible</option>
                      <option value="Morning">Morning (8 AM - 12 PM)</option>
                      <option value="Afternoon">Afternoon (12 PM - 4 PM)</option>
                      <option value="Evening">Evening (4 PM - 8 PM)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-2xl font-bold text-brand-blue">Rs. {subtotal}</span>
              </div>
              <div className="flex gap-3">
                {step === 'checkout' && (
                  <button 
                    onClick={() => setStep('cart')}
                    className="flex-1 py-4 border border-gray-300 rounded-2xl font-bold text-gray-600 hover:bg-white transition-colors"
                  >
                    Back
                  </button>
                )}
                <button 
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className="flex-[2] py-4 bg-brand-blue text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {step === 'cart' ? 'Proceed to Checkout' : 'Order via WhatsApp'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
