import React from 'react';
import { motion } from 'framer-motion';
import { FaRobot, FaCode, FaBrain, FaChartLine, FaUsers, FaShieldAlt } from 'react-icons/fa';

const Caracteristicas = () => {
  const caracteristicas = [
    {
      icono: <FaRobot className="w-8 h-8" />,
      titulo: "IA Personalizada",
      descripcion: "Algoritmos adaptativos que ajustan el contenido según tu nivel y estilo único de aprendizaje",
      color: "from-purple-500 to-pink-600"
    },
    {
      icono: <FaCode className="w-8 h-8" />,
      titulo: "Proyectos Reales",
      descripcion: "Desarrolla aplicaciones del mundo real con tecnologías de vanguardia y asistencia IA",
      color: "from-purple-600 to-pink-500"
    },
    {
      icono: <FaBrain className="w-8 h-8" />,
      titulo: "Aprendizaje Activo",
      descripcion: "Metodología práctica con feedback personalizado y correcciones en tiempo real",
      color: "from-purple-500 to-pink-600"
    },
    {
      icono: <FaChartLine className="w-8 h-8" />,
      titulo: "Análisis Avanzado",
      descripcion: "Seguimiento detallado con métricas personalizadas y predicciones de progreso por IA",
      color: "from-pink-600 to-purple-500"
    },
    {
      icono: <FaUsers className="w-8 h-8" />,
      titulo: "Comunidad Exclusiva",
      descripcion: "Conecta con una red global de desarrolladores y participa en desafíos colaborativos",
      color: "from-purple-500 to-pink-600"
    },
    {
      icono: <FaShieldAlt className="w-8 h-8" />,
      titulo: "Certificación Validada",
      descripcion: "Obtén credenciales reconocidas internacionalmente respaldadas por empresas líderes",
      color: "from-pink-600 to-purple-500"
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
    <section id="caracteristicas" className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-50 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600/20 rounded-full filter blur-[100px] animate-pulse"></div>
        <div className="absolute top-1/2 -right-20 w-60 h-60 bg-pink-600/20 rounded-full filter blur-[80px] animate-pulse delay-1000"></div>
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-indigo-600/20 rounded-full filter blur-[100px] animate-pulse delay-700"></div>
        <div className="absolute left-0 top-0 w-full h-full bg-grid-pattern opacity-5"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1 mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full backdrop-blur-sm border border-purple-500/20"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 font-medium">Revoluciona tu aprendizaje</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Características Principales
            </span>
          </h2>
          
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Descubre cómo nuestra plataforma redefine el aprendizaje con tecnología de vanguardia e IA personalizada
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
              className="relative overflow-hidden backdrop-blur-sm rounded-2xl shadow-xl"
            >
              {/* Fondo elegante */}
              <div className="absolute inset-0 bg-gradient-to-b from-purple-800/10 to-gray-900/90"></div>
              
              {/* Borde superior con gradiente */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              
              <div className="relative p-6 z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/80 to-pink-500/80 flex items-center justify-center shadow-lg">
                    {caracteristica.icono}
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {caracteristica.titulo}
                  </h3>
                </div>
                
                <div className="p-4 rounded-xl bg-purple-900/10 border border-purple-500/5">
                  <p className="text-gray-300 leading-relaxed">
                    {caracteristica.descripcion}
                  </p>
                </div>
                
                {/* Línea decorativa de separación */}
                <div className="mt-6 h-px w-full bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Caracteristicas;
