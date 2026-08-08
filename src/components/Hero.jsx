// src/components/Hero.jsx
import { useState, useEffect } from 'react';
import heroImageDefault from '../assets/ptincipale.jpg';
import Typewriter from 'typewriter-effect';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import maison from "../assets/maisn.png";

// Importation unique de Firestore (Gratuit)
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Hero() {
  const [currentBg, setCurrentBg] = useState(heroImageDefault);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Charger l'image sauvegardée dans Firestore au chargement du composant
  useEffect(() => {
    const fetchHeroBg = async () => {
      try {
        const docRef = doc(db, "settings", "hero");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().bgUrl) {
          setCurrentBg(docSnap.data().bgUrl);
        }
      } catch (error) {
        console.error("Erreur de chargement du background Firestore:", error);
      }
    };

    fetchHeroBg();
  }, []);

  // Connexion Admin
  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === 'famod2026') {
      setIsAuthenticated(true);
      setErrorMsg('');
      setPasswordInput('');
    } else {
      setErrorMsg('Mot de passe incorrect !');
    }
  };

  // 2. Sauvegarder l'URL directe de l'image dans Firestore
  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) {
      alert("Veuillez saisir une URL d'image.");
      return;
    }

    setLoading(true);
    try {
      const url = imageUrlInput.trim();
      await setDoc(doc(db, "settings", "hero"), { bgUrl: url }, { merge: true });
      setCurrentBg(url);
      setImageUrlInput('');
      alert("Lien de l'image enregistré avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'URL:", error);
      alert("Échec de l'enregistrement dans Firestore.");
    } finally {
      setLoading(false);
    }
  };

  // --- GESTION DU MOUVEMENT DE LA SOURIS (PARALLAXE) ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  const bgX = useTransform(smoothX, [-0.5, 0.5], ['3%', '-3%']);
  const bgY = useTransform(smoothY, [-0.5, 0.5], ['3%', '-3%']);

  const textX = useTransform(smoothX, [-0.5, 0.5], ['-15px', '15px']);
  const textY = useTransform(smoothY, [-0.5, 0.5], ['-15px', '15px']);

  const handleMouseMove = (e) => {
    const { clientWidth, clientHeight } = e.currentTarget;
    const x = e.clientX / clientWidth - 0.5;
    const y = e.clientY / clientHeight - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] },
    },
  };

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full bg-[#050505] flex items-center pt-28 pb-16 px-6 md:px-16 overflow-hidden"
    >
      
      {/* PANNEAU ADMIN */}
      <div className="absolute top-24 left-6 md:left-16 z-30">
        <button
          onClick={() => setShowAdmin(!showAdmin)}
          className="bg-[#D9A76F]/80 hover:bg-[#D9A76F] backdrop-blur-md text-black px-3 py-1.5 rounded-md text-xs font-semibold transition-colors shadow-lg"
        >
          {showAdmin ? 'Masquer Admin' : 'Accès Admin'}
        </button>

        {showAdmin && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 p-4 bg-[#111111]/95 border border-gray-800 rounded-xl shadow-2xl backdrop-blur-md max-w-sm text-xs"
          >
            {!isAuthenticated ? (
              <form onSubmit={handleLogin} className="space-y-3">
                <p className="font-semibold text-[#D9A76F]">Accès Administrateur Protégé</p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="Mot de passe"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="flex-1 bg-black/60 border border-gray-700 text-white p-2 rounded-lg focus:outline-none focus:border-[#D9A76F]"
                  />
                  <button
                    type="submit"
                    className="bg-[#D9A76F] text-black px-3 py-2 rounded-lg font-semibold hover:bg-amber-500 transition-colors"
                  >
                    OK
                  </button>
                </div>
                {errorMsg && <p className="text-red-500">{errorMsg}</p>}
              </form>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                  <span className="font-semibold text-[#D9A76F]">Modifier le background</span>
                  <button 
                    onClick={() => setIsAuthenticated(false)}
                    className="text-gray-400 hover:text-white underline text-[10px]"
                  >
                    Déconnexion
                  </button>
                </div>

                {loading && <p className="text-[#D9A76F] animate-pulse">Enregistrement en cours...</p>}

                <div className="pt-1">
                  <label className="block text-gray-400 mb-1">URL de l'image :</label>
                  <form onSubmit={handleUrlSubmit} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={imageUrlInput}
                      disabled={loading}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="flex-1 bg-black/60 border border-gray-700 text-white p-2 rounded-lg focus:outline-none focus:border-[#D9A76F]"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#D9A76F] text-black px-3 py-2 rounded-lg font-semibold hover:bg-amber-500 transition-colors"
                    >
                      Appliquer
                    </button>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* 1. L'IMAGE EN ARRIÈRE-PLAN */}
      <div className="absolute top-0 right-0 w-full md:w-2/3 h-full z-0 overflow-hidden">
        <motion.img 
          key={currentBg}
          src={currentBg} 
          alt="Background Hero" 
          style={{ x: bgX, y: bgY }}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1.05, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-full h-full object-cover object-center scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
      </div>

      {/* 2. GLOW AMBIANT EN ARRIÈRE-PLAN */}
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.25, 0.15] 
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-20 top-1/3 w-96 h-96 bg-[#D9A76F]/20 rounded-full blur-[120px] pointer-events-none z-0"
      />

      {/* 3. LE CONTENU TEXTE ET BOUTONS */}
      <motion.div 
        style={{ x: textX, y: textY }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-2xl space-y-8"
      >
        <motion.h1 
          variants={itemVariants}
          className="text-5xl md:text-7xl font-serif leading-tight tracking-tight text-white min-h-[140px] md:min-h-[180px]"
        >
          <div className='w-64 flex items-center justify-center'>
            <img src={maison} alt="" className='w-38 flex items-center justify-center' />
          </div>
          FAMILLE<br />
          <span className="text-[#D9A76F] hover:text-white transition-colors duration-300 inline-block">
            <Typewriter
              options={{
                strings: ['MODÈLE'],
                autoStart: true,
                loop: true,
                deleteSpeed: 50,
                delay: 70,
              }}
            />
          </span>
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-gray-300 max-w-lg leading-relaxed text-sm md:text-base font-light"
        >
          Construire une famille <span className="text-[#D9A76F] font-normal">Heureuse, modèle, stable, durable </span> et y promouvoir le bonheur basé sur l’amour, la compassion et la justice du Christ.
        </motion.p>

        <motion.div variants={itemVariants} className="flex gap-4 pt-2">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#D9A76F] text-[#050505] px-8 py-3 rounded-full font-semibold hover:bg-white transition duration-300 shadow-lg shadow-[#D9A76F]/20"
          >
            <Link to={'/service'}>
              Explorer Plus
            </Link>
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            className="text-white border border-gray-600 px-8 py-3 rounded-full transition duration-300"
          >
            <Link to={'/about'}>
              Apprendre encore plus
            </Link>
          </motion.button>
        </motion.div>
      </motion.div>

    </section>
  );
}