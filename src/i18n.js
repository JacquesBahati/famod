// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      // --- NAVBAR ---
      services: "Services",
      about: "A propos de Nous",
      media: "Média",
      history: "Histoire",
      contact: "Contactez-nous",

      // --- PAGE ACCUEIL / HERO ---
      hero_title: "Bienvenue chez FAMOD",
      hero_subtitle: "Découvrez nos initiatives et nos projets.",

      // --- PAGE SERVICES ---
      services_title: "Nos Services",
      services_desc: "Découvrez l'ensemble de nos prestations et services.",

      // --- PAGE À PROPOS ---
      about_title: "À Propos de FAMOD",
      about_desc: "Nous sommes une organisation dédiée à...",

      // --- PAGE MÉDIA ---
      media_title: "Espace Média",
      media_desc: "Retrouvez nos dernières vidéos, images et actualités.",

      // --- PAGE HISTOIRE ---
      history_title: "Notre Histoire",
      history_desc: "Découvrez le parcours et les origines de FAMOD.",

      // --- PAGE CONTACT ---
      contact_title: "Rejoindre le Groupe FAMOD",
      contact_phone_label: "Votre numéro WhatsApp :",
      contact_btn: "Demander à intégrer le groupe",
    }
  },
  en: {
    translation: {
      // --- NAVBAR ---
      services: "Services",
      about: "About Us",
      media: "Media",
      history: "History",
      contact: "Contact Us",

      // --- PAGE ACCUEIL / HERO ---
      hero_title: "Welcome to FAMOD",
      hero_subtitle: "Discover our initiatives and projects.",

      // --- PAGE SERVICES ---
      services_title: "Our Services",
      services_desc: "Explore all of our offerings and services.",

      // --- PAGE À PROPOS ---
      about_title: "About FAMOD",
      about_desc: "We are an organization dedicated to...",

      // --- PAGE MÉDIA ---
      media_title: "Media Space",
      media_desc: "Find our latest videos, pictures, and news.",

      // --- PAGE HISTOIRE ---
      history_title: "Our History",
      history_desc: "Learn about the journey and origins of FAMOD.",

      // --- PAGE CONTACT ---
      contact_title: "Join FAMOD Group",
      contact_phone_label: "Your WhatsApp Number:",
      contact_btn: "Request to join the group",
    }
  },
  sw: {
    translation: {
      // --- NAVBAR ---
      services: "Huduma",
      about: "Kuhusu Sisi",
      media: "Vyombo vya Habari",
      history: "Historia",
      contact: "Wasiliana Nasi",

      // --- PAGE ACCUEIL / HERO ---
      hero_title: "Karibu FAMOD",
      hero_subtitle: "Gundua mipango na miradi yetu.",

      // --- PAGE SERVICES ---
      services_title: "Huduma Zetu",
      services_desc: "Angalia huduma zetu zote tunazotoa.",

      // --- PAGE À PROPOS ---
      about_title: "Kuhusu FAMOD",
      about_desc: "Sisi ni shirika linalojitolea kwa...",

      // --- PAGE MÉDIA ---
      media_title: "Eneo la Vyombo vya Habari",
      media_desc: "Pata video, picha na habari zetu za hivi karibuni.",

      // --- PAGE HISTOIRE ---
      history_title: "Historia Yetu",
      history_desc: "Jifunze kuhusu safari na asili ya FAMOD.",

      // --- PAGE CONTACT ---
      contact_title: "Jiunge na Kikundi cha FAMOD",
      contact_phone_label: "Nambari yako ya WhatsApp:",
      contact_btn: "Omba kujiunga na kikundi",
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'fr', // Langue par défaut
  fallbackLng: 'fr',
  interpolation: { escapeValue: false }
});

export default i18n;