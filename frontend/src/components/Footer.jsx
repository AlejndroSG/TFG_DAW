import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaBrain, FaEnvelope, FaArrowUp, FaCode, FaLaptopCode, FaBookOpen } from 'react-icons/fa';

const Footer = () => {
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, margin: "-10% 0px" });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const socialLinks = [
    { icon: <FaFacebook />, url: "#", color: "hover:text-purple-400" },
    { icon: <FaTwitter />, url: "#", color: "hover:text-purple-400" },
    { icon: <FaInstagram />, url: "#", color: "hover:text-purple-400" },
    { icon: <FaLinkedin />, url: "#", color: "hover:text-purple-400" }
  ];

  const quickLinks = [
    { name: "Cursos", url: "/cursos", icon: <FaBookOpen /> },
    { name: "Blog", url: "/blog", icon: <FaCode /> },
    { name: "Sobre Nosotros", url: "/sobre-nosotros", icon: <FaLaptopCode /> },
    { name: "Contacto", url: "/contacto", icon: <FaEnvelope /> }
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer ref={footerRef} className="bg-gray-900 text-white pt-16 pb-8 relative overflow-hidden">
      {/* Elementos decorativos sutiles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl opacity-20"></div>
      </div>
      
      <div className="max-w-screen-xl mx-auto px-6 relative">
        {/* Botón de volver arriba */}
        <motion.div 
          className="absolute -top-8 right-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -4, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/40 transition-shadow duration-300"
          >
            <FaArrowUp className="text-white text-lg" />
          </motion.button>
        </motion.div>

        <motion.div 
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="flex flex-col md:flex-row gap-10 justify-between mb-10"
        >
          {/* Logo y descripción */}
          <motion.div className="md:w-1/3 space-y-6" variants={itemVariants}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 p-0.5 shadow-lg shadow-purple-500/20 flex items-center justify-center">
                <div className="rounded-full bg-gray-900 w-full h-full flex items-center justify-center">
                  <FaBrain className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
                LearnIA
              </h3>
            </div>
            
            <p className="text-gray-300 text-base leading-relaxed pr-4">
              Transformamos la educación con inteligencia artificial avanzada, creando experiencias de aprendizaje personalizadas para cada estudiante.
            </p>
            
            <div className="flex space-x-5">
              {socialLinks.map((link, index) => (
                <motion.a 
                  key={index}
                  href={link.url}
                  whileHover={{ scale: 1.2, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className={`text-gray-400 text-xl ${link.color} transition-all duration-300`}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Enlaces rápidos */}
          <motion.div variants={itemVariants} className="md:w-1/3">
            <h4 className="text-xl font-semibold mb-6 text-white">
              Enlaces Rápidos
            </h4>
            <div className="grid grid-cols-2 gap-5">
              {quickLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.url}
                  className="text-gray-300 hover:text-purple-400 transition-all duration-300 flex items-center gap-3 group"
                  whileHover={{ x: 5 }}
                >
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-colors">
                    <span className="text-purple-400">{link.icon}</span>
                  </div>
                  <span>{link.name}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants} className="md:w-1/3">
            <h4 className="text-xl font-semibold mb-6 text-white">
              Newsletter
            </h4>
            <div className="space-y-5 bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-5 rounded-xl backdrop-blur-sm border border-purple-500/10">
              <p className="text-gray-300">
                Recibe noticias sobre nuevos cursos y recursos educativos.
              </p>
              <div className="flex items-center">
                <input 
                  type="email" 
                  placeholder="Tu email" 
                  className="px-4 py-3 bg-gray-800/70 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-gray-200 w-full"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-r-lg text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-shadow"
                >
                  <FaEnvelope className="text-lg" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Separador con gradiente */}
        <div className="h-px w-full bg-gradient-to-r from-purple-600/30 via-pink-600/40 to-purple-600/30 my-8"></div>
        
        {/* Copyright */}
        <motion.div 
          className="text-center text-sm text-gray-400 flex flex-col sm:flex-row justify-between items-center"
          variants={itemVariants}
        >
          <p>&copy; {new Date().getFullYear()} LearnIA. Todos los derechos reservados.</p>
          <div className="flex space-x-6 mt-3 sm:mt-0">
            <a href="/privacidad" className="hover:text-purple-400 transition-colors">Privacidad</a>
            <a href="/terminos" className="hover:text-purple-400 transition-colors">Términos</a>
            <a href="/cookies" className="hover:text-purple-400 transition-colors">Cookies</a>
          </div>
        </motion.div>
      </div>
      
      {/* Línea decorativa inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 opacity-70"></div>
    </footer>
  );
};

export default Footer;
