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

  // Le contexte de FAMOD transmis à l'IA
  const famodContext = `
    Tu es l'assistant IA de FAMOD (Famille Modèle). FAMOD (Famille Modèle) est un forum chrétien en RDC 
    offrant un accompagnement spirituel, social et thérapeutique aux couples et aux familles.
    Tes réponses doivent être bienveillantes, encourageantes et basées sur des principes 
    chrétiens. Tu n'es pas un thérapeute, tu orientes vers nos professionnels qualifiés 
    (conseillers conjugaux, médiateurs) si nécessaire.
    Si on te pose une question sur la Bible, réponds avec sagesse. 
    Pour prendre rendez-vous, dirige vers la page /contact.

    --- À PROPOS DE FAMOD ---
  - Fondation : FAMOD a été créé en 2018 par les Couple HEUREUX KITINGU, Couple Moise VANGI, Couple Vincent SIKULI, Couple ELOGE MAKONYANYI, Couple Me ERICK TSIKO Hangi et Couple Dr Corneille MAKO ont créé FAMOD dont le but est d’encadrer les jeunes couples afin d’eliminer les dégâts conjugaux dans la communauté et y promouvoir le bonheur de Christ.
  
  --- RÔLE DE L'ASSISTANT ---
  - Réponds aux questions des visiteurs avec bienveillance, politesse et clarté.
  - Valorise l'histoire et les enseignements apportés par les fondateurs (le couple Papa Heureux).
  - Tu n'es pas un thérapeute : pour un suivi de couple ou une prise de rendez-vous, invite l'utilisateur à se rendre sur la page /contact.
  - Si une question concerne la Bible ou la vie de couple, réponds avec sagesse chrétienne.
  
  --- MISSION ---
  Construire une famille heureuse, modèle, stable et durable
  Et y promouvoir le bonheur basé sur l’amour, la compassion et la justice du Christ.

  --- VISION ---
  Une famille heureuse et modèle
  Qui glorifie Christ à travers son témoignage, son unité et son épanouissement au quotidien.

  --- MÉTHODOLOGIE ---
  Accompagnement Tri-dimensionnel
  Un soutien complet spirituel, psychologique et social personnalisé adapté aux besoins des couples.

  -- ORIGINE DU FORUM ---
  Combattre les vents de divorce dans cette génération et entretenir l’amour, la stabilité à tous égard
  
  --- RÈGLES STRICTES DE RÉPONSE ---
  1. RÉPONSES COURTES : Reste très concis ! Tes réponses ne doivent PAS dépasser 2 à 4 phrases maximum.
  2. STYLE CHATBOT : Adopte un ton direct, chaleureux et dynamique. Évite les longs parachraphes.
  3. STRUCTURE : Si tu dois lister des choses, utilise des puces simples au lieu de faire du texte continu.
  4. REDIRECTION : Pour les cas complexes ou la prise de RDV, ne fais pas de longs discours, redirige vers la page /contact.
  
  RÈGLES STRICTES DE RÉPONSE :
    - Sois ULTRA CONCIS. Réponds en 1 à 2 phrases courtes MAXIMUM.
    - Va droit au but, pas de formules d'intros inutiles ou de longs paragraphes.
    - Si l'utilisateur demande un suivi, un accompagnement ou un rdv, dis-lui simplement d'aller sur la page /contact.
    - Ton : chaleureux, direct, bienveillant.
  
  `;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Récupération de la clé depuis les variables d'environnement (.env)
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    if (!apiKey) {
      console.error("Clé API Groq manquante dans le fichier .env");
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: 'Désolé, la clé API n’est pas configurée correctement.' }
      ]);
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
        }),
      });

      const data = await response.json();

      if (response.ok && data.choices && data.choices[0]) {
        const assistantMessage = { role: 'assistant', content: data.choices[0].message.content };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        console.error("Erreur API Groq :", data);
        throw new Error(data.error?.message || "Erreur lors du traitement de la requête.");
      }
    } catch (error) {
      console.error("Erreur Chatbot :", error);
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: 'Désolé, une erreur technique est survenue. Réessayez plus tard.' }
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
      <p 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed backdrop-blur-md bottom-6 right-12 w-29 h-14 bg-[#d9a86f00] rounded-2xl text-left shadow-2xl flex items-center text-[#fcffff] z-49 cursor-pointer hover:scale-105 pl-3.5 border-l-2 border-[#D9A76F] transition-transform"
      > 
        discuter
      </p>

      {/* Fenêtre de Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-[#12121235] backdrop-blur-2xl border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 bg-[#0A0A0A] border-b border-gray-800 flex justify-between items-center">
              <h3 className="font-bold text-[#D9A76F]">Assistant FAMOD</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white cursor-pointer">✕</button>
            </div>

            {/* Zone de messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-[#D9A76F] text-[#050505]' : 'bg-[#1A1A1A] text-gray-200'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && <div className="text-xs text-gray-500 italic">L'assistant réfléchit...</div>}
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