import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaCheck, FaTimes, FaGem, FaRocket, FaBuilding } from 'react-icons/fa';

const Precios = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10% 0px" });

  const planes = [
    {
      nombre: "Plan Básico",
      precio: "0",
      descripcion: "Perfecto para comenzar tu viaje en la programación",
      caracteristicas: [
        "Acceso a cursos básicos",
        "Proyectos guiados",
        "Comunidad de estudiantes",
        "Certificados básicos",
        "Soporte por email"
      ],
      noIncluido: [
        "Mentoría personalizada",
        "Proyectos avanzados",
        "Certificados premium",
        "Acceso prioritario"
      ],
      color: "from-purple-400 to-purple-600",
      popular: false,
      icono: <FaRocket />,
      delay: 0.1
    },
    {
      nombre: "Plan Pro",
      precio: "29.99",
      descripcion: "La mejor opción para desarrolladores serios",
      caracteristicas: [
        "Todo del Plan Básico",
        "Mentoría personalizada",
        "Proyectos avanzados",
        "Certificados premium",
        "Acceso prioritario",
        "Soporte 24/7",
        "Recursos exclusivos",
        "Comunidad premium"
      ],
      noIncluido: [],
      color: "from-purple-600 to-pink-600",
      popular: true,
      icono: <FaGem />,
      delay: 0.3
    },
    {
      nombre: "Plan Enterprise",
      precio: "99.99",
      descripcion: "Solución completa para equipos y empresas",
      caracteristicas: [
        "Todo del Plan Pro",
        "Formación para equipos",
        "Panel de administración",
        "API personalizada",
        "Soporte dedicado",
        "Implementación guiada",
        "Análisis de progreso",
        "Personalización total"
      ],
      noIncluido: [],
      color: "from-pink-600 to-purple-400",
      popular: false,
      icono: <FaBuilding />,
      delay: 0.5
    }
  ];

  const contenedorVariantes = {
    oculto: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const elementoVariantes = {
    oculto: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12
      }
    }
  };

  return (
    <section ref={sectionRef} className="py-24 bg-gray-900 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 left-1/3 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-20 right-1/4 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl opacity-60"></div>
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
              Precios Flexibles
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Planes </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">a tu Medida</span>
          </h2>
          
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Elige el plan que mejor se adapte a tus objetivos y comienza a transformar tu futuro hoy
          </p>
        </motion.div>

        <motion.div
          variants={contenedorVariantes}
          initial="oculto"
          animate={isInView ? "visible" : "oculto"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {planes.map((plan, indice) => (
            <motion.div
              key={indice}
              variants={elementoVariantes}
              custom={indice}
              className={`relative ${plan.popular ? 'z-10' : 'z-0'}`}
            >
              <div 
                className={`relative h-full bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 
                ${plan.popular ? 'shadow-xl shadow-purple-500/20 ring-2 ring-purple-500 transform lg:-translate-y-4' : 'shadow-lg'}`}
              >
                {/* Efectos de fondo decorativos */}
                <div className="absolute right-0 top-0 -mr-10 -mt-10 w-40 h-40 bg-gradient-to-tr from-purple-600/10 via-purple-400/5 to-pink-600/10 rounded-full blur-3xl opacity-70"></div>

                {/* Badge de plan popular */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-1.5 rounded-full text-sm font-medium shadow-lg">
                      Más Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8 relative">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${plan.color} p-0.5 flex items-center justify-center`}>
                    <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
                      >
                        {plan.icono}
                      </motion.div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.nombre}
                  </h3>
                  <p className="text-gray-400 mb-6 min-h-[48px]">
                    {plan.descripcion}
                  </p>

                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                      {plan.precio}€
                    </span>
                    <span className="text-gray-400 ml-2">/mes</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.caracteristicas.map((caracteristica, i) => (
                    <div key={i} className="flex items-center text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-3 flex-shrink-0">
                        <FaCheck className="w-3 h-3 text-white" />
                      </div>
                      <span>{caracteristica}</span>
                    </div>
                  ))}
                  {plan.noIncluido.map((caracteristica, i) => (
                    <div key={i} className="flex items-center text-gray-500">
                      <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center mr-3 flex-shrink-0">
                        <FaTimes className="w-3 h-3 text-gray-500" />
                      </div>
                      <span>{caracteristica}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.4)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 px-8 rounded-xl font-semibold text-white mt-auto 
                  ${plan.popular 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-600/25' 
                    : 'bg-gradient-to-r from-gray-700 to-gray-800 border border-purple-500/30 hover:border-purple-500/50'}`}
                >
                  {plan.popular ? 'Comenzar Ahora' : 'Seleccionar Plan'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl backdrop-blur-sm border border-gray-700/50 shadow-lg">
            <h3 className="text-xl text-white font-semibold mb-3">
              ¿Necesitas un plan personalizado para tu empresa?
            </h3>
            <p className="text-gray-400 mb-6">
              Contacta con nuestro equipo para crear una solución adaptada a las necesidades específicas de tu organización
            </p>
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-full font-semibold border border-purple-500/30 hover:border-purple-500/50 transition-colors duration-300 shadow-lg"
            >
              Contacta con Nosotros
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Precios;
