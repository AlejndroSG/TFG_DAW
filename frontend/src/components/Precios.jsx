import React from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes } from 'react-icons/fa';

const Precios = () => {
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
      color: "from-blue-500 to-cyan-400",
      popular: false
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
      popular: true
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
      color: "from-orange-500 to-red-500",
      popular: false
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
    oculto: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Planes y Precios
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tus objetivos
          </p>
        </motion.div>

        <motion.div
          variants={contenedorVariantes}
          initial="oculto"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {planes.map((plan, indice) => (
            <motion.div
              key={indice}
              variants={elementoVariantes}
              className={`relative bg-gray-800 rounded-2xl p-8 ${
                plan.popular ? 'ring-2 ring-purple-500 transform lg:-translate-y-4' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Más Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.nombre}
                </h3>
                <p className="text-gray-400 mb-6">
                  {plan.descripcion}
                </p>
                <div className="flex items-baseline justify-center">
                  <span className={`text-5xl font-bold text-white`}>
                    {plan.precio}€
                  </span>
                  <span className="text-gray-400 ml-2">/mes</span>
                </div>
              </div>

              <div className="space-y-4">
                {plan.caracteristicas.map((caracteristica, i) => (
                  <div key={i} className="flex items-center text-gray-300">
                    <FaCheck className="w-5 h-5 text-green-500 mr-3" />
                    <span>{caracteristica}</span>
                  </div>
                ))}
                {plan.noIncluido.map((caracteristica, i) => (
                  <div key={i} className="flex items-center text-gray-500">
                    <FaTimes className="w-5 h-5 text-red-500 mr-3" />
                    <span>{caracteristica}</span>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "tween", duration: 0.2 }}
                className={`w-full mt-8 py-4 px-8 rounded-xl font-semibold text-white bg-gradient-to-r ${
                  plan.color
                } hover:opacity-90 transition-opacity duration-300 shadow-lg`}
              >
                {plan.popular ? 'Comenzar Ahora' : 'Seleccionar Plan'}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 text-lg mb-6">
            ¿Necesitas un plan personalizado para tu empresa?
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "tween", duration: 0.2 }}
            className="px-8 py-3 bg-gray-800 text-white rounded-full font-semibold hover:bg-gray-700 transition-colors duration-300"
          >
            Contacta con Nosotros
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Precios;
