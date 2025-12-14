import React, { useState } from 'react';
import { Module, Question, PdfResource } from '../types';
import { QcmCard } from './QcmCard';
import { generateQuestionsForModule } from '../services/geminiService';
import { 
  FileText, 
  HelpCircle, 
  Plus, 
  Sparkles, 
  Loader2, 
  ArrowLeft,
  BookOpen,
  Timer,
  Trophy,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

interface ModuleViewProps {
  moduleData: Module;
  onBack: () => void;
  onUpdateModule: (updatedModule: Module) => void;
}

export const ModuleView: React.FC<ModuleViewProps> = ({ moduleData, onBack, onUpdateModule }) => {
  const [activeTab, setActiveTab] = useState<'qcm' | 'pdf' | 'test'>('qcm');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // New Question Form State
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionOptions, setNewQuestionOptions] = useState(['', '', '', '']);
  const [newQuestionCorrectIndices, setNewQuestionCorrectIndices] = useState<number[]>([]);
  const [newQuestionExplanation, setNewQuestionExplanation] = useState('');
  
  // New PDF Form State
  const [showPdfForm, setShowPdfForm] = useState(false);
  const [newPdfName, setNewPdfName] = useState('');
  const [newPdfUrl, setNewPdfUrl] = useState('');

  // --- TEST MODE STATE ---
  const [testState, setTestState] = useState<'intro' | 'active' | 'result'>('intro');
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [testAnswers, setTestAnswers] = useState<Record<string, number[]>>({}); // Map: QuestionID -> Array of OptionIndices

  // Filter questions for Test Mode (Exclude AI generated questions)
  const eligibleTestQuestions = moduleData.questions.filter(q => !q.id.startsWith('ai-'));

  const handleGenerateAi = async () => {
    setIsGenerating(true);
    try {
      // Modification ici : On passe moduleData.description en 2ème argument
      const newQuestions = await generateQuestionsForModule(moduleData.name, moduleData.description || "", 3);
      const updatedModule = {
        ...moduleData,
        questions: [...moduleData.questions, ...newQuestions]
      };
      onUpdateModule(updatedModule);
    } catch (e: any) {
      console.error(e);
      // Gestion intelligente des messages d'erreur
      let message = "Une erreur est survenue lors de la génération.";
      
      // Détection de l'erreur de quota (429) ou de surcharge (503)
      const errorString = e.toString();
      if (errorString.includes('429') || errorString.includes('Quota') || errorString.includes('Resource has been exhausted')) {
        message = "⚠️ Le serveur est très sollicité (Limite de quota atteinte). Veuillez attendre une minute avant de réessayer.";
      } else if (errorString.includes('API_KEY')) {
         message = "Erreur de configuration : Clé API manquante ou invalide.";
      }

      alert(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleNewQuestionCorrectIndex = (index: number) => {
      if (newQuestionCorrectIndices.includes(index)) {
          setNewQuestionCorrectIndices(prev => prev.filter(i => i !== index));
      } else {
          setNewQuestionCorrectIndices(prev => [...prev, index]);
      }
  };

  const handleAddManualQuestion = () => {
    if (!newQuestionText || newQuestionOptions.some(o => !o) || newQuestionCorrectIndices.length === 0) {
        alert("Veuillez remplir tous les champs et sélectionner au moins une réponse correcte.");
        return;
    }

    const newQ: Question = {
      id: `manual-${Date.now()}`,
      text: newQuestionText,
      options: newQuestionOptions,
      correctIndices: newQuestionCorrectIndices.sort((a,b) => a - b),
      explanation: newQuestionExplanation
    };

    onUpdateModule({
      ...moduleData,
      questions: [...moduleData.questions, newQ]
    });

    setNewQuestionText('');
    setNewQuestionOptions(['', '', '', '']);
    setNewQuestionCorrectIndices([]);
    setNewQuestionExplanation('');
    setShowAddForm(false);
  };

  const handleAddPdf = () => {
      if(!newPdfName || !newPdfUrl) return;
      
      const newPdf: PdfResource = {
          id: `pdf-${Date.now()}`,
          name: newPdfName,
          url: newPdfUrl
      };

      onUpdateModule({
          ...moduleData,
          pdfs: [...moduleData.pdfs, newPdf]
      });

      setNewPdfName('');
      setNewPdfUrl('');
      setShowPdfForm(false);
  }

  // --- TEST MODE LOGIC ---
  const startTest = () => {
      // Shuffle questions and pick max 60 (ONLY NON-AI QUESTIONS)
      const shuffled = [...eligibleTestQuestions]
          .sort(() => 0.5 - Math.random())
          .slice(0, 60);
      
      setTestQuestions(shuffled);
      setTestAnswers({});
      setCurrentTestIndex(0);
      setTestState('active');
  };

  const handleTestAnswer = (optionIndices: number[]) => {
      const currentQ = testQuestions[currentTestIndex];
      setTestAnswers(prev => ({
          ...prev,
          [currentQ.id]: optionIndices
      }));
  };

  const nextQuestion = () => {
      if (currentTestIndex < testQuestions.length - 1) {
          setCurrentTestIndex(prev => prev + 1);
      } else {
          setTestState('result');
      }
  };

  const calculateScore = () => {
      let score = 0;
      testQuestions.forEach(q => {
          const userAnswers = testAnswers[q.id] || [];
          // Exact match validation for multiple choice
          const isCorrect = 
            userAnswers.length === q.correctIndices.length && 
            q.correctIndices.every(i => userAnswers.includes(i));

          if (isCorrect) {
              score++;
          }
      });
      return score;
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="flex items-center text-sm text-slate-500 hover:text-primary-600 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Retour aux modules
        </button>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{moduleData.name}</h1>
        <p className="text-slate-600">{moduleData.description || "Aucune description disponible pour ce module."}</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-200 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('qcm')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-all whitespace-nowrap ${
            activeTab === 'qcm' 
              ? 'border-primary-500 text-primary-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          Révision QCMs ({moduleData.questions.length})
        </button>
        <button
          onClick={() => setActiveTab('test')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-all whitespace-nowrap ${
            activeTab === 'test' 
              ? 'border-primary-500 text-primary-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Timer className="w-4 h-4" />
          Mode Test
        </button>
        <button
          onClick={() => setActiveTab('pdf')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-all whitespace-nowrap ${
            activeTab === 'pdf' 
              ? 'border-primary-500 text-primary-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          Documents PDF ({moduleData.pdfs.length})
        </button>
      </div>

      {/* --- CONTENT: QCM REVISION --- */}
      {activeTab === 'qcm' && (
        <div className="space-y-6">
          {/* Actions Bar */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button 
              onClick={handleGenerateAi}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:from-violet-700 hover:to-indigo-700 transition-all text-sm font-medium disabled:opacity-70"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isGenerating ? "Génération en cours..." : "Générer avec IA"}
            </button>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-all text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Ajouter une question
            </button>
          </div>

          {/* Add Question Form */}
          {showAddForm && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8 animate-in fade-in slide-in-from-top-4">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary-600" />
                Nouvelle Question Manuelle
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Énoncé de la question</label>
                  <textarea 
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    rows={2}
                    placeholder={`Ex: Question sur ${moduleData.name}...`}
                  />
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Options de réponse (Cochez les bonnes réponses)
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {newQuestionOptions.map((opt, i) => (
                      <div key={i} className={`flex items-center gap-3 p-2 rounded-md border transition-colors ${newQuestionCorrectIndices.includes(i) ? 'bg-green-50 border-green-200 ring-1 ring-green-500/20' : 'bg-white border-slate-200'}`}>
                        <div className="relative flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={newQuestionCorrectIndices.includes(i)}
                            onChange={() => toggleNewQuestionCorrectIndex(i)}
                            className="w-5 h-5 text-green-600 border-slate-300 rounded focus:ring-green-500 cursor-pointer"
                            title="Marquer comme réponse correcte"
                          />
                        </div>
                        <input 
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...newQuestionOptions];
                            newOpts[i] = e.target.value;
                            setNewQuestionOptions(newOpts);
                          }}
                          className="flex-1 bg-transparent border-none p-1 text-sm focus:ring-0 outline-none placeholder:text-slate-400"
                          placeholder={`Option ${i+1}`}
                        />
                        {newQuestionCorrectIndices.includes(i) && <span className="text-xs font-bold text-green-600 px-2">Correcte</span>}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Explication de la réponse (Optionnel)</label>
                  <textarea 
                    value={newQuestionExplanation}
                    onChange={(e) => setNewQuestionExplanation(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    rows={2}
                    placeholder="Expliquez pourquoi ces réponses sont les bonnes..."
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 mt-4">
                  <button 
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={handleAddManualQuestion}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium shadow-sm hover:shadow"
                  >
                    Enregistrer la question
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Questions List */}
          {moduleData.questions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
               <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                 <HelpCircle className="text-slate-400 w-6 h-6" />
               </div>
               <h3 className="text-slate-900 font-medium mb-1">Aucune question pour le moment</h3>
               <p className="text-slate-500 text-sm max-w-xs mx-auto mb-4">Utilisez l'IA pour générer des questions ou ajoutez-les manuellement.</p>
               <button 
                  onClick={handleGenerateAi}
                  className="text-primary-600 font-medium text-sm hover:underline"
               >
                 Essayer la génération IA &rarr;
               </button>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {moduleData.questions.map((q, idx) => (
                <QcmCard key={q.id} question={q} index={idx} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- CONTENT: TEST MODE --- */}
      {activeTab === 'test' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              
              {/* STATE: INTRO */}
              {testState === 'intro' && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center max-w-2xl mx-auto">
                      <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Timer className="text-primary-600 w-8 h-8" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">Mode Examen</h2>
                      <p className="text-slate-600 mb-8 leading-relaxed">
                          Ce mode sélectionne aléatoirement jusqu'à 60 questions du module (questions IA exclues).
                          Vous devez sélectionner <strong>toutes</strong> les bonnes réponses pour valider une question.
                      </p>
                      
                      <div className="flex justify-center gap-8 mb-8 text-sm text-slate-500">
                           <div className="flex flex-col items-center gap-1">
                               <span className="font-bold text-slate-900 text-lg">
                                   {Math.min(60, eligibleTestQuestions.length)}
                               </span>
                               <span>Questions</span>
                           </div>
                           <div className="flex flex-col items-center gap-1">
                               <span className="font-bold text-slate-900 text-lg">Mix</span>
                               <span>Aléatoire</span>
                           </div>
                           <div className="flex flex-col items-center gap-1">
                               <span className="font-bold text-slate-900 text-lg">Score</span>
                               <span>Final</span>
                           </div>
                      </div>

                      <button 
                          onClick={startTest}
                          disabled={eligibleTestQuestions.length === 0}
                          className="w-full sm:w-auto bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-all font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          {eligibleTestQuestions.length === 0 ? "Aucune question de cours disponible" : "Commencer l'examen"}
                      </button>
                      
                      {eligibleTestQuestions.length === 0 && moduleData.questions.length > 0 && (
                          <p className="mt-4 text-xs text-orange-500">
                              Note : Les questions générées par IA ne sont pas incluses dans le mode examen.
                          </p>
                      )}
                  </div>
              )}

              {/* STATE: ACTIVE */}
              {testState === 'active' && testQuestions.length > 0 && (
                  <div className="max-w-3xl mx-auto">
                      {/* Progress Bar */}
                      <div className="mb-6 flex items-center justify-between text-sm text-slate-500">
                          <span>Question {currentTestIndex + 1} / {testQuestions.length}</span>
                          <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-700">Test en cours</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 mb-8 overflow-hidden">
                          <div 
                              className="bg-primary-600 h-2 rounded-full transition-all duration-300 ease-out"
                              style={{ width: `${((currentTestIndex + 1) / testQuestions.length) * 100}%` }}
                          />
                      </div>

                      {/* Question Card */}
                      <QcmCard 
                          key={testQuestions[currentTestIndex].id} // Force re-render on change
                          question={testQuestions[currentTestIndex]} 
                          index={currentTestIndex}
                          isTestMode={true}
                          selectedAnswers={testAnswers[testQuestions[currentTestIndex].id] || []}
                          onAnswer={handleTestAnswer}
                          showFeedback={false}
                      />

                      {/* Navigation Buttons */}
                      <div className="flex justify-between items-center mt-6">
                           <button 
                               onClick={() => setCurrentTestIndex(prev => Math.max(0, prev - 1))}
                               disabled={currentTestIndex === 0}
                               className="text-slate-500 hover:text-slate-800 disabled:opacity-30 flex items-center gap-2 px-4 py-2 font-medium"
                           >
                               <ArrowLeft className="w-4 h-4" /> Précédent
                           </button>

                           <button 
                               onClick={nextQuestion}
                               className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white shadow-md transition-all ${
                                   currentTestIndex === testQuestions.length - 1 
                                   ? 'bg-green-600 hover:bg-green-700' 
                                   : 'bg-slate-800 hover:bg-slate-900'
                               }`}
                           >
                               {currentTestIndex === testQuestions.length - 1 ? "Terminer le test" : "Suivant"}
                               {currentTestIndex !== testQuestions.length - 1 && <ArrowRight className="w-4 h-4" />}
                           </button>
                      </div>
                  </div>
              )}

              {/* STATE: RESULT */}
              {testState === 'result' && (
                  <div className="max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
                      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                          <div className="bg-slate-900 text-white p-8 text-center">
                              <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                              <h2 className="text-3xl font-bold mb-2">Examen Terminé</h2>
                              <p className="text-slate-400">Voici vos résultats pour {moduleData.name}</p>
                          </div>
                          
                          <div className="p-8 text-center border-b border-slate-100">
                              <div className="inline-flex items-center justify-center p-6 rounded-full bg-slate-50 mb-6 relative">
                                  <svg className="w-32 h-32 transform -rotate-90">
                                      <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-200" />
                                      <circle 
                                          cx="64" cy="64" r="60" 
                                          stroke="currentColor" strokeWidth="8" fill="transparent" 
                                          className="text-primary-600 transition-all duration-1000 ease-out"
                                          strokeDasharray={377}
                                          strokeDashoffset={377 - (377 * calculateScore()) / testQuestions.length}
                                      />
                                  </svg>
                                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                                      <span className="text-3xl font-bold text-slate-900">{calculateScore()}</span>
                                      <span className="text-xs text-slate-500 uppercase font-semibold">sur {testQuestions.length}</span>
                                  </div>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-4 text-center">
                                  <div className="p-3 bg-green-50 rounded-lg">
                                      <span className="block text-2xl font-bold text-green-600">{calculateScore()}</span>
                                      <span className="text-xs text-green-800 font-medium">Correctes</span>
                                  </div>
                                  <div className="p-3 bg-red-50 rounded-lg">
                                      <span className="block text-2xl font-bold text-red-600">{testQuestions.length - calculateScore()}</span>
                                      <span className="text-xs text-red-800 font-medium">Incorrectes</span>
                                  </div>
                                  <div className="p-3 bg-blue-50 rounded-lg">
                                      <span className="block text-2xl font-bold text-blue-600">{Math.round((calculateScore() / testQuestions.length) * 100)}%</span>
                                      <span className="text-xs text-blue-800 font-medium">Précision</span>
                                  </div>
                              </div>
                          </div>

                          <div className="p-6 bg-slate-50 flex justify-center gap-4">
                              <button 
                                  onClick={() => setTestState('intro')}
                                  className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-colors"
                              >
                                  <RotateCcw className="w-4 h-4" /> Recommencer
                              </button>
                              <button 
                                  onClick={() => setActiveTab('qcm')}
                                  className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                              >
                                  <BookOpen className="w-4 h-4" /> Retour aux QCMs
                              </button>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      )}

      {/* --- CONTENT: PDF --- */}
      {activeTab === 'pdf' && (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-slate-800">Ressources Documentaires</h3>
                <button 
                    onClick={() => setShowPdfForm(!showPdfForm)}
                    className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-all text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Ajouter un PDF
                </button>
            </div>

            {showPdfForm && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6 animate-in slide-in-from-top-2">
                    <h4 className="font-semibold text-slate-800 mb-3 text-sm">Nouveau Document</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">Nom du fichier</label>
                             <input 
                                type="text"
                                value={newPdfName}
                                onChange={e => setNewPdfName(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="ex: Cours Anatomie Ch.1"
                             />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">URL du PDF</label>
                             <input 
                                type="text"
                                value={newPdfUrl}
                                onChange={e => setNewPdfUrl(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="https://..."
                             />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setShowPdfForm(false)} className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700">Annuler</button>
                        <button onClick={handleAddPdf} className="px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 shadow-sm">Ajouter</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {moduleData.pdfs.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-500 text-sm bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        Aucun document disponible pour ce module.
                    </div>
                ) : (
                    moduleData.pdfs.map((pdf) => (
                        <div key={pdf.id} className="group bg-white p-4 rounded-xl border border-slate-200 hover:border-primary-300 hover:shadow-md transition-all flex items-start gap-4">
                            <div className="bg-red-50 p-3 rounded-lg group-hover:bg-red-100 transition-colors">
                                <FileText className="w-6 h-6 text-red-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-slate-900 truncate pr-2" title={pdf.name}>{pdf.name}</h4>
                                <a 
                                    href={pdf.url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="text-xs text-primary-600 hover:underline mt-1 inline-block"
                                >
                                    Ouvrir le document &rarr;
                                </a>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      )}
    </div>
  );
};