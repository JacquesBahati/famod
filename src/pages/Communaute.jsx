// src/pages/Communaute.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  where,
  writeBatch,
  arrayUnion 
} from 'firebase/firestore';

const STICKERS = ['🔥', '❤️', '👏', '😍', '🎉', '🚀', '✨', '😂', '💯', '🙌', '💡', '👑','✊🏽','🤲','👋','🥺','😁','🫡','🥹','👀','👍','🙌🏽','☝🏽','🫶','🙏','😢','👉🏽'];

// PARAMÈTRES DE CONSERVATION
const IS_TEST_MODE = false; // Passez à true pour tester en 10 secondes
const EXPIRATION_DAYS = 45;

// Fonction utilitaire pour jouer un son de notification (Web Audio API)
const playNotificationSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {
    console.error("Impossible de jouer le son de notification", e);
  }
};

export default function Communaute() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showStickers, setShowStickers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [typingUsers, setTypingUsers] = useState([]);
  
  // ÉTATS POUR LES PERSONNES EN LIGNE
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showOnlineList, setShowOnlineList] = useState(false);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const isInitialLoad = useRef(true);
  const typingTimeoutRef = useRef(null);
  const touchTimerRef = useRef(null);
  const currentUser = auth.currentUser;

  // ==========================================
  // GESTION DU STATUT EN LIGNE (OPTIMISÉE)
  // ==========================================
  useEffect(() => {
    if (!currentUser) return;

    const userOnlineRef = doc(db, 'online_users', currentUser.uid);

    const updateOnlineStatus = async () => {
      try {
        const nameToUse = currentUser.displayName || currentUser.email?.split('@')[0] || 'Membre';
        await setDoc(userOnlineRef, {
          uid: currentUser.uid,
          userName: nameToUse,
          userPhoto: currentUser.photoURL || null,
          updatedAt: Date.now()
        }, { merge: true });
      } catch (err) {
        console.error("❌ Erreur enregistrement présence :", err);
      }
    };

    updateOnlineStatus();
    const interval = setInterval(updateOnlineStatus, 5000);

    const handleUnload = () => {
      deleteDoc(userOnlineRef).catch(() => {});
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleUnload);
      deleteDoc(userOnlineRef).catch(() => {});
    };
  }, [currentUser]);

  // Écoute en temps réel des utilisateurs connectés
  useEffect(() => {
    const qOnline = collection(db, 'online_users');

    const unsubscribe = onSnapshot(qOnline, (snapshot) => {
      const now = Date.now();
      
      const activeList = snapshot.docs
        .map(docSnap => docSnap.data())
        .filter(user => {
          if (!user.updatedAt) return false;
          const diff = Math.abs(now - user.updatedAt);
          return diff < 60000; // Valide si mis à jour dans la dernière minute
        });

      setOnlineUsers(activeList);
    }, (error) => {
      console.error("❌ Erreur lecture des membres en ligne :", error);
    });

    return () => unsubscribe();
  }, []);

  // 1. SUPPRESSION AUTOMATIQUE SUR FIRESTORE
  const cleanExpiredMessages = async () => {
    try {
      const expirationDate = new Date();
      
      if (IS_TEST_MODE) {
        expirationDate.setSeconds(expirationDate.getSeconds() - 10);
      } else {
        expirationDate.setDate(expirationDate.getDate() - EXPIRATION_DAYS);
      }

      const q = query(
        collection(db, 'community_chat'),
        where('createdAt', '<=', expirationDate)
      );

      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const batch = writeBatch(db);
        querySnapshot.forEach((docSnap) => {
          batch.delete(docSnap.ref);
        });
        await batch.commit();
        console.log(`[Firestore Clean] ${querySnapshot.size} message(s) expiré(s) supprimé(s) de la base de données.`);
      }
    } catch (error) {
      console.error("Erreur lors du nettoyage automatique Firestore :", error);
    }
  };

  // 2. Écoute des messages Firestore en temps réel + Marqueur de lecture + Nettoyage
  useEffect(() => {
    cleanExpiredMessages();

    const q = query(
      collection(db, 'community_chat'), 
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const now = new Date();
      const expirationLimitMs = IS_TEST_MODE 
        ? 10 * 1000 
        : EXPIRATION_DAYS * 24 * 60 * 60 * 1000;

      const msgs = snapshot.docs
        .map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }))
        .filter((msg) => {
          if (!msg.createdAt) return true;
          const msgDate = msg.createdAt.toDate ? msg.createdAt.toDate() : new Date(msg.createdAt);
          return now - msgDate < expirationLimitMs;
        });

      if (!isInitialLoad.current && msgs.length > messages.length) {
        const lastMsg = msgs[msgs.length - 1];
        if (lastMsg.uid !== currentUser?.uid) {
          playNotificationSound();
          
          if (chatContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            const isScrolledToBottom = scrollHeight - scrollTop - clientHeight < 100;
            if (!isScrolledToBottom) {
              setUnreadCount((prev) => prev + 1);
            }
          }
        }
      }

      setMessages(msgs);
      setLoading(false);
      isInitialLoad.current = false;

      if (currentUser) {
        snapshot.docs.forEach((docSnap) => {
          const data = docSnap.data();
          const readByList = data.readBy || [];
          if (data.uid !== currentUser.uid && !readByList.includes(currentUser.uid)) {
            const msgRef = doc(db, 'community_chat', docSnap.id);
            updateDoc(msgRef, {
              readBy: arrayUnion(currentUser.uid)
            }).catch(err => console.error("Erreur lors de la mise à jour de la lecture:", err));
          }
        });
      }
    }, (error) => {
      console.error("Erreur Firestore :", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // 3. FONCTION DE MISE À JOUR DU STATUT D'ÉCRIRE
  const updateTypingStatus = async (isTyping) => {
    if (!currentUser) return;
    try {
      const userTypingRef = doc(db, 'typing_status', currentUser.uid);
      await setDoc(userTypingRef, {
        uid: currentUser.uid,
        userName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Un membre',
        isTyping: isTyping,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error("Erreur mise à jour statut écriture:", error);
    }
  };

  // 4. ÉCOUTE EN TEMPS RÉEL DES AUTRES UTILISATEURS EN TRAIN D'ÉCRIRE
  useEffect(() => {
    if (!currentUser) return;

    const qTyping = query(
      collection(db, 'typing_status'),
      where('isTyping', '==', true)
    );

    const unsubscribeTyping = onSnapshot(qTyping, (snapshot) => {
      const activeTypers = snapshot.docs
        .map((docSnap) => docSnap.data())
        .filter((user) => user.uid !== currentUser.uid);

      setTypingUsers(activeTypers);
    });

    const handleUnload = () => {
      updateTypingStatus(false);
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      unsubscribeTyping();
      window.removeEventListener('beforeunload', handleUnload);
      updateTypingStatus(false);
    };
  }, [currentUser]);

  // Gestion de la saisie utilisateur
  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewMessage(value);

    if (value.trim().length > 0) {
      updateTypingStatus(true);

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      
      typingTimeoutRef.current = setTimeout(() => {
        updateTypingStatus(false);
      }, 2000);
    } else {
      updateTypingStatus(false);
    }
  };

  // Déplacement automatique vers le bas
  useEffect(() => {
    if (unreadCount === 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, unreadCount, typingUsers]);

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    if (scrollHeight - scrollTop - clientHeight < 50) {
      setUnreadCount(0);
    }
  };

  // Envoi d'un message texte
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    updateTypingStatus(false);

    try {
      await addDoc(collection(db, 'community_chat'), {
        text: newMessage.trim(),
        type: 'text',
        uid: currentUser.uid,
        userName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Membre',
        userPhoto: currentUser.photoURL || null,
        readBy: [currentUser.uid],
        createdAt: serverTimestamp(),
      });
      setNewMessage('');
      setShowStickers(false);
      setUnreadCount(0);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
    }
  };

  // Envoi d'un sticker
  const handleSendSticker = async (sticker) => {
    if (!currentUser) return;

    try {
      await addDoc(collection(db, 'community_chat'), {
        text: sticker,
        type: 'sticker',
        uid: currentUser.uid,
        userName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Membre',
        userPhoto: currentUser.photoURL || null,
        readBy: [currentUser.uid],
        createdAt: serverTimestamp(),
      });
      setShowStickers(false);
      setUnreadCount(0);
    } catch (error) {
      console.error("Erreur lors de l'envoi du sticker :", error);
    }
  };

  // Suppression d'un message
  const handleDeleteMessage = async (msgId, msgUid) => {
    if (!currentUser || currentUser.uid !== msgUid) return;

    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer ce message ?");
    if (!confirmDelete) return;

    try {
      const msgRef = doc(db, 'community_chat', msgId);
      await deleteDoc(msgRef);
    } catch (error) {
      console.error("Erreur lors de la suppression du message :", error);
    }
  };

  // Gestion des événements tactiles Android (Appui long)
  const handleTouchStart = (msgId, msgUid) => {
    if (!currentUser || currentUser.uid !== msgUid) return;
    touchTimerRef.current = setTimeout(() => {
      handleDeleteMessage(msgId, msgUid);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
    }
  };

  // Formater l'heure
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Calculer le nombre de jours restants avant suppression
  const getDaysRemaining = (timestamp) => {
    if (!timestamp) return EXPIRATION_DAYS;
    const msgDate = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diffMs = new Date() - msgDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const remaining = EXPIRATION_DAYS - diffDays;
    return remaining > 0 ? remaining : 0;
  };

  // Formater l'en-tête de date
  const formatDateHeader = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (d1, d2) =>
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();

    if (isSameDay(date, today)) return "Aujourd'hui";
    if (isSameDay(date, yesterday)) return "Hier";

    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  };

  const getDateKey = (timestamp) => {
    if (!timestamp) return 'pending';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  const renderTypingText = () => {
    if (typingUsers.length === 0) return null;
    if (typingUsers.length === 1) {
      return `${typingUsers[0].userName} est en train d'écrire...`;
    }
    if (typingUsers.length === 2) {
      return `${typingUsers[0].userName} et ${typingUsers[1].userName} sont en train d'écrire...`;
    }
    return `Plusieurs personnes sont en train d'écrire...`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 h-[calc(100vh-6rem)] flex flex-col relative">
      
      {/* En-tête avec Bouton des membres en ligne */}
      <div className="bg-[#121212] border border-gray-800 rounded-2xl p-4 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shrink-0 relative">
        <div>
          <h1 className="text-xl font-bold text-[#D9A76F] flex items-center gap-2">
            <span>💬</span> Espace Communauté FAMOD
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Échangez et discutez en direct avec tous les membres.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Message d'information sur la durée de vie des messages */}
          <div className="flex items-center gap-2 bg-[#1a150e] border border-[#D9A76F]/30 px-3 py-1.5 rounded-xl text-xs text-[#D9A76F]">
            <span>⏳</span>
            <span>
              {IS_TEST_MODE 
                ? "MODE TEST ACTIF : 10s" 
                : <><strong>sms expire dand 45j</strong> max</>}
            </span>
          </div>
          {/* BOUTON POUR VOIR LES PERSONNES EN LIGNE */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowOnlineList((prev) => !prev)}
              className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-3 py-1.5 rounded-xl text-xs font-semibold text-green-400 hover:bg-green-500/20 transition cursor-pointer"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span>{onlineUsers.length} en ligne</span>
            </button>

            {/* POPUP DE LA LISTE DES PERSONNES EN LIGNE */}
            <AnimatePresence>
              {showOnlineList && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-64 bg-[#161616] border border-gray-800 rounded-2xl p-3 shadow-2xl z-50 text-left"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-gray-800 mb-2">
                    <span className="text-xs font-bold text-gray-200">Connectés actuellement ({onlineUsers.length})</span>
                    <button 
                      onClick={() => setShowOnlineList(false)}
                      className="text-gray-400 hover:text-white text-xs p-1"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {onlineUsers.length === 0 ? (
                      <p className="text-xs text-gray-500 py-2 text-center">Aucun membre en ligne</p>
                    ) : (
                      onlineUsers.map((u) => (
                        <div key={u.uid} className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/5 transition">
                          {u.userPhoto ? (
                            <img src={u.userPhoto} alt={u.userName} className="w-7 h-7 rounded-full object-cover border border-[#D9A76F]" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-[#D9A76F] text-[#050505] font-bold text-xs flex items-center justify-center">
                              {u.userName?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="text-xs font-medium text-gray-200 truncate flex-1">
                            {u.userName} {u.uid === currentUser?.uid && <span className="text-[#D9A76F] text-[10px]">(Vous)</span>}
                          </span>
                          <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          
        </div>
      </div>

      {/* Zone des messages */}
      <div 
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 bg-[#0a0a0a] border border-gray-800 rounded-2xl p-4 overflow-y-auto flex flex-col gap-4 shadow-inner relative"
      >
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
            Chargement de la discussion...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            
            {/* SVG Personnage Joyeux */}
            <div className="relative mb-4">
              <svg 
                width="120" 
                height="120" 
                viewBox="0 0 200 200" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-[0_0_20px_rgba(217,167,111,0.25)]"
              >
                <circle cx="100" cy="100" r="75" fill="#D9A76F" fillOpacity="0.08" stroke="#D9A76F" strokeOpacity="0.2" strokeWidth="2" />
                <path d="M60 160C60 135 78 120 100 120C122 120 140 135 140 160" stroke="#D9A76F" strokeWidth="4" strokeLinecap="round" />
                <circle cx="100" cy="80" r="28" fill="#121212" stroke="#D9A76F" strokeWidth="4" />
                <path d="M89 76C89 76 92 72 95 76" stroke="#D9A76F" strokeWidth="3" strokeLinecap="round" />
                <path d="M105 76C105 76 108 72 111 76" stroke="#D9A76F" strokeWidth="3" strokeLinecap="round" />
                <path d="M91 88C95 94 105 94 109 88" stroke="#D9A76F" strokeWidth="3" strokeLinecap="round" />
                <path d="M64 135L48 150" stroke="#D9A76F" strokeWidth="4" strokeLinecap="round" />

                <motion.g
                  animate={{ rotate: [0, 18, -10, 18, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", repeatDelay: 0.5 }}
                  style={{ transformOrigin: "135px 130px" }}
                >
                  <path d="M136 132L152 100" stroke="#D9A76F" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="156" cy="94" r="8" fill="#D9A76F" />
                  <path d="M152 88L150 82" stroke="#D9A76F" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M156 86L156 79" stroke="#D9A76F" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M160 88L162 82" stroke="#D9A76F" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M168 84C171 87 171 93 168 96" stroke="#D9A76F" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                  <path d="M173 81C178 87 178 96 173 102" stroke="#D9A76F" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                </motion.g>
              </svg>
            </div>

            <h2 className="text-lg font-bold text-white mb-1">
              Bienvenue dans la discussion !
            </h2>
            <p className="text-gray-400 font-medium text-sm max-w-sm">
              Soyez le premier à écrire et lancez la conversation avec la communauté.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.uid === currentUser?.uid;
            const readCount = msg.readBy ? msg.readBy.length : 0;
            const daysLeft = getDaysRemaining(msg.createdAt);

            const currentDateKey = getDateKey(msg.createdAt);
            const prevDateKey = index > 0 ? getDateKey(messages[index - 1].createdAt) : null;
            const showDateHeader = currentDateKey !== prevDateKey && msg.createdAt;

            return (
              <div key={msg.id} className="flex flex-col gap-4">
                
                {/* Séparateur de date */}
                {showDateHeader && (
                  <div className="flex items-center justify-center my-2">
                    <span className="bg-[#181818] text-gray-400 text-[11px] font-medium px-3 py-1 rounded-full border border-gray-800/80 shadow-sm uppercase tracking-wide">
                      {formatDateHeader(msg.createdAt)}
                    </span>
                  </div>
                )}

                {/* Bulle de message */}
                <div 
                  className={`group flex gap-3 max-w-[85%] sm:max-w-[70%] ${
                    isMe ? 'self-end flex-row-reverse' : 'self-start'
                  }`}
                >
                  {/* Avatar */}
                  {msg.userPhoto ? (
                    <img
                      src={msg.userPhoto}
                      alt={msg.userName}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full border border-[#D9A76F]/50 object-cover shrink-0 mt-1"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#D9A76F] text-[#050505] font-bold text-xs flex items-center justify-center shrink-0 mt-1">
                      {msg.userName?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Contenu */}
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    {!isMe && (
                      <span className="text-[11px] text-gray-400 mb-1 ml-1 font-medium">
                        {msg.userName}
                      </span>
                    )}

                    <div className="flex items-center gap-2 relative group">
                      {/* Bouton de suppression */}
                      {isMe && (
                        <button
                          onClick={() => handleDeleteMessage(msg.id, msg.uid)}
                          title="Supprimer ce message"
                          className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-md text-xs active:scale-95"
                        >
                          🗑️
                        </button>
                      )}

                      {/* Bulle de message avec support tactile */}
                      <div
                        onTouchStart={() => handleTouchStart(msg.id, msg.uid)}
                        onTouchEnd={handleTouchEnd}
                        onTouchMove={handleTouchEnd}
                        className={`rounded-2xl px-4 py-2.5 shadow-md select-none ${
                          msg.type === 'sticker'
                            ? 'bg-transparent text-4xl p-1'
                            : isMe
                            ? 'bg-[#D9A76F] text-[#050505] font-medium rounded-tr-none'
                            : 'bg-[#181818] text-gray-100 border border-gray-800 rounded-tl-none'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {msg.text}
                        </p>
                      </div>
                    </div>

                    {/* Méta-informations */}
                    <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-gray-500">
                      <span>{formatTime(msg.createdAt)}</span>
                      
                      {!IS_TEST_MODE && (
                        <span 
                          title={`Ce message sera effacé dans ${daysLeft} jour(s)`}
                          className={`font-medium ${daysLeft <= 5 ? 'text-red-400' : 'text-gray-500'}`}
                        >
                          • Expire dans {daysLeft}j
                        </span>
                      )}

                      {readCount > 0 && (
                        <span 
                          title={`Lu par ${readCount} personne(s)`}
                          className="flex items-center gap-0.5 text-gray-400 font-medium bg-gray-900/60 px-1.5 py-0.5 rounded border border-gray-800"
                        >
                          <span className="text-[#D9A76F]">✓✓</span> {readCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Notification flottante */}
      <AnimatePresence>
        {unreadCount > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => {
              messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
              setUnreadCount(0);
            }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-[#D9A76F] text-[#050505] font-semibold text-xs px-4 py-2 rounded-full shadow-xl flex items-center gap-2 cursor-pointer border border-white/20 hover:scale-105 transition"
          >
            <span>↓ {unreadCount} nouveau{unreadCount > 1 ? 'x' : ''} message{unreadCount > 1 ? 's' : ''}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Indicateur visuel "En train d'écrire..." */}
      <AnimatePresence>
        {typingUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="flex items-center gap-2 text-xs text-[#D9A76F] font-medium px-2 pt-2 italic"
          >
            <span className="flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-[#D9A76F] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-[#D9A76F] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-[#D9A76F] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
            <span>{renderTypingText()}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Barre de saisie */}
      <div className="relative mt-2 shrink-0">
        <AnimatePresence>
          {showStickers && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-16 left-0 bg-[#121212] border border-gray-800 rounded-2xl p-3 shadow-2xl grid grid-cols-6 gap-2 z-20"
            >
              {STICKERS.map((sticker) => (
                <button
                  key={sticker}
                  type="button"
                  onClick={() => handleSendSticker(sticker)}
                  className="text-2xl hover:scale-125 transition p-2 hover:bg-gray-800 rounded-xl cursor-pointer"
                >
                  {sticker}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
          <button
            type="button"
            onClick={() => setShowStickers((prev) => !prev)}
            className={`p-3 rounded-xl border transition cursor-pointer ${
              showStickers 
                ? 'border-[#D9A76F] bg-[#D9A76F]/10 text-[#D9A76F]' 
                : 'border-gray-800 bg-[#121212] text-gray-400 hover:text-white'
            }`}
          >
            😃
          </button>

          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Écrivez un message..."
            className="flex-1 bg-[#121212] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#D9A76F] outline-none transition"
          />

          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-[#D9A76F] text-[#050505] font-semibold px-5 py-3 rounded-xl hover:bg-white disabled:opacity-40 transition cursor-pointer shrink-0"
          >
            Envoyer
          </button>
        </form>
      </div>

    </div>
  );
}