// src/pages/Contact.jsx
import React, { useState } from 'react';

export default function Contact() {
  const [copied, setCopied] = useState(false);

  // 1. Configuration WhatsApp
  const rawPhoneNumber = '243994136810'; 
  const defaultWhatsAppMessage = "Bonjour, je souhaite rejoindre le groupe FAMOD et en savoir plus sur vos activités.";
  const whatsappUrl = `https://wa.me/${rawPhoneNumber}?text=${encodeURIComponent(defaultWhatsAppMessage)}`;

  // 2. Configuration Email / Gmail
  const emailAddress = "famillemodele206@gmail.com"; // ⚠️ Remplace par ton adresse réelle
  const emailSubject = "Demande d'information - FAMOD";
  const defaultEmailBody = "Bonjour l'équipe FAMOD,\n\nJe souhaite obtenir plus d'informations concernant votre ministère et vos activités.";

  // Lien direct Web Gmail (ouvre l'onglet d'envoi Gmail directement dans le navigateur)
  const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(defaultEmailBody)}`;

  // Fonction de secours : Copier l'adresse dans le presse-papier
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white p-8 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-[#121212] border border-[#D1A977]/30 rounded-3xl p-8 text-center space-y-8 shadow-2xl">
        
        {/* En-tête */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Contactez FAMOD</h2>
          <p className="text-xs text-slate-400">
            Choisissez votre canal préféré pour nous écrire et intégrer notre communauté.
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="space-y-4">
          
          {/* Bouton WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-between w-full py-3.5 px-6 rounded-2xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-emerald-500/20 group"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
              </svg>
              <span>Écrire sur WhatsApp</span>
            </div>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>

          {/* Bouton Web Gmail */}
          <a
            href={gmailWebUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-between w-full py-3.5 px-6 rounded-2xl bg-red-600/90 hover:bg-red-500 text-white font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-red-500/20 group"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.272H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.545l8.073-6.052c1.618-1.214 3.927-.059 3.927 1.964z" />
              </svg>
              <span>Ouvrir dans Gmail</span>
            </div>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>

          {/* Bouton secours : Copier l'adresse Email */}
          <button
            type="button"
            onClick={handleCopyEmail}
            className="w-full py-2.5 px-4 rounded-xl bg-[#1A1A1A] hover:bg-[#252525] border border-gray-800 text-xs text-slate-300 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 002-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>{copied ? "Adresse email copié !" : `Copier l'adresse : ${emailAddress}`}</span>
          </button>

        </div>

        {/* Note de bas de carte */}
        <p className="text-[11px] text-slate-500 border-t border-slate-800 pt-4">
          Nous vous répondons généralement sous 24h.
        </p>

      </div>
    </div>
  );
}