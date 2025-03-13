import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuoteLeft, FaLinkedin, FaGithub } from 'react-icons/fa';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Carlos Rodríguez",
      role: "Frontend Developer en Google",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
      company: "google.svg",
      text: "Gracias a LearnIA, pasé de no saber nada de programación a conseguir mi primer trabajo como desarrollador en menos de un año. La IA personalizada realmente hace la diferencia.",
      links: {
        linkedin: "https://linkedin.com/in/carlos-rodriguez",
        github: "https://github.com/carlos-dev"
      }
    },
    {
      name: "Ana Martínez",
      role: "Full Stack Developer en Meta",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
      company: "meta.svg",
      text: "La mentoría en vivo fue clave para mi desarrollo. Los expertos no solo resuelven dudas, sino que te guían hacia las mejores prácticas de la industria.",
      links: {
        linkedin: "https://linkedin.com/in/ana-martinez",
        github: "https://github.com/ana-dev"
      }
    },
    {
      name: "David García",
      role: "Backend Developer en Amazon",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      company: "amazon.svg",
      text: "Los proyectos prácticos son muy realistas. Cuando llegué a mi primera entrevista, ya tenía experiencia con las tecnologías que usaban en producción.",
      links: {
        linkedin: "https://linkedin.com/in/david-garcia",
        github: "https://github.com/david-dev"
      }
    }
  ];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
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
              key={currentIndex}
              custom={currentIndex}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
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
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].name}
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
                      {testimonials[currentIndex].name}
                    </h3>
                    <p className="text-purple-400 mt-1">
                      {testimonials[currentIndex].role}
                    </p>
                    <div className="flex justify-center gap-4 mt-4">
                      <a
                        href={testimonials[currentIndex].links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-purple-500 transition-colors"
                      >
                        <FaLinkedin className="w-5 h-5" />
                      </a>
                      <a
                        href={testimonials[currentIndex].links.github}
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
                      "{testimonials[currentIndex].text}"
                    </p>
                  </blockquote>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute -bottom-16 left-0 right-0 flex justify-center items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrev}
              className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === currentIndex 
                      ? 'bg-purple-500' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
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

export default Testimonials;
