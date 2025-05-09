import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGraduationCap, FaBook, FaBrain, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

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
    { icon: <FaFacebook />, url: "#", color: "hover:text-blue-500" },
    { icon: <FaTwitter />, url: "#", color: "hover:text-sky-500" },
    { icon: <FaInstagram />, url: "#", color: "hover:text-pink-500" },
    { icon: <FaLinkedin />, url: "#", color: "hover:text-blue-600" }
  ];

  const quickLinks = [
    { name: "Cursos", url: "/cursos" },
    { name: "Blog", url: "/blog" },
    { name: "Sobre Nosotros", url: "/sobre-nosotros" },
    { name: "Privacidad", url: "/privacidad" },
    { name: "Términos de Uso", url: "/terminos" },
    { name: "Contacto", url: "/contacto" }
  ];

  const contactInfo = [
    { icon: <FaEnvelope />, text: "info@learnia.com" },
    { icon: <FaPhone />, text: "+34 912 456 789" },
    { icon: <FaMapMarkerAlt />, text: "Madrid, España" }
  ];

  return (
    <footer ref={footerRef} className="bg-gray-900 text-white pt-20 pb-8 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-pink-600/10 rounded-full blur-3xl opacity-40"></div>
      </div>

      {/* Decoración de rejilla */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <motion.div 
        className="max-w-screen-xl mx-auto px-6 relative"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Columna 1: Logo y descripción */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 p-0.5 shadow-lg shadow-purple-500/20">
                <div className="rounded-full bg-gray-900 w-full h-full flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'conic-gradient(from 180deg, rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.3), rgba(168, 85, 247, 0.3))'
                    }}
                  />
                  <FaBrain className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 relative z-10" />
                </div>
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
                LearnIA
              </h3>
            </div>
            
            <p className="text-gray-300 leading-relaxed">
              Transformamos la educación con inteligencia artificial avanzada, creando 
              experiencias de aprendizaje personalizadas y efectivas.
            </p>
            
            <div className="flex space-x-4">
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

          {/* Columna 2: Enlaces rápidos */}
          <motion.div variants={itemVariants} className="md:mx-auto">
            <h4 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                <FaBook className="text-purple-400" />
              </div>
              Enlaces Rápidos
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {quickLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.url}
                  className="text-gray-300 hover:text-purple-400 transition-all duration-300 hover:translate-x-1 flex items-center gap-2 group"
                  whileHover={{ x: 5 }}
                >
                  <span className="h-px w-5 bg-purple-500/50 group-hover:w-8 transition-all duration-300"></span>
                  {link.name}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Columna 3: Contacto */}
          <motion.div variants={itemVariants} className="md:mx-auto">
            <h4 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                <FaPhone className="text-purple-400" />
              </div>
              Contacto
            </h4>
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-purple-400">
                    {info.icon}
                  </div>
                  <span className="text-gray-300">{info.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Columna 4: Newsletter */}
          <motion.div variants={itemVariants}>
            <h4 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                <FaGraduationCap className="text-purple-400" />
              </div>
              Newsletter
            </h4>
            <div className="space-y-4">
              <p className="text-gray-300">
                Suscríbete para recibir recursos educativos gratuitos y noticias sobre nuevos cursos.
              </p>
              <div className="flex flex-col space-y-3">
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="Tu email" 
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-gray-300"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <FaEnvelope className="text-gray-500" />
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-shadow"
                >
                  Suscribirme
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Separador con gradiente */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-700 to-transparent my-8"></div>
        
        {/* Copyright */}
        <motion.div 
          className="text-center text-sm text-gray-400 flex flex-col md:flex-row justify-between items-center"
          variants={itemVariants}
        >
          <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} LearnIA. Todos los derechos reservados.</p>
          <div className="flex space-x-6">
            <a href="/privacidad" className="hover:text-purple-400 transition-colors">Privacidad</a>
            <a href="/terminos" className="hover:text-purple-400 transition-colors">Términos</a>
            <a href="/cookies" className="hover:text-purple-400 transition-colors">Cookies</a>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Decoración de fondo */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 opacity-60"></div>
    </footer>
  );
};

export default Footer;
