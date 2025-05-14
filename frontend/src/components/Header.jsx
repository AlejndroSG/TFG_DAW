import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Login from '../Pages/Login';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { FaRocket, FaGraduationCap, FaRegLightbulb, FaBook, FaPhoneAlt, FaInfoCircle, FaSignInAlt, FaRegUserCircle, FaUserShield, FaChartLine } from 'react-icons/fa';

const Header = () => {
  const navigate = useNavigate();
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

  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const navItems = [
    { name: 'Inicio', path: '/' },
    { name: 'Cursos', path: '/cursos' },
    { name: 'Blog', path: '/blog' },
    { name: 'Sobre Nosotros', path: '/sobre-nosotros' },
    { name: 'Contacto', path: '/contacto' }
  ];
  
  const getIcon = (name) => {
    switch(name) {
      case 'Inicio': return <FaRocket className="text-purple-400" size={14} />;
      case 'Cursos': return <FaGraduationCap className="text-purple-400" size={14} />;
      case 'Blog': return <FaBook className="text-purple-400" size={14} />;
      case 'Sobre Nosotros': return <FaInfoCircle className="text-purple-400" size={14} />;
      case 'Contacto': return <FaPhoneAlt className="text-purple-400" size={14} />;
      default: return <FaRegLightbulb className="text-purple-400" size={14} />;
    }
  };

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
    
    // Redirección automática al panel de administración si es admin
    if (userData.tipo_usuario.toLowerCase() === 'administrador') {
      setTimeout(() => {
        navigate('/admin');
        toast.success('Accediendo al panel de administración...');
      }, 500);
    }
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
        className={`fixed w-full z-40 backdrop-blur-sm ${
          scrolled 
            ? 'bg-gray-900/90 shadow-lg shadow-purple-500/10'
            : 'bg-transparent'
        }`}
      >
        {/* Barra decorativa superior con gradiente */}
        <div className="h-0.5 w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600"></div>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "tween", duration: 0.2 }}
              className="flex items-center"
            >
              <Link to="/" className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-70 blur-sm animate-pulse"></div>
                  <div className="relative flex items-center justify-center h-10 w-10 rounded-full bg-gray-900 border border-purple-500/30">
                    <FaGraduationCap className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-transparent" style={{
                    background: 'linear-gradient(to right, #a78bfa, #db2777)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text'
                  }}>
                    LearnIA
                  </span>
                  <span className="text-[10px] text-gray-400 -mt-1 font-medium tracking-wider">REVOLUCIONA TU APRENDIZAJE</span>
                </div>
              </Link>
            </motion.div>

            {/* Menú de navegación para escritorio */}
            <nav className="hidden md:flex items-center gap-7">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <motion.div
                    key={index}
                    initial={false}
                    animate={{ y: isActive ? -2 : 0 }}
                    whileHover={{ y: -2, scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="relative"
                  >
                    <Link
                      to={item.path}
                      className={`flex items-center gap-1.5 text-sm font-medium px-2 py-1 rounded-md transition-all duration-300 ${
                        isActive
                          ? 'text-white bg-purple-600/10'
                          : 'text-gray-300 hover:text-white hover:bg-purple-500/5'
                      }`}
                    >
                      {getIcon(item.name)}
                      <span>{item.name}</span>
                    </Link>
                    {isActive && (
                      <motion.div 
                        layoutId="activeIndicator"
                        className="absolute -bottom-1 left-1/2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 transform -translate-x-1/2"
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </nav>

            <div className="flex items-center gap-4">
              {/* Avatar en modo móvil cuando está logueado */}
              {isLoggedIn && userData && (
                <Link to="/perfil" className="md:hidden">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full opacity-70 blur-sm"></div>
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData.nombre}`}
                      alt="Avatar"
                      className="relative w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 p-0.5"
                    />
                  </motion.div>
                </Link>
              )}
              
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
                <div className="hidden md:flex items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-purple-600/10 border border-purple-500/20"
                  >
                    <div className="relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full opacity-70 blur-sm"></div>
                      <img 
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData.nombre}`}
                        alt="Avatar" 
                        className="relative w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 p-0.5"
                      />
                    </div>
                    <div className="flex flex-col">
                      <Link to="/perfil" className="text-white font-medium hover:text-purple-400 transition-colors text-sm">
                        {userData.nombre}
                      </Link>
                      <span className="text-[10px] text-gray-400">
                        {userData.tipo_usuario.toLowerCase() === 'administrador' ? 'Administrador' : 'Estudiante'}
                      </span>
                    </div>
                  </motion.div>
                  
                  {userData.tipo_usuario === 'admin' && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Link 
                        to="/admin" 
                        className="flex items-center gap-1.5 px-3 py-1.5 text-white rounded-lg transition-all duration-300 bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:shadow-lg hover:shadow-purple-500/20"
                      >
                        <FaUserShield className="text-white" size={14} />
                        <span className="text-sm font-medium">Panel Admin</span>
                      </Link>
                    </motion.div>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-gray-300 hover:text-white hover:bg-purple-500/5 rounded-lg transition-all duration-300 border border-transparent hover:border-purple-500/20"
                  >
                    <FaRegUserCircle className="text-purple-400" size={14} />
                    <span className="text-sm">Salir</span>
                  </motion.button>
                </div>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    onClick={handleLoginClick}
                    className="hidden md:flex items-center gap-1.5 px-4 py-2 text-gray-200 hover:text-white transition-colors duration-300 border border-purple-500/20 rounded-lg hover:bg-purple-500/5"
                  >
                    <FaSignInAlt className="text-purple-400" size={14} />
                    <span>Iniciar Sesión</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.3)" }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="hidden md:block px-5 py-2 text-white rounded-lg font-medium shadow-lg"
                    style={{
                      background: 'linear-gradient(45deg, #7c3aed, #db2777)'
                    }}
                  >
                    <span className="relative inline-block px-1">
                      <span className="relative z-10">Empezar Gratis</span>
                      <div className="absolute inset-0 rounded-full bg-white/20 blur-sm animate-pulse z-0"></div>
                    </span>
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
                        className="flex items-center gap-2 py-3 px-4 text-gray-300 hover:text-white hover:bg-purple-500/10 rounded-lg transition-colors duration-300"
                      >
                        {getIcon(item.name)}
                        <span>{item.name}</span>
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <div className="mt-auto">
                  {!isLoggedIn ? (
                    <div className="space-y-4">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleLoginClick}
                        className="w-full py-3 flex items-center justify-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 border border-purple-500/20 rounded-lg hover:bg-purple-500/10"
                      >
                        <FaSignInAlt className="text-purple-400" />
                        <span>Iniciar Sesión</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full py-3 text-white rounded-lg font-medium shadow-lg relative overflow-hidden group"
                        style={{
                          background: 'linear-gradient(45deg, #7c3aed, #db2777)'
                        }}
                      >
                        <span className="relative z-10">Empezar Gratis</span>
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-pink-600/40 to-purple-600/40 transition-transform duration-700"></div>
                      </motion.button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-600/10 border border-purple-500/20">
                        <div className="relative">
                          <img 
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData.nombre}`} 
                            alt="Avatar" 
                            className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 p-0.5"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-medium text-sm">{userData.nombre}</span>
                          <span className="text-[10px] text-gray-400">
                            {userData.tipo_usuario.toLowerCase() === 'administrador' ? 'Administrador' : 'Estudiante'}
                          </span>
                        </div>
                      </div>
                      <Link to="/perfil" className="w-full py-3 flex items-center justify-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 border border-purple-500/20 rounded-lg hover:bg-purple-500/10">
                        <FaRegUserCircle className="text-purple-400" />
                        <span>Mi Perfil</span>
                      </Link>
                      {userData.tipo_usuario.toLowerCase() === 'administrador' && (
                        <Link 
                          to="/admin" 
                          onClick={() => setMenuOpen(false)}
                          className="w-full py-3 flex items-center justify-center gap-2 text-white transition-all duration-300 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 bg-gradient-to-r from-purple-600 to-pink-600"
                        >
                          <FaUserShield className="text-white" />
                          <span>Panel de Administración</span>
                        </Link>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleLogout}
                        className="w-full py-3 flex items-center justify-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 border border-purple-500/20 rounded-lg hover:bg-purple-500/10"
                      >
                        <FaSignInAlt className="text-purple-400" />
                        <span>Cerrar Sesión</span>
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