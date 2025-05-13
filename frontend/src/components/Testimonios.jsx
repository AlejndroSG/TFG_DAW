import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { FaQuoteLeft, FaLinkedin, FaGithub, FaStar } from 'react-icons/fa';

const Testimonios = () => {
  const [indiceActual, setIndiceActual] = useState(0);
  const [direccion, setDireccion] = useState(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10% 0px" });

  const testimonios = [
    {
      nombre: "Carlos Rodríguez",
      rol: "Frontend Developer en Google",
      imagen: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
      empresa: "google.svg",
      texto: "Gracias a LearnIA, pasé de no saber nada de programación a conseguir mi primer trabajo como desarrollador en menos de un año. La IA personalizada realmente hace la diferencia.",
      puntuacion: 5,
      enlaces: {
        linkedin: "https://linkedin.com/in/carlos-rodriguez",
        github: "https://github.com/carlos-dev"
      }
    },
    {
      nombre: "Ana Martínez",
      rol: "Full Stack Developer en Meta",
      imagen: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
      empresa: "meta.svg",
      texto: "La mentoría en vivo fue clave para mi desarrollo. Los expertos no solo resuelven dudas, sino que te guían hacia las mejores prácticas de la industria.",
      puntuacion: 5,
      enlaces: {
        linkedin: "https://linkedin.com/in/ana-martinez",
        github: "https://github.com/ana-dev"
      }
    },
    {
      nombre: "David García",
      rol: "Backend Developer en Amazon",
      imagen: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      empresa: "amazon.svg",
      texto: "Los proyectos prácticos son muy realistas. Cuando llegué a mi primera entrevista, ya tenía experiencia con las tecnologías que usaban en producción.",
      puntuacion: 4,
      enlaces: {
        linkedin: "https://linkedin.com/in/david-garcia",
        github: "https://github.com/david-dev"
      }
    }
  ];

  const siguienteTestimonio = () => {
    setDireccion(1);
    setIndiceActual((indiceAnterior) => 
      indiceAnterior === testimonios.length - 1 ? 0 : indiceAnterior + 1
    );
  };

  const testimonioAnterior = () => {
    setDireccion(-1);
    setIndiceActual((indiceAnterior) => 
      indiceAnterior === 0 ? testimonios.length - 1 : indiceAnterior - 1
    );
  };

  const variantesSlide = {
    entrar: (direccion) => ({
      x: direccion > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9
    }),
    centro: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    salir: (direccion) => ({
      zIndex: 0,
      x: direccion < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9,
      position: 'absolute'
    })
  };

  return (
    <section ref={sectionRef} className="py-24 bg-gray-900 overflow-hidden relative">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-[10%] w-72 h-72 bg-purple-600/10 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-10 left-[5%] w-80 h-80 bg-pink-600/10 rounded-full blur-3xl opacity-60"></div>
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
              Testimonios Reales
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Historias de </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Éxito</span>
          </h2>
          
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Descubre cómo nuestros estudiantes transformaron sus carreras con nuestra plataforma
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative max-w-5xl mx-auto min-h-[480px] sm:min-h-[420px] md:min-h-[340px] lg:min-h-[360px]"
        >
          {/* Decoración de fondo para las tarjetas */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-60 bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-purple-600/5 blur-2xl rounded-full"></div>

          <AnimatePresence initial={false} custom={direccion}>
            <motion.div
              key={indiceActual}
              custom={direccion}
              variants={variantesSlide}
              initial="entrar"
              animate="centro"
              exit="salir"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 }
              }}
              className="absolute inset-0 backdrop-blur-sm"
            >
              <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50 rounded-2xl p-5 sm:p-8 md:p-10 h-full shadow-xl shadow-purple-900/10">
                <div className="flex flex-col md:flex-row items-center gap-5 sm:gap-8 md:gap-10 h-full">
                  <div className="w-full md:w-2/5 flex flex-col items-center">
                    <div className="relative mb-4 sm:mb-6">
                      {/* Círculo giratorio de gradiente */}
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-2 rounded-full"
                        style={{
                          background: 'conic-gradient(from 0deg, rgba(168, 85, 247, 0.4), rgba(236, 72, 153, 0.4), rgba(168, 85, 247, 0.4))'
                        }}
                      />
                      
                      <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 overflow-hidden rounded-full border-4 border-gray-800 relative z-10 p-1 bg-gray-800">
                        <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-purple-200 to-pink-200">
                          <img
                            src={testimonios[indiceActual].imagen}
                            alt={testimonios[indiceActual].nombre}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="absolute -bottom-2 -right-2 z-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-3 shadow-lg"
                      >
                        <FaQuoteLeft className="w-4 h-4 text-white" />
                      </motion.div>
                    </div>
                    
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {testimonios[indiceActual].nombre}
                      </h3>
                      <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 font-medium mb-3">
                        {testimonios[indiceActual].rol}
                      </p>
                      
                      {/* Estrellas de valoración */}
                      <div className="flex justify-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={i < testimonios[indiceActual].puntuacion 
                              ? "text-yellow-400" 
                              : "text-gray-600"} 
                            size={18} 
                          />
                        ))}
                      </div>
                      
                      <div className="flex justify-center gap-4 mt-4">
                        <motion.a
                          whileHover={{ y: -3, scale: 1.1 }}
                          href={testimonios[indiceActual].enlaces.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-purple-400 transition-colors p-2 bg-gray-800/80 rounded-full"
                        >
                          <FaLinkedin className="w-5 h-5" />
                        </motion.a>
                        <motion.a
                          whileHover={{ y: -3, scale: 1.1 }}
                          href={testimonios[indiceActual].enlaces.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-pink-400 transition-colors p-2 bg-gray-800/80 rounded-full"
                        >
                          <FaGithub className="w-5 h-5" />
                        </motion.a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-3/5 flex items-center mt-2 md:mt-0">
                    <blockquote className="relative">
                      <div className="absolute -left-6 top-0 opacity-10 text-6xl text-purple-400">
                        <FaQuoteLeft />
                      </div>
                      <p className="text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed italic relative z-10">
                        "{testimonios[indiceActual].texto}"
                      </p>
                    </blockquote>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute -bottom-16 sm:-bottom-14 left-0 right-0 flex justify-center items-center gap-4 sm:gap-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={testimonioAnterior}
              className="p-3 sm:p-4 rounded-full bg-gray-800/80 hover:bg-purple-500/30 text-white border border-purple-500/30 shadow-lg shadow-purple-500/10 backdrop-blur-sm transition-colors duration-200"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            <div className="flex gap-3">
              {testimonios.map((_, indice) => (
                <button
                  key={indice}
                  onClick={() => {
                    setDireccion(indice > indiceActual ? 1 : -1);
                    setIndiceActual(indice);
                  }}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    indice === indiceActual 
                      ? 'w-6 sm:w-10 bg-gradient-to-r from-purple-500 to-pink-500' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={siguienteTestimonio}
              className="p-3 sm:p-4 rounded-full bg-gray-800/80 hover:bg-purple-500/30 text-white border border-purple-500/30 shadow-lg shadow-purple-500/10 backdrop-blur-sm transition-colors duration-200"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonios;
