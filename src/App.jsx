// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CustomCursor from './components/CustomCursor';

// Imports Firebase pour vérifier l'authentification sur la route protégée
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// 1. Les imports avec majuscule (Convention React obligatoire)
import Service from "./pages/service";
import Media from "./pages/media";
import Histoir from "./pages/histoir";
import About from "./pages/about";
import Contact from "./pages/contact";
import Communaute from "./pages/Communaute"; // 👈 Nouvelle page Communauté

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ListingPreview from './components/ListingPreview';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';

// Import de l'Assistant IA FAMOD
import AIChatbot from './components/AIChatbot';

// 🍪 Import du bandeau de consentement des cookies
import CookieBanner from './components/CookieBanner';

// Composant de protection de route : réservé aux personnes connectées
function PrivateRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return null; // Tu peux remplacer par un spinner/loader si besoin
  }

  return user ? children : <Navigate to="/" replace />;
}

// Composant pour regrouper les éléments de ta page d'accueil
function Home() {
  return (
    <main>
      <Hero />
      <ListingPreview />
      <CallToAction />
    </main>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D9A76F] selection:text-black flex flex-col justify-between">
      {/* Le cercle magique qui suit la souris */}
      <CustomCursor />

      <Navbar />
      
      {/* Espacement (pt-24) pour éviter que la Navbar fixe ne cache le haut des pages */}
      <div className="pt-24 flex-grow">
        <Routes>
          {/* L'accueil affiche le composant Home */}
          <Route path="/" element={<Home />} />
          
          {/* Les autres routes chargent leurs pages respectives */}
          <Route path="/service" element={<Service />} />
          <Route path="/about" element={<About />} />
          <Route path="/histoir" element={<Histoir />} />
          <Route path="/media" element={<Media />} />
          <Route path="/contact" element={<Contact />} />

          {/* 🔒 Route réservée uniquement aux membres connectés */}
          <Route 
            path="/communaute" 
            element={
              <PrivateRoute>
                <Communaute />
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>

      <Footer />

      {/* Le Chatbot IA : Placé juste avant la fermeture du conteneur principal */}
      <AIChatbot />

      {/* 🍪 Bandeau Cookies : S'affiche en bas de l'écran lors des nouvelles visites */}
      <CookieBanner />
    </div>
  );
}