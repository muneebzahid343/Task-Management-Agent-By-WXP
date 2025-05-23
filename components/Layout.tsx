
import React from 'react';
import Sidebar from './Sidebar';
import { ViewMode } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setCurrentView }) => {
  const viewTitles: Record<ViewMode, string> = {
    [ViewMode.Dashboard]: 'Dashboard Overview',
    [ViewMode.Tasks]: 'Task Management Hub',
    [ViewMode.AIAssistant]: 'AI Powered Assistant',
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto custom-scrollbar">
        <header className="mb-8 pb-4 border-b border-slate-800">
            <h1 className="text-3xl sm:text-4xl font-bold text-sky-400 tracking-tight">
              WXP Work Management Agent
            </h1>
            <p className="text-slate-400 text-base mt-1.5">{viewTitles[currentView]}</p>
        </header>
        <div className="animate-modalShow"> {/* Added subtle animation to content area */}
          {children}
        </div>
      </main>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          /* FIX: Replaced tailwind.theme.extend.colors.slate[800] with static hex value */
          background: #1e293b; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          /* FIX: Replaced tailwind.theme.extend.colors.slate[600] with static hex value */
          background: #475569;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          /* FIX: Replaced tailwind.theme.extend.colors.slate[500] with static hex value */
          background: #64748b;
        }
        /* Firefox scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          /* FIX: Replaced tailwind.theme.extend.colors.slate[600] and tailwind.theme.extend.colors.slate[800] with static hex values */
          scrollbar-color: #475569 #1e293b;
        }
      `}</style>
    </div>
  );
};

export default Layout;