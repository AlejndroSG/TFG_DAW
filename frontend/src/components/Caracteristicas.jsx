import React from 'react';
import { motion } from 'framer-motion';
import { FaRobot, FaCode, FaBrain, FaChartLine, FaUsers, FaShieldAlt } from 'react-icons/fa';

const Caracteristicas = () => {
  const caracteristicas = [
    {
      icono: <FaRobot className="w-8 h-8" />,
      titulo: "IA Personalizada",
      descripcion: "Algoritmos adaptativos que ajustan el contenido según tu nivel y estilo de aprendizaje",
      color: "from-blue-500 to-cyan-400"
    },
    {
      icono: <FaCode className="w-8 h-8" />,
      titulo: "Proyectos Reales",
      descripcion: "Desarrolla aplicaciones del mundo real usando las últimas tecnologías",
      color: "from-purple-500 to-pink-500"
    },
    {
      icono: <FaBrain className="w-8 h-8" />,
      titulo: "Aprendizaje Activo",
      descripcion: "Metodología práctica con feedback instantáneo y corrección de código en tiempo real",
      color: "from-orange-500 to-red-500"
    },
    {
      icono: <FaChartLine className="w-8 h-8" />,
      titulo: "Análisis de Progreso",
      descripcion: "Seguimiento detallado de tu evolución con métricas personalizadas",
      color: "from-green-500 to-emerald-400"
    },
    {
      icono: <FaUsers className="w-8 h-8" />,
      titulo: "Comunidad Activa",
      descripcion: "Conecta con otros desarrolladores y participa en proyectos colaborativos",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icono: <FaShieldAlt className="w-8 h-8" />,
      titulo: "Certificación Validada",
      descripcion: "Obtén certificados respaldados por empresas tecnológicas líderes",
      color: "from-indigo-500 to-purple-500"
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

  const itemVariantes = {
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
    <section id="caracteristicas" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Características Principales
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Descubre por qué nuestra plataforma es única para aprender programación
          </p>
        </motion.div>

        <motion.div
          variants={contenedorVariantes}
          initial="oculto"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {caracteristicas.map((caracteristica, indice) => (
            <motion.div
              key={indice}
              variants={itemVariantes}
              className="group relative bg-gray-800 rounded-2xl p-8 hover:bg-gray-800/80 transition-colors duration-300"
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${caracteristica.color} p-4 mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                {caracteristica.icono}
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                {caracteristica.titulo}
              </h3>
              <p className="text-gray-400">
                {caracteristica.descripcion}
              </p>
              <div className={`absolute inset-0 bg-gradient-to-r ${caracteristica.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Caracteristicas;
