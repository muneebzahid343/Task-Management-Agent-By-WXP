import React from 'react';
import { ViewMode } from '../types';
import { TasksIcon, SparklesIcon, DashboardIcon, WXPLogoIcon } from './Icons'; // Added WXPLogoIcon

interface SidebarProps {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { name: 'Dashboard', view: ViewMode.Dashboard, icon: <DashboardIcon className="w-5 h-5 mr-3 flex-shrink-0" /> },
    { name: 'Tasks', view: ViewMode.Tasks, icon: <TasksIcon className="w-5 h-5 mr-3 flex-shrink-0" /> },
    { name: 'AI Assistant', view: ViewMode.AIAssistant, icon: <SparklesIcon className="w-5 h-5 mr-3 flex-shrink-0" /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 p-5 space-y-6 border-r border-slate-800 flex flex-col shadow-lg">
      <div className="flex items-center space-x-2.5 mb-5 mt-1">
        <WXPLogoIcon className="w-8 h-8 text-sky-400" /> 
        <span className="text-xl font-bold text-slate-100 tracking-tight">WXP Agent</span>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {navItems.map(item => (
            <li key={item.view}>
              <button
                onClick={() => setCurrentView(item.view)}
                className={`w-full flex items-center px-3.5 py-2.5 rounded-lg transition-all duration-200 ease-in-out group
                  ${currentView === item.view 
                    ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg scale-[1.02]' 
                    : 'text-slate-400 hover:bg-slate-700/60 hover:text-sky-300 hover:scale-[1.01] active:scale-[0.99]'
                  }`}
                aria-current={currentView === item.view ? 'page' : undefined}
              >
                {React.cloneElement(item.icon, { 
                    className: `w-5 h-5 mr-3.5 transition-colors flex-shrink-0 ${currentView === item.view ? 'text-white' : 'text-slate-500 group-hover:text-sky-400'}` 
                })}
                <span className="text-sm font-medium">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto text-xs text-slate-600 text-center">
        WXP Agent v1.1 Modern
      </div>
    </aside>
  );
};

export default Sidebar;