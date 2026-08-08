// src/components/CallToAction.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import famille from '../assets/famille.jpg';
import { Link } from 'react-router-dom';

// Importation unique de Firestore (Gratuit)
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function CallToAction() {
  // État de l'image
  const [currentImage, setCurrentImage] = useState(famille);
  const [loading, setLoading] = useState(false);

  // États du panneau Admin et Authentification
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [newImageInput, setNewImageInput] = useState('');

  // 1. Charger l'image depuis Firestore au chargement du composant
  useEffect(() => {
    const fetchCtaImage = async () => {
      try {
        const docRef = doc(db, "settings", "cta");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().imageUrl) {
          setCurrentImage(docSnap.data().imageUrl);
        }
      } catch (error) {
        console.error("Erreur de chargement de l'image CTA Firestore:", error);
      }
    };

    fetchCtaImage();
  }, []);

  // Vérification du mot de passe
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

  // Basculer l'affichage du panneau Admin
  const toggleAdmin = () => {
    setShowAdmin(!showAdmin);
  };

  // 2. Enregistrer la nouvelle URL dans Firestore
  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    if (!newImageInput.trim()) {
      alert("Veuillez entrer une URL d'image.");
      return;
    }

    setLoading(true);
    try {
      const url = newImageInput.trim();
      await setDoc(doc(db, "settings", "cta"), { imageUrl: url }, { merge: true });
      setCurrentImage(url);
      setNewImageInput('');
      alert("Image enregistrée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'URL :", error);
      alert("Échec de la mise à jour de l'image.");
    } finally {
      setLoading(false);
    }
  };

  // Réinitialiser à l'image par défaut dans Firestore
  const handleResetImage = async () => {
    if (!window.confirm("Voulez-vous restaurer l'image par défaut ?")) return;

    setLoading(true);
    try {
      await setDoc(doc(db, "settings", "cta"), { imageUrl: famille }, { merge: true });
      setCurrentImage(famille);
      alert("Image par défaut restaurée !");
    } catch (error) {
      console.error("Erreur de réinitialisation :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 px-6 md:px-16 bg-[#050505] border-t border-gray-900/50">
      
      {/* Bouton Panneau Administration */}
      <div className="mb-8">
        <button
          onClick={toggleAdmin}
          className="bg-[#D9A76F] text-black px-4 py-2 rounded-md text-xs font-semibold hover:bg-amber-500 transition-colors"
        >
          {showAdmin ? 'Masquer Panneau Admin' : 'Mode Admin'}
        </button>

        {showAdmin && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-6 bg-[#111111] border border-gray-800 rounded-xl space-y-4"
          >
            {!isAuthenticated ? (
              /* Formulaire de connexion Admin */
              <form onSubmit={handleLogin} className="max-w-sm space-y-3">
                <h3 className="text-sm font-semibold text-[#D9A76F]">Accès Administrateur Protégé</h3>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="Entrez le mot de passe"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="flex-1 bg-black/60 border border-gray-700 text-white p-2 rounded-lg text-xs focus:outline-none focus:border-[#D9A76F]"
                  />
                  <button
                    type="submit"
                    className="bg-[#D9A76F] text-black px-4 py-2 rounded-lg text-xs font-semibold hover:bg-amber-500 transition-colors"
                  >
                    Valider
                  </button>
                </div>
                {errorMsg && <p className="text-red-500 text-xs">{errorMsg}</p>}
              </form>
            ) : (
              /* Espace Admin (Accessible après mot de passe) */
              <>
                <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                  <h3 className="text-lg font-serif text-[#D9A76F]">Gestion de l'image de section</h3>
                  <button
                    onClick={() => setIsAuthenticated(false)}
                    className="text-xs text-gray-400 hover:text-white underline"
                  >
                    Déconnexion
                  </button>
                </div>
                
                {loading && <p className="text-[#D9A76F] text-xs animate-pulse">Enregistrement en cours...</p>}

                <form onSubmit={handleUrlSubmit} className="space-y-2 max-w-lg">
                  <label className="block text-xs text-gray-400">URL de l'image (Gratuit) :</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={newImageInput}
                      disabled={loading}
                      onChange={(e) => setNewImageInput(e.target.value)}
                      className="flex-1 bg-black/60 border border-gray-700 text-white p-2.5 rounded-lg text-xs focus:outline-none focus:border-[#D9A76F]"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#D9A76F] text-black font-semibold px-4 rounded-lg text-xs hover:bg-amber-500 transition-colors"
                    >
                      Appliquer
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        
        {/* Texte et bouton à gauche */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">
            Une famille Heureuse et modèle qui glorifie <br />
            <span className="italic font-light text-[#D9A76F]">Christ.</span>
          </h2>
          
          <p className="text-gray-400 max-w-md leading-relaxed text-sm font-light">
            Les hommes et les femmes en tant que créatures de
            Dieu ont besoin d’un bon cadre pour échanger entre
            partenaires leurs soucis, inquiétudes et projets dans une
            atmosphère nouvelle et agréable.
          </p>

          <button className="bg-[#D9A76F] text-[#050505] px-8 py-3 rounded-full font-semibold hover:bg-white transition duration-300">
            <Link to={'/contact'}>
              Contactez-nous
            </Link>
          </button>
        </motion.div>

        {/* Image à droite */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          className="relative h-[360px] rounded-2xl overflow-hidden shadow-2xl border border-gray-800/80 group flex items-center justify-center bg-black/40"
        >
          {currentImage ? (
            <>
              <img 
                src={currentImage} 
                alt="Famille modèle" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

              {/* Badges d'administration sur l'image */}
              {showAdmin && isAuthenticated && (
                <div className="absolute top-3 left-3 right-3 z-20 flex justify-between items-center bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/10 text-xs">
                  <span className="text-gray-300 font-mono text-[10px]">Document: settings/cta</span>
                  <button
                    onClick={handleResetImage}
                    className="bg-red-600/80 hover:bg-red-600 text-white px-2 py-1 rounded transition-colors text-[10px]"
                  >
                    Restaurer par défaut
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center p-6">
              <p className="text-gray-500 text-sm mb-3">Aucune image sélectionnée</p>
              {showAdmin && isAuthenticated && (
                <button
                  onClick={handleResetImage}
                  className="bg-[#D9A76F] text-black text-xs px-3 py-1.5 rounded font-semibold"
                >
                  Restaurer l'image par défaut
                </button>
              )}
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
}