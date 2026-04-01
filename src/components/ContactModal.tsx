import { X, Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
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
            className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="bg-brand-blue p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Contact Us</h2>
                <p className="text-brand-sky text-sm">We're here to help you!</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-brand-sky transition-colors">
                <div className="p-3 bg-brand-sky/20 text-brand-blue rounded-xl">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number</p>
                  <p className="text-lg font-bold text-gray-800">0770599229</p>
                  <a href="tel:0770599229" className="text-sm text-brand-blue font-medium hover:underline">Call Now</a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-brand-sky transition-colors">
                <div className="p-3 bg-brand-sky/20 text-brand-blue rounded-xl">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                  <p className="text-lg font-bold text-gray-800 break-all">ahamedfathir8@gmail.com</p>
                  <a href="mailto:ahamedfathir8@gmail.com" className="text-sm text-brand-blue font-medium hover:underline">Send Email</a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-brand-sky transition-colors">
                <div className="p-3 bg-brand-sky/20 text-brand-blue rounded-xl">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Our Location</p>
                  <p className="text-lg font-bold text-gray-800">123, Pelyagoda market, Sri Lanka</p>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => window.open('https://wa.me/94770599229', '_blank')}
                  className="w-full py-4 bg-[#25D366] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-green-200"
                >
                  <MessageSquare size={20} />
                  Chat on WhatsApp
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
