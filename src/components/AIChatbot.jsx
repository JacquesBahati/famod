// src/components/AIChatbot.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Bonjour ! Je suis l’assistant de FAMOD. Comment puis-je vous aider aujourd’hui ?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Contexte simplifié et direct
  const famodContext = `
    Tu es l'assistant IA de FAMOD (Famille Modèle), un forum chrétien en RDC d'accompagnement pour couples/familles.
    
    RÈGLES STRICTES :
    - Réponses ULTRA COURTES : 1 à 2 phrases max.
    - Ton : chaleureux, direct, bienveillant.
    - Pour les rendez-vous ou accompagnements, redirige simplement vers la page /contact.
  `;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    if (!apiKey) {
      setMessages(prev => [
        ...prev, 
        { role: 'user', content: input },
        { role: 'assistant', content: 'Désolé, la clé API n’est pas encore chargée par Vercel.' }
      ]);
      setInput('');
      return;
    }

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: famodContext },
            ...updatedMessages
          ],
          max_tokens: 100,
          temperature: 0.5
        }),
      });

      const data = await response.json();

      if (response.ok && data.choices && data.choices[0]) {
        const assistantMessage = { role: 'assistant', content: data.choices[0].message.content };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error?.message || "Erreur API");
      }
    } catch (error) {
      console.error("Erreur Chatbot:", error);
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: 'Désolé, une erreur est survenue.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      {/* Bouton Bulle (Flottant) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#D9A76F] rounded-full shadow-2xl flex items-center justify-center text-[#050505] z-50 cursor-pointer hover:scale-105 transition-transform"
      >
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {/* Fenêtre de Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-[#12121242] border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 bg-[#0A0A0A] border-b border-gray-800 flex justify-between items-center">
              <h3 className="font-bold text-[#D9A76F]">Assistant FAMOD</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white cursor-pointer">✕</button>
            </div>

            {/* Zone de messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#12121200] backdrop-blur-2xl drop-shadow-2xl">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-[#D9A76F] text-black font-medium' 
                      : 'bg-[#1A1A1A] text-gray-200 border border-gray-800'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && <div className="text-xs text-gray-400 italic">L'assistant réfléchit...</div>}
              <div ref={messagesEndRef} />
            </div>

            {/* Input & Bouton d'envoi */}
            <div className="p-3 border-t border-gray-800 bg-[#0A0A0A] flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Posez votre question..."
                className="flex-1 p-2.5 rounded-lg bg-[#1A1A1A] border border-gray-800 text-sm text-white focus:outline-none focus:border-[#D9A76F]"
              />
              <button 
                onClick={handleSend} 
                disabled={isLoading}
                className="p-2.5 bg-[#D9A76F] hover:bg-[#b88c57] rounded-lg text-[#050505] disabled:opacity-50 cursor-pointer transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}