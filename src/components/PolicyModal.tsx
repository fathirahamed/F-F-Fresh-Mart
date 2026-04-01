import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy';
}

export default function PolicyModal({ isOpen, onClose, type }: PolicyModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
          >
            <div className="bg-brand-blue p-6 text-white flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-2xl font-bold">{type === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto prose prose-sm max-w-none">
              {type === 'terms' ? (
                <div className="space-y-4 text-gray-600">
                  <h3 className="text-lg font-bold text-gray-800">1. Acceptance of Terms</h3>
                  <p>By accessing and using F&F Mart, you agree to be bound by these Terms and Conditions. If you do not agree, please refrain from using our services.</p>
                  
                  <h3 className="text-lg font-bold text-gray-800">2. Ordering & Delivery</h3>
                  <p>Orders placed through WhatsApp are subject to availability. Delivery times are estimates and may vary based on location and demand. We reserve the right to refuse service to anyone for any reason at any time.</p>
                  
                  <h3 className="text-lg font-bold text-gray-800">3. Pricing & Payments</h3>
                  <p>All prices are in Sri Lankan Rupees (Rs.). Prices are subject to change without notice. Payments are typically handled via Cash on Delivery or bank transfer as agreed upon during the WhatsApp checkout process.</p>
                  
                  <h3 className="text-lg font-bold text-gray-800">4. Returns & Refunds</h3>
                  <p>Due to the perishable nature of our products (fish and meat), returns are only accepted at the time of delivery if the product does not meet quality standards. Please inspect your order upon arrival.</p>
                </div>
              ) : (
                <div className="space-y-4 text-gray-600">
                  <h3 className="text-lg font-bold text-gray-800">1. Information Collection</h3>
                  <p>We collect minimal information required to process your orders, including your name, delivery address, and contact number. This information is shared with our delivery partners solely for fulfillment purposes.</p>
                  
                  <h3 className="text-lg font-bold text-gray-800">2. Data Usage</h3>
                  <p>Your data is used to provide and improve our services, communicate with you about your orders, and for internal record-keeping. We do not sell or rent your personal information to third parties.</p>
                  
                  <h3 className="text-lg font-bold text-gray-800">3. Security</h3>
                  <p>We implement reasonable security measures to protect your information. However, please be aware that no method of transmission over the internet is 100% secure.</p>
                  
                  <h3 className="text-lg font-bold text-gray-800">4. Your Rights</h3>
                  <p>You have the right to request access to the personal information we hold about you and to ask for it to be corrected or deleted. Contact us via WhatsApp for any privacy-related inquiries.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
