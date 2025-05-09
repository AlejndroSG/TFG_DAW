import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaRobot, FaLaptopCode, FaUserFriends, FaCertificate } from 'react-icons/fa';

const ComoFunciona = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10% 0px" });
  
  const pasos = [
    {
      icono: <FaRobot className="w-12 h-12" />,
      titulo: "Evaluación IA",
      descripcion: "Nuestra IA analiza tu nivel y objetivos para crear un plan personalizado",
      color: "from-purple-400 to-purple-600",
      delay: 0.1
    },
    {
      icono: <FaLaptopCode className="w-12 h-12" />,
      titulo: "Aprendizaje Práctico",
      descripcion: "Desarrolla proyectos reales con tecnologías actuales del mercado",
      color: "from-purple-500 to-pink-500",
      delay: 0.3
    },
    {
      icono: <FaUserFriends className="w-12 h-12" />,
      titulo: "Mentoría en Vivo",
      descripcion: "Recibe apoyo personalizado de expertos en la industria",
      color: "from-pink-500 to-pink-600",
      delay: 0.5
    },
    {
      icono: <FaCertificate className="w-12 h-12" />,
      titulo: "Certificación",
      descripcion: "Obtén certificados validados por empresas tecnológicas",
      color: "from-pink-600 to-purple-400",
      delay: 0.7
    }
  ];

  const contenedorVariantes = {
    oculto: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariantes = {
    oculto: { opacity: 0, y: 30 },
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

  return (
    <section ref={sectionRef} className="py-24 bg-gray-900 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl opacity-70"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <div className="inline-block px-4 py-1 mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full backdrop-blur-sm border border-purple-500/20">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 font-medium">
              Proceso Inteligente
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">¿Cómo </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Funciona</span>
            <span className="text-white">?</span>
          </h2>
          
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Un proceso innovador y efectivo para transformar tu carrera en el mundo tecnológico
          </p>
        </motion.div>

        <motion.div
          variants={contenedorVariantes}
          initial="oculto"
          animate={isInView ? "visible" : "oculto"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative"
        >
          {/* Conector entre tarjetas */}
          <div className="absolute top-24 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30 hidden lg:block"></div>
          
          {pasos.map((paso, indice) => (
            <motion.div
              key={indice}
              custom={indice}
              variants={itemVariantes}
              className="relative z-10"
            >
              <div className="bg-gray-800 rounded-2xl p-8 h-full border border-gray-700/50 backdrop-blur-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1">
                {/* Número de paso */}
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center text-lg font-bold text-white">
                  {indice + 1}
                </div>
                
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.4, delay: paso.delay }}
                  className={`w-24 h-24 rounded-full bg-gradient-to-r ${paso.color} flex items-center justify-center mb-8 mx-auto p-0.5 shadow-lg shadow-purple-500/20`}
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 3, repeatDelay: 1 }}
                      className="text-3xl"
                      style={{ color: 'white' }}
                    >
                      {paso.icono}
                    </motion.div>
                  </div>
                </motion.div>
                
                <h3 className="text-xl font-bold text-white mb-4 text-center">
                  {paso.titulo}
                </h3>
                
                <p className="text-gray-300 text-center">
                  {paso.descripcion}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="text-center mt-20"
        >
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Nuestra metodología exclusiva ha sido diseñada para maximizar tu aprendizaje y llevarte al éxito profesional en el menor tiempo posible.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(139, 92, 246, 0.25)" }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow-xl shadow-purple-500/20 flex items-center gap-2 mx-auto"
          >
            <span>Comienza Tu Viaje</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ComoFunciona;
