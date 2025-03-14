import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGraduationCap, FaBook, FaBrain } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
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
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-pink-600/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div 
        className="max-w-screen-xl mx-auto px-4 relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Columna 1: Logo y descripción */}
          <motion.div className="text-center md:text-left space-y-4" variants={itemVariants}>
            <div className="inline-flex items-center gap-2">
              <FaBrain className="text-3xl bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text" />
              <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
                LearnIA
              </h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Transformando la educación a través de la inteligencia artificial, 
              creando experiencias de aprendizaje únicas y personalizadas.
            </p>
            <div className="flex justify-center md:justify-start space-x-4 pt-2">
              <motion.a 
                href="#"
                whileHover={{ scale: 1.1, color: '#E879F9' }}
                className="text-gray-300 text-xl hover:text-purple-400 transition-colors"
              >
                <FaFacebook />
              </motion.a>
              <motion.a 
                href="#"
                whileHover={{ scale: 1.1, color: '#E879F9' }}
                className="text-gray-300 text-xl hover:text-purple-400 transition-colors"
              >
                <FaTwitter />
              </motion.a>
              <motion.a 
                href="#"
                whileHover={{ scale: 1.1, color: '#E879F9' }}
                className="text-gray-300 text-xl hover:text-purple-400 transition-colors"
              >
                <FaInstagram />
              </motion.a>
              <motion.a 
                href="#"
                whileHover={{ scale: 1.1, color: '#E879F9' }}
                className="text-gray-300 text-xl hover:text-purple-400 transition-colors"
              >
                <FaLinkedin />
              </motion.a>
            </div>
          </motion.div>

          {/* Columna 2: Enlaces rápidos */}
          <motion.div className="text-center md:text-left" variants={itemVariants}>
            <h4 className="text-xl font-semibold mb-6 text-gray-100 flex items-center gap-2">
              <FaBook className="text-purple-400" />
              Enlaces Rápidos
            </h4>
            <div className="flex flex-col space-y-3">
              {['Sobre Nosotros', 'Privacidad', 'Términos de Uso', 'Contacto'].map((item, index) => (
                <motion.a
                  key={index}
                  href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                  className="text-gray-300 hover:text-purple-400 transition-all hover:translate-x-1 inline-flex items-center gap-2"
                  whileHover={{ x: 5 }}
                >
                  <span className="h-px w-4 bg-purple-400/50"></span>
                  {item}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Columna 3: Recursos */}
          <motion.div className="text-center md:text-left" variants={itemVariants}>
            <h4 className="text-xl font-semibold mb-6 text-gray-100 flex items-center gap-2">
              <FaGraduationCap className="text-purple-400" />
              Recursos Educativos
            </h4>
            <div className="space-y-4">
              <p className="text-gray-300">
                Descubre nuestros recursos gratuitos y empieza tu viaje en el mundo 
                del aprendizaje con IA.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-shadow"
              >
                Empezar Ahora
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Línea divisoria con gradiente */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>

        {/* Copyright */}
        <motion.div 
          className="text-center text-sm text-gray-400"
          variants={itemVariants}
        >
          <p> {new Date().getFullYear()} LearnIA. Todos los derechos reservados.</p>
        </motion.div>
      </motion.div>
    </footer>
  );
}

export default Footer;