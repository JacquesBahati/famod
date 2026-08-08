// src/components/ListingPreview.jsx
import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

// Firestore
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  writeBatch 
} from 'firebase/firestore';

// Images par défaut
import enseignement from '../assets/enseignement.jpg';
import repas from '../assets/repas.jpg';
import debat from '../assets/debat.jpg';
import coeur from '../assets/coeur.jpg';
import divers from '../assets/divers.jpg';
import priere from '../assets/priere.jpg';
import echange from '../assets/echange.jpg';

const initialItems = [
  { id: 'enseignement', title: 'Enseignements des couples', subtitle: 'FAMILLE MODÈLE', image: enseignement },
  { id: 'debat', title: 'Questions, débat.', subtitle: 'FAMILLE MODÈLE', image: debat },
  { id: 'echange', title: 'Échanges des idées, projets d’avenir', subtitle: 'FAMILLE MODÈLE', image: echange },
  { id: 'repas', title: 'Repas et jouissance', subtitle: 'FAMILLE MODÈLE', image: repas },
  { id: 'priere', title: 'Prière centrée sur la famille', subtitle: 'FAMILLE MODÈLE', image: priere },
  { id: 'coeur', title: 'Moment de coeur à coeur', subtitle: 'FAMILLE MODÈLE', image: coeur },
  { id: 'divers', title: 'Divertissement', subtitle: 'FAMILLE MODÈLE', image: divers },
];

export default function ListingPreview() {
  const sectionRef = useRef(null);

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Administration
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Formulaire
  const [customId, setCustomId] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  // 1. Charger STRICTEMENT les cartes existantes (SANS injection automatique)
  const fetchProperties = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "domains"));
      
      if (!querySnapshot.empty) {
        const fetchedList = querySnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setProperties(fetchedList);
      } else {
        // Si Firestore est complètement vide, afficher les images locales temporairement
        setProperties(initialItems);
      }
    } catch (error) {
      console.error("Erreur d'accès à Firestore :", error);
      setProperties(initialItems);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Action Manuelle : Initialiser ou réinitialiser proprement les 7 cartes par défaut
  const handleSeedDefaultCards = async () => {
    setLoading(true);
    try {
      // 1. Supprimer tous les doublons actuels avec un Batch
      const querySnapshot = await getDocs(collection(db, "domains"));
      const batch = writeBatch(db);
      querySnapshot.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });
      await batch.commit();

      // 2. Écrire uniquement les 7 cartes avec ID fixes
      for (const item of initialItems) {
        const { id, ...data } = item;
        await setDoc(doc(db, "domains", id), data);
      }

      await fetchProperties();
      alert("Base nettoyée et réinitialisée à 7 cartes uniques !");
    } catch (error) {
      console.error("Erreur d'initialisation :", error);
      alert("Échec de la réinitialisation.");
    } finally {
      setLoading(false);
    }
  };

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

  // 2. Ajouter une carte manuellement
  const handleAddProperty = async (e) => {
    e.preventDefault();
    if (!newTitle || !newImageUrl) {
      alert("Veuillez entrer au moins un titre et une URL d'image.");
      return;
    }

    setSubmitting(true);
    try {
      const newItem = {
        title: newTitle,
        subtitle: newSubtitle || 'FAMILLE MODÈLE',
        image: newImageUrl.trim(),
      };

      if (customId.trim()) {
        await setDoc(doc(db, "domains", customId.trim()), newItem);
      } else {
        await addDoc(collection(db, "domains"), newItem);
      }

      setCustomId('');
      setNewTitle('');
      setNewSubtitle('');
      setNewImageUrl('');
      await fetchProperties();
      alert("Carte enregistrée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      alert("Échec de l'enregistrement.");
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Supprimer une carte
  const handleDeleteProperty = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) return;

    try {
      await deleteDoc(doc(db, "domains", id));
      setProperties(properties.filter((prop) => prop.id !== id));
    } catch (error) {
      console.error("Erreur de suppression :", error);
      alert("Impossible de supprimer cet élément.");
    }
  };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const imageY = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  const specs = [
    { label: '1. Enseignements des couples', value: 'FAMOD' },
    { label: '2. Ateliers', value: 'FAMOD' },
    { label: '3. Prière', value: 'FAMOD' },
    { label: '4. Divertissements', value: 'FAMOD' },
  ];

  const specs2 = [
    { label: '1. Enseignements et Prières', value: 'FAMOD' },
    { label: '2. Ateliers', value: 'FAMOD' },
    { label: '3. Accompagnement prénuptial', value: 'FAMOD' },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 70 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, delay: index * 0.25, ease: [0.25, 1, 0.5, 1] },
    }),
  };

  return (
    <section ref={sectionRef} className="py-16 px-6 md:px-16 bg-[#080808] border-t border-gray-900/50 overflow-hidden">
      
      {/* Panneau Administration */}
      <div className="mb-8">
        <button
          onClick={() => setShowAdmin(!showAdmin)}
          className="bg-[#D9A76F] text-black px-4 py-2 rounded-md text-xs font-semibold hover:bg-amber-500 transition-colors"
        >
          {showAdmin ? 'Masquer Panneau Admin' : 'Mode Admin'}
        </button>

        {showAdmin && (
          <div className="mt-4 p-6 bg-[#111111] border border-gray-800 rounded-xl">
            {!isAuthenticated ? (
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
              <>
                <div className="flex justify-between items-center border-b border-gray-800 pb-3 mb-4">
                  <h3 className="text-lg font-serif text-[#D9A76F]">Ajouter un domaine d'intervention</h3>
                  <div className="flex gap-3 items-center">
                    <button
                      onClick={handleSeedDefaultCards}
                      className="bg-red-900/40 border border-red-500/50 text-red-300 px-3 py-1 rounded text-xs hover:bg-red-800/60 transition"
                    >
                      ⚡ Purger & Remettre les 7 cartes uniques
                    </button>
                    <button
                      onClick={() => setIsAuthenticated(false)}
                      className="text-xs text-gray-400 hover:text-white underline"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>

                <form onSubmit={handleAddProperty} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <input
                    type="text"
                    placeholder="ID (facultatif)"
                    value={customId}
                    onChange={(e) => setCustomId(e.target.value)}
                    className="bg-black/60 border border-gray-700 text-white p-2.5 rounded-lg text-xs focus:outline-none focus:border-[#D9A76F]"
                  />
                  <input
                    type="text"
                    placeholder="Titre"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    className="bg-black/60 border border-gray-700 text-white p-2.5 rounded-lg text-xs focus:outline-none focus:border-[#D9A76F]"
                  />
                  <input
                    type="text"
                    placeholder="Sous-titre (Ex: FAMILLE MODÈLE)"
                    value={newSubtitle}
                    onChange={(e) => setNewSubtitle(e.target.value)}
                    className="bg-black/60 border border-gray-700 text-white p-2.5 rounded-lg text-xs focus:outline-none focus:border-[#D9A76F]"
                  />
                  <input
                    type="text"
                    placeholder="Lien / URL de l'image (Ex: https://...)"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    required
                    className="bg-black/60 border border-gray-700 text-white p-2.5 rounded-lg text-xs focus:outline-none focus:border-[#D9A76F]"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="md:col-span-2 lg:col-span-4 bg-[#D9A76F] text-black font-semibold p-2.5 rounded-lg text-xs hover:bg-amber-500 transition-colors"
                  >
                    {submitting ? 'Enregistrement...' : 'Ajouter la carte'}
                  </button>
                </form>
              </>
            )}
          </div>
        )}
      </div>

      <motion.h2 
        style={{ y: titleY }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl md:text-3xl font-serif font-normal mb-8 text-white tracking-wide"
      >
        Domaines d’Intervention
      </motion.h2>

      {loading ? (
        <p className="text-gray-400 text-sm py-12 text-center">Chargement...</p>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6 items-stretch">
          
          {properties.map((prop, index) => (
            <motion.div
              key={prop.id}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.4 } }}
              className="relative h-[380px] rounded-xl overflow-hidden group cursor-pointer border border-gray-800/80 shadow-lg"
            >
              <motion.img
                style={{ y: imageY, scale: 1.2 }}
                src={prop.image}
                alt={prop.title}
                className="w-full h-[125%] object-cover transition-transform duration-700 ease-out group-hover:scale-125"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

              {showAdmin && isAuthenticated && (
                <div className="absolute top-3 left-3 right-3 z-20 flex justify-between items-center bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/10 text-xs">
                  <span className="text-gray-200 font-mono font-semibold text-[10px] truncate max-w-[150px]">
                    ID: {prop.id}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProperty(prop.id);
                    }}
                    className="bg-red-600/90 hover:bg-red-600 text-white px-2 py-1 rounded transition-colors text-[10px] font-bold"
                  >
                    Supprimer
                  </button>
                </div>
              )}

              <div className="absolute bottom-5 left-5 text-white z-10 pr-4 transition-transform duration-300 group-hover:-translate-y-2">
                <h3 className="text-xl font-serif font-medium leading-snug group-hover:text-[#D9A76F] transition-colors duration-300">
                  {prop.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1 tracking-wider uppercase font-light">
                  {prop.subtitle}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Panneau latéral fixe */}
          <motion.div
            custom={properties.length}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={cardVariants}
            className="bg-[#111111] h-auto min-h-[380px] p-6 rounded-xl border border-gray-800/80 flex flex-col justify-between shadow-lg"
          >
            <div>
              <span className="text-[#D9A76F] text-[10px] uppercase tracking-widest font-semibold block mb-1">
                FAMOD
              </span>
              <h3 className="text-xl font-serif text-white mb-3">
                Offre gratuitement les services suivants:
              </h3>

              <p className="text-xs text-[#D9A76F] leading-relaxed mb-2 font-bold">☑️ Aux mariés</p>
              <div className="space-y-2.5 border-t border-gray-800/80 pt-3">
                {specs.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs items-center">
                    <span className="text-gray-400 font-light">{item.label}</span>
                    <span className="text-white font-medium">{item.value}</span>
                  </div>
                ))}
              </div>

              <p className="pt-5 text-xs text-[#D9A76F] leading-relaxed mb-2 font-bold">☑️ Aux non mariés</p>
              <div className="space-y-2.5 border-t border-gray-800/80 pt-3">
                {specs2.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs items-center">
                    <span className="text-gray-400 font-light">{item.label}</span>
                    <span className="text-white font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="mt-6 w-full bg-transparent border border-[#D9A76F] text-[#D9A76F] py-2.5 rounded-full text-xs font-semibold hover:bg-[#D9A76F] hover:text-[#050505] transition duration-300">
              <Link to={"/service"}>Voir les détails</Link>
            </button>
          </motion.div>

        </div>
      )}
    </section>
  );
}