import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

interface FooterProps {
  onOpenPolicy: (type: 'terms' | 'privacy') => void;
  onOpenContact: () => void;
  onOpenAuth: () => void;
  onOpenHistory: () => void;
}

export default function Footer({ onOpenPolicy, onOpenContact, onOpenAuth, onOpenHistory }: FooterProps) {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-brand-blue">F&F Mart</h2>
            <p className="text-gray-500 leading-relaxed max-w-sm">
              Welcome to Sri Lanka's first inspirational experience in online grocery retailing. 
              Freshness delivered right to your doorstep.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-gray-500">
                <MapPin className="w-5 h-5 text-brand-blue shrink-0 mt-1" />
                <span>123, Pelyagoda market, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500">
                <Phone className="w-5 h-5 text-brand-blue shrink-0" />
                <span>0770599229</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500">
                <Mail className="w-5 h-5 text-brand-blue shrink-0" />
                <span>ahamedfathir8@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Useful Links Column */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6">Useful Links</h3>
            <ul className="space-y-4">
              <li>
                <button onClick={onOpenAuth} className="text-gray-500 hover:text-brand-blue transition-colors">
                  My Account
                </button>
              </li>
              <li>
                <button onClick={onOpenHistory} className="text-gray-500 hover:text-brand-blue transition-colors">
                  Order History
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('privacy')} className="text-gray-500 hover:text-brand-blue transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('terms')} className="text-gray-500 hover:text-brand-blue transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={onOpenContact} className="text-gray-500 hover:text-brand-blue transition-colors">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Follow Us Column */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-brand-blue hover:text-white transition-all">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-brand-blue hover:text-white transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-brand-blue hover:text-white transition-all">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} F&F Mart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
