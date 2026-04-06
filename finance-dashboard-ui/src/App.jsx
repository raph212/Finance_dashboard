import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Insights from './pages/Insights';
import RoleSwitcher from './components/RoleSwitcher';
import ThemeToggle from './components/ThemeToggle';
import { useFinance } from './contexts/FinanceContext';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const { theme } = useFinance();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="App">
      {/* Navigation Tabs */}
      <nav className="glass-hover shadow-2xl animate-fade-in-down bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 text-white dark:from-violet-700 dark:via-fuchsia-700 dark:to-violet-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex space-x-8">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`py-4 px-1 border-b-4 font-semibold text-base transition-all duration-300 hover:scale-110 rounded-xl ${
                  currentView === 'dashboard'
                    ? 'border-white text-white bg-white/20'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                📊
                <span className="ml-2">Dashboard</span>
              </button>
              <button
                onClick={() => setCurrentView('transactions')}
                className={`py-4 px-1 border-b-4 font-semibold text-base transition-all duration-300 hover:scale-110 rounded-xl ${
                  currentView === 'transactions'
                    ? 'border-white text-white bg-white/20'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                💳
                <span className="ml-2">Transactions</span>
              </button>
              <button
                onClick={() => setCurrentView('insights')}
                className={`py-4 px-1 border-b-4 font-semibold text-base transition-all duration-300 hover:scale-110 rounded-xl ${
                  currentView === 'insights'
                    ? 'border-white text-white bg-white/20'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                📈
                <span className="ml-2">Insights</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <RoleSwitcher />
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="fade-in">
        {currentView === 'dashboard' ? <Dashboard /> :
         currentView === 'transactions' ? <Transactions /> : <Insights />}
      </div>
    </div>
  )
}

export default App