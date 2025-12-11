import React, { useState } from 'react';
import { X, Send, Mail } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Création du lien mailto avec le sujet et le corps du message
    const subject = encodeURIComponent(`Contact MedQCM Pro de ${email}`);
    const body = encodeURIComponent(`Message de: ${email}\n\n${message}`);
    
    // Ouvre le client mail par défaut
    window.location.href = `mailto:linahousni8@gmail.com?subject=${subject}&body=${body}`;
    
    // Fermer la modale après un court délai
    setTimeout(() => {
        onClose();
        setEmail('');
        setMessage('');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 bg-slate-50 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800">Contactez-nous</h2>
            <p className="text-sm text-slate-500 mt-1">Une question ou une suggestion ? Écrivez-nous.</p>
        </div>

        <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Votre Email</label>
                    <input 
                        required
                        type="email" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                        placeholder="exemple@email.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                    <textarea 
                        required
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        rows={4}
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                        placeholder="Comment pouvons-nous vous aider ?"
                    />
                </div>
                <button 
                    type="submit"
                    className="w-full bg-primary-600 text-white py-2.5 rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                    <Send className="w-4 h-4" />
                    Envoyer le message
                </button>
            </form>
        </div>
        
        <div className="p-4 bg-slate-50 text-center border-t border-slate-100 flex flex-col items-center gap-2">
            <div className="bg-white p-2 rounded-full shadow-sm">
                <Mail className="w-4 h-4 text-primary-600" />
            </div>
            <p className="text-xs text-slate-500">
                Email direct : <a href="mailto:linahousni8@gmail.com" className="text-primary-600 hover:underline font-medium">linahousni8@gmail.com</a>
            </p>
        </div>
      </div>
    </div>
  );
};