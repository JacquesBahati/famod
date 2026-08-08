// src/pages/Services.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Liste des services organisée
const servicesData = [
  {
    id: 1,
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: "Conseil Conjugal & Familial",
    shortDesc: "Accompagnement personnalisé pour renforcer la communication, restaurer l'harmonie et surmonter les crises de couple.",
    fullDesc: "Notre service de conseil conjugal offre un espace neutre, bienveillant et strictement confidentiel. Nous aidons les couples à identifier les blocages relationnels, à réapprendre à communiquer sainement et à reconstruire des fondations solides basées sur l'amour, le respect et les principes du Christ.",
    features: [
      "Gestion et résolution des conflits",
      "Restauration de la confiance et du dialogue",
      "Préparation au mariage (fiancés)",
      "Sessions individuelles ou en couple"
    ],
    badge: "Populaire"
  },
  {
    id: 2,
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Soutien Psychologique & Thérapeutique",
    shortDesc: "Prise en charge professionnelle des blessures émotionnelles, du stress familial et des traumatismes du passé.",
    fullDesc: "Grâce à notre équipe de thérapeutes qualifiés, nous offrons une prise en charge holistique pour surmonter l'anxiété, la dépression, les blessures de l'enfance ou le deuil qui impactent la vie de famille. Un suivi adapté pour guérir l'intérieur afin de mieux s'épanouir en famille.",
    features: [
      "Thérapie familiale systémique",
      "Gestion du stress et de l'épuisement émotionnel",
      "Accompagnement après épreuves lourdes",
      "Suivi personnalisé avec des experts"
    ]
  },
  {
    id: 3,
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: "Accompagnement Spirituel",
    shortDesc: "Enseignements bibliques et moments de prière axés sur le modèle familial chrétien et la maturité foi-vie.",
    fullDesc: "Nous croyons que Dieu est le créateur de la famille. Notre accompagnement spirituel propose des études bibliques ciblées, des temps d'intercession et des conseils fondés sur l'Évangile pour aider les foyers à marcher selon la volonté divine.",
    features: [
      "Études bibliques sur le foyer et le mariage",
      "Soutien par la prière et l'intercession",
      "Orientation spirituelle pour les décideurs du foyer",
      "Édification et maturité spirituelle"
    ]
  },
  {
    id: 4,
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Médiation & Résolution de Conflits",
    shortDesc: "Une démarche pacifique et structurée pour dénouer les tensions complexes entre conjoints ou membres de la famille.",
    fullDesc: "Lorsque le dialogue semble totalement rompu, nos médiateurs interviennent pour instaurer un cadre neutre. Nous aidons les parties à trouver des compromis équitables et durables sans passer par des affrontements destructeurs.",
    features: [
      "Intervention neutre et impartiale",
      "Résolution de désaccords éducatifs ou financiers",
      "Médiation familiale élargie",
      "Protection de l'intérêt des enfants"
    ]
  },
  {
    id: 5,
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Ateliers, Séminaires & Retraites",
    shortDesc: "Des événements thématiques, conférences et moments d'échanges dynamiques pour fortifier les couples et les jeunes.",
    fullDesc: "FAMOD organise régulièrement des ateliers pratiques, des conférences interactives et des retraites de couples. Ces espaces permettent d'apprendre des paires, de partager des expériences et de rafraîchir la flamme de son foyer.",
    features: [
      "Retraites spirituelles et de détente pour couples",
      "Conférences et panels avec des experts",
      "Ateliers pratiques sur l'éducation des enfants",
      "Temps de communion et de partage"
    ]
  },
  {
    id: 6,
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: "Assistance & Réorientation Sociale",
    shortDesc: "Orientation et aide concrète pour les familles vulnérables ou traversant des difficultés d'intégration.",
    fullDesc: "Nous accompagnons les familles sur le plan social en travaillant en réseau avec des organismes partenaires. Notre objectif est de proposer un filet de sécurité aux foyers en détresse pour leur permettre de retrouver stabilité et autonomie.",
    features: [
      "Écoute sociale et orientation",
      "Accompagnement des jeunes foyers",
      "Réseau de solidarité communautaire",
      "Inclusivité sans aucune distinction"
    ]
  }
];

// Variants pour Framer Motion
const containerStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  }
};

export default function Services() {
  const [selectedService, setSelectedService] = useState(null);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#070707] text-stone-200 min-h-screen relative overflow-hidden">
      
      {/* Halos lumineux en arrière-plan */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#D1A977]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#D1A977]/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        
        {/* En-tête */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-[#D1A977]/10 text-[#D1A977] border border-[#D1A977]/30">
            <span className="w-2 h-2 rounded-full bg-[#D1A977] animate-pulse"></span>
            Nos Domaines d'Action
          </span>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Comment nous accompagnons votre <span className="text-[#D1A977]">famille</span>
          </h1>

          <p className="text-stone-400 text-base sm:text-lg leading-relaxed">
            Découvrez nos services conçus pour soutenir, guider et fortifier les couples et les foyers à chaque étape de leur histoire. Cliquez sur un service pour en savoir plus.
          </p>
        </motion.div>

        {/* Grille des Services */}
        <motion.div 
          variants={containerStagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {servicesData.map((service) => (
            <motion.div
              key={service.id}
              variants={cardVariant}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedService(service)}
              className="bg-[#0f0f0f] border border-stone-800 hover:border-[#D1A977]/60 rounded-3xl p-8 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-[#D1A977]/10 group flex flex-col justify-between relative overflow-hidden"
            >
              {/* Badge si présent */}
              {service.badge && (
                <span className="absolute top-4 right-4 bg-[#D1A977] text-[#070707] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider">
                  {service.badge}
                </span>
              )}

              <div>
                {/* Icône animée */}
                <div className="w-16 h-16 rounded-2xl bg-[#D1A977]/10 text-[#D1A977] flex items-center justify-center mb-6 group-hover:bg-[#D1A977] group-hover:text-[#070707] transition-all duration-300 border border-[#D1A977]/20">
                  {service.icon}
                </div>

                {/* Titre */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#D1A977] transition-colors">
                  {service.title}
                </h3>

                {/* Description courte */}
                <p className="text-stone-400 text-sm leading-relaxed mb-6">
                  {service.shortDesc}
                </p>
              </div>

              {/* Bouton En savoir plus */}
              <div className="pt-4 border-t border-stone-800/80 flex items-center gap-2 text-xs font-bold text-[#D1A977] group-hover:translate-x-1 transition-transform">
                <span>Cliquer pour découvrir</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bandeau d'action vers Contact */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#14120e] via-[#1a1713] to-[#070707] border border-[#D1A977]/30 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left"
        >
          <div>
            <h3 className="text-2xl font-bold text-white">Un besoin particulier non listé ?</h3>
            <p className="text-stone-400 text-sm mt-1">Notre équipe est à votre disposition pour étudier votre situation en toute confidentialité.</p>
          </div>
          <Link
            to="/contact"
            className="bg-[#D1A977] hover:bg-[#c39864] text-[#070707] font-bold px-7 py-3.5 rounded-2xl transition-all shadow-lg hover:scale-105 text-sm shrink-0"
          >
            Prendre rendez-vous
          </Link>
        </motion.div>

      </div>

      {/* ==========================================
          MODALE / BOÎTE DE DIALOGUE INTERACTIVE
      ========================================== */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            
            {/* Arrière-plan flou sombre */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Boîte Modale */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-[#121212] border border-[#D1A977]/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full relative z-10 shadow-2xl text-white my-auto max-h-[90vh] overflow-y-auto"
            >
              {/* Bouton Fermer (X) */}
              <button 
                type="button"
                onClick={() => setSelectedService(null)}
                className="absolute top-5 right-5 w-10 h-10 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
              >
                ✕
              </button>

              {/* En-tête Modale */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#D1A977]/20 text-[#D1A977] flex items-center justify-center shrink-0 border border-[#D1A977]/40">
                  {selectedService.icon}
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D1A977]">Détails du Service</span>
                  <h2 className="text-2xl font-bold text-white">{selectedService.title}</h2>
                </div>
              </div>

              {/* Contenu */}
              <div className="space-y-6 text-stone-300">
                <p className="text-base leading-relaxed text-stone-200 bg-[#080808] p-4 rounded-2xl border border-stone-800">
                  {selectedService.fullDesc}
                </p>

                {/* Points clés */}
                <div>
                  <h4 className="text-sm font-bold text-[#D1A977] uppercase tracking-wider mb-3">
                    Ce que comprend cet accompagnement :
                  </h4>
                  <ul className="space-y-2.5">
                    {selectedService.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-stone-300">
                        <span className="w-5 h-5 rounded-full bg-[#D1A977]/20 text-[#D1A977] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions au bas de la modale */}
                <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/contact"
                    onClick={() => setSelectedService(null)}
                    className="flex-1 bg-[#D1A977] hover:bg-[#c39864] text-[#070707] font-bold py-3 px-6 rounded-xl text-center text-sm transition shadow-lg"
                  >
                    Demander ce service
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedService(null)}
                    className="py-3 px-6 rounded-xl border border-stone-800 hover:bg-stone-900 text-stone-400 hover:text-white text-sm transition cursor-pointer"
                  >
                    Fermer
                  </button>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}