import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuoteLeft, FaLinkedin, FaGithub } from 'react-icons/fa';

const Testimonios = () => {
  const [indiceActual, setIndiceActual] = useState(0);

  const testimonios = [
    {
      nombre: "Carlos Rodríguez",
      rol: "Frontend Developer en Google",
      imagen: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
      empresa: "google.svg",
      texto: "Gracias a LearnIA, pasé de no saber nada de programación a conseguir mi primer trabajo como desarrollador en menos de un año. La IA personalizada realmente hace la diferencia.",
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
      enlaces: {
        linkedin: "https://linkedin.com/in/david-garcia",
        github: "https://github.com/david-dev"
      }
    }
  ];

  const siguienteTestimonio = () => {
    setIndiceActual((indiceAnterior) => 
      indiceAnterior === testimonios.length - 1 ? 0 : indiceAnterior + 1
    );
  };

  const testimonioAnterior = () => {
    setIndiceActual((indiceAnterior) => 
      indiceAnterior === 0 ? testimonios.length - 1 : indiceAnterior - 1
    );
  };

  const variantesSlide = {
    entrar: (direccion) => ({
      x: direccion > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    centro: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    salir: (direccion) => ({
      zIndex: 0,
      x: direccion < 0 ? '100%' : '-100%',
      opacity: 0,
      position: 'absolute'
    })
  };

  return (
    <section className="py-20 bg-gray-900 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Historias de Éxito
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Descubre cómo nuestros estudiantes transformaron sus carreras
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto h-[500px] md:h-[300px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={indiceActual}
              custom={indiceActual}
              variants={variantesSlide}
              initial="entrar"
              animate="centro"
              exit="salir"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute inset-0 bg-gray-800 rounded-2xl p-8 md:p-12"
            >
              <div className="flex flex-col md:flex-row items-center gap-8 h-full">
                <div className="w-full md:w-1/3 flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="w-32 h-32 overflow-hidden rounded-full border-4 border-purple-500 bg-purple-100">
                      <img
                        src={testimonios[indiceActual].imagen}
                        alt={testimonios[indiceActual].nombre}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-2"
                    >
                      <FaQuoteLeft className="w-4 h-4 text-white" />
                    </motion.div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-white">
                      {testimonios[indiceActual].nombre}
                    </h3>
                    <p className="text-purple-400 mt-1">
                      {testimonios[indiceActual].rol}
                    </p>
                    <div className="flex justify-center gap-4 mt-4">
                      <a
                        href={testimonios[indiceActual].enlaces.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-purple-500 transition-colors"
                      >
                        <FaLinkedin className="w-5 h-5" />
                      </a>
                      <a
                        href={testimonios[indiceActual].enlaces.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-purple-500 transition-colors"
                      >
                        <FaGithub className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-2/3 flex items-center">
                  <blockquote>
                    <p className="text-gray-300 text-lg leading-relaxed italic">
                      "{testimonios[indiceActual].texto}"
                    </p>
                  </blockquote>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute -bottom-16 left-0 right-0 flex justify-center items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "tween", duration: 0.2 }}
              onClick={testimonioAnterior}
              className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            <div className="flex gap-2">
              {testimonios.map((_, indice) => (
                <button
                  key={indice}
                  onClick={() => setIndiceActual(indice)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    indice === indiceActual 
                      ? 'bg-purple-500' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "tween", duration: 0.2 }}
              onClick={siguienteTestimonio}
              className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonios;
