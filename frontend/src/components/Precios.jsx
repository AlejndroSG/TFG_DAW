import React from 'react';
import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';

const planes = [
  {
    nombre: "Plan Básico",
    precio: "29",
    periodo: "mes",
    descripcion: "Perfecto para comenzar tu viaje en IA",
    caracteristicas: [
      "Acceso a cursos fundamentales",
      "Proyectos básicos guiados",
      "Soporte por correo",
      "Certificado de finalización",
      "Acceso a la comunidad"
    ],
    destacado: false,
    color: "from-purple-600 to-purple-400"
  },
  {
    nombre: "Plan Pro",
    precio: "49",
    periodo: "mes",
    descripcion: "Para profesionales que buscan especializarse",
    caracteristicas: [
      "Todos los cursos disponibles",
      "Proyectos avanzados con feedback",
      "Mentoría grupal semanal",
      "Certificaciones profesionales",
      "Acceso prioritario a eventos",
      "Recursos exclusivos"
    ],
    destacado: true,
    color: "from-purple-600 to-pink-600"
  },
  {
    nombre: "Plan Enterprise",
    precio: "99",
    periodo: "mes",
    descripcion: "Solución completa para equipos y empresas",
    caracteristicas: [
      "Acceso ilimitado a todo el contenido",
      "Mentoría individual personalizada",
      "Proyectos empresariales reales",
      "Certificaciones avanzadas",
      "Soporte prioritario 24/7",
      "Capacitación personalizada"
    ],
    destacado: false,
    color: "from-pink-600 to-pink-400"
  }
];

const Precios = () => {
  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight"
          >
            Planes y Precios
            <span className="block text-gradient mt-2">Flexibles</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            Elige el plan que mejor se adapte a tus objetivos y comienza
            tu viaje en el mundo de la Inteligencia Artificial.
          </motion.p>
        </div>

        {/* Grid de planes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {planes.map((plan, index) => (
            <motion.div
              key={plan.nombre}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`relative ${plan.destacado ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              {/* Tarjeta del plan */}
              <div className={`
                h-full bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50
                hover:border-purple-500/50 transition-all duration-300
                ${plan.destacado ? 'border-purple-500/50 shadow-glow' : ''}
              `}>
                {/* Etiqueta de destacado */}
                {plan.destacado && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
                      <span className="text-white text-sm font-semibold">Más Popular</span>
                    </div>
                  </div>
                )}

                {/* Encabezado del plan */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-heading font-bold text-white mb-2 tracking-tight">
                    {plan.nombre}
                  </h3>
                  <p className="text-gray-300 mb-6">
                    {plan.descripcion}
                  </p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-heading font-bold text-white">€{plan.precio}</span>
                    <span className="text-gray-400 ml-2">/{plan.periodo}</span>
                  </div>
                </div>

                {/* Lista de características */}
                <ul className="space-y-4 mb-8">
                  {plan.caracteristicas.map((caracteristica) => (
                    <li key={caracteristica} className="flex items-start">
                      <div className={`
                        flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r ${plan.color}
                        flex items-center justify-center mt-1
                      `}>
                        <FaCheck className="w-3 h-3 text-white" />
                      </div>
                      <span className="ml-3 text-gray-300">{caracteristica}</span>
                    </li>
                  ))}
                </ul>

                {/* Botón de acción */}
                <div className="text-center">
                  <button className={`
                    w-full px-8 py-4 rounded-xl font-heading font-semibold text-white
                    transition-all duration-300
                    ${plan.destacado
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-glow'
                      : 'bg-gray-700 hover:bg-gray-600'
                    }
                  `}>
                    Comenzar Ahora
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Garantía */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400">
            <span className="text-purple-400">✨ 30 días de garantía de devolución</span>
            {" · "}
            <span>Sin compromiso</span>
            {" · "}
            <span>Cancela en cualquier momento</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Precios;
