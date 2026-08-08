// src/pages/About.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';


// Variantes d'animation Framer Motion
const containerStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.215, 0.61, 0.355, 1],
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function Histoire() {
  const couplesFondateurs = [
    "Couple Moise VANGI",
    "Couple HEUREUX KITINGU",
    "Couple Vincent SIKULI ",
    "Couple ELOGE MAKONYANYI",
    "Couple Me ERICK TSIKO Hangi",
    "Couple Dr Corneille MAKO"
  ];

  const etapesTimeline = [
    { id: "#01", title: "Constat & Vision", text: "L'impréparation au mariage" },
    { id: "#02", title: "Fondation 2018", text: "Lancement officiel par les 6 couples" },
    { id: "#03", title: "Accompagnement", text: "Encadrement & conseils conjugaux" },
    { id: "#04", title: "Impact Social", text: "Promouvoir le bonheur de Christ" },
  ];

  const piliersCartes = [
    {
      title: "Préparation au Mariage",
      subtitle: "Bâtir sur des fondations solides",
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Épanouissement Familial",
      subtitle: "Protéger les enfants & le foyer",
      image: "https://images.unsplash.com/photo-1522158634071-9c86458816e3?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Restauration Conjugale",
      subtitle: "Éliminer les dégâts dans la communauté",
      image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800",
    }
  ];

  return (
    <section className="bg-[#070707] text-stone-200 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* ==========================================
            1. HERO HEADER (Inspiré du haut de l'image)
            Structure courbée avec dégradé chaud
        ========================================== */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={scaleIn}
          className="relative bg-gradient-to-b from-[#D1A977]/25 via-[#1c150c] to-[#0f0e0c] rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-14 border border-[#D1A977]/30 overflow-hidden shadow-2xl"
        >
          {/* Aura / Halo lumineux doré */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D1A977]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Sous-header top */}
          <div className="flex items-center justify-between mb-12 relative z-10">
            <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#D1A977] bg-[#D1A977]/10 px-4 py-2 rounded-full border border-[#D1A977]/20">
              Notre Histoire
            </span>
            <span className="text-xs sm:text-sm text-stone-400 font-medium">
              Depuis 2018
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Titre & Silhouette */}
            <motion.div variants={containerStagger} className="lg:col-span-7 space-y-4">
              <motion.h3 variants={fadeInUp} className="text-[#D1A977] font-semibold text-lg sm:text-xl">
                L'Origine du Forum
              </motion.h3>
              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-none">
                 Combattre les vents de divorce  <br />
                <span className="text-[#D1A977]">et entretenir l’amour,</span> <br />
                la stabilité à tous égard.
              </motion.h1>
            </motion.div>

            {/* Citation à droite */}
            <motion.div variants={fadeInUp} className="lg:col-span-5 space-y-4 lg:pl-6 border-l-0 lg:border-l border-[#D1A977]/20">
              <p className="text-lg sm:text-xl font-medium text-stone-200 leading-relaxed italic">
                « Un espace né du fardeau de préserver les foyers et de promouvoir le bonheur de Christ au sein de notre communauté. »
              </p>
              <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold">
                — Vision FAMOD
              </p>
            </motion.div>
          </div>

          {/* Timeline style #01, #02, #03, #04 (Comme sur l'image) */}
          <motion.div 
            variants={containerStagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-8 border-t border-[#D1A977]/20 relative z-10"
          >
            {etapesTimeline.map((item) => (
              <motion.div key={item.id} variants={fadeInUp} className="space-y-1">
                <span className="text-xs font-bold text-[#D1A977]">{item.id}</span>
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
                <p className="text-xs text-stone-400">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>


        {/* ==========================================
            2. BANDEAU DES FONDATEURS (Barre des marques)
        ========================================== */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="bg-[#0f0f0f] rounded-2xl py-6 px-4 border border-stone-800"
        >
          <p className="text-center text-xs font-semibold text-[#D1A977] uppercase tracking-widest mb-4">
            Fondé avec dévouement par nos 6 couples pionniers
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-xs sm:text-sm font-medium text-stone-300">
            {couplesFondateurs.map((couple, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D1A977]" />
                <span>{couple}</span>
              </div>
            ))}
          </div>
        </motion.div>


        {/* ==========================================
            3. SECTION CONTENU RÈCIT (2 Colonnes)
            Partie centrale inspirée du milieu de l'image
        ========================================== */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerStagger}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-6"
        >
          {/* Colonne Gauche - Titre de section */}
          <motion.div variants={fadeInUp} className="lg:col-span-5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D1A977]">
              Genèse & Engagement
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Protéger la famille, bâtir la société.
            </h2>
          </motion.div>

          {/* Colonne Droite - Le Texte fourni */}
          <motion.div variants={fadeInUp} className="lg:col-span-7 space-y-6 text-stone-300 text-base sm:text-lg leading-relaxed">
            <p>
              Pendant de nombreuses années, les couples subissent les conséquences de l’impréparation consistante avant le mariage et ses conséquences se répercutent au niveau des enfants, partenaires et la société entière.
            </p>
            <p className="text-stone-300">
              Depuis <strong className="text-[#D1A977] font-semibold">2018</strong>, utilisant leurs appels, fardeaux, les <span className="text-white font-medium">Couple Moise VANGI</span>, <span className="text-white font-medium">Couple HEUREUX KITINGU</span>, <span className="text-white font-medium">Couple Vincent SIKULI </span>, <span className="text-white font-medium">Couple ELOGE MAKONYANYI</span>, <span className="text-white font-medium">Couple Me ERICK TSIKO Hangi</span> et <span className="text-white font-medium">Couple Dr Corneille MAKO</span> ont créé <strong className="text-[#D1A977] font-semibold">FAMOD</strong> dont le but est d’encadrer les jeunes couples afin d’éliminer les dégâts conjugaux dans la communauté et y promouvoir le bonheur de Christ.
            </p>

            {/* Bouton style pillule avec flèche */}
            <div className="pt-2">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#rejoindre"
                className="inline-flex items-center gap-3 bg-[#D1A977] text-[#070707] font-bold px-7 py-3.5 rounded-full shadow-lg hover:bg-[#c39864] transition-all text-sm"
                
              >
                <Link to={'./Communaute.jsx'}>
                <span>Rejoindre la communauté</span>
                <span className="w-6 h-6 rounded-full bg-[#070707] text-[#D1A977] flex items-center justify-center text-xs">
                  →
                </span>
                </Link>
              </motion.a>
            </div>
          </motion.div>
        </motion.div>


        {/* ==========================================
            4. GRILLE DE CARTES (Inspirée du bas de l'image)
            3 cartes verticales avec coins très arrondis
        ========================================== */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerStagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6"
        >
          {piliersCartes.map((card, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              className="group bg-[#0f0f0f] rounded-[2.5rem] p-4 border border-stone-800 hover:border-[#D1A977]/50 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              {/* Image avec coins arrondis */}
              <div className="relative h-64 sm:h-72 w-full rounded-[2rem] overflow-hidden mb-5">
                <img 
                  src={card.image} 
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter grayscale contrast-125 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-transparent opacity-80" />
              </div>

              {/* Contenu sous l'image */}
              <div className="px-3 pb-3 space-y-1">
                <h3 className="text-xl font-bold text-white group-hover:text-[#D1A977] transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-stone-400">
                  {card.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}