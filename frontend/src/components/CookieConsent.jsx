import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FaTimes, FaCookieBite, FaShieldAlt } from 'react-icons/fa';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Comprobar si ya se ha aceptado las cookies en localStorage y cookie
    const checkCookieConsent = () => {
      // Verificar primero en localStorage (es más rápido)
      const localConsent = localStorage.getItem('cookie_consent');
      
      // También verificar en cookie para mejor persistencia
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('cookie_consent='));
      
      const cookieConsent = cookieValue ? cookieValue.split('=')[1] : null;
      
      // Si no existe consentimiento en ninguno de los dos lugares, mostrar el banner
      if (!localConsent && !cookieConsent) {
        setVisible(true);
      }
      
      // Si el usuario está autenticado, intentar sincronizar con el backend
      const syncWithBackend = async () => {
        try {
          if (localConsent === 'accepted') {
            await axios.post(
              'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=setCookieConsent',
              { consent: true },
              { 
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true 
              }
            );
          }
        } catch (error) {
          console.error('Error al sincronizar consentimiento con backend:', error);
        }
      };
      
      // Intentar sincronizar en segundo plano, pero no esperamos el resultado
      syncWithBackend();
    };

    // Esperar un poco antes de mostrar el modal para no interferir con la carga inicial
    const timer = setTimeout(checkCookieConsent, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAccept = async () => {
    try {
      // Guardar en localStorage
      localStorage.setItem('cookie_consent', 'accepted');
      
      // Establecer cookie con expiración de 1 año
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      document.cookie = `cookie_consent=accepted; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
      
      // Intentar guardar en el backend si está disponible
      await axios.post(
        'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=setCookieConsent',
        { consent: true },
        { 
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true 
        }
      ).catch(err => {
        console.error('Error al sincronizar con backend:', err);
        // Continuamos normalmente aunque falle el backend
      });
      
      setVisible(false);
    } catch (error) {
      console.error('Error al guardar el consentimiento de cookies:', error);
      // Incluso si hay error, ocultamos el banner ya que guardamos localmente
      setVisible(false);
    }
  };

  const handleDecline = async () => {
    try {
      // Guardar en localStorage
      localStorage.setItem('cookie_consent', 'declined');
      
      // Establecer cookie con expiración de 1 semana (periodo más corto para volver a preguntar)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      document.cookie = `cookie_consent=declined; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
      
      // Intentar guardar en el backend si está disponible
      await axios.post(
        'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=setCookieConsent',
        { consent: false },
        { 
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true 
        }
      ).catch(err => {
        console.error('Error al sincronizar con backend:', err);
        // Continuamos normalmente aunque falle el backend
      });
      
      setVisible(false);
    } catch (error) {
      console.error('Error al guardar el rechazo de cookies:', error);
      // Incluso si hay error, ocultamos el banner
      setVisible(false);
    }
  };

  const handleClose = () => {
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
          className="fixed bottom-6 left-0 right-0 z-50 p-4 md:px-6 mx-auto max-w-4xl pointer-events-none"
        >
          <div className="mx-auto">
            <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl shadow-purple-500/10 p-5 backdrop-blur-sm bg-opacity-90 pointer-events-auto">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-purple-600/20 rounded-lg">
                    <FaCookieBite className="text-purple-400 text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Política de Cookies</h3>
                </div>
                <motion.button 
                  onClick={handleClose}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-full"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes />
                </motion.button>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="text-gray-300 text-sm md:text-base leading-relaxed flex-1">
                  <div className="flex items-start space-x-2 mb-2">
                    <FaShieldAlt className="text-green-400 mt-1 flex-shrink-0" />
                    <p className="flex-1">
                      Utilizamos cookies para mejorar tu experiencia y ofrecer contenidos personalizados. 
                      Al usar LearnIA, aceptas nuestro uso de cookies de acuerdo con nuestra 
                      <a href="/politica-cookies" className="text-purple-400 hover:text-purple-300 hover:underline ml-1">
                        Política de Cookies
                      </a>.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 md:gap-3 justify-end flex-shrink-0">
                  <motion.button
                    onClick={handleDecline}
                    className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-all duration-200 flex items-center justify-center min-w-[100px]"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Rechazar
                  </motion.button>
                  <motion.button
                    onClick={handleAccept}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200 flex items-center justify-center min-w-[100px]"
                    whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(168, 85, 247, 0.3)" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Aceptar
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
