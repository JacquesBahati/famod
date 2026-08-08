// src/components/CustomCursor.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    // Effet au clic (pression)
    const handleMouseDown = (e) => {
      setIsClicking(true);

      // Ajouter une onde d'impact à la position exacte du clic
      const newRipple = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      };

      setRipples((prev) => [...prev, newRipple]);

      // Nettoyer l'onde après la fin de l'animation (600ms)
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    };

    // Relâchement du clic
    const handleMouseUp = () => {
      setIsClicking(false);
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
    
      {/* 1. Animation de l'onde de choc (Ripple) qui s'agrandit et disparaît au clic */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ opacity: 0.8, scale: 0.2 }}
            animate={{ opacity: 0, scale: 2.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '2px solid #D1A977',
              backgroundColor: 'rgba(209, 169, 119, 0.2)',
              pointerEvents: 'none',
              zIndex: 99998,
              x: ripple.x - 20,
              y: ripple.y - 20,
            }}
          />
        ))}
      </AnimatePresence>

      {/* 2. Le rond principal qui suit la souris (s'écrase légèrement pendant le clic) */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: '2px solid #D1A977',
          backgroundColor: isClicking ? 'rgba(209, 169, 119, 0.3)' : 'transparent',
          pointerEvents: 'none',
          zIndex: 99999,
        }}
        animate={{
          x: mousePosition.x - 18,
          y: mousePosition.y - 18,
          scale: isClicking ? 0.75 : 1, // Le cercle se récurte/se compresse au moment du clic
        }}
        transition={{
          type: 'spring',
          damping: 20,
          stiffness: 300,
          mass: 0.2,
        }}
      />
    </>
  );
}