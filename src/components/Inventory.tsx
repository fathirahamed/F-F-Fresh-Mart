import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X, Image as ImageIcon, Tag, Package, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface InventoryItem {
  id: string | number;
  name: string;
  category: string;
  image: string;
  price: number;
  stock: number;
  aiTag?: string | null;
}

interface InventoryProps {
  inventory: InventoryItem[];
  onAddProduct: (product: Omit<InventoryItem, 'id'>) => void;
  onDeleteProduct: (id: string | number) => void;
  onUpdateProduct: (id: string | number, updates: Partial<InventoryItem>) => void;
}

const BRAND_COLOR = '#0056b3';

export const Inventory: React.FC<InventoryProps> = ({ 
  inventory, 
  onAddProduct, 
  onDeleteProduct, 
  onUpdateProduct 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<InventoryItem, 'id'>>({
    name: '',
    category: 'Fish',
    image: '',
    price: 0,
    stock: 0,
    aiTag: ''
  });
  const [editForm, setEditForm] = useState<Partial<InventoryItem>>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isEdit) {
          setEditForm(prev => ({ ...prev, image: base64String }));
        } else {
          setNewProduct(prev => ({ ...prev, image: base64String }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    if (!newProduct.name || !newProduct.image || newProduct.price <= 0) {
      alert("Please fill in all required fields.");
      return;
    }
    onAddProduct(newProduct);
    setNewProduct({
      name: '',
      category: 'Fish',
      image: '',
      price: 0,
      stock: 0,
      aiTag: ''
    });
    setIsAdding(false);
  };

  const startEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const handleSave = (id: string | number) => {
    onUpdateProduct(id, editForm);
    setEditingId(null);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Product Inventory</h2>
          <p className="text-gray-500">Manage your store's products, stock, and pricing.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          {isAdding ? <X size={20} /> : <Plus size={20} />}
          {isAdding ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {/* Add Product Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-8 rounded-3xl shadow-xl border border-brand-sky/50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Product Name</label>
              <div className="relative">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="e.g. Fresh Salmon"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-sky outline-none"
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Category</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select 
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-sky outline-none appearance-none"
                  value={newProduct.category}
                  onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                >
                  <option value="Fish">Fish</option>
                  <option value="Meat">Meat</option>
                  <option value="Dried Fish">Dried Fish</option>
                  <option value="Grocery">Grocery</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Drinks">Drinks</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Product Image</label>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="file" 
                    accept="image/*"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-sky outline-none file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-sky file:text-brand-blue hover:file:bg-brand-blue hover:file:text-white"
                    onChange={e => handleFileChange(e)}
                  />
                </div>
                {newProduct.image && (
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200">
                    <img src={newProduct.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Price (Rs.)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="number" 
                  placeholder="0.00"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-sky outline-none"
                  value={newProduct.price || ''}
                  onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Stock Quantity</label>
              <div className="relative">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="number" 
                  placeholder="0"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-sky outline-none"
                  value={newProduct.stock || ''}
                  onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">AI Tag (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. Fresh Catch"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-sky outline-none"
                value={newProduct.aiTag || ''}
                onChange={e => setNewProduct({...newProduct, aiTag: e.target.value})}
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3 flex justify-end pt-4">
              <button 
                onClick={handleAdd}
                className="px-10 py-4 bg-brand-blue text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
              >
                Confirm Add Product
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">Product</th>
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">Category</th>
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">Price</th>
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">Stock</th>
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 relative group/img">
                        <img 
                          src={editingId === item.id ? editForm.image : item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {editingId === item.id && (
                          <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover/img:opacity-100 transition-opacity">
                            <ImageIcon size={16} className="text-white" />
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={e => handleFileChange(e, true)} 
                            />
                          </label>
                        )}
                      </div>
                      <div>
                        {editingId === item.id ? (
                          <input 
                            type="text" 
                            className="p-2 border rounded-lg focus:ring-2 focus:ring-brand-sky outline-none" 
                            value={editForm.name} 
                            onChange={e => setEditForm({...editForm, name: e.target.value})} 
                          />
                        ) : (
                          <>
                            <p className="font-bold text-gray-800">{item.name}</p>
                            {item.aiTag && (
                              <span className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                {item.aiTag}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    {editingId === item.id ? (
                      <select 
                        className="p-2 border rounded-lg focus:ring-2 focus:ring-brand-sky outline-none" 
                        value={editForm.category} 
                        onChange={e => setEditForm({...editForm, category: e.target.value})} 
                      >
                        <option value="Fish">Fish</option>
                        <option value="Meat">Meat</option>
                        <option value="Dried Fish">Dried Fish</option>
                        <option value="Grocery">Grocery</option>
                        <option value="Bakery">Bakery</option>
                        <option value="Drinks">Drinks</option>
                      </select>
                    ) : (
                      <span className="px-3 py-1 bg-brand-sky text-brand-blue rounded-full text-xs font-bold">
                        {item.category}
                      </span>
                    )}
                  </td>
                  <td className="p-6">
                    {editingId === item.id ? (
                      <input 
                        type="number" 
                        className="w-24 p-2 border rounded-lg focus:ring-2 focus:ring-brand-sky outline-none" 
                        value={editForm.price} 
                        onChange={e => setEditForm({...editForm, price: parseFloat(e.target.value)})} 
                      />
                    ) : (
                      <span className="font-bold text-gray-700">Rs. {item.price}</span>
                    )}
                  </td>
                  <td className="p-6">
                    {editingId === item.id ? (
                      <input 
                        type="number" 
                        className="w-20 p-2 border rounded-lg focus:ring-2 focus:ring-brand-sky outline-none" 
                        value={editForm.stock} 
                        onChange={e => setEditForm({...editForm, stock: parseInt(e.target.value)})} 
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${item.stock < 10 ? 'bg-red-500' : 'bg-green-500'}`} />
                        <span className="font-medium text-gray-600">{item.stock} in stock</span>
                      </div>
                    )}
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      {editingId === item.id ? (
                        <>
                          <button 
                            onClick={() => handleSave(item.id)}
                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            title="Save Changes"
                          >
                            <Save size={18} />
                          </button>
                          <button 
                            onClick={() => setEditingId(null)}
                            className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
                            title="Cancel"
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => startEdit(item)}
                            className="p-2 bg-brand-sky text-brand-blue rounded-lg hover:bg-brand-blue hover:text-white transition-all"
                            title="Edit Product"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${item.name}?`)) {
                                onDeleteProduct(item.id);
                              }
                            }}
                            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                            title="Delete Product"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {inventory.length === 0 && (
          <div className="p-20 text-center text-gray-400">
            <Package size={64} className="mx-auto mb-4 opacity-20" />
            <p className="text-xl font-medium">No products in inventory.</p>
          </div>
        )}
      </div>
    </div>
  );
};
