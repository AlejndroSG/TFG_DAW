import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaBrain, FaEnvelope, FaArrowUp } from 'react-icons/fa';

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
    { name: "Cursos", url: "/cursos" },
    { name: "Blog", url: "/blog" },
    { name: "Sobre Nosotros", url: "/sobre-nosotros" },
    { name: "Contacto", url: "/contacto" }
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer ref={footerRef} className="bg-gray-900 text-white pt-12 pb-6 relative overflow-hidden">
      {/* Elementos decorativos sutiles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-pink-600/10 rounded-full blur-3xl opacity-30"></div>
      </div>
      
      <div className="max-w-screen-xl mx-auto px-6 relative">
        {/* Botu00f3n de volver arriba */}
        <motion.div 
          className="absolute -top-6 right-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -3, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20"
          >
            <FaArrowUp className="text-white" />
          </motion.button>
        </motion.div>

        <motion.div 
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="flex flex-col md:flex-row gap-6 justify-between"
        >
          {/* Logo y descripciu00f3n */}
          <motion.div className="md:w-1/3 space-y-4" variants={itemVariants}>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 p-0.5 shadow-lg shadow-purple-500/20 flex items-center justify-center">
                <div className="rounded-full bg-gray-900 w-full h-full flex items-center justify-center">
                  <FaBrain className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
                LearnIA
              </h3>
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed pr-4">
              Transformamos la educaciu00f3n con inteligencia artificial avanzada, creando experiencias de aprendizaje personalizadas.
            </p>
            
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <motion.a 
                  key={index}
                  href={link.url}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`text-gray-400 ${link.color} transition-all duration-300`}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Enlaces ru00e1pidos */}
          <motion.div variants={itemVariants} className="md:w-1/3">
            <h4 className="text-lg font-semibold mb-4 text-white">
              Enlaces Ru00e1pidos
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {quickLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.url}
                  className="text-gray-400 hover:text-purple-400 transition-all duration-300 text-sm flex items-center gap-1 group"
                  whileHover={{ x: 3 }}
                >
                  <span className="h-px w-4 bg-purple-500/50 group-hover:w-6 transition-all duration-300"></span>
                  {link.name}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Newsletter simplificado */}
          <motion.div variants={itemVariants} className="md:w-1/3">
            <h4 className="text-lg font-semibold mb-4 text-white">
              Newsletter
            </h4>
            <div className="space-y-3">
              <p className="text-gray-400 text-sm">
                Recibe noticias sobre nuevos cursos y recursos educativos.
              </p>
              <div className="flex items-center">
                <input 
                  type="email" 
                  placeholder="Tu email" 
                  className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-gray-300 text-sm w-full"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-r-lg text-white text-sm shadow-lg shadow-purple-500/20"
                >
                  <FaEnvelope />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Separador con gradiente */}
        <div className="h-px w-full bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 my-6"></div>
        
        {/* Copyright */}
        <motion.div 
          className="text-center text-xs text-gray-500 flex flex-col sm:flex-row justify-between items-center"
          variants={itemVariants}
        >
          <p>&copy; {new Date().getFullYear()} LearnIA. Todos los derechos reservados.</p>
          <div className="flex space-x-5 mt-2 sm:mt-0">
            <a href="/privacidad" className="hover:text-purple-400 transition-colors">Privacidad</a>
            <a href="/terminos" className="hover:text-purple-400 transition-colors">Tu00e9rminos</a>
            <a href="/cookies" className="hover:text-purple-400 transition-colors">Cookies</a>
          </div>
        </motion.div>
      </div>
      
      {/* Lu00ednea decorativa inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 opacity-50"></div>
    </footer>
  );
};

export default Footer;
