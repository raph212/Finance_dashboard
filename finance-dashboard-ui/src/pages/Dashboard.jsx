import React from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { transactions } = useFinance();

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netBalance = totalIncome - totalExpenses;

  // Prepare data for monthly spending chart
  const monthlyData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const month = new Date(t.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      if (!acc[month]) acc[month] = 0;
      acc[month] += Math.abs(t.amount);
      return acc;
    }, {});

  const chartData = Object.keys(monthlyData).map(month => ({
    month,
    expenses: monthlyData[month]
  }));

  return (
    <div className="p-8 glass min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <h1 className="text-4xl md:text-5xl font-black mb-8 text-center text-slate-800 dark:text-white fade-in text-glow">🚀 Dashboard Overview</h1>

      {transactions.length === 0 ? (
        <div className="fade-in text-center py-24 animate-scale-in">
          <div className="text-8xl mb-8 animate-bounce animate-pulse-glow">📊</div>
          <h2 className="text-3xl md:text-4xl font-black text-neutral-600 dark:text-neutral-400 mb-6">No transactions yet</h2>
          <p className="text-xl text-neutral-700 dark:text-neutral-300 mb-10 max-w-md mx-auto leading-relaxed">Add your first transaction to see insights and charts.</p>
          <p className="text-lg font-semibold text-secondary-600 dark:text-secondary-400 animate-pulse">⚡ Switch to Admin role above to get started</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="glass-hover-lg p-8 rounded-3xl shadow-glow-primary animate-fade-in-up animation-delay-100 card-hover group">
              <div className="text-5xl mb-4 group-hover:animate-float transition-all">💰</div>
              <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">Total Income</h2>
              <p className="text-4xl font-black text-slate-800 dark:text-white">${totalIncome.toLocaleString()}</p>
            </div>
            <div className="glass-hover-lg p-8 rounded-3xl shadow-glow-yellow animate-fade-in-up animation-delay-200 card-hover group">
              <div className="text-5xl mb-4 group-hover:animate-float transition-all">💸</div>
              <h2 className="text-xl font-bold text-amber-600 dark:text-amber-400 mb-2">Total Expenses</h2>
              <p className="text-4xl font-black text-slate-800 dark:text-white">${totalExpenses.toLocaleString()}</p>
            </div>
            <div className={`glass-hover-lg p-8 rounded-3xl shadow-2xl animate-fade-in-up animation-delay-300 card-hover group ${netBalance >= 0 ? 'hover:shadow-glow-primary' : 'hover:shadow-red-500/50'}`}>
              <div className={`text-5xl mb-4 ${netBalance >= 0 ? 'group-hover:animate-float' : ''} ${netBalance >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>⚖️</div>
              <h2 className="text-xl font-bold text-slate-600 dark:text-slate-300 mb-2">Net Balance</h2>
              <p className={`text-4xl font-black ${netBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                ${netBalance.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="glass-hover-lg p-8 rounded-3xl shadow-2xl animate-fade-in animation-delay-400 card-hover">
            <h2 className="text-3xl font-bold mb-8 text-slate-800 dark:text-white">📉 Monthly Spending Trends</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.8)" fontWeight="600" />
                <YAxis stroke="rgba(255,255,255,0.8)" fontWeight="600" />
                <Tooltip contentStyle={{background: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '16px'}} />
                <Legend wrapperStyle={{fontWeight: 'bold', color: 'white'}} />
                <Line type="monotone" dataKey="expenses" stroke="#8b5cf6" strokeWidth={4} dot={{fill: '#8b5cf6', strokeWidth: 2}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;