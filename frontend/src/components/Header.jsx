import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Login from '../Pages/Login';
import { toast } from 'react-hot-toast';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

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
    { name: 'Recursos', path: '/recursos' },
    { name: 'Blog', path: '/blog' }
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

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    toast.success('Has cerrado sesión correctamente');
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
              {isLoggedIn ? (
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
                    <span className="text-white">{userData.nombre}</span>
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
                    className="px-6 py-2 text-white rounded-full font-medium shadow-lg hover:shadow-purple-500/25"
                    style={{
                      background: 'linear-gradient(to right, #7c3aed, #db2777)'
                    }}
                  >
                    Empezar Gratis
                  </motion.button>
                </>
              )}

              <button className="md:hidden text-white">
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
                    d="M4 6h16M4 12h16M4 18h16" 
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <Login 
        isOpen={isLoginOpen}
        onClose={handleLoginClose}
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
      />
    </>
  );
};

export default Header;