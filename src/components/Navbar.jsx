// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from "../assets/LOGO FAMOD png.png";
import AuthModal from './AuthModal';

// Imports Firebase pour l'authentification
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState({ code: 'fr', label: 'FR', name: 'Français' });
  const [hasTranslateBanner, setHasTranslateBanner] = useState(false);
  
  // État de l'utilisateur Firebase et de la modale
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const location = useLocation();

  const languages = [
    { code: 'fr', label: 'FR', name: 'Français' },
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'sw', label: 'SW', name: 'Kiswahili' },
  ];

  // 1. Écouter l'état de connexion de l'utilisateur avec Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fonction de déconnexion
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  // 3. Minuteur : Proposer l'inscription toutes les 10 secondes si non connecté
  useEffect(() => {
    const timer = setInterval(() => {
      if (!auth.currentUser) {
        setIsAuthOpen(true);
      }
    }, 20000); // 10 secondes

    return () => clearInterval(timer);
  }, []);

  // 4. Initialisation de Google Translate & lecture du cookie actif
  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
    if (match && match[1]) {
      const langCode = match[1].split('/').pop();
      const active = languages.find((l) => l.code === langCode);
      if (active) setCurrentLang(active);
    }

    const checkBanner = () => {
      const banner = document.querySelector('.goog-te-banner-frame, iframe[src*="translate"]');
      if (banner && banner.offsetHeight > 0) {
        setHasTranslateBanner(true);
      } else if (document.body.style.top && document.body.style.top !== '0px') {
        setHasTranslateBanner(true);
      } else {
        setHasTranslateBanner(false);
      }
    };

    const observer = new MutationObserver(checkBanner);
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });

    if (!window.google || !window.google.translate) {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          { 
            pageLanguage: 'fr', 
            includedLanguages: 'fr,en,sw',
            autoDisplay: false 
          },
          'google_translate_element'
        );
      };

      const scriptId = 'google-translate-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
      }
    }

    return () => observer.disconnect();
  }, []);

  const changeLanguage = (lang) => {
    setCurrentLang(lang);
    setIsLangOpen(false);

    const domain = window.location.hostname;

    if (lang.code === 'fr') {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`;
    } else {
      document.cookie = `googtrans=/fr/${lang.code}; path=/;`;
      document.cookie = `googtrans=/fr/${lang.code}; path=/; domain=${domain}`;
      document.cookie = `googtrans=/fr/${lang.code}; path=/; domain=.${domain}`;
    }

    const selectElem = document.querySelector('.goog-te-combo');
    if (selectElem) {
      selectElem.value = lang.code;
      selectElem.dispatchEvent(new Event('change'));
    } else {
      window.location.reload();
    }
  };

  // 5. Liens de navigation
  const baseLinks = [
    { name: 'Services', path: '/service' },
    { name: 'À propos de Nous', path: '/about' },
    { name: 'Média', path: '/media' },
    { name: 'Histoire', path: '/histoir' },
  ];

  const links = currentUser 
    ? [...baseLinks, { name: 'Communauté', path: '/communaute' }]
    : baseLinks;

  const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Utilisateur';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <>
      <nav 
        className={`border-b border-white/10 bg-[#050505]/20 backdrop-blur-xl fixed w-full z-40 transition-all duration-300 ${
          hasTranslateBanner ? 'top-[40px]' : 'top-0'
        }`}
      >
        <div 
          id="google_translate_element" 
          className="absolute opacity-0 pointer-events-none -z-50 w-0 h-0 overflow-hidden" 
        />

        <div className="flex justify-between items-center px-5 md:px-8 xl:px-12 py-3.5">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl xl:text-2xl font-bold tracking-widest text-white group shrink-0">
            <p className="border-b-2 border-transparent group-hover:border-[#D9A76F] transition-all duration-300 font-serif">
              FAMOD
            </p>
            <motion.img 
              whileHover={{ scale: 1.08, rotate: 2 }}
              transition={{ type: "spring", stiffness: 300 }}
              src={logoImg} 
              alt="Logo FAMOD" 
              className="w-11 xl:w-14 h-auto" 
            />
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-7 text-xs xl:text-sm uppercase tracking-wider relative">
            {links.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className="relative py-2 text-gray-300 hover:text-white transition duration-300 whitespace-nowrap"
                >
                  {link.name}

                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D9A76F]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Actions Desktop */}
          <div className="hidden lg:flex gap-3 xl:gap-4 items-center shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-2 xl:gap-3 bg-gray-900/80 border border-white/10 px-3 py-1.5 rounded-full">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={userName}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      if (e.currentTarget.nextSibling) {
                        e.currentTarget.nextSibling.style.display = 'flex';
                      }
                    }}
                    className="w-7 h-7 xl:w-8 xl:h-8 rounded-full border border-[#D9A76F] object-cover shrink-0"
                  />
                ) : null}

                <div 
                  style={{ display: currentUser.photoURL ? 'none' : 'flex' }}
                  className="w-7 h-7 xl:w-8 xl:h-8 rounded-full bg-[#D9A76F] text-[#050505] font-bold items-center justify-center text-xs xl:text-sm shadow-md shrink-0"
                >
                  {userInitial}
                </div>

                <span className="text-xs xl:text-sm font-medium text-gray-200 max-w-[90px] xl:max-w-[130px] truncate" title={userName}>
                  <strong className="text-[#D9A76F]">{userName}</strong>
                </span>

                <button
                  onClick={handleLogout}
                  className="text-[11px] xl:text-xs font-semibold text-red-400 hover:text-red-300 border border-red-500/30 hover:bg-red-500/10 transition px-2.5 py-1 rounded-lg cursor-pointer ml-1"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="text-xs xl:text-sm font-semibold text-gray-300 hover:text-[#D9A76F] transition px-3 py-1.5 cursor-pointer whitespace-nowrap"
              >
                Se connecter
              </button>
            )}

            {/* Menu Langues Desktop */}
            <div className="relative">
              <button 
                type="button"
                onClick={() => setIsLangOpen((prev) => !prev)}
                className="text-xs xl:text-sm font-bold text-gray-300 hover:text-[#D9A76F] transition flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 bg-[#121212] cursor-pointer"
              >
                <span>{currentLang.label}</span>
                <svg 
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-[#0a0a0a]/90 border border-white/10 rounded-xl shadow-2xl py-2 overflow-hidden z-50 backdrop-blur-md">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => changeLanguage(lang)}
                      className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center justify-between hover:bg-[#D9A76F]/10 hover:text-[#D9A76F] transition cursor-pointer ${
                        currentLang.code === lang.code ? 'text-[#D9A76F] bg-[#121212]' : 'text-gray-300'
                      }`}
                    >
                      <span>{lang.name}</span>
                      <span className="text-[10px] opacity-60">({lang.label})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/contact"
                className="bg-[#D9A76F] text-[#050505] px-4 xl:px-6 py-2 rounded-full text-xs xl:text-sm font-semibold hover:bg-white transition inline-block shadow-lg shadow-[#D9A76F]/10 whitespace-nowrap"
              >
                Contactez-nous
              </Link>
            </motion.div>
          </div>

          {/* Bouton Hamburger Mobile Amélioré */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="lg:hidden text-white focus:outline-none p-2 rounded-xl bg-white/5 border border-white/10 cursor-pointer"
            aria-label="Menu Mobile"
          >
            <svg 
              className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </motion.button>
        </div>

        {/* ==========================================
        MENU MOBILE EMBELLI (STYLE CARTE GLASSMORPHISM)
        ========================================== */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="lg:hidden px-4 pb-6 pt-2"
            >
              <div className="bg-[#121212]/35 border border-[#D9A76F]/30 rounded-3xl p-5 shadow-2xl backdrop-blur-2xl flex flex-col gap-5 text-left">
                
                {/* 1. LIENS DE NAVIGATION MOBILE */}
                <div className="flex flex-col gap-1.5">
                  {links.map((link, index) => {
                    const isActive = location.pathname === link.path;

                    return (
                      <motion.div
                        key={link.path}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <NavLink
                          to={link.path}
                          onClick={() => setIsOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center justify-between px-4 py-3 rounded-2xl text-base font-medium transition-all ${
                              isActive
                                ? 'bg-[#D9A76F]/15 text-[#D9A76F] font-bold border border-[#D9A76F]/30'
                                : 'text-gray-200 hover:bg-white/5 hover:text-white'
                            }`
                          }
                        >
                          <span>{link.name}</span>
                          {isActive && (
                            <span className="w-2 h-2 rounded-full bg-[#D9A76F] shadow-[0_0_8px_#D9A76F]" />
                          )}
                        </NavLink>
                      </motion.div>
                    );
                  })}
                </div>

                {/* 2. ESPACE PROFIL / CONNEXION MOBILE */}
                <div className="border-t border-white/10 pt-4">
                  {currentUser ? (
                    <div className="bg-[#181818] border border-white/10 p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-inner">
                      <div className="flex items-center gap-3 overflow-hidden">
                        {currentUser.photoURL ? (
                          <img
                            src={currentUser.photoURL}
                            alt={userName}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              if (e.currentTarget.nextSibling) {
                                e.currentTarget.nextSibling.style.display = 'flex';
                              }
                            }}
                            className="w-10 h-10 rounded-full border-2 border-[#D9A76F] object-cover shrink-0"
                          />
                        ) : null}

                        <div 
                          style={{ display: currentUser.photoURL ? 'none' : 'flex' }}
                          className="w-10 h-10 rounded-full bg-[#D9A76F] text-[#050505] font-bold items-center justify-center text-base shadow-md shrink-0"
                        >
                          {userInitial}
                        </div>

                        <div className="flex flex-col overflow-hidden">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Compte</span>
                          <span className="text-sm font-bold text-white truncate">{userName}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 px-3 py-2 rounded-xl transition shrink-0"
                      >
                        Déconnexion
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        setIsAuthOpen(true);
                      }}
                      className="w-full py-3.5 rounded-2xl bg-white/5 border border-white/10 text-[#D9A76F] font-bold text-sm text-center hover:bg-[#D9A76F]/10 transition flex items-center justify-center gap-2"
                    >
                      <span>🔑</span> Se connecter / S'inscrire
                    </button>
                  )}
                </div>

                {/* 3. SÉLECTEUR DE LANGUES MOBILE (PILLS MODERNES) */}
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block px-1">
                    Langue d'affichage
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          changeLanguage(lang);
                          setIsOpen(false);
                        }}
                        className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 border ${
                          currentLang.code === lang.code
                            ? 'border-[#D9A76F] bg-[#D9A76F] text-black shadow-md'
                            : 'border-white/10 bg-[#161616] text-gray-300 hover:bg-white/5'
                        }`}
                      >
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. BOUTON ACTION PRINCIPAL */}
                <div className="pt-1">
                  <Link
                    to="/contact"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center bg-[#D9A76F] hover:bg-white text-black py-3.5 rounded-2xl text-sm font-bold transition shadow-lg shadow-[#D9A76F]/20 block"
                  >
                    Contactez-nous
                  </Link>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Rendu de la Modale d'authentification */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}