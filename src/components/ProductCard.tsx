import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';

interface Variant {
  id: string;
  name: string;
  price: number;
}

interface Product {
  id: number | string;
  name: string;
  category: string;
  aiTag: string | null;
  image: string;
  variants: Variant[];
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, variant: Variant) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);

  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-transparent hover:border-brand-blue transition-all duration-300 overflow-hidden flex flex-col group">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className="bg-brand-blue text-white text-xs font-bold px-2 py-1 rounded shadow">
            {product.category}
          </span>
          {product.aiTag && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
              🌿 {product.aiTag}
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-800 text-lg mb-1 leading-tight">{product.name}</h3>
        
        <div className="mt-auto pt-3">
          <label className="text-xs text-gray-500 mb-1 block">Select Size/Weight:</label>
          <select 
            className="w-full p-2 border border-gray-200 rounded bg-gray-50 focus:outline-none focus:border-brand-blue transition-colors mb-3"
            value={selectedVariant.id}
            onChange={(e) => {
              const variant = product.variants.find(v => v.id === e.target.value);
              if (variant) setSelectedVariant(variant);
            }}
          >
            {product.variants.map(v => (
              <option key={v.id} value={v.id}>{v.name} - Rs. {v.price}</option>
            ))}
          </select>

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-brand-blue">
              Rs. {selectedVariant.price}
            </span>
            <button 
              onClick={() => onAddToCart(product, selectedVariant)}
              className="bg-brand-sky text-brand-blue hover:bg-brand-blue hover:text-white p-2 rounded-full transition-colors flex items-center justify-center shadow-sm cursor-pointer"
              title="Add to Cart"
            >
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
