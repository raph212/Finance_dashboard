import React from 'react';
import { useFinance } from '../contexts/FinanceContext';

const RoleSwitcher = () => {
  const { userRole, setUserRole } = useFinance();

  const toggleRole = () => {
    setUserRole(userRole === 'admin' ? 'viewer' : 'admin');
  };

  return (
    <div className="flex items-center space-x-3 bg-white/20 dark:bg-white/10 backdrop-blur-sm p-3 rounded-2xl glass">
      <span className="text-sm font-semibold text-white drop-shadow-lg">
        👤 Role: <span className={`px-2 py-1 rounded-full text-xs font-bold ${userRole === 'admin' ? 'bg-emerald-500/30 text-emerald-300' : 'bg-amber-500/30 text-amber-300'}`}>
          {userRole === 'admin' ? 'Admin' : 'Viewer'}
        </span>
      </span>
      <button
        onClick={toggleRole}
        className="btn-primary px-4 py-2 text-sm shadow-glow-primary hover:shadow-2xl"
      >
        ⚡ Switch
      </button>
    </div>
  );
};

export default RoleSwitcher;