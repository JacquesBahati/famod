// src/components/AuthModal.jsx
import { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { auth } from '../firebase';

export default function AuthModal({ isOpen, onClose }) {
  // Mode : true = Inscription, false = Connexion
  const [isSignUp, setIsSignUp] = useState(false); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 État pour afficher/masquer le mot de passe
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // 1. Authentification Google
  const handleGoogleAuth = async () => {
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onClose();
    } catch (err) {
      console.error("Erreur Google Auth :", err);
      if (err.code === 'auth/account-exists-with-different-credential') {
        setError("Un compte existe déjà avec cet e-mail via une autre méthode de connexion.");
      } else {
        setError("Erreur lors de l'inscription avec Google.");
      }
    }
  };

  // 2. Soumission du formulaire Email / Mot de passe
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isSignUp) {
        // Inscription
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Enregistrement du nom dans le profil utilisateur Firebase
        if (name.trim()) {
          await updateProfile(userCredential.user, {
            displayName: name.trim()
          });
        }
      } else {
        // Connexion
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (err) {
      console.error("Erreur Auth :", err.code);

      // Gestion des erreurs en français
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError("Un compte existe déjà avec cette adresse e-mail. Veuillez vous connecter.");
          break;
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError("E-mail ou mot de passe incorrect.");
          break;
        case 'auth/weak-password':
          setError("Le mot de passe doit contenir au moins 6 caractères.");
          break;
        case 'auth/invalid-email':
          setError("L'adresse e-mail n'est pas valide.");
          break;
        default:
          setError("Une erreur est survenue. Veuillez réessayer.");
          break;
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#121212] border border-gray-800 rounded-2xl w-full max-w-md p-6 text-white relative shadow-2xl">
        
        {/* Bouton Fermer */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg font-bold cursor-pointer"
        >
          ✕
        </button>

        {/* Titre dynamique */}
        <h2 className="text-2xl font-bold text-[#D9A76F] mb-6 text-center">
          {isSignUp ? "Créer un compte" : "Se connecter"}
        </h2>

        {/* Affichage des erreurs */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {/* Formulaire Classique */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Champ Nom d'utilisateur (affiché UNIQUEMENT en mode Inscription) */}
          {isSignUp && (
            <div>
              <label className="text-xs text-gray-400 block mb-1">Nom d'utilisateur</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#050505] border border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#D9A76F] outline-none transition"
                placeholder="Votre nom complet"
              />
            </div>
          )}

          <div>
            <label className="text-xs text-gray-400 block mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#050505] border border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#D9A76F] outline-none transition"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Mot de passe</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#050505] border border-gray-800 rounded-xl pl-4 pr-11 py-2.5 text-sm focus:border-[#D9A76F] outline-none transition"
                placeholder="••••••••"
              />
              
              {/* Bouton pour afficher / masquer le mot de passe */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D9A76F] transition cursor-pointer p-1"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? (
                  /* Icône œil barré */
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-10-7-10-7a17.92 17.92 0 012.19-3.23m3.11-2.48A9.972 9.972 0 0112 5c7 0 10 7 10 7a18.23 18.23 0 01-3.21 3.88m-2.48 2.19L3 3l18 18M9.88 9.88a3 3 0 104.24 4.24" />
                  </svg>
                ) : (
                  /* Icône œil ouvert */
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#D9A76F] text-[#050505] font-semibold py-3 rounded-xl hover:bg-white transition mt-2 cursor-pointer"
          >
            {isSignUp ? "S'inscrire" : "Se connecter"}
          </button>
        </form>

        {/* BOUTON GOOGLE : Affiché UNIQUEMENT lors de l'inscription */}
        {isSignUp && (
          <>
            <div className="flex items-center gap-3 my-5">
              <div className="h-[1px] bg-gray-800 flex-1" />
              <span className="text-xs text-gray-500 uppercase">ou</span>
              <div className="h-[1px] bg-gray-800 flex-1" />
            </div>

            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full border border-gray-800 bg-[#050505] hover:bg-gray-900 transition text-sm font-medium py-2.5 rounded-xl flex items-center justify-center gap-3 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              S'inscrire avec Google
            </button>
          </>
        )}

        {/* Basculer entre Connexion et Inscription */}
        <div className="mt-6 text-center text-xs text-gray-400">
          {isSignUp ? (
            <p>
              Vous avez déjà un compte ?{' '}
              <button 
                type="button"
                onClick={() => {
                  setError('');
                  setIsSignUp(false);
                }} 
                className="text-[#D9A76F] font-semibold hover:underline ml-1 cursor-pointer"
              >
                Se connecter
              </button>
            </p>
          ) : (
            <p>
              Pas encore de compte ?{' '}
              <button 
                type="button"
                onClick={() => {
                  setError('');
                  setIsSignUp(true);
                }} 
                className="text-[#D9A76F] font-semibold hover:underline ml-1 cursor-pointer"
              >
                Créer un compte
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}