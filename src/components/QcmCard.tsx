import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { CheckCircle2, XCircle, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface QcmCardProps {
  question: Question;
  index: number;
  // Props optionnelles pour le mode Test (Contrôlé)
  isTestMode?: boolean;
  selectedAnswer?: number | null;
  onAnswer?: (index: number) => void;
  showFeedback?: boolean;
}

export const QcmCard: React.FC<QcmCardProps> = ({ 
  question, 
  index, 
  isTestMode = false,
  selectedAnswer = null,
  onAnswer,
  showFeedback = true
}) => {
  // État interne pour le mode révision standard
  const [internalSelected, setInternalSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // En mode Test, on utilise les props du parent. Sinon, l'état interne.
  const currentSelection = isTestMode ? selectedAnswer : internalSelected;
  
  // Le feedback (couleurs) est affiché si : 
  // 1. Pas en mode test (immédiat) ET une réponse est choisie
  // 2. En mode test ET que le parent dit de montrer le feedback (fin du test)
  const shouldShowFeedback = isTestMode ? showFeedback : (currentSelection !== null);

  const handleSelect = (optionIndex: number) => {
    if (isTestMode) {
      if (!showFeedback && onAnswer) { // On peut changer tant que le test n'est pas fini
        onAnswer(optionIndex);
      }
    } else {
      if (internalSelected !== null) return; // En mode révision, on ne change pas
      setInternalSelected(optionIndex);
      if (optionIndex !== question.correctIndex) {
        setShowExplanation(true);
      }
    }
  };

  const isCorrect = currentSelection === question.correctIndex;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md mb-6">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
        <h3 className="font-semibold text-slate-800 text-lg flex gap-3">
          <span className="flex items-center justify-center bg-slate-200 text-slate-600 text-xs font-bold rounded w-6 h-6 min-w-[1.5rem] mt-1">
            {index + 1}
          </span>
          {question.text}
        </h3>
        
        {shouldShowFeedback && (
            <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {isCorrect ? <><CheckCircle2 className="w-4 h-4" /> Correct</> : <><XCircle className="w-4 h-4" /> Incorrect</>}
            </div>
        )}
      </div>

      <div className="p-5 space-y-3">
        {question.options.map((option, idx) => {
          let buttonStyle = "border-slate-200 hover:bg-slate-50 hover:border-slate-300";
          let icon = null;

          if (shouldShowFeedback) {
            // Mode Résultat (Test fini ou Révision répondue)
            if (idx === question.correctIndex) {
              buttonStyle = "bg-green-50 border-green-200 text-green-800 ring-1 ring-green-500/20"; 
              icon = <CheckCircle2 className="w-5 h-5 text-green-600" />;
            } else if (idx === currentSelection) {
              buttonStyle = "bg-red-50 border-red-200 text-red-800 ring-1 ring-red-500/20";
              icon = <XCircle className="w-5 h-5 text-red-600" />;
            } else {
              buttonStyle = "opacity-50 border-transparent bg-slate-50 grayscale";
            }
          } else {
            // Mode Test actif (Sélection neutre)
            if (idx === currentSelection) {
               buttonStyle = "bg-primary-50 border-primary-200 text-primary-800 ring-1 ring-primary-500/20";
               // Pas d'icône V/X pour ne pas spoiler
               icon = <div className="w-4 h-4 rounded-full bg-primary-600" />
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={shouldShowFeedback && !isTestMode} // En révision, on bloque. En test fini, on bloque via logic parent ou ici.
              className={`w-full text-left p-4 rounded-lg border flex items-center justify-between transition-all duration-200 group ${buttonStyle}`}
            >
              <span className="font-medium">{option}</span>
              {icon}
            </button>
          );
        })}
      </div>

      {shouldShowFeedback && (
        <div className="bg-slate-50 border-t border-slate-100">
           <button 
             onClick={() => setShowExplanation(!showExplanation)}
             className="w-full flex items-center justify-between p-4 text-sm text-slate-500 hover:text-primary-600 font-medium transition-colors"
           >
             <span className="flex items-center gap-2">
               <HelpCircle className="w-4 h-4" />
               {showExplanation ? "Masquer l'explication" : "Voir l'explication"}
             </span>
             {showExplanation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
           </button>
           
           {showExplanation && (
             <div className="p-4 pt-0 text-slate-600 text-sm leading-relaxed border-t border-dashed border-slate-200 bg-blue-50/30">
               <strong className="text-slate-800 block mb-1">Explication :</strong>
               {question.explanation || "Aucune explication disponible pour cette question."}
             </div>
           )}
        </div>
      )}
    </div>
  );
};