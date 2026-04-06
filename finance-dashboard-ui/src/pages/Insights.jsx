import React from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const Insights = () => {
  const { transactions, categories } = useFinance();

  // Prepare data for bar chart: spending by category
  const spendingByCategory = categories.map(cat => {
    const total = transactions
      .filter(t => t.category === cat.id && t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return { name: cat.name, amount: total, color: cat.color };
  }).filter(cat => cat.amount > 0).sort((a, b) => b.amount - a.amount);

  // Prepare data for line chart: monthly income vs expenses
  const monthlyData = {};
  transactions.forEach(t => {
    const month = t.date.slice(0, 7); // YYYY-MM
    if (!monthlyData[month]) {
      monthlyData[month] = { month, income: 0, expenses: 0 };
    }
    if (t.type === 'income') {
      monthlyData[month].income += t.amount;
    } else {
      monthlyData[month].expenses += Math.abs(t.amount);
    }
  });
  const lineData = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));

  // Additional insights
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const monthsCount = lineData.length;
  const averageMonthlySpending = monthsCount > 0 ? totalExpenses / monthsCount : 0;
  const topSpendingMonth = lineData.reduce((top, current) => current.expenses > top.expenses ? current : top, lineData[0] || { month: 'N/A', expenses: 0 });

  return (
    <div className="p-8 glass min-h-screen bg-gradient-to-br from-violet-100 via-purple-100 to-cyan-100 dark:from-slate-900 dark:via-violet-950 dark:to-slate-900">
      <h1 className="text-4xl md:text-6xl font-black mb-12 text-center text-slate-800 dark:text-white fade-in animate-fade-in-down text-glow">⚡ Financial Insights</h1>

      {transactions.length === 0 ? (
        <div className="fade-in text-center py-28 animate-scale-in">
          <div className="text-9xl mb-8 animate-pulse-glow animate-spin-slow">📈</div>
          <h2 className="text-4xl font-black text-neutral-600 dark:text-neutral-400 mb-6">No data for insights</h2>
          <p className="text-2xl text-neutral-700 dark:text-neutral-300 mb-12 max-w-lg mx-auto leading-relaxed">Add transactions to unlock powerful financial insights and charts.</p>
          <p className="text-xl font-bold text-primary-600 dark:text-primary-400 animate-pulse-glow">🚀 Visit Transactions & switch to Admin</p>
        </div>
      ) : (
        <>
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 fade-in">
            {/* Bar Chart */}
            <div className="glass-hover p-8 rounded-3xl shadow-2xl animate-fade-in-left">
              <h2 className="text-3xl font-bold mb-8 text-slate-800 dark:text-white">Spending by Category</h2>
              <ResponsiveContainer width="100%" height={450}>
                <BarChart data={spendingByCategory}>
                  <CartesianGrid strokeDasharray="5 5" stroke="rgba(255,255,255,0.15)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.9)" fontSize={14} fontWeight="700" />
                  <YAxis stroke="rgba(255,255,255,0.9)" fontSize={14} fontWeight="700" />
                  <Tooltip contentStyle={{background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', backdropFilter: 'blur(20px)'}} />
                  <Legend wrapperStyle={{fontWeight: 'bold', color: 'white'}} />
                  <Bar dataKey="amount" fill="url(#categoryGradient)" stroke="#8b5cf6" strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Line Chart */}
            <div className="glass-hover p-8 rounded-3xl shadow-2xl animate-fade-in-right">
              <h2 className="text-3xl font-bold mb-8 text-slate-800 dark:text-white">Income vs Expenses</h2>
              <ResponsiveContainer width="100%" height={450}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="5 5" stroke="rgba(255,255,255,0.15)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.9)" fontSize={14} fontWeight="700" />
                  <YAxis stroke="rgba(255,255,255,0.9)" fontSize={14} fontWeight="700" />
                  <Tooltip contentStyle={{background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', backdropFilter: 'blur(20px)'}} />
                  <Legend wrapperStyle={{fontWeight: 'bold', color: 'white'}} />
                  <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={4} dot={{fill: '#10b981'}} />
                  <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={4} dot={{fill: '#ef4444'}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Insights Cards */}
          <div className="glass-hover p-10 rounded-3xl shadow-2xl animate-fade-in-up">
            <h2 className="text-4xl font-black mb-12 text-center text-slate-800 dark:text-white">💎 Key Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="gradient-success p-8 rounded-3xl text-white shadow-2xl hover:scale-105 transition-all glass-hover">
                <div className="text-5xl mb-4 animate-bounce">📊</div>
                <h3 className="text-2xl font-bold mb-4">Avg Monthly Spending</h3>
                <p className="text-5xl font-black drop-shadow-lg">${averageMonthlySpending.toLocaleString('en', {minimumFractionDigits: 0})}</p>
              </div>
              <div className="gradient-primary p-8 rounded-3xl text-white shadow-2xl hover:scale-105 transition-all glass-hover">
                <div className="text-5xl mb-4 animate-bounce">🔥</div>
                <h3 className="text-2xl font-bold mb-4">Top Spending Month</h3>
                <p className="text-3xl font-black drop-shadow-lg">{topSpendingMonth.month}</p>
                <p className="text-xl opacity-90 mt-2">${topSpendingMonth.expenses.toLocaleString()}</p>
              </div>
              <div className="gradient-secondary p-8 rounded-3xl text-white shadow-2xl hover:scale-105 transition-all glass-hover">
                <div className="text-5xl mb-4 animate-bounce">📈</div>
                <h3 className="text-2xl font-bold mb-4">Total Categories</h3>
                <p className="text-5xl font-black drop-shadow-lg">{spendingByCategory.length}</p>
                <p className="text-xl opacity-90 mt-2">Active spending categories</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Insights;