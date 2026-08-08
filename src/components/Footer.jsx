// src/components/Footer.jsx
import { FaTiktok, FaYoutube, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="py-12 border-t border-gray-900 bg-[#050505] text-center text-gray-500 text-xs">
      <div className="flex justify-center items-center gap-6 mb-6 text-gray-400 font-light">
        <a 
          href="https://vt.tiktok.com/ZS45KTPGW/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2 hover:text-white transition"
        >
          <FaTiktok className="text-base" />
          <span>TikTok</span>
        </a>

        <span>•</span>

        <a 
          href="https://youtube.com/@famillemodele?si=pHq-c42amLsyA8jT" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2 hover:text-white transition"
        >
          <FaYoutube className="text-base hover:text-white" />
          <span>YouTube</span>
        </a>

        <span>•</span>

        <a 
          href="https://www.instagram.com/modelefamille?igsh=MW5wdjE1YjhwN3Zl&utm_source=qr" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2 hover:text-white transition"
        >
          <FaInstagram className="text-base hover:text-white" />
          <span>Instagram</span>
        </a>
      </div>

      <p className="tracking-widest uppercase text-gray-600">
        © {new Date().getFullYear()} FAMOD. Tous droits réservés.
      </p>
    </footer>
  );
}