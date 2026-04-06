import React from 'react';
import { useFinance } from '../contexts/FinanceContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useFinance();

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-2xl glass-hover text-xl shadow-lg hover:shadow-glow-primary hover:rotate-12 transition-all duration-300 group"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span className="group-hover:animate-float inline-block">{theme === 'dark' ? '☀️' : '🌙'}</span>
    </button>
  );
};

export default ThemeToggle;