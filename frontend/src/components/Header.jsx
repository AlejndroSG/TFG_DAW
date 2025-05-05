import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Login from '../Pages/Login';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const comprobarSesion = async () => {
      try {
        const respuesta = await axios.get(
          'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=comprobarSesion',
          {
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            withCredentials: true
          }
        );

        if (respuesta.data && respuesta.data.username) {
          setIsLoggedIn(true);
          setUserData({
            nombre: respuesta.data.username,
            id: respuesta.data.id,
            tipo_usuario: respuesta.data.tipo_usuario
          });
          toast.success(`¡Bienvenido ${respuesta.data.username}!`);
        } else {
          setIsLoggedIn(false);
          setUserData(null);
        }
      } catch (error) {
        console.error('Error al comprobar sesión:', error);
        setIsLoggedIn(false);
        setUserData(null);
      }
    };

    comprobarSesion();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Inicio', path: '/' },
    { name: 'Cursos', path: '/cursos' },
    { name: 'Blog', path: '/blog' },
    { name: 'Sobre Nosotros', path: '/sobre-nosotros' },
    { name: 'Contacto', path: '/contacto' }
  ];

  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };

  const handleLoginClose = () => {
    setIsLoginOpen(false);
  };

  const handleLoginSuccess = (userData) => {
    setIsLoginOpen(false);
    setIsLoggedIn(true);
    setUserData(userData);
    toast.success(`¡Bienvenido ${userData.nombre}!`);
  };

  const handleLoginError = (message) => {
    toast.error(message);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=desconectar',
        {},
        { withCredentials: true }
      );
      setIsLoggedIn(false);
      setUserData(null);
      toast.success('Has cerrado sesión correctamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "tween",
        duration: 0.3
      }
    },
    open: {
      opacity: 1,
      x: "0%",
      transition: {
        type: "tween",
        duration: 0.3
      }
    }
  };

  const linkVariants = {
    closed: { x: 20, opacity: 0 },
    open: i => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
      }
    })
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 50, damping: 15 }}
        className={`fixed w-full z-40 ${
          scrolled 
            ? 'bg-gray-900 bg-opacity-98'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "tween", duration: 0.2 }}
              className="flex items-center"
            >
              <Link to="/" className="flex items-center gap-3">
                <img 
                  className="h-10 w-10" 
                  src="/src/assets/react.svg" 
                  alt="LearnIA Logo" 
                />
                <span className="text-2xl font-bold text-transparent" style={{
                  background: 'linear-gradient(to right, #a78bfa, #db2777)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text'
                }}>
                  LearnIA
                </span>
              </Link>
            </motion.div>

            {/* Menú de navegación para escritorio */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -1 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <Link
                    to={item.path}
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              {/* Botón del menú hamburguesa */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="md:hidden text-white p-2 rounded-lg hover:bg-purple-500/10 transition-colors duration-300"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                  />
                </svg>
              </motion.button>

              {userData && isLoggedIn ? (
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "tween", duration: 0.2 }}
                    className="flex items-center gap-2"
                  >
                    <img 
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData.nombre}`}
                      alt="Avatar" 
                      className="w-8 h-8 rounded-full bg-purple-500"
                    />
                    <Link to="/perfil" className="text-white hover:text-purple-400 transition-colors">
                      {userData.nombre}
                    </Link>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "tween", duration: 0.2 }}
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    Cerrar Sesión
                  </motion.button>
                </div>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "tween", duration: 0.2 }}
                    onClick={handleLoginClick}
                    className="hidden md:block px-4 py-2 text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    Iniciar Sesión
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "tween", duration: 0.2 }}
                    className="hidden md:block px-6 py-2 text-white rounded-full font-medium shadow-lg hover:shadow-purple-500/25"
                    style={{
                      background: 'linear-gradient(to right, #a78bfa, #db2777)'
                    }}
                  >
                    Empezar Gratis
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="fixed top-0 right-0 h-screen w-4/5 max-w-sm bg-gray-900 shadow-2xl md:hidden"
              style={{
                backgroundImage: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(219, 39, 119, 0.1) 100%)'
              }}
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex justify-end mb-8">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMenuOpen(false)}
                    className="p-2 text-white hover:bg-purple-500/10 rounded-lg transition-colors duration-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                <nav className="flex flex-col gap-4">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={index}
                      custom={index}
                      variants={linkVariants}
                      className="border-b border-purple-500/20"
                    >
                      <Link
                        to={item.path}
                        onClick={() => setMenuOpen(false)}
                        className="block py-3 px-4 text-gray-300 hover:text-white hover:bg-purple-500/10 rounded-lg transition-colors duration-300"
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <div className="mt-auto">
                  {!isLoggedIn && (
                    <div className="space-y-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLoginClick}
                        className="w-full py-3 text-gray-300 hover:text-white transition-colors duration-300 border border-purple-500/20 rounded-lg"
                      >
                        Iniciar Sesión
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 text-white rounded-lg font-medium shadow-lg"
                        style={{
                          background: 'linear-gradient(to right, #7c3aed, #db2777)'
                        }}
                      >
                        Empezar Gratis
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <Login isOpen={isLoginOpen} onClose={handleLoginClose} onSuccess={handleLoginSuccess} onError={handleLoginError}/>
    </>
  );
};

export default Header;