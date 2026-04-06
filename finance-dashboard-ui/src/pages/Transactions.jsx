import React, { useState, useMemo, useEffect } from 'react';
import { useFinance } from '../contexts/FinanceContext';

const Transactions = () => {
  const { transactions, categories, filters, updateFilters, userRole, addTransaction, updateTransaction, deleteTransaction } = useFinance();
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    description: '',
    category: '',
    amount: '',
    type: 'income'
  });
  const [errors, setErrors] = useState({});

  const getCategoryName = (id) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : id;
  };

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;
    if (filters.category) filtered = filtered.filter(t => t.category === filters.category);
    if (filters.dateRange.start) filtered = filtered.filter(t => new Date(t.date) >= new Date(filters.dateRange.start));
    if (filters.dateRange.end) filtered = filtered.filter(t => new Date(t.date) <= new Date(filters.dateRange.end));
    if (localSearchTerm) filtered = filtered.filter(t => t.description.toLowerCase().includes(localSearchTerm.toLowerCase()));
    return filtered;
  }, [transactions, filters, localSearchTerm]);

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      let aVal = sortField === 'date' ? new Date(a.date) : a.amount;
      let bVal = sortField === 'date' ? new Date(b.date) : b.amount;
      return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });
  }, [filteredTransactions, sortField, sortOrder]);

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder(sortField === field && sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.description.trim()) newErrors.description = 'Description required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Amount > 0 required';
    if (!formData.category) newErrors.category = 'Category required';
    if (!formData.date) newErrors.date = 'Date required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    if (userRole !== 'admin') return;
    setEditingTransaction(null);
    setFormData({ date: '', description: '', category: '', amount: '', type: 'income' });
    setErrors({});
    setShowModal(true);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      date: transaction.date,
      description: transaction.description,
      category: transaction.category,
      amount: Math.abs(transaction.amount).toString(),
      type: transaction.type
    });
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('Delete transaction?')) deleteTransaction(id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const amount = formData.type === 'expense' ? -parseFloat(formData.amount) : parseFloat(formData.amount);
    const data = { ...formData, amount: editingTransaction ? amount : amount };
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data);
    } else {
      addTransaction(data);
    }
    setShowModal(false);
    setEditingTransaction(null);
    setFormData({ date: '', description: '', category: '', amount: '', type: 'income' });
  };

  const handleCloseModal = (e) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
      setEditingTransaction(null);
      setErrors({});
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingTransaction(null);
    setErrors({});
    setFormData({ date: '', description: '', category: '', amount: '', type: 'income' });
  };

  const clearFilters = () => {
    setLocalSearchTerm('');
    updateFilters({ category: '', dateRange: { start: '', end: '' } });
  };

  const handleResetData = () => {
    if (confirm('Reset to mock data?')) {
      localStorage.removeItem('finance-state');
      window.location.reload();
    }
  };

  return (
    <div className="p-12 glass min-h-screen backdrop-blur-xl bg-gradient-to-br from-slate-100 via-slate-50 to-zinc-100 dark:from-slate-900 dark:via-slate-800 dark:to-zinc-900">
      <h1 className="text-5xl font-black mb-12 text-center text-slate-800 dark:text-white animate-fade-in-down text-glow">💳 Transactions Hub</h1>

      {/* Action Buttons */}
      <div className="mb-12 flex flex-wrap gap-4 justify-center">
        <button onClick={handleResetData} className="btn-secondary px-8 py-4 text-xl shadow-2xl hover:shadow-glow-primary transform hover:-translate-y-2">
          🔄 Reset Data
        </button>
        <button onClick={clearFilters} className="btn-primary px-8 py-4 text-xl shadow-2xl hover:shadow-glow-primary transform hover:-translate-y-2">
          🧹 Clear Filters
        </button>
        <button 
          onClick={handleAdd} 
          disabled={userRole !== 'admin'}
          className={`px-8 py-4 text-xl rounded-3xl shadow-2xl transition-all text-white font-black ${userRole === 'admin' ? 'btn-success hover:shadow-glow-primary transform hover:-translate-y-2 hover:scale-105' : 'bg-neutral-400 cursor-not-allowed opacity-60 shadow-lg'}`}
          title={userRole !== 'admin' ? 'Admin only' : 'Add new transaction'}
        >
          ➕ {userRole === 'admin' ? 'New Transaction' : 'Admin Required'}
        </button>
      </div>

      {/* Filters */}
      <div className="glass p-10 rounded-3xl shadow-2xl mb-12 backdrop-blur-xl">
        <h3 className="text-2xl font-bold mb-8 text-center text-slate-800 dark:text-white">🔍 Smart Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <input type="text" placeholder="🔎 Search description..." value={localSearchTerm} onChange={(e) => setLocalSearchTerm(e.target.value)} className="glass-input p-5 text-xl rounded-2xl placeholder:text-slate-400 text-slate-800 dark:text-white" />
          <select value={filters.category} onChange={(e) => updateFilters({ category: e.target.value })} className="glass-input p-5 text-xl rounded-2xl text-slate-800 dark:text-white">
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
          <input type="date" value={filters.dateRange.start} onChange={(e) => updateFilters({ dateRange: { ...filters.dateRange, start: e.target.value } })} className="glass-input p-5 text-xl rounded-2xl text-slate-800 dark:text-white" />
          <input type="date" value={filters.dateRange.end} onChange={(e) => updateFilters({ dateRange: { ...filters.dateRange, end: e.target.value } })} className="glass-input p-5 text-xl rounded-2xl text-slate-800 dark:text-white" />
        </div>
      </div>

      {/* Transactions Table */}
      {sortedTransactions.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4 mx-auto w-24">📋</div>
          <h2 className="text-2xl font-bold text-gray-500 mb-4 dark:text-gray-400">No transactions found</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            {transactions.length === 0 ? 'Click Reset Data to load mocks.' : 'Adjust filters or click Reset Data.'}
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400">Role: {userRole} | Total: {transactions.length}</div>
        </div>
      ) : (
        <div className="glass-hover rounded-3xl shadow-2xl overflow-hidden border border-white/30">
          <table className="w-full">
            <thead>
              <tr className="glass backdrop-blur-sm">
                <th className="px-8 py-6 text-left font-black text-xl text-slate-800 dark:text-white cursor-pointer hover:shadow-glow-primary p-4 rounded-tl-2xl" onClick={() => handleSort('date')}>
                  📅 Date {sortField === 'date' && (sortOrder === 'asc' ? '↗️' : '↘️')}
                </th>
                <th className="px-8 py-6 text-left font-black text-xl text-slate-800 dark:text-white">📝 Description</th>
                <th className="px-8 py-6 text-left font-black text-xl text-slate-800 dark:text-white">🏷️ Category</th>
                <th className="px-8 py-6 text-left font-black text-xl text-slate-800 dark:text-white cursor-pointer hover:shadow-glow-primary" onClick={() => handleSort('amount')}>
                  💰 Amount {sortField === 'amount' && (sortOrder === 'asc' ? '↗️' : '↘️')}
                </th>
                <th className="px-8 py-6 text-left font-black text-xl text-slate-800 dark:text-white">📊 Type</th>
                {userRole === 'admin' && <th className="px-8 py-6 text-left font-black text-xl text-slate-800 dark:text-white rounded-tr-2xl">⚙️ Actions</th>}
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map((t) => (
                <tr key={t.id} className="table-row-hover border-b border-white/10 backdrop-blur-sm hover:glass-hover">
                  <td className="px-8 py-6 font-bold text-lg text-slate-800 dark:text-white">{t.date}</td>
                  <td className="px-8 py-6 font-semibold text-slate-700 dark:text-slate-200">{t.description}</td>
                  <td className="px-8 py-6">
                    <span className="px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white font-bold text-sm rounded-2xl shadow-lg" style={{backgroundColor: categories.find(c => c.id === t.category)?.color || '#64748b'}}>
                      {getCategoryName(t.category)}
                    </span>
                  </td>
                  <td className={`px-8 py-6 font-black text-2xl ${t.amount >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    ${Math.abs(t.amount).toLocaleString()}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-2 text-lg rounded-full font-bold shadow-lg ${t.type === 'income' ? 'gradient-success text-white' : 'bg-red-500/20 text-red-400 border-2 border-red-500/50'}`}>
                      {t.type.toUpperCase()}
                    </span>
                  </td>
                  {userRole === 'admin' && (
                    <td className="px-8 py-6 space-x-3">
                      <button onClick={() => handleEdit(t)} className="btn-primary px-6 py-3 text-lg hover:rotate-180 transform-gpu">✏️ Edit</button>
                      <button onClick={() => handleDelete(t.id)} className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-6 py-3 text-lg text-white rounded-2xl shadow-xl hover:shadow-glow-primary transform hover:-translate-y-1 active:scale-95 transition-all">🗑️ Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="glass p-6 text-lg backdrop-blur-sm">
            <span className="text-neutral-200 font-bold">📊 Showing <span className="text-primary-400">{sortedTransactions.length}</span> of <span className="text-primary-400">{transactions.length}</span> transactions</span> 
            <span className="ml-8 text-neutral-300">👤 Role: <strong className="text-primary-400">{userRole.toUpperCase()}</strong></span>
          </div>
        </div>
      )}

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-6" onClick={handleCloseModal}>
          <div className="glass-hover rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto border-4 border-white/20">
            <div className="p-12">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <div className="text-6xl mb-4">{editingTransaction ? '✏️' : '➕'}</div>
                  <h2 className="text-4xl font-black text-white drop-shadow-2xl">
                    {editingTransaction ? 'Edit Transaction' : 'Create New Transaction'}
                  </h2>
                </div>
                <button onClick={handleCancel} className="text-4xl text-white/80 hover:text-white hover:rotate-90 transition-all duration-300 p-4 rounded-3xl hover:bg-white/20">&times;</button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block text-xl font-bold mb-4 text-white drop-shadow-lg">📅 Date</label>
                  <input 
                    type="date" 
                    value={formData.date} 
                    onChange={(e) => setFormData({...formData, date: e.target.value})} 
                    className="glass w-full p-8 text-2xl rounded-3xl focus:ring-8 ring-primary-500/30 backdrop-blur-xl border-2 border-white/30" 
                    required 
                  />
                  {errors.date && <p className="text-red-400 text-xl mt-3 font-bold drop-shadow-lg">{errors.date}</p>}
                </div>
                <div>
                  <label className="block text-xl font-bold mb-4 text-white drop-shadow-lg">📝 Description</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Monthly grocery shopping at supermarket" 
                    value={formData.description} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})} 
                    className="glass w-full p-8 text-2xl rounded-3xl focus:ring-8 ring-primary-500/30 backdrop-blur-xl border-2 border-white/30" 
                    required 
                  />
                  {errors.description && <p className="text-red-400 text-xl mt-3 font-bold drop-shadow-lg">{errors.description}</p>}
                </div>
                <div>
                  <label className="block text-xl font-bold mb-4 text-white drop-shadow-lg">🏷️ Category</label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData({...formData, category: e.target.value})} 
                    className="glass w-full p-8 text-2xl rounded-3xl focus:ring-8 ring-primary-500/30 backdrop-blur-xl border-2 border-white/30" 
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-400 text-xl mt-3 font-bold drop-shadow-lg">{errors.category}</p>}
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xl font-bold mb-4 text-white drop-shadow-lg">💰 Amount</label>
                    <input 
                      type="number" 
                      placeholder="1250.00" 
                      value={formData.amount} 
                      onChange={(e) => setFormData({...formData, amount: e.target.value})} 
                      min="0" 
                      step="0.01" 
                      className="glass w-full p-8 text-2xl rounded-3xl focus:ring-8 ring-primary-500/30 backdrop-blur-xl border-2 border-white/30" 
                      required 
                    />
                    {errors.amount && <p className="text-red-400 text-xl mt-3 font-bold drop-shadow-lg">{errors.amount}</p>}
                  </div>
                  <div>
                    <label className="block text-xl font-bold mb-4 text-white drop-shadow-lg">📊 Type</label>
                    <select 
                      value={formData.type} 
                      onChange={(e) => setFormData({...formData, type: e.target.value})} 
                      className="glass w-full p-8 text-2xl rounded-3xl focus:ring-8 ring-primary-500/30 backdrop-blur-xl border-2 border-white/30"
                    >
                      <option value="income">Income (+)</option>
                      <option value="expense">Expense (-)</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-6 pt-8">
                  <button type="submit" className="flex-1 gradient-primary hover:shadow-glow-primary text-white font-black py-8 px-12 text-2xl rounded-3xl shadow-2xl transition-all hover:-translate-y-2 hover:scale-105">
                    {editingTransaction ? '✏️ Update' : '✅ Create'} Transaction
                  </button>
                  <button type="button" onClick={handleCancel} className="flex-1 gradient-secondary hover:shadow-glow-primary text-white font-black py-8 px-12 text-2xl rounded-3xl shadow-2xl transition-all hover:-translate-y-2">
                    ❌ Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Transactions;
