import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Variantes d'animation globales
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
      ease: [0.215, 0.61, 0.355, 1], // Custom cubic-bezier pour un effet ultra-fluide
    },
  },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

// Animation mot par mot pour les grands titres
const titleWordAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

export default function AboutSection() {
  const titleText = "FAMOD (Famille Modèle)";
  const words = titleText.split(" ");

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#070707] text-stone-200 transition-colors duration-300 overflow-hidden relative">
      {/* Éléments de fond décoratifs animés (Halos dorés) */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.12, 0.22, 0.12],
          x: [0, 30, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-10 w-72 h-72 bg-[#D1A977]/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.08, 0.18, 0.08],
          x: [0, -40, 0],
          y: [0, 40, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-10 w-96 h-96 bg-[#D1A977]/15 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        {/* ==========================================
            1. HERO / EN-TÊTE (Animation au chargement)
        ========================================== */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerStagger}
          className="text-center max-w-3xl mx-auto space-y-6"
        >
          {/* Badge haut */}
          <motion.div variants={fadeInUp} className="inline-block">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase bg-[#D1A977]/10 text-[#D1A977] shadow-sm border border-[#D1A977]/30"
            >
              <span className="w-2 h-2 rounded-full bg-[#D1A977] animate-pulse"></span>
              À Propos de Notre Forum
            </motion.span>
          </motion.div>

          {/* Titre principal animé mot par mot */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight flex flex-wrap justify-center gap-x-3 gap-y-1">
            {words.map((word, i) => (
              <motion.span
                key={i}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={titleWordAnimation}
                className={word.includes("FAMOD") || word.includes("Modèle") ? "text-[#D1A977] inline-block" : "inline-block"}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Paragraphe d'introduction */}
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-stone-300 leading-relaxed font-normal"
          >
            Un forum dédié aux jeunes couples chrétiens basé en République Démocratique du Congo, offrant un espace communautaire d'apprentissage, d'échange et d'accompagnement.
          </motion.p>

          {/* Ligne décorative séparatrice */}
          <motion.div
            variants={scaleIn}
            className="w-24 h-1 bg-gradient-to-r from-[#D1A977] to-[#D1A977]/30 mx-auto rounded-full mt-4"
          />
        </motion.div>


        {/* ==========================================
            2. VISION, MISSION & MÉTHODOLOGIE
        ========================================== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerStagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Mission */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -8 }}
            className="bg-gradient-to-b from-[#121212] to-[#0a0a0a] p-8 rounded-3xl border border-[#D1A977]/30 shadow-xl relative overflow-hidden group flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#D1A977]/5 rounded-bl-full pointer-events-none group-hover:bg-[#D1A977]/10 transition-all duration-300" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#D1A977]/10 text-[#D1A977] flex items-center justify-center mb-6 font-bold border border-[#D1A977]/20">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#D1A977] mb-2">Notre Mission</h3>
              <p className="text-xl font-bold text-white mb-4 leading-snug">
                Construire une famille heureuse, modèle, stable et durable
              </p>
              <p className="text-stone-400 text-sm leading-relaxed">
                Et y promouvoir le bonheur basé sur l’amour, la compassion et la justice du Christ.
              </p>
            </div>
          </motion.div>

          {/* Vision */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -8 }}
            className="bg-gradient-to-b from-[#121212] to-[#0a0a0a] p-8 rounded-3xl border border-[#D1A977]/30 shadow-xl relative overflow-hidden group flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#D1A977]/5 rounded-bl-full pointer-events-none group-hover:bg-[#D1A977]/10 transition-all duration-300" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#D1A977]/10 text-[#D1A977] flex items-center justify-center mb-6 font-bold border border-[#D1A977]/20">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#D1A977] mb-2">Notre Vision</h3>
              <p className="text-xl font-bold text-white mb-4 leading-snug">
                Une famille heureuse et modèle
              </p>
              <p className="text-stone-400 text-sm leading-relaxed">
                Qui glorifie Christ à travers son témoignage, son unité et son épanouissement au quotidien.
              </p>
            </div>
          </motion.div>

          {/* Méthodologie */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -8 }}
            className="bg-gradient-to-b from-[#121212] to-[#0a0a0a] p-8 rounded-3xl border border-[#D1A977]/30 shadow-xl relative overflow-hidden group flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#D1A977]/5 rounded-bl-full pointer-events-none group-hover:bg-[#D1A977]/10 transition-all duration-300" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#D1A977]/10 text-[#D1A977] flex items-center justify-center mb-6 font-bold border border-[#D1A977]/20">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#D1A977] mb-2">Notre Méthodologie</h3>
              <p className="text-xl font-bold text-white mb-4 leading-snug">
                Accompagnement Tri-dimensionnel
              </p>
              <p className="text-stone-400 text-sm leading-relaxed">
                Un soutien complet spirituel, psychologique et social personnalisé adapté aux besoins des couples.
              </p>
            </div>
          </motion.div>
        </motion.div>


        {/* ==========================================
            3. PILIERS D'ACTION (Animation au Scroll)
        ========================================== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerStagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Pilier 1 */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
            className="group bg-[#0f0f0f] backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-stone-800 hover:shadow-2xl hover:border-[#D1A977]/50 transition-all duration-300"
          >
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="w-14 h-14 rounded-2xl bg-[#D1A977]/10 text-[#D1A977] flex items-center justify-center mb-6 group-hover:bg-[#D1A977] group-hover:text-[#070707] transition-colors duration-300 shadow-inner"
            >
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </motion.div>
            <motion.h3 variants={fadeInUp} className="text-xl font-bold text-white mb-3">
              Accompagnement Holistique
            </motion.h3>
            <motion.p variants={fadeInUp} className="text-stone-400 text-sm leading-relaxed">
              Notre approche va au-delà du physique : nous intégrons pleinement les dimensions sociales, émotionnelles et spirituelles nécessaires à l'épanouissement du couple et de la famille.
            </motion.p>
          </motion.div>

          {/* Pilier 2 */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
            className="group bg-[#0f0f0f] backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-stone-800 hover:shadow-2xl hover:border-[#D1A977]/50 transition-all duration-300"
          >
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="w-14 h-14 rounded-2xl bg-[#D1A977]/10 text-[#D1A977] flex items-center justify-center mb-6 group-hover:bg-[#D1A977] group-hover:text-[#070707] transition-colors duration-300 shadow-inner"
            >
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </motion.div>
            <motion.h3 variants={fadeInUp} className="text-xl font-bold text-white mb-3">
              Communion & Transformation
            </motion.h3>
            <motion.p variants={fadeInUp} className="text-stone-400 text-sm leading-relaxed">
              À travers des enseignements ciblés, des temps d'échanges interactifs et des sorties, nous accompagnons les couples mariés, non-mariés et fiancés vers une transformation durable.
            </motion.p>
          </motion.div>

          {/* Pilier 3 */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
            className="group bg-[#0f0f0f] backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-stone-800 hover:shadow-2xl hover:border-[#D1A977]/50 transition-all duration-300"
          >
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="w-14 h-14 rounded-2xl bg-[#D1A977]/10 text-[#D1A977] flex items-center justify-center mb-6 group-hover:bg-[#D1A977] group-hover:text-[#070707] transition-colors duration-300 shadow-inner"
            >
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </motion.div>
            <motion.h3 variants={fadeInUp} className="text-xl font-bold text-white mb-3">
              Suivi Professionnel
            </motion.h3>
            <motion.p variants={fadeInUp} className="text-stone-400 text-sm leading-relaxed">
              Une équipe d'experts qualifiés (conseillers conjugaux, thérapeutes de famille, médiateurs) est disponible pour écouter et guider les foyers en situation de difficulté.
            </motion.p>
          </motion.div>
        </motion.div>


        {/* ==========================================
            4. SECTION DETAILED CONTENT (2 Colonnes)
        ========================================== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={containerStagger}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#0d0d0d] rounded-3xl p-8 sm:p-12 shadow-xl border border-stone-800/80 overflow-hidden relative"
        >
          {/* Colonne Gauche - Texte */}
          <motion.div variants={fadeInLeft} className="space-y-6">
            <motion.span
              variants={fadeInUp}
              className="text-xs font-bold uppercase tracking-wider text-[#D1A977] bg-[#D1A977]/10 px-3 py-1 rounded-md border border-[#D1A977]/20"
            >
              Notre Synergie
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-2xl sm:text-3xl font-bold text-white leading-tight"
            >
              Une collaboration ouverte avec le corps du Christ
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-stone-300 leading-relaxed"
            >
              Pour accomplir sa mission avec efficacité, <strong className="text-[#D1A977] font-semibold">FAMOD</strong> travaille en étroite collaboration avec des parrains dévoués, des églises locales, des chapelles et des aumôneries.
            </motion.p>

            <motion.p
              variants={fadeInUp}
              className="text-stone-400 leading-relaxed"
            >
              Nous faisons appel aux serviteurs de Dieu, pasteurs locaux et intervenants visiteurs animés par la vision d'édifier les familles, <span className="font-semibold text-stone-200">indépendamment de leur appartenance ethnique, religieuse ou politique.</span>
            </motion.p>
          </motion.div>

          {/* Colonne Droite - Équipe Pluridisciplinaire */}
          <motion.div
            variants={fadeInRight}
            className="bg-[#050505] p-6 sm:p-8 rounded-2xl border border-stone-800 space-y-5 shadow-inner"
          >
            <motion.h3
              variants={fadeInUp}
              className="text-lg font-bold text-[#D1A977] pb-2 border-b border-stone-800"
            >
              Une équipe pluridisciplinaire à votre service :
            </motion.h3>
            {/* Item 1 */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ x: 6 }}
              className="flex items-start space-x-3 transition-transform duration-200"
            >
              <div className="mt-1 w-6 h-6 rounded-full bg-[#D1A977]/20 text-[#D1A977] flex items-center justify-center shrink-0 font-bold text-xs border border-[#D1A977]/40">
                ✓
              </div>
              <p className="text-sm text-stone-300">
                <strong className="text-white font-semibold">Conseillers conjugaux :</strong> Écoute active et orientation pour restaurer la communication.
              </p>
            </motion.div>

            {/* Item 2 */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ x: 6 }}
              className="flex items-start space-x-3 transition-transform duration-200"
            >
              <div className="mt-1 w-6 h-6 rounded-full bg-[#D1A977]/20 text-[#D1A977] flex items-center justify-center shrink-0 font-bold text-xs border border-[#D1A977]/40">
                ✓
              </div>
              <p className="text-sm text-stone-300">
                <strong className="text-white font-semibold">Thérapeutes de famille :</strong> Accompagnement des dynamiques familiales complexes.
              </p>
            </motion.div>

            {/* Item 3 */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ x: 6 }}
              className="flex items-start space-x-3 transition-transform duration-200"
            >
              <div className="mt-1 w-6 h-6 rounded-full bg-[#D1A977]/20 text-[#D1A977] flex items-center justify-center shrink-0 font-bold text-xs border border-[#D1A977]/40">
                ✓
              </div>
              <p className="text-sm text-stone-300">
                <strong className="text-white font-semibold">Médiateurs familiaux :</strong> Résolution pacifique des conflits.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>


        {/* ==========================================
            5. BANDEAU INCLUSIVITÉ & CONTACT
        ========================================== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={scaleIn}
          className="relative overflow-hidden bg-gradient-to-r from-[#14120e] via-[#1c1813] to-[#070707] rounded-3xl p-8 sm:p-12 text-white border border-[#D1A977]/30 shadow-2xl"
        >
          {/* Effet brillant de fond */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-[#D1A977]/10 to-transparent skew-x-12 pointer-events-none"
          />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center sm:text-left">
            <motion.div variants={containerStagger} className="max-w-2xl space-y-4">
              <motion.h3 variants={fadeInUp} className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Un accueil inconditionnel & confidentiel
              </motion.h3>
              <motion.p variants={fadeInUp} className="text-stone-300 text-sm sm:text-base leading-relaxed">
                Nous offrons une écoute et un accompagnement à tous les couples et familles en difficulté, <strong className="text-[#D1A977] underline decoration-[#D1A977]">sans distinction</strong> de nationalité, de religion, d'appartenance politique, d'orientation ou d'identité sexuelle.
              </motion.p>
            </motion.div>

            <motion.div variants={scaleIn}>
              <motion.div
                whileHover={{ scale: 1.07, boxShadow: "0px 10px 25px rgba(209, 169, 119, 0.25)" }}
                whileTap={{ scale: 0.95 }}
                className="inline-block shrink-0 bg-[#D1A977] text-[#070707] hover:bg-[#c39864] font-bold px-8 py-4 rounded-2xl shadow-lg transition-colors duration-200 text-sm sm:text-base tracking-wide"
              >
                <Link to={'/contact'}>
                  Besoin d'écoute ? Contactez-nous
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}