// src/components/CookieBanner.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà donné son choix
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    // Enregistrer le choix
    localStorage.setItem('cookie_consent', 'accepted');
    document.cookie = "analytics_allowed=true; max-age=31536000; path=/; SameSite=Lax";
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    document.cookie = "analytics_allowed=false; max-age=31536000; path=/; SameSite=Lax";
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-[#121212] border border-gray-800 rounded-2xl p-5 shadow-2xl z-50 flex flex-col gap-4 text-sm"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">🍪</span>
            <div>
              <h3 className="font-bold text-white mb-1">Respect de votre vie privée</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Nous utilisons des cookies pour améliorer votre expérience et mesurer l'audience. Vous pouvez choisir de les accepter ou de les refuser.
              </p>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={handleDecline}
              className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition text-xs font-medium cursor-pointer"
            >
              Refuser
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 rounded-xl bg-[#D9A76F] text-[#050505] hover:bg-white transition text-xs font-semibold cursor-pointer"
            >
              Accepter
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}