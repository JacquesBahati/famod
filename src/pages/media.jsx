// src/pages/Media.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import Atelier from "../assets/atelier.jpg";
import evenement from "../assets/evenement.jpg";
import planification from "../assets/planification.jpg";
import coeur from '../assets/coeur.jpg';

// --- MOT DE PASSE ADMIN UNIQUE ---
const ADMIN_PASSWORD = 'famod2026';

// Helper pour convertir un lien YouTube standard en Embed
const formatYoutubeEmbed = (url) => {
  if (!url) return '';
  if (url.includes('embed/')) return url;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11)
    ? `https://www.youtube.com/embed/${match[2]}`
    : url;
};

// --- ANIMATION VARIANTS ---
const containerStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] },
  },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

// --- DATA MEDIAS INITIALES (FALLBACK) ---
const initialArcMediaCards = [
  
];
const initialBentoMediaCards = [
 
];
const initialCarouselMediaCards = [
  
];
const initialDriveList = [

];
const initialTeachingList = [
  
];
const initialTestimonialList = [
  
  
];

export default function MediaSection() {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  
  // LISTES MEDIAS DYNAMIQUES
  const [arcList, setArcList] = useState(initialArcMediaCards);
  const [bentoList, setBentoList] = useState(initialBentoMediaCards);
  const [carouselList, setCarouselList] = useState(initialCarouselMediaCards);

  // ADMIN ARC 3D
  const [isArcAdminOpen, setIsArcAdminOpen] = useState(false);
  const [arcPassword, setArcPassword] = useState('');
  const [isArcAdminUnlocked, setIsArcAdminUnlocked] = useState(false);
  const [arcError, setArcError] = useState('');
  const [arcSuccess, setArcSuccess] = useState('');
  const [newArcTitle, setNewArcTitle] = useState('');
  const [newArcCategory, setNewArcCategory] = useState('');
  const [newArcDate, setNewArcDate] = useState('');
  const [newArcDesc, setNewArcDesc] = useState('');
  const [newArcImg, setNewArcImg] = useState('');
  const [newArcImgPreview, setNewArcImgPreview] = useState('');

  // ADMIN BENTO GRID
  const [isBentoAdminOpen, setIsBentoAdminOpen] = useState(false);
  const [bentoPassword, setBentoPassword] = useState('');
  const [isBentoAdminUnlocked, setIsBentoAdminUnlocked] = useState(false);
  const [bentoError, setBentoError] = useState('');
  const [bentoSuccess, setBentoSuccess] = useState('');
  const [newBentoTitle, setNewBentoTitle] = useState('');
  const [newBentoSubtitle, setNewBentoSubtitle] = useState('');
  const [newBentoCategory, setNewBentoCategory] = useState('');
  const [newBentoDesc, setNewBentoDesc] = useState('');
  const [newBentoImg, setNewBentoImg] = useState('');
  const [newBentoImgPreview, setNewBentoImgPreview] = useState('');

  // ADMIN CARROUSEL
  const [isCarouselAdminOpen, setIsCarouselAdminOpen] = useState(false);
  const [carouselPassword, setCarouselPassword] = useState('');
  const [isCarouselAdminUnlocked, setIsCarouselAdminUnlocked] = useState(false);
  const [carouselError, setCarouselError] = useState('');
  const [carouselSuccess, setCarouselSuccess] = useState('');
  const carouselContainerRef = useRef(null);
  const carouselTrackRef = useRef(null);
  const [dragConstraintWidth, setDragConstraintWidth] = useState(0);
  const [newCarTitle, setNewCarTitle] = useState('');
  const [newCarSubtitle, setNewCarSubtitle] = useState('');
  const [newCarCategory, setNewCarCategory] = useState('');
  const [newCarDate, setNewCarDate] = useState('');
  const [newCarDesc, setNewCarDesc] = useState('');
  const [newCarImg, setNewCarImg] = useState('');
  const [newCarImgPreview, setNewCarImgPreview] = useState('');

  // CALCUL CONTRAINTE DRAG CARROUSEL
  useEffect(() => {
    if (carouselContainerRef.current && carouselTrackRef.current) {
      const containerW = carouselContainerRef.current.offsetWidth;
      const trackW = carouselTrackRef.current.scrollWidth;
      setDragConstraintWidth(Math.max(0, trackW - containerW));
    }
  }, [carouselList]);

  // ÉTATS GOOGLE DRIVE
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [driveList, setDriveList] = useState(initialDriveList);
  const [selectedDriveIndex, setSelectedDriveIndex] = useState(0);
  const [activeDriveTab, setActiveDriveTab] = useState('public');
  const [newDriveTitle, setNewDriveTitle] = useState('');
  const [newDriveUrl, setNewDriveUrl] = useState('');
  const [drivePassword, setDrivePassword] = useState('');
  const [isDriveAdminUnlocked, setIsDriveAdminUnlocked] = useState(false);
  const [driveError, setDriveError] = useState('');
  const [driveSuccess, setDriveSuccess] = useState('');

  // ÉTATS ENSEIGNEMENTS VIDÉO
  const [isTeachingModalOpen, setIsTeachingModalOpen] = useState(false);
  const [teachingList, setTeachingList] = useState(initialTeachingList);
  const [currentTeachingIndex, setCurrentTeachingIndex] = useState(0);
  const [activeTeachTab, setActiveTeachTab] = useState('watch');
  const [newTeachTitle, setNewTeachTitle] = useState('');
  const [newTeachSpeaker, setNewTeachSpeaker] = useState('');
  const [newTeachDuration, setNewTeachDuration] = useState('');
  const [newTeachUrl, setNewTeachUrl] = useState('');
  const [newTeachDesc, setNewTeachDesc] = useState('');
  const [teachPassword, setTeachPassword] = useState('');
  const [isTeachAdminUnlocked, setIsTeachAdminUnlocked] = useState(false);
  const [teachError, setTeachError] = useState('');
  const [teachSuccess, setTeachSuccess] = useState('');

  // ÉTATS TÉMOIGNAGES VIVANTS VIDÉO
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [testimonialList, setTestimonialList] = useState(initialTestimonialList);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [activeTestiTab, setActiveTestiTab] = useState('watch');
  const [newTestiTitle, setNewTestiTitle] = useState('');
  const [newTestiSpeaker, setNewTestiSpeaker] = useState('');
  const [newTestiUrl, setNewTestiUrl] = useState('');
  const [newTestiDesc, setNewTestiDesc] = useState('');
  const [testiPassword, setTestiPassword] = useState('');
  const [isTestiAdminUnlocked, setIsTestiAdminUnlocked] = useState(false);
  const [testiError, setTestiError] = useState('');
  const [testiSuccess, setTestiSuccess] = useState('');

  // --- SYNCHRONISATION FIRESTORE EN TEMPS RÉEL ---
  useEffect(() => {
    const unsubArc = onSnapshot(collection(db, 'arcMedia'), (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({ ...docSnap.data(), id: docSnap.id }));
      setArcList([...initialArcMediaCards, ...items]);
    });
    const unsubBento = onSnapshot(collection(db, 'bentoMedia'), (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({ ...docSnap.data(), id: docSnap.id }));
      setBentoList([...initialBentoMediaCards, ...items]);
    });
    const unsubCarousel = onSnapshot(collection(db, 'carouselMedia'), (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({ ...docSnap.data(), id: docSnap.id }));
      setCarouselList([...initialCarouselMediaCards, ...items]);
    });
    const unsubDrive = onSnapshot(collection(db, 'driveLinks'), (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({ ...docSnap.data(), id: docSnap.id }));
      setDriveList([...initialDriveList, ...items]);
    });
    const unsubTeaching = onSnapshot(collection(db, 'teachings'), (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({ ...docSnap.data(), id: docSnap.id }));
      setTeachingList([...initialTeachingList, ...items]);
    });
    const unsubTesti = onSnapshot(collection(db, 'testimonials'), (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({ ...docSnap.data(), id: docSnap.id }));
      setTestimonialList([...initialTestimonialList, ...items]);
    });
    return () => {
      unsubArc();
      unsubBento();
      unsubCarousel();
      unsubDrive();
      unsubTeaching();
      unsubTesti();
    };
  }, []);

  // HELPER POUR CONVERTIR L'IMAGE LOCALE EN BASE64
  const handleGenericFileChange = (e, setImg, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImg(reader.result);
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // HANDLERS ARC 3D ADMIN
  const handleUnlockArcAdmin = (e) => {
    e.preventDefault();
    if (arcPassword === ADMIN_PASSWORD) {
      setIsArcAdminUnlocked(true);
      setArcError('');
    } else {
      setArcError('Mot de passe incorrect !');
    }
  };
  const handleAddArcItem = async (e) => {
    e.preventDefault();
    if (!newArcImg) {
      setArcError("Veuillez choisir un fichier image ou saisir une URL !");
      return;
    }
    try {
      const newItem = {
        title: newArcTitle,
        category: newArcCategory || 'Séminaire',
        date: newArcDate || 'Récent',
        desc: newArcDesc,
        img: newArcImg,
        rotation: 0,
        translateY: 0,
        createdAt: new Date().toISOString(),
      };
      await addDoc(collection(db, 'arcMedia'), newItem);
      setNewArcTitle('');
      setNewArcCategory('');
      setNewArcDate('');
      setNewArcDesc('');
      setNewArcImg('');
      setNewArcImgPreview('');
      setArcError('');
      setArcSuccess('Image ajoutée à l\'Arc 3D !');
      setTimeout(() => setArcSuccess(''), 2000);
    } catch (err) {
      setArcError('Erreur d\'enregistrement Firestore : ' + err.message);
    }
  };
  const handleDeleteArcItem = async (id) => {
    try {
      if (typeof id === 'string' && id.startsWith('arc-')) {
        setArcList((prev) => prev.filter((item) => item.id !== id));
      } else {
        await deleteDoc(doc(db, 'arcMedia', id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // HANDLERS BENTO ADMIN
  const handleUnlockBentoAdmin = (e) => {
    e.preventDefault();
    if (bentoPassword === ADMIN_PASSWORD) {
      setIsBentoAdminUnlocked(true);
      setBentoError('');
    } else {
      setBentoError('Mot de passe incorrect !');
    }
  };
  const handleAddBentoItem = async (e) => {
    e.preventDefault();
    if (!newBentoImg) {
      setBentoError("Veuillez choisir un fichier image ou saisir une URL !");
      return;
    }
    try {
      const newItem = {
        title: newBentoTitle,
        subtitle: newBentoSubtitle || 'Activité FAMOD',
        category: newBentoCategory || 'Atelier',
        date: 'Récent',
        desc: newBentoDesc,
        img: newBentoImg,
        gridSpan: 'md:col-span-1 md:row-span-1',
        createdAt: new Date().toISOString(),
      };
      await addDoc(collection(db, 'bentoMedia'), newItem);
      setNewBentoTitle('');
      setNewBentoSubtitle('');
      setNewBentoCategory('');
      setNewBentoDesc('');
      setNewBentoImg('');
      setNewBentoImgPreview('');
      setBentoError('');
      setBentoSuccess('Image ajoutée à la Bento Grid !');
      setTimeout(() => setBentoSuccess(''), 2000);
    } catch (err) {
      setBentoError('Erreur d\'enregistrement Firestore : ' + err.message);
    }
  };
  const handleDeleteBentoItem = async (id) => {
    try {
      if (typeof id === 'string' && id.startsWith('bento-')) {
        setBentoList((prev) => prev.filter((item) => item.id !== id));
      } else {
        await deleteDoc(doc(db, 'bentoMedia', id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // HANDLERS CARROUSEL ADMIN
  const handleUnlockCarouselAdmin = (e) => {
    e.preventDefault();
    if (carouselPassword === ADMIN_PASSWORD) {
      setIsCarouselAdminUnlocked(true);
      setCarouselError('');
    } else {
      setCarouselError('Mot de passe incorrect !');
    }
  };
  const handleAddCarouselItem = async (e) => {
    e.preventDefault();
    if (!newCarImg) {
      setCarouselError("Veuillez sélectionner un fichier image ou saisir une URL !");
      return;
    }
    try {
      const newItem = {
        title: newCarTitle,
        subtitle: newCarSubtitle || 'Activité FAMOD',
        category: newCarCategory || 'Événement',
        date: newCarDate || 'Récent',
        desc: newCarDesc,
        img: newCarImg,
        createdAt: new Date().toISOString(),
      };
      await addDoc(collection(db, 'carouselMedia'), newItem);
      setNewCarTitle('');
      setNewCarSubtitle('');
      setNewCarCategory('');
      setNewCarDate('');
      setNewCarDesc('');
      setNewCarImg('');
      setNewCarImgPreview('');
      setCarouselError('');
      setCarouselSuccess('Image ajoutée au carrousel !');
      setTimeout(() => setCarouselSuccess(''), 2000);
    } catch (err) {
      setCarouselError('Erreur d\'enregistrement Firestore : ' + err.message);
    }
  };
  const handleDeleteCarouselItem = async (id) => {
    try {
      if (typeof id === 'string' && id.startsWith('scroll-')) {
        setCarouselList((prev) => prev.filter((item) => item.id !== id));
      } else {
        await deleteDoc(doc(db, 'carouselMedia', id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // OTHER ADMIN HANDLERS
  const handleUnlockDriveAdmin = (e) => {
    e.preventDefault();
    if (drivePassword === ADMIN_PASSWORD) {
      setIsDriveAdminUnlocked(true);
      setDriveError('');
    } else {
      setDriveError('Mot de passe incorrect !');
    }
  };
  const handleUnlockTeachAdmin = (e) => {
    e.preventDefault();
    if (teachPassword === ADMIN_PASSWORD) {
      setIsTeachAdminUnlocked(true);
      setTeachError('');
    } else {
      setTeachError('Mot de passe incorrect !');
    }
  };
  const handleUnlockTestiAdmin = (e) => {
    e.preventDefault();
    if (testiPassword === ADMIN_PASSWORD) {
      setIsTestiAdminUnlocked(true);
      setTestiError('');
    } else {
      setTestiError('Mot de passe incorrect !');
    }
  };
  const handleAddDriveLink = async (e) => {
    e.preventDefault();
    try {
      const newItem = {
        title: newDriveTitle,
        url: newDriveUrl,
        date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
        createdAt: new Date().toISOString(),
      };
      await addDoc(collection(db, 'driveLinks'), newItem);
      setSelectedDriveIndex(0);
      setNewDriveTitle('');
      setNewDriveUrl('');
      setDriveSuccess('Nouveau lien Google Drive ajouté avec succès !');
      setTimeout(() => setDriveSuccess(''), 2000);
    } catch (err) {
      setDriveError('Erreur d\'enregistrement Firestore : ' + err.message);
    }
  };
  const handleDeleteDrive = async (id) => {
    try {
      if (typeof id === 'string' && id.startsWith('drive-')) {
        setDriveList((prev) => prev.filter((item) => item.id !== id));
      } else {
        await deleteDoc(doc(db, 'driveLinks', id));
      }
      setSelectedDriveIndex(0);
    } catch (err) {
      console.error(err);
    }
  };
  const handleAddTeaching = async (e) => {
    e.preventDefault();
    try {
      const newItem = {
        title: newTeachTitle,
        speaker: newTeachSpeaker || 'Intervenant FAMOD',
        duration: newTeachDuration || '30 min',
        desc: newTeachDesc,
        videoUrl: formatYoutubeEmbed(newTeachUrl),
        createdAt: new Date().toISOString(),
      };
      await addDoc(collection(db, 'teachings'), newItem);
      setCurrentTeachingIndex(0);
      setNewTeachTitle('');
      setNewTeachSpeaker('');
      setNewTeachDuration('');
      setNewTeachUrl('');
      setNewTeachDesc('');
      setTeachSuccess('Enseignement vidéo ajouté avec succès !');
      setTimeout(() => setTeachSuccess(''), 2000);
    } catch (err) {
      setTeachError('Erreur d\'enregistrement Firestore : ' + err.message);
    }
  };
  const handleDeleteTeach = async (id) => {
    try {
      if (typeof id === 'string' && id.startsWith('teach-')) {
        setTeachingList((prev) => prev.filter((item) => item.id !== id));
      } else {
        await deleteDoc(doc(db, 'teachings', id));
      }
      if (currentTeachingIndex >= teachingList.length - 1) {
        setCurrentTeachingIndex(Math.max(0, teachingList.length - 2));
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleAddTestimonial = async (e) => {
    e.preventDefault();
    try {
      const newItem = {
        title: newTestiTitle,
        speaker: newTestiSpeaker || 'Témoin FAMOD',
        date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
        desc: newTestiDesc,
        videoUrl: formatYoutubeEmbed(newTestiUrl),
        createdAt: new Date().toISOString(),
      };
      await addDoc(collection(db, 'testimonials'), newItem);
      setCurrentTestimonialIndex(0);
      setNewTestiTitle('');
      setNewTestiSpeaker('');
      setNewTestiUrl('');
      setNewTestiDesc('');
      setTestiSuccess('Témoignage vidéo ajouté avec succès !');
      setTimeout(() => setTestiSuccess(''), 2000);
    } catch (err) {
      setTestiError('Erreur d\'enregistrement Firestore : ' + err.message);
    }
  };
  const handleDeleteTesti = async (id) => {
    try {
      if (typeof id === 'string' && id.startsWith('testi-')) {
        setTestimonialList((prev) => prev.filter((item) => item.id !== id));
      } else {
        await deleteDoc(doc(db, 'testimonials', id));
      }
      if (currentTestimonialIndex >= testimonialList.length - 1) {
        setCurrentTestimonialIndex(Math.max(0, testimonialList.length - 2));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // TÉLÉCHARGEMENT AVEC REPLI AUTOMATIQUE SI ERREUR CORS (FINALLY CORRIGÉ)
  const handleDownload = async (e, media) => {
    e.stopPropagation();
    setDownloadingId(media.id);
    try {
      const response = await fetch(media.img, { mode: 'cors' });
      if (!response.ok) throw new Error('CORS bloqué');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `FAMOD_${media.title.replace(/\s+/g, '_')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      window.open(media.img, '_blank');
    } finally {
      setDownloadingId(null);
    }
  };

  const ImageOverlayActions = ({ media }) => (
    <div className="absolute top-3 right-3 z-20 flex items-center gap-2 group-hover:opacity-100 transition-opacity duration-300">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setSelectedMedia(media);
        }}
        title="Agrandir et visualiser"
        className="p-2 rounded-full bg-black/70 hover:bg-[#D1A977] text-white hover:text-black border border-white/20 transition-all backdrop-blur-md"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>
      <button
        onClick={(e) => handleDownload(e, media)}
        title="Télécharger l'image"
        className="p-2 rounded-full bg-black/70 hover:bg-[#D1A977] text-white hover:text-black border border-white/20 transition-all backdrop-blur-md"
      >
        {downloadingId === media.id ? (
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin block"></span>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        )}
      </button>
    </div>
  );

  return (
    <section className="relative min-h-screen bg-[#070707] text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans select-none">
      {/* Background Glow */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#D1A977]/10 rounded-full blur-[120px] pointer-events-none"
      />
      <div className="max-w-7xl mx-auto space-y-24 relative z-10">
        {/* ==========================================
        1. HERO & GALERIE ARC 3D
        ========================================== */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerStagger}
          className="text-center space-y-10"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
            <motion.div variants={fadeInUp} className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase bg-[#D1A977]/10 text-[#D1A977] border border-[#D1A977]/30 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#D1A977] animate-pulse"></span>
                Médiathèque FAMOD
              </span>
            </motion.div>
            <button
              onClick={() => setIsArcAdminOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#D1A977]/10 hover:bg-[#D1A977] text-[#D1A977] hover:text-black border border-[#D1A977]/40 font-bold text-xs transition-all flex items-center gap-2"
            >
               Admin Arc 3D
            </button>
          </div>
          <motion.div variants={fadeInUp} className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Revivez nos Moments & <br />
              <span className="text-[#D1A977]">Événements en Images</span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Découvrez la vie du Forum FAMOD : séminaires, retraites de couples, ateliers et moments de communion.
            </p>
          </motion.div>
          {/* ARC PERSPECTIVE */}
          <motion.div
            variants={fadeInUp}
            className="pt-8 pb-12 overflow-x-auto no-scrollbar scroll-smooth flex justify-center items-center min-h-[380px]"
          >
            <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 min-w-[900px] px-8">
              {arcList.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.1, rotate: 0, y: -15, zIndex: 30, transition: { duration: 0.3 } }}
                  onClick={() => setSelectedMedia(item)}
                  style={{ transform: `rotate(${item.rotation || 0}deg) translateY(${item.translateY || 0}px)` }}
                  className="relative group cursor-pointer w-44 sm:w-52 h-72 sm:h-80 rounded-3xl overflow-hidden border-2 border-[#D1A977]/20 shadow-2xl transition-all duration-300 shrink-0 bg-[#121212]"
                >
                  <ImageOverlayActions media={item} />
                  <img src={item.img} alt={item.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                  <div className="absolute bottom-0 inset-x-0 p-4 text-left space-y-1">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#D1A977] text-black uppercase tracking-wider">{item.category}</span>
                    <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-[#D1A977] transition-colors">{item.title}</h3>
                    <p className="text-[11px] text-slate-300 line-clamp-1 font-light">{item.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          {/* 3 CARTES HIGHLIGHTS CLIQUABLES */}
          <motion.div variants={containerStagger} className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 max-w-5xl mx-auto text-left">
            <motion.div
              variants={fadeInUp}
              onClick={() => setIsTeachingModalOpen(true)}
              className="bg-[#121212] p-6 rounded-2xl border border-[#D1A977]/30 hover:border-[#D1A977] cursor-pointer group transition-all duration-300 shadow-lg hover:shadow-[#D1A977]/10"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-[#D1A977]/10 text-[#D1A977] group-hover:bg-[#D1A977] group-hover:text-black transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#D1A977]/20 text-[#D1A977]">
                  {teachingList.length} Vidéo(s)
                </span>
              </div>
              <h4 className="text-lg font-bold text-white mb-1 group-hover:text-[#D1A977] transition-colors">Enseignements en Vidéo</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Suivez nos messages vidéo et enseignements sur la vie de couple.</p>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              onClick={() => setIsDriveModalOpen(true)}
              className="bg-[#121212] p-6 rounded-2xl border border-[#D1A977]/30 hover:border-[#D1A977] cursor-pointer group transition-all duration-300 shadow-lg hover:shadow-[#D1A977]/10"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-[#D1A977]/10 text-[#D1A977] group-hover:bg-[#D1A977] group-hover:text-black transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#D1A977]/20 text-[#D1A977]">
                  {driveList.length} Album(s)
                </span>
              </div>
              <h4 className="text-lg font-bold text-white mb-1 group-hover:text-[#D1A977] transition-colors">Retraites & Événements</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Accédez aux albums photos Google Drive de nos temps forts.</p>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              onClick={() => setIsTestimonialModalOpen(true)}
              className="bg-[#121212] p-6 rounded-2xl border border-[#D1A977]/30 hover:border-[#D1A977] cursor-pointer group transition-all duration-300 shadow-lg hover:shadow-[#D1A977]/10"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-[#D1A977]/10 text-[#D1A977] group-hover:bg-[#D1A977] group-hover:text-black transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 00-2 2z" />
                  </svg>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#D1A977]/20 text-[#D1A977]">
                  {testimonialList.length} Vidéo(s)
                </span>
              </div>
              <h4 className="text-lg font-bold text-white mb-1 group-hover:text-[#D1A977] transition-colors">Témoignages Vivants</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Découvrez les vidéos de témoignages de foyers transformés.</p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ==========================================
        2. SECTION BENTO GRID
        ========================================== */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={containerStagger} className="space-y-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
            <div className="text-center sm:text-left space-y-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Tout ce que FAMOD vous Propose</h2>
              <p className="text-slate-300 text-sm sm:text-base">Explorez nos activités à travers notre galerie interactive bento.</p>
            </div>
            <button
              onClick={() => setIsBentoAdminOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#D1A977]/10 hover:bg-[#D1A977] text-[#D1A977] hover:text-black border border-[#D1A977]/40 font-bold text-xs transition-all flex items-center gap-2"
            >
               Admin Bento Grid
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[260px]">
            {bentoList.map((card) => (
              <motion.div
                key={card.id}
                variants={scaleIn}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                onClick={() => setSelectedMedia(card)}
                className={`group relative rounded-3xl overflow-hidden border border-white/10 hover:border-[#D1A977]/60 shadow-xl cursor-pointer bg-[#121212] ${card.gridSpan || 'md:col-span-1 md:row-span-1'}`}
              >
                <ImageOverlayActions media={card} />
                <img src={card.img} alt={card.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/70 text-[#D1A977] border border-[#D1A977]/30 backdrop-blur-md">{card.category}</span>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 space-y-2 z-10">
                  <p className="text-xs text-[#D1A977] font-medium tracking-wide uppercase">{card.subtitle}</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#D1A977] transition-colors">{card.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 font-normal leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ==========================================
        3. CARROUSEL HORIZONTAL AUTOMATIQUE INTERACTIF (DE DROITE À GAUCHE)
        ========================================== */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={containerStagger} className="space-y-8 pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="space-y-2 text-left">
              <span className="text-xs font-bold tracking-widest uppercase text-[#D1A977]">Aperçu Continu & Interactif</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Explorer nos Activités Récentes</h2>
            </div>
            <button
              onClick={() => setIsCarouselAdminOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#D1A977]/10 hover:bg-[#D1A977] text-[#D1A977] hover:text-black border border-[#D1A977]/40 font-bold text-xs transition-all flex items-center gap-2"
            >
               Gérer le Carrousel (Admin)
            </button>
          </div>
          <div ref={carouselContainerRef} className="overflow-hidden w-full relative py-4 cursor-grab active:cursor-grabbing">
            <motion.div
              ref={carouselTrackRef}
              drag="x"
              dragConstraints={{ right: 0, left: -dragConstraintWidth }}
              className="flex gap-6 w-max"
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                ease: 'linear',
                duration: 25,
                repeat: Infinity,
              }}
              whileHover={{ animationPlayState: 'paused' }}
              whileTap={{ animationPlayState: 'paused' }}
            >
              {[...carouselList, ...carouselList].map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  onClick={() => setSelectedMedia(item)}
                  className="group relative shrink-0 w-72 sm:w-80 h-96 rounded-3xl overflow-hidden border border-white/10 hover:border-[#D1A977]/60 shadow-xl cursor-pointer bg-[#121212] transition-all duration-300 select-none"
                >
                  <ImageOverlayActions media={item} />
                  <img src={item.img} alt={item.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />
                  <div className="absolute bottom-0 inset-x-0 p-6 space-y-2 z-10 text-left">
                    <p className="text-[11px] text-[#D1A977] font-semibold tracking-wider uppercase">{item.date} • {item.subtitle}</p>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#D1A977] transition-colors leading-snug">{item.title}</h3>
                    <p className="text-xs text-slate-300 line-clamp-2 font-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ==========================================
      MODALE GESTION ADMIN ARC 3D
      ========================================== */}
      <AnimatePresence>
        {isArcAdminOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsArcAdminOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-2xl bg-[#121212] border border-[#D1A977]/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-left space-y-6 max-h-[90vh] overflow-y-auto">
              <button onClick={() => setIsArcAdminOpen(false)} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/80 text-white hover:text-[#D1A977] border border-white/20 flex items-center justify-center">✕</button>
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#D1A977]/10 text-[#D1A977] border border-[#D1A977]/30">Administration</span>
                <h3 className="text-2xl font-bold text-white">Gestion Galerie Arc 3D</h3>
              </div>
              {!isArcAdminUnlocked ? (
                <form onSubmit={handleUnlockArcAdmin} className="space-y-3 bg-[#161616] p-5 rounded-2xl border border-white/10">
                  <p className="text-xs text-slate-300">Entrez le mot de passe admin :</p>
                  <input
                    type="password"
                    placeholder="Mot de passe administrateur"
                    value={arcPassword}
                    onChange={(e) => setArcPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D1A977]"
                  />
                  {arcError && <p className="text-xs text-red-400"> {arcError}</p>}
                  <button type="submit" className="w-full py-2.5 rounded-xl bg-[#D1A977] text-black font-bold text-xs">Déverrouiller</button>
                </form>
              ) : (
                <>
                  <form onSubmit={handleAddArcItem} className="space-y-3 bg-[#161616] p-5 rounded-2xl border border-white/10">
                    <h4 className="text-xs font-bold text-[#D1A977] uppercase">Ajouter une nouvelle image</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input type="text" placeholder="Identifiant / Titre *" value={newArcTitle} onChange={(e) => setNewArcTitle(e.target.value)} required className="px-3 py-2 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D1A977]" />
                      <input type="text" placeholder="Catégorie" value={newArcCategory} onChange={(e) => setNewArcCategory(e.target.value)} className="px-3 py-2 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D1A977]" />
                      <input type="text" placeholder="Date (ex: Mai 2024)" value={newArcDate} onChange={(e) => setNewArcDate(e.target.value)} className="px-3 py-2 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D1A977]" />
                    </div>
                    <div className="space-y-2 pt-1">
                      <label className="block text-[11px] font-semibold text-slate-300">Image : Fichier local OU URL</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleGenericFileChange(e, setNewArcImg, setNewArcImgPreview)}
                          className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#D1A977]/20 file:text-[#D1A977] hover:file:bg-[#D1A977] hover:file:text-black cursor-pointer"
                        />
                        <input
                          type="url"
                          placeholder="Ou collez une URL d'image"
                          value={newArcImg.startsWith('data:') ? '' : newArcImg}
                          onChange={(e) => {
                            setNewArcImg(e.target.value);
                            setNewArcImgPreview(e.target.value);
                          }}
                          className="px-3 py-2 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D1A977]"
                        />
                      </div>
                      {newArcImgPreview && (
                        <div className="mt-2 flex items-center gap-3 bg-[#181818] p-2 rounded-xl border border-white/10">
                          <img src={newArcImgPreview} alt="Aperçu" referrerPolicy="no-referrer" className="w-12 h-12 rounded object-cover" />
                          <span className="text-[10px] text-emerald-400 font-semibold">Aperçu sélectionné</span>
                        </div>
                      )}
                    </div>
                    <textarea placeholder="Description..." value={newArcDesc} onChange={(e) => setNewArcDesc(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-white/10 text-white text-xs h-16 resize-none focus:outline-none focus:border-[#D1A977]" />
                    {arcError && <p className="text-xs text-red-400"> {arcError}</p>}
                    {arcSuccess && <p className="text-xs text-emerald-400"> {arcSuccess}</p>}
                    <button type="submit" className="w-full py-2.5 rounded-xl bg-[#D1A977] text-black font-bold text-xs">Ajouter l'image</button>
                  </form>
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Images actuelles</h4>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {arcList.map((item) => (
                        <div key={item.id} className="p-3 rounded-xl bg-[#181818] border border-white/5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <img src={item.img} alt={item.title} referrerPolicy="no-referrer" className="w-8 h-8 rounded object-cover" />
                            <span className="truncate">{item.title}</span>
                          </div>
                          <button onClick={() => handleDeleteArcItem(item.id)} className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 text-[11px] font-semibold shrink-0">Supprimer</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
      MODALE GESTION ADMIN BENTO GRID
      ========================================== */}
      <AnimatePresence>
        {isBentoAdminOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsBentoAdminOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-2xl bg-[#121212] border border-[#D1A977]/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-left space-y-6 max-h-[90vh] overflow-y-auto">
              <button onClick={() => setIsBentoAdminOpen(false)} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/80 text-white hover:text-[#D1A977] border border-white/20 flex items-center justify-center">✕</button>
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#D1A977]/10 text-[#D1A977] border border-[#D1A977]/30">Administration</span>
                <h3 className="text-2xl font-bold text-white">Gestion Bento Grid</h3>
              </div>
              {!isBentoAdminUnlocked ? (
                <form onSubmit={handleUnlockBentoAdmin} className="space-y-3 bg-[#161616] p-5 rounded-2xl border border-white/10">
                  <p className="text-xs text-slate-300">Entrez le mot de passe admin :</p>
                  <input
                    type="password"
                    placeholder="Mot de passe administrateur"
                    value={bentoPassword}
                    onChange={(e) => setBentoPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D1A977]"
                  />
                  {bentoError && <p className="text-xs text-red-400"> {bentoError}</p>}
                  <button type="submit" className="w-full py-2.5 rounded-xl bg-[#D1A977] text-black font-bold text-xs">Déverrouiller</button>
                </form>
              ) : (
                <>
                  <form onSubmit={handleAddBentoItem} className="space-y-3 bg-[#161616] p-5 rounded-2xl border border-white/10">
                    <h4 className="text-xs font-bold text-[#D1A977] uppercase">Ajouter une nouvelle carte Bento</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input type="text" placeholder="Identifiant / Titre *" value={newBentoTitle} onChange={(e) => setNewBentoTitle(e.target.value)} required className="px-3 py-2 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D1A977]" />
                      <input type="text" placeholder="Sous-titre" value={newBentoSubtitle} onChange={(e) => setNewBentoSubtitle(e.target.value)} className="px-3 py-2 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D1A977]" />
                      <input type="text" placeholder="Catégorie" value={newBentoCategory} onChange={(e) => setNewBentoCategory(e.target.value)} className="px-3 py-2 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D1A977]" />
                    </div>
                    <div className="space-y-2 pt-1">
                      <label className="block text-[11px] font-semibold text-slate-300">Image : Fichier local OU URL</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleGenericFileChange(e, setNewBentoImg, setNewBentoImgPreview)}
                          className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#D1A977]/20 file:text-[#D1A977] hover:file:bg-[#D1A977] hover:file:text-black cursor-pointer"
                        />
                        <input
                          type="url"
                          placeholder="Ou collez une URL d'image"
                          value={newBentoImg.startsWith('data:') ? '' : newBentoImg}
                          onChange={(e) => {
                            setNewBentoImg(e.target.value);
                            setNewBentoImgPreview(e.target.value);
                          }}
                          className="px-3 py-2 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D1A977]"
                        />
                      </div>
                      {newBentoImgPreview && (
                        <div className="mt-2 flex items-center gap-3 bg-[#181818] p-2 rounded-xl border border-white/10">
                          <img src={newBentoImgPreview} alt="Aperçu" referrerPolicy="no-referrer" className="w-12 h-12 rounded object-cover" />
                          <span className="text-[10px] text-emerald-400 font-semibold">Aperçu sélectionné</span>
                        </div>
                      )}
                    </div>
                    <textarea placeholder="Description..." value={newBentoDesc} onChange={(e) => setNewBentoDesc(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-white/10 text-white text-xs h-16 resize-none focus:outline-none focus:border-[#D1A977]" />
                    {bentoError && <p className="text-xs text-red-400"> {bentoError}</p>}
                    {bentoSuccess && <p className="text-xs text-emerald-400"> {bentoSuccess}</p>}
                    <button type="submit" className="w-full py-2.5 rounded-xl bg-[#D1A977] text-black font-bold text-xs">Ajouter la carte</button>
                  </form>
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Cartes actuelles</h4>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {bentoList.map((item) => (
                        <div key={item.id} className="p-3 rounded-xl bg-[#181818] border border-white/5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <img src={item.img} alt={item.title} referrerPolicy="no-referrer" className="w-8 h-8 rounded object-cover" />
                            <span className="truncate">{item.title}</span>
                          </div>
                          <button onClick={() => handleDeleteBentoItem(item.id)} className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 text-[11px] font-semibold shrink-0">Supprimer</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
      MODALE GESTION ADMIN CARROUSEL
      ========================================== */}
      <AnimatePresence>
        {isCarouselAdminOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCarouselAdminOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-2xl bg-[#121212] border border-[#D1A977]/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-left space-y-6 max-h-[90vh] overflow-y-auto">
              <button onClick={() => setIsCarouselAdminOpen(false)} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/80 text-white hover:text-[#D1A977] border border-white/20 flex items-center justify-center">✕</button>
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#D1A977]/10 text-[#D1A977] border border-[#D1A977]/30">Administration</span>
                <h3 className="text-2xl font-bold text-white">Gestion du Carrousel Horizontal</h3>
              </div>
              {!isCarouselAdminUnlocked ? (
                <form onSubmit={handleUnlockCarouselAdmin} className="space-y-3 bg-[#161616] p-5 rounded-2xl border border-white/10">
                  <p className="text-xs text-slate-300">Entrez le mot de passe admin :</p>
                  <input
                    type="password"
                    placeholder="Mot de passe administrateur"
                    value={carouselPassword}
                    onChange={(e) => setCarouselPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D1A977]"
                  />
                  {carouselError && <p className="text-xs text-red-400"> {carouselError}</p>}
                  <button type="submit" className="w-full py-2.5 rounded-xl bg-[#D1A977] text-black font-bold text-xs">Déverrouiller</button>
                </form>
              ) : (
                <>
                  <form onSubmit={handleAddCarouselItem} className="space-y-3 bg-[#161616] p-5 rounded-2xl border border-white/10">
                    <h4 className="text-xs font-bold text-[#D1A977] uppercase">Ajouter une nouvelle carte</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input type="text" placeholder="Identifiant / Titre *" value={newCarTitle} onChange={(e) => setNewCarTitle(e.target.value)} required className="px-3 py-2 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D1A977]" />
                      <input type="text" placeholder="Sous-titre" value={newCarSubtitle} onChange={(e) => setNewCarSubtitle(e.target.value)} className="px-3 py-2 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D1A977]" />
                      <input type="text" placeholder="Catégorie" value={newCarCategory} onChange={(e) => setNewCarCategory(e.target.value)} className="px-3 py-2 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D1A977]" />
                      <input type="text" placeholder="Date (ex: Août 2026)" value={newCarDate} onChange={(e) => setNewCarDate(e.target.value)} className="px-3 py-2 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D1A977]" />
                    </div>
                    <div className="space-y-2 pt-1">
                      <label className="block text-[11px] font-semibold text-slate-300">Image : Fichier local OU URL</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleGenericFileChange(e, setNewCarImg, setNewCarImgPreview)}
                          className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#D1A977]/20 file:text-[#D1A977] hover:file:bg-[#D1A977] hover:file:text-black cursor-pointer"
                        />
                        <input
                          type="url"
                          placeholder="Ou collez une URL d'image"
                          value={newCarImg.startsWith('data:') ? '' : newCarImg}
                          onChange={(e) => {
                            setNewCarImg(e.target.value);
                            setNewCarImgPreview(e.target.value);
                          }}
                          className="px-3 py-2 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D1A977]"
                        />
                      </div>
                      {newCarImgPreview && (
                        <div className="mt-2 flex items-center gap-3 bg-[#181818] p-2 rounded-xl border border-white/10">
                          <img src={newCarImgPreview} alt="Aperçu" referrerPolicy="no-referrer" className="w-12 h-12 rounded object-cover" />
                          <span className="text-[10px] text-emerald-400 font-semibold">Aperçu sélectionné</span>
                        </div>
                      )}
                    </div>
                    <textarea placeholder="Description..." value={newCarDesc} onChange={(e) => setNewCarDesc(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-white/10 text-white text-xs h-16 resize-none focus:outline-none focus:border-[#D1A977]" />
                    {carouselError && <p className="text-xs text-red-400"> {carouselError}</p>}
                    {carouselSuccess && <p className="text-xs text-emerald-400"> {carouselSuccess}</p>}
                    <button type="submit" className="w-full py-2.5 rounded-xl bg-[#D1A977] text-black font-bold text-xs">Ajouter la carte</button>
                  </form>
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Cartes actuelles</h4>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {carouselList.map((item) => (
                        <div key={item.id} className="p-3 rounded-xl bg-[#181818] border border-white/5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <img src={item.img} alt={item.title} referrerPolicy="no-referrer" className="w-8 h-8 rounded object-cover" />
                            <span className="truncate">{item.title}</span>
                          </div>
                          <button onClick={() => handleDeleteCarouselItem(item.id)} className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 text-[11px] font-semibold shrink-0">Supprimer</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
      MODALE GOOGLE DRIVE
      ========================================== */}
      <AnimatePresence>
        {isDriveModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDriveModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-2xl bg-[#121212] border border-[#D1A977]/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-left space-y-6">
              <button onClick={() => setIsDriveModalOpen(false)} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/80 text-white hover:text-[#D1A977] border border-white/20 flex items-center justify-center">✕</button>
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#D1A977]/10 text-[#D1A977] border border-[#D1A977]/30">Album Événements</span>
                <h3 className="text-2xl font-bold text-white">Retraites & Événements Photos</h3>
              </div>
              <div className="flex border-b border-white/10 text-xs font-semibold">
                <button onClick={() => setActiveDriveTab('public')} className={`pb-3 px-4 border-b-2 ${activeDriveTab === 'public' ? 'border-[#D1A977] text-[#D1A977]' : 'border-transparent text-slate-400'}`}> Consultation des Liens</button>
                <button onClick={() => setActiveDriveTab('admin')} className={`pb-3 px-4 border-b-2 ${activeDriveTab === 'admin' ? 'border-[#D1A977] text-[#D1A977]' : 'border-transparent text-slate-400'}`}> Espace Admin</button>
              </div>
              {activeDriveTab === 'public' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-400">Sélectionnez un événement pour l'ouvrir dans Google Drive :</p>
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                    {driveList.map((item, index) => (
                      <div key={item.id} onClick={() => setSelectedDriveIndex(index)} className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${index === selectedDriveIndex ? 'bg-[#D1A977]/15 border-[#D1A977]' : 'bg-[#181818] border-white/5 hover:border-white/20'}`}>
                        <div>
                          <h5 className="text-xs font-bold text-white">{item.title}</h5>
                          <span className="text-[10px] text-[#D1A977]">{item.date}</span>
                        </div>
                        <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="px-3 py-1.5 rounded-lg bg-[#D1A977] hover:bg-[#b89262] text-black text-[11px] font-bold">Ouvrir ↗</a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeDriveTab === 'admin' && (
                <div className="space-y-4">
                  {!isDriveAdminUnlocked ? (
                    <form onSubmit={handleUnlockDriveAdmin} className="space-y-3 bg-[#161616] p-4 rounded-2xl border border-white/10">
                      <p className="text-xs text-slate-300">Veuillez vous authentifier pour gérer les albums :</p>
                      <input type="password" placeholder="Mot de passe administrateur" value={drivePassword} onChange={(e) => setDrivePassword(e.target.value)} required className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D1A977]" />
                      {driveError && <p className="text-xs text-red-400"> {driveError}</p>}
                      <button type="submit" className="w-full py-2.5 rounded-xl bg-[#D1A977] text-black font-bold text-xs">Déverrouiller la gestion</button>
                    </form>
                  ) : (
                    <>
                      <form onSubmit={handleAddDriveLink} className="space-y-3 bg-[#161616] p-4 rounded-2xl border border-white/10">
                        <h4 className="text-xs font-bold text-[#D1A977] uppercase">Ajouter un nouveau lien Drive</h4>
                        <input type="text" placeholder="Identifiant / Titre (ex: Cérémonie du 09 août 2026)" value={newDriveTitle} onChange={(e) => setNewDriveTitle(e.target.value)} required className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D1A977]" />
                        <input type="url" placeholder="Lien Google Drive (https://drive.google.com/...)" value={newDriveUrl} onChange={(e) => setNewDriveUrl(e.target.value)} required className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D1A977]" />
                        {driveSuccess && <p className="text-xs text-emerald-400"> {driveSuccess}</p>}
                        <button type="submit" className="w-full py-2.5 rounded-xl bg-[#D1A977] text-black font-bold text-xs">Ajouter l'album</button>
                      </form>
                      <div className="space-y-2 pt-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase">Supprimer un album</h4>
                        <div className="max-h-40 overflow-y-auto space-y-2">
                          {driveList.map((item) => (
                            <div key={item.id} className="p-3 rounded-xl bg-[#181818] border border-white/5 flex items-center justify-between text-xs">
                              <span className="truncate pr-2">{item.title}</span>
                              <button onClick={() => handleDeleteDrive(item.id)} className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 text-[11px] font-semibold">Supprimer</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
      MODALE ENSEIGNEMENTS VIDÉO
      ========================================== */}
      <AnimatePresence>
        {isTeachingModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsTeachingModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-5xl bg-[#121212] border border-[#D1A977]/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh]">
              <button onClick={() => setIsTeachingModalOpen(false)} className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/80 text-white hover:text-[#D1A977] border border-white/20 flex items-center justify-center">✕</button>
              <div className="lg:w-2/3 bg-black flex flex-col justify-center">
                <div className="relative aspect-video w-full">
                  <iframe src={teachingList[currentTeachingIndex]?.videoUrl} title={teachingList[currentTeachingIndex]?.title} className="w-full h-full border-0" allowFullScreen />
                </div>
                <div className="p-5 text-left space-y-1 bg-[#161616]">
                  <span className="text-xs font-semibold text-[#D1A977]">{teachingList[currentTeachingIndex]?.speaker} • {teachingList[currentTeachingIndex]?.duration}</span>
                  <h3 className="text-lg font-bold text-white">{teachingList[currentTeachingIndex]?.title}</h3>
                  <p className="text-xs text-slate-300">{teachingList[currentTeachingIndex]?.desc}</p>
                </div>
              </div>
              <div className="lg:w-1/3 p-6 bg-[#121212] border-t lg:border-t-0 lg:border-l border-white/10 overflow-y-auto space-y-4 text-left">
                <div className="flex border-b border-white/10 text-xs font-semibold pb-2 gap-2">
                  <button onClick={() => setActiveTeachTab('watch')} className={`pb-1 px-2 border-b-2 ${activeTeachTab === 'watch' ? 'border-[#D1A977] text-[#D1A977]' : 'text-slate-400'}`}>Playlist ({teachingList.length})</button>
                  <button onClick={() => setActiveTeachTab('admin')} className={`pb-1 px-2 border-b-2 ${activeTeachTab === 'admin' ? 'border-[#D1A977] text-[#D1A977]' : 'text-slate-400'}`}> Espace Admin</button>
                </div>
                {activeTeachTab === 'watch' && (
                  <div className="space-y-2">
                    {teachingList.map((vid, index) => (
                      <div key={vid.id} onClick={() => setCurrentTeachingIndex(index)} className={`p-3 rounded-xl border cursor-pointer transition-all flex justify-between items-center gap-3 ${index === currentTeachingIndex ? 'bg-[#D1A977]/20 border-[#D1A977]' : 'bg-[#181818] border-white/5 hover:border-white/20'}`}>
                        <div className={`p-2 rounded-lg shrink-0 ${index === currentTeachingIndex ? 'bg-[#D1A977] text-black' : 'bg-white/10 text-[#D1A977]'}`}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <div className="overflow-hidden flex-1">
                          <h5 className="text-xs font-bold text-white truncate">{vid.title}</h5>
                          <p className="text-[10px] text-slate-400">{vid.speaker}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {activeTeachTab === 'admin' && (
                  <div className="space-y-4">
                    {!isTeachAdminUnlocked ? (
                      <form onSubmit={handleUnlockTeachAdmin} className="space-y-3 bg-[#161616] p-4 rounded-2xl border border-white/10">
                        <p className="text-xs text-slate-300">Accès administrateur requis :</p>
                        <input type="password" placeholder="Mot de passe admin" value={teachPassword} onChange={(e) => setTeachPassword(e.target.value)} required className="w-full p-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs" />
                        {teachError && <p className="text-xs text-red-400"> {teachError}</p>}
                        <button type="submit" className="w-full py-2 rounded-xl bg-[#D1A977] text-black font-bold text-xs">Se connecter</button>
                      </form>
                    ) : (
                      <>
                        <form onSubmit={handleAddTeaching} className="space-y-3 bg-[#161616] p-4 rounded-2xl border border-white/10">
                          <h4 className="text-xs font-bold text-[#D1A977] uppercase">Ajouter un enseignement</h4>
                          <input type="text" placeholder="Identifiant / Titre" value={newTeachTitle} onChange={(e) => setNewTeachTitle(e.target.value)} required className="w-full p-2 rounded-xl bg-[#181818] border border-white/10 text-white text-xs" />
                          <input type="text" placeholder="Intervenant (ex: Pasteur Martin)" value={newTeachSpeaker} onChange={(e) => setNewTeachSpeaker(e.target.value)} className="w-full p-2 rounded-xl bg-[#181818] border border-white/10 text-white text-xs" />
                          <input type="text" placeholder="Durée (ex: 35 min)" value={newTeachDuration} onChange={(e) => setNewTeachDuration(e.target.value)} className="w-full p-2 rounded-xl bg-[#181818] border border-white/10 text-white text-xs" />
                          <input type="url" placeholder="Lien YouTube" value={newTeachUrl} onChange={(e) => setNewTeachUrl(e.target.value)} required className="w-full p-2 rounded-xl bg-[#181818] border border-white/10 text-white text-xs" />
                          <textarea placeholder="Description de la vidéo..." value={newTeachDesc} onChange={(e) => setNewTeachDesc(e.target.value)} className="w-full p-2 rounded-xl bg-[#181818] border border-white/10 text-white text-xs h-16 resize-none" />
                          {teachSuccess && <p className="text-xs text-emerald-400"> {teachSuccess}</p>}
                          <button type="submit" className="w-full py-2.5 rounded-xl bg-[#D1A977] text-black font-bold text-xs">Ajouter l'enseignement</button>
                        </form>
                        <div className="space-y-2 pt-2">
                          <h4 className="text-xs font-bold text-slate-400 uppercase">Supprimer une vidéo</h4>
                          <div className="max-h-40 overflow-y-auto space-y-2">
                            {teachingList.map((vid) => (
                              <div key={vid.id} className="p-3 rounded-xl bg-[#181818] border border-white/5 flex items-center justify-between text-xs">
                                <span className="truncate pr-2">{vid.title}</span>
                                <button onClick={() => handleDeleteTeach(vid.id)} className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 text-[11px] font-semibold">Supprimer</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
      MODALE TÉMOIGNAGES VIVANTS VIDÉO
      ========================================== */}
      <AnimatePresence>
        {isTestimonialModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsTestimonialModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-5xl bg-[#121212] border border-[#D1A977]/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh]">
              <button onClick={() => setIsTestimonialModalOpen(false)} className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/80 text-white hover:text-[#D1A977] border border-white/20 flex items-center justify-center">✕</button>
              <div className="lg:w-2/3 bg-black flex flex-col justify-center">
                <div className="relative aspect-video w-full">
                  <iframe src={testimonialList[currentTestimonialIndex]?.videoUrl} title={testimonialList[currentTestimonialIndex]?.title} className="w-full h-full border-0" allowFullScreen />
                </div>
                <div className="p-5 text-left space-y-1 bg-[#161616]">
                  <span className="text-xs font-semibold text-[#D1A977]">{testimonialList[currentTestimonialIndex]?.speaker} • {testimonialList[currentTestimonialIndex]?.date}</span>
                  <h3 className="text-lg font-bold text-white">{testimonialList[currentTestimonialIndex]?.title}</h3>
                  <p className="text-xs text-slate-300">{testimonialList[currentTestimonialIndex]?.desc}</p>
                </div>
              </div>
              <div className="lg:w-1/3 p-6 bg-[#121212] border-t lg:border-t-0 lg:border-l border-white/10 overflow-y-auto space-y-4 text-left">
                <div className="flex border-b border-white/10 text-xs font-semibold pb-2 gap-2">
                  <button onClick={() => setActiveTestiTab('watch')} className={`pb-1 px-2 border-b-2 ${activeTestiTab === 'watch' ? 'border-[#D1A977] text-[#D1A977]' : 'text-slate-400'}`}>Témoignages ({testimonialList.length})</button>
                  <button onClick={() => setActiveTestiTab('admin')} className={`pb-1 px-2 border-b-2 ${activeTestiTab === 'admin' ? 'border-[#D1A977] text-[#D1A977]' : 'text-slate-400'}`}> Espace Admin</button>
                </div>
                {activeTestiTab === 'watch' && (
                  <div className="space-y-2">
                    {testimonialList.map((vid, index) => (
                      <div key={vid.id} onClick={() => setCurrentTestimonialIndex(index)} className={`p-3 rounded-xl border cursor-pointer transition-all flex justify-between items-center gap-3 ${index === currentTestimonialIndex ? 'bg-[#D1A977]/20 border-[#D1A977]' : 'bg-[#181818] border-white/5 hover:border-white/20'}`}>
                        <div className={`p-2 rounded-lg shrink-0 ${index === currentTestimonialIndex ? 'bg-[#D1A977] text-black' : 'bg-white/10 text-[#D1A977]'}`}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <div className="overflow-hidden flex-1">
                          <h5 className="text-xs font-bold text-white truncate">{vid.title}</h5>
                          <p className="text-[10px] text-slate-400">{vid.speaker}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {activeTestiTab === 'admin' && (
                  <div className="space-y-4">
                    {!isTestiAdminUnlocked ? (
                      <form onSubmit={handleUnlockTestiAdmin} className="space-y-3 bg-[#161616] p-4 rounded-2xl border border-white/10">
                        <p className="text-xs text-slate-300">Accès administrateur requis :</p>
                        <input type="password" placeholder="Mot de passe admin" value={testiPassword} onChange={(e) => setTestiPassword(e.target.value)} required className="w-full p-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs" />
                        {testiError && <p className="text-xs text-red-400"> {testiError}</p>}
                        <button type="submit" className="w-full py-2 rounded-xl bg-[#D1A977] text-black font-bold text-xs">Se connecter</button>
                      </form>
                    ) : (
                      <>
                        <form onSubmit={handleAddTestimonial} className="space-y-3 bg-[#161616] p-4 rounded-2xl border border-white/10">
                          <h4 className="text-xs font-bold text-[#D1A977] uppercase">Ajouter un témoignage</h4>
                          <input type="text" placeholder="Identifiant / Titre" value={newTestiTitle} onChange={(e) => setNewTestiTitle(e.target.value)} required className="w-full p-2 rounded-xl bg-[#181818] border border-white/10 text-white text-xs" />
                          <input type="text" placeholder="Nom des témoins" value={newTestiSpeaker} onChange={(e) => setNewTestiSpeaker(e.target.value)} className="w-full p-2 rounded-xl bg-[#181818] border border-white/10 text-white text-xs" />
                          <input type="url" placeholder="Lien YouTube" value={newTestiUrl} onChange={(e) => setNewTestiUrl(e.target.value)} required className="w-full p-2 rounded-xl bg-[#181818] border border-white/10 text-white text-xs" />
                          <textarea placeholder="Description du témoignage..." value={newTestiDesc} onChange={(e) => setNewTestiDesc(e.target.value)} className="w-full p-2 rounded-xl bg-[#181818] border border-white/10 text-white text-xs h-16 resize-none" />
                          {testiSuccess && <p className="text-xs text-emerald-400"> {testiSuccess}</p>}
                          <button type="submit" className="w-full py-2.5 rounded-xl bg-[#D1A977] text-black font-bold text-xs">Ajouter le témoignage</button>
                        </form>
                        <div className="space-y-2 pt-2">
                          <h4 className="text-xs font-bold text-slate-400 uppercase">Supprimer un témoignage</h4>
                          <div className="max-h-40 overflow-y-auto space-y-2">
                            {testimonialList.map((vid) => (
                              <div key={vid.id} className="p-3 rounded-xl bg-[#181818] border border-white/5 flex items-center justify-between text-xs">
                                <span className="truncate pr-2">{vid.title}</span>
                                <button onClick={() => handleDeleteTesti(vid.id)} className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 text-[11px] font-semibold">Supprimer</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
      LIGHTBOX IMAGE
      ========================================== */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedMedia(null)} className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-4xl bg-[#121212] border border-[#D1A977]/40 rounded-3xl overflow-hidden shadow-2xl text-left max-h-[90vh] flex flex-col md:flex-row">
              <button onClick={() => setSelectedMedia(null)} className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/80 text-white hover:text-[#D1A977] border border-white/20 flex items-center justify-center">✕</button>
              
              <div className="md:w-3/5 bg-black flex items-center justify-center">
                <img src={selectedMedia.img} alt={selectedMedia.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </div>
              <div className="md:w-2/5 p-6 flex flex-col justify-between space-y-4 bg-[#161616]">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[#D1A977]">{selectedMedia.date}</span>
                  <h3 className="text-2xl font-bold text-white">{selectedMedia.title}</h3>
                  <p className="text-slate-300 text-sm">{selectedMedia.desc}</p>
                </div>
                <button onClick={(e) => handleDownload(e, selectedMedia)} className="w-full py-2.5 rounded-xl bg-[#D1A977] text-black text-xs font-semibold">
                  {downloadingId === selectedMedia.id ? 'Téléchargement...' : 'Télécharger l\'image'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}