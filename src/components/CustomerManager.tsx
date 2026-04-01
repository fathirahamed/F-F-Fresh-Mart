import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X, User, Phone, MapPin, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface Customer {
  id: string | number;
  name: string;
  phone: string;
  address: string;
  email?: string;
  createdAt: string;
}

interface CustomerManagerProps {
  customers: Customer[];
  onAddCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  onDeleteCustomer: (id: string | number) => void;
  onUpdateCustomer: (id: string | number, updates: Partial<Customer>) => void;
}

const BRAND_COLOR = '#0056b3';

export const CustomerManager: React.FC<CustomerManagerProps> = ({ 
  customers, 
  onAddCustomer, 
  onDeleteCustomer, 
  onUpdateCustomer 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id' | 'createdAt'>>({
    name: '',
    phone: '',
    address: '',
    email: ''
  });
  const [editForm, setEditForm] = useState<Partial<Customer>>({});

  const handleAdd = () => {
    if (!newCustomer.name || !newCustomer.phone) {
      alert("Please fill in name and phone number.");
      return;
    }
    onAddCustomer(newCustomer);
    setNewCustomer({
      name: '',
      phone: '',
      address: '',
      email: ''
    });
    setIsAdding(false);
  };

  const startEdit = (customer: Customer) => {
    setEditingId(customer.id);
    setEditForm({ ...customer });
  };

  const handleSave = (id: string | number) => {
    onUpdateCustomer(id, editForm);
    setEditingId(null);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Customer Relationship Management</h2>
          <p className="text-gray-500">Manage your customer database and contact information.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          {isAdding ? <X size={20} /> : <Plus size={20} />}
          {isAdding ? 'Cancel' : 'Add New Customer'}
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search by name or phone..." 
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-brand-sky outline-none"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Add Customer Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-8 rounded-3xl shadow-xl border border-brand-sky/50 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="e.g. John Doe"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-sky outline-none"
                  value={newCustomer.name}
                  onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="0771234567"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-sky outline-none"
                  value={newCustomer.phone}
                  onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
                <textarea 
                  placeholder="Enter full address..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-sky outline-none min-h-[80px]"
                  value={newCustomer.address}
                  onChange={e => setNewCustomer({...newCustomer, address: e.target.value})}
                />
              </div>
            </div>

            <div className="flex justify-end md:col-span-2 pt-4">
              <button 
                onClick={handleAdd}
                className="px-10 py-4 bg-brand-blue text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
              >
                Save Customer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">Customer</th>
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">Contact</th>
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">Address</th>
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-sky text-brand-blue flex items-center justify-center font-bold">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        {editingId === c.id ? (
                          <input 
                            className="p-2 border rounded" 
                            value={editForm.name} 
                            onChange={e => setEditForm({...editForm, name: e.target.value})} 
                          />
                        ) : (
                          <p className="font-bold text-gray-800">{c.name}</p>
                        )}
                        <p className="text-xs text-gray-400">Added on {new Date(c.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    {editingId === c.id ? (
                      <input 
                        className="p-2 border rounded" 
                        value={editForm.phone} 
                        onChange={e => setEditForm({...editForm, phone: e.target.value})} 
                      />
                    ) : (
                      <span className="font-medium text-gray-600">{c.phone}</span>
                    )}
                  </td>
                  <td className="p-6">
                    {editingId === c.id ? (
                      <textarea 
                        className="p-2 border rounded w-full" 
                        value={editForm.address} 
                        onChange={e => setEditForm({...editForm, address: e.target.value})} 
                      />
                    ) : (
                      <span className="text-sm text-gray-500 line-clamp-1">{c.address}</span>
                    )}
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      {editingId === c.id ? (
                        <>
                          <button 
                            onClick={() => handleSave(c.id)}
                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            <Save size={18} />
                          </button>
                          <button 
                            onClick={() => setEditingId(null)}
                            className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => startEdit(c)}
                            className="p-2 bg-brand-sky text-brand-blue rounded-lg hover:bg-brand-blue hover:text-white transition-all"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm(`Delete ${c.name}?`)) {
                                onDeleteCustomer(c.id);
                              }
                            }}
                            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
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
        {filteredCustomers.length === 0 && (
          <div className="p-20 text-center text-gray-400">
            <User size={64} className="mx-auto mb-4 opacity-20" />
            <p className="text-xl font-medium">No customers found.</p>
          </div>
        )}
      </div>
    </div>
  );
};
