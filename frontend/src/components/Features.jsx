import React from 'react';
import { motion } from 'framer-motion';
import { FaRobot, FaCode, FaBrain, FaChartLine, FaUsers, FaShieldAlt } from 'react-icons/fa';

const Features = () => {
  const features = [
    {
      icon: <FaRobot className="w-8 h-8" />,
      title: "IA Personalizada",
      description: "Algoritmos adaptativos que ajustan el contenido según tu nivel y estilo de aprendizaje",
      color: "from-blue-500 to-cyan-400"
    },
    {
      icon: <FaCode className="w-8 h-8" />,
      title: "Proyectos Reales",
      description: "Desarrolla aplicaciones del mundo real usando las últimas tecnologías",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <FaBrain className="w-8 h-8" />,
      title: "Aprendizaje Activo",
      description: "Metodología práctica con feedback instantáneo y corrección de código en tiempo real",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <FaChartLine className="w-8 h-8" />,
      title: "Análisis de Progreso",
      description: "Seguimiento detallado de tu evolución con métricas personalizadas",
      color: "from-green-500 to-emerald-400"
    },
    {
      icon: <FaUsers className="w-8 h-8" />,
      title: "Comunidad Activa",
      description: "Conecta con otros desarrolladores y participa en proyectos colaborativos",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "Certificación Validada",
      description: "Obtén certificados respaldados por empresas tecnológicas líderes",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="features" className="py-20 bg-gray-900">
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
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative bg-gray-800 rounded-2xl p-8 hover:bg-gray-800/80 transition-colors duration-300"
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} p-4 mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-400">
                {feature.description}
              </p>
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
