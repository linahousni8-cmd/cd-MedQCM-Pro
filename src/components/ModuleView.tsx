import React from 'react';
import { LucideLayoutDashboard, LucideGraduationCap, LucideMail } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onNavigateHome: () => void;
  onContactClick: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onNavigateHome, onContactClick }) => {
  return (
    <div className="flex h-full w-full bg-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-full shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2 cursor-pointer" onClick={onNavigateHome}>
          <div className="bg-primary-600 p-2 rounded-lg">
             <LucideGraduationCap className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">MedQCM<span className="text-primary-600">Pro</span></h1>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
           <button onClick={onNavigateHome} className="flex items-center gap-3 w-full p-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-primary-600 transition-colors font-medium text-sm">
             <LucideLayoutDashboard className="w-5 h-5" />
             Tableau de bord
           </button>
           
           <div className="pt-4 pb-2">
             <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Navigation</p>
           </div>
           
           {/* Navigation is largely handled in the main content area for this tree structure, 
               but we provide a quick link home here. */}
           <div className="px-3 text-sm text-slate-500 italic">
             Sélectionnez une année dans le tableau de bord pour commencer.
           </div>

        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={onContactClick}
            className="flex items-center justify-center gap-2 w-full bg-slate-800 text-white p-3 rounded-lg hover:bg-slate-900 transition-all shadow-md hover:shadow-lg text-sm font-medium"
          >
            <LucideMail className="w-4 h-4" />
            Contactez-nous
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white h-16 border-b border-slate-200 flex items-center justify-between px-4">
           <div className="flex items-center gap-2 font-bold text-slate-800">
              <LucideGraduationCap className="text-primary-600 w-6 h-6" />
              MedQCM
           </div>
           <button onClick={onContactClick} className="text-slate-600">
             <LucideMail className="w-6 h-6" />
           </button>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8 relative">
          {children}
        </div>
      </main>
    </div>
  );
};