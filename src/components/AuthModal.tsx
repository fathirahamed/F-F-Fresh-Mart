import { X, Mail, Phone, Lock, ArrowRight, ShoppingBag, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGuestLogin: () => void;
  onAdminLogin: () => void;
}

export default function AuthModal({ isOpen, onClose, onGuestLogin, onAdminLogin }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');

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
            <div className="bg-brand-blue p-8 text-white text-center relative">
              <button 
                onClick={onClose} 
                className="absolute right-4 top-4 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
              <div className="bg-brand-sky/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={32} className="text-brand-sky" />
              </div>
              <h2 className="text-3xl font-bold mb-2">{isLogin ? 'Welcome Back!' : 'Join F&F Mart'}</h2>
              <p className="text-brand-sky text-sm opacity-80">
                {isLogin ? 'Sign in to access your orders and history' : 'Create an account for a faster checkout experience'}
              </p>
            </div>

            <div className="p-8">
              <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-8">
                <button
                  onClick={() => setAuthMethod('email')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${authMethod === 'email' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-500 hover:text-brand-blue'}`}
                >
                  <Mail size={16} />
                  Email
                </button>
                <button
                  onClick={() => setAuthMethod('phone')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${authMethod === 'phone' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-500 hover:text-brand-blue'}`}
                >
                  <Phone size={16} />
                  Mobile
                </button>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                    {authMethod === 'email' ? 'Email Address' : 'Mobile Number'}
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      {authMethod === 'email' ? <Mail size={20} /> : <Phone size={20} />}
                    </div>
                    <input
                      type={authMethod === 'email' ? 'email' : 'tel'}
                      placeholder={authMethod === 'email' ? 'example@mail.com' : '077 123 4567'}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-sky focus:bg-white transition-all text-gray-800 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Password</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock size={20} />
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-sky focus:bg-white transition-all text-gray-800 font-medium"
                    />
                  </div>
                </div>

                {isLogin && (
                  <div className="text-right">
                    <button type="button" className="text-xs font-bold text-brand-blue hover:underline">Forgot Password?</button>
                  </div>
                )}

                <button className="w-full py-4 bg-brand-blue text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 mt-4 group">
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="mt-6 flex flex-col gap-3">
                <button 
                  onClick={onGuestLogin}
                  className="w-full py-3 border-2 border-brand-sky text-brand-blue rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-sky/20 transition-colors"
                >
                  <User size={18} />
                  Continue as Guest
                </button>
                
                <button 
                  onClick={onAdminLogin}
                  className="w-full py-2 text-xs font-bold text-gray-400 hover:text-brand-blue transition-colors uppercase tracking-widest"
                >
                  Staff Login
                </button>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-2 font-bold text-brand-blue hover:underline"
                  >
                    {isLogin ? 'Register Now' : 'Sign In'}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
