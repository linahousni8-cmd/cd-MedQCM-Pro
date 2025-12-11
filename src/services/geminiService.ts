import { GoogleGenAI, Type } from "@google/genai";
import type { Question } from "../types";

// Fonction sécurisée pour récupérer la clé API dans un environnement Vite/Browser
const getApiKey = () => {
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env?.API_KEY) {
       // @ts-ignore
       return process.env.API_KEY;
    }
    // @ts-ignore
    if (import.meta.env?.VITE_API_KEY) {
       // @ts-ignore
       return import.meta.env.VITE_API_KEY;
    }
  } catch (e) {
    console.warn("Erreur lecture clé API", e);
  }
  return '';
};

export const generateQuestionsForModule = async (moduleName: string, count: number = 3): Promise<Question[]> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    console.warn("Clé API manquante");
    // On retourne une erreur explicite ou des questions vides pour ne pas crasher
    throw new Error("Clé API manquante. Veuillez ajouter VITE_API_KEY dans les Secrets GitHub.");
  }

  // Initialisation lazy (uniquement quand on en a besoin) pour éviter les crashs au démarrage
  const ai = new GoogleGenAI({ apiKey });
  
  const model = "gemini-2.5-flash";
  
  const prompt = `Génère ${count} questions QCM (Choix Multiples) pour un module de médecine intitulé "${moduleName}".
  Pour chaque question :
  - Fournis un énoncé clair.
  - Fournis 4 options de réponse.
  - Indique l'index de la réponse correcte (0 à 3).
  - Fournis une explication brève.
  - Le contenu doit être en français.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["text", "options", "correctIndex", "explanation"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];

    const rawQuestions = JSON.parse(text);
    
    return rawQuestions.map((q: any, index: number) => ({
      id: `ai-${Date.now()}-${index}`,
      text: q.text,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation
    }));
  } catch (error) {
    console.error("Erreur Gemini:", error);
    throw error;
  }
};