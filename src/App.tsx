import { useState } from 'react';
import { Layout } from './components/Layout';
import { ModuleView } from './components/ModuleView';
import { ContactModal } from './components/ContactModal';
import { INITIAL_DATA } from './constants';
import type { Year, Semester, Module } from './types';
import { Folder, FolderOpen, Book, ChevronRight } from 'lucide-react';

export default function App() {
  const [data, setData] = useState(INITIAL_DATA);
  const [selectedYear, setSelectedYear] = useState<Year | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleUpdateModule = (updatedModule: Module) => {
    // Deep update of state structure
    if (!selectedYear || !selectedSemester) return;

    const newData = { ...data };
    const yearIndex = newData.years.findIndex(y => y.id === selectedYear.id);
    if (yearIndex === -1) return;

    const semIndex = newData.years[yearIndex].semesters.findIndex(s => s.id === selectedSemester.id);
    if (semIndex === -1) return;

    const modIndex = newData.years[yearIndex].semesters[semIndex].modules.findIndex(m => m.id === updatedModule.id);
    if (modIndex === -1) return;

    newData.years[yearIndex].semesters[semIndex].modules[modIndex] = updatedModule;
    
    setData(newData);
    setSelectedModule(updatedModule); // Update local view state
  };

  const resetSelection = () => {
    setSelectedYear(null);
    setSelectedSemester(null);
    setSelectedModule(null);
  };

  const renderDashboard = () => (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Bienvenue sur <span className="text-primary-600">MedQCM Pro</span></h1>
        <p className="text-slate-600 max-w-2xl">Sélectionnez votre année d'étude pour accéder aux modules, QCMs et ressources PDF.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {data.years.map((year) => (
          <div key={year.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div 
              className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => setSelectedYear(selectedYear?.id === year.id ? null : year)}
            >
              {selectedYear?.id === year.id ? <FolderOpen className="text-primary-600 w-6 h-6" /> : <Folder className="text-slate-400 w-6 h-6" />}
              <h2 className="text-lg font-semibold text-slate-800">{year.name}</h2>
              <ChevronRight className={`ml-auto w-5 h-5 text-slate-400 transition-transform ${selectedYear?.id === year.id ? 'rotate-90' : ''}`} />
            </div>

            {selectedYear?.id === year.id && (
              <div className="p-4 bg-white animate-in slide-in-from-top-2">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {year.semesters.map(semester => (
                        <div key={semester.id} className="border border-slate-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                           <h3 className="font-medium text-slate-700 mb-3 border-b border-slate-100 pb-2">{semester.name}</h3>
                           <ul className="space-y-2">
                             {semester.modules.length > 0 ? (
                               semester.modules.map(module => (
                                 <li key={module.id}>
                                   <button 
                                     onClick={() => {
                                        setSelectedSemester(semester);
                                        setSelectedModule(module);
                                     }}
                                     className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary-600 w-full text-left p-2 rounded hover:bg-slate-50 transition-all group"
                                   >
                                     <div className="bg-slate-100 p-1.5 rounded text-slate-400 group-hover:text-primary-500 group-hover:bg-primary-50 transition-colors">
                                        <Book className="w-4 h-4" />
                                     </div>
                                     {module.name}
                                   </button>
                                 </li>
                               ))
                             ) : (
                               <li className="text-xs text-slate-400 italic p-2">Aucun module disponible.</li>
                             )}
                           </ul>
                        </div>
                    ))}
                 </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Layout 
      onNavigateHome={resetSelection}
      onContactClick={() => setIsContactOpen(true)}
    >
      {selectedModule ? (
        <ModuleView 
          moduleData={selectedModule} 
          onBack={() => setSelectedModule(null)}
          onUpdateModule={handleUpdateModule}
        />
      ) : (
        renderDashboard()
      )}

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </Layout>
  );
}