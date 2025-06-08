import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FaTimes, FaCookieBite, FaShieldAlt } from 'react-icons/fa';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Forzar la aparición del modal de cookies para pruebas
    const forceShowCookieBanner = () => {
      // Eliminar cualquier consentimiento previo
      localStorage.removeItem('cookie_consent');
      document.cookie = 'cookie_consent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Forzar la aparición del banner
      console.log('Forzando aparición del modal de cookies');
      setVisible(true);
    };
    
    // Llamar inmediatamente
    forceShowCookieBanner();
  }, []);

  const handleAccept = async () => {
    try {
      // Guardar localmente primero (para UX inmediata)
      localStorage.setItem('cookie_consent', 'accepted');
      
      // Establecer cookie con expiración de 1 año
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      document.cookie = `cookie_consent=accepted; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
      
      // Ocultar el banner inmediatamente mientras se procesa el backend
      setVisible(false);
      
      // Intentar guardar en el backend
      await axios.post(
        'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=setCookieConsent',
        { consent: true },
        { 
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true 
        }
      );
      
      console.log('Consentimiento guardado correctamente');
    } catch (error) {
      // Si hay error con el backend, ya tenemos guardado localmente
      console.error('Error al guardar consentimiento en backend:', error);
    }
  };

  const handleDecline = async () => {
    try {
      // Guardar localmente primero (para UX inmediata)
      localStorage.setItem('cookie_consent', 'declined');
      
      // Establecer cookie con expiración más corta (1 semana)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7); // Preguntar de nuevo en una semana
      document.cookie = `cookie_consent=declined; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
      
      // Ocultar el banner inmediatamente mientras se procesa el backend
      setVisible(false);
      
      // Intentar guardar en el backend
      await axios.post(
        'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=setCookieConsent',
        { consent: false },
        { 
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true 
        }
      );
      
      console.log('Rechazo guardado correctamente');
    } catch (error) {
      // Si hay error con el backend, ya tenemos guardado localmente
      console.error('Error al guardar rechazo en backend:', error);
    }
  };

  const handleClose = () => {
    // Al cerrar sin decisión, guardamos temporalmente para no molestar
    localStorage.setItem('cookie_consent', 'pending');
    // Pero solo por un tiempo corto (1 día)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.cookie = `cookie_consent=pending; expires=${tomorrow.toUTCString()}; path=/; SameSite=Lax`;
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="fixed bottom-0 left-0 right-0 z-50 mx-auto pointer-events-auto"
        >
          <div className="bg-gray-900 border-t border-gray-800 p-4 shadow-lg backdrop-blur-sm bg-opacity-95">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <FaCookieBite className="text-purple-400 text-xl" />
                <p className="text-gray-300 text-sm">
                  Utilizamos cookies para mejorar tu experiencia. Al continuar navegando,
                  aceptas nuestra <a href="/politica-cookies" className="text-purple-400 hover:text-purple-300 underline">política de cookies</a>.
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button 
                  onClick={handleDecline}
                  className="px-4 py-1.5 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  Rechazar
                </button>
                <button 
                  onClick={handleAccept}
                  className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-500 rounded-md text-white hover:from-purple-700 hover:to-pink-600 transition-colors"
                >
                  Aceptar
                </button>
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                  aria-label="Cerrar"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
