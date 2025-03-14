import React from 'react';
import { motion } from 'framer-motion';
import { FaRobot, FaLaptopCode, FaUserFriends, FaCertificate } from 'react-icons/fa';

const ComoFunciona = () => {
  const pasos = [
    {
      icono: <FaRobot className="w-12 h-12" />,
      titulo: "Evaluación IA",
      descripcion: "Nuestra IA analiza tu nivel y objetivos para crear un plan personalizado",
      color: "from-blue-500 to-cyan-400"
    },
    {
      icono: <FaLaptopCode className="w-12 h-12" />,
      titulo: "Aprendizaje Práctico",
      descripcion: "Desarrolla proyectos reales con tecnologías actuales del mercado",
      color: "from-purple-500 to-pink-500"
    },
    {
      icono: <FaUserFriends className="w-12 h-12" />,
      titulo: "Mentoría en Vivo",
      descripcion: "Recibe apoyo personalizado de expertos en la industria",
      color: "from-orange-500 to-red-500"
    },
    {
      icono: <FaCertificate className="w-12 h-12" />,
      titulo: "Certificación",
      descripcion: "Obtén certificados validados por empresas tecnológicas",
      color: "from-green-500 to-emerald-400"
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
    oculto: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "tween",
        duration: 0.3
      }
    }
  };

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ type: "tween", duration: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            ¿Cómo Funciona?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Un proceso simple y efectivo para convertirte en desarrollador profesional
          </p>
        </motion.div>

        <motion.div
          variants={contenedorVariantes}
          initial="oculto"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {pasos.map((paso, indice) => (
            <motion.div
              key={indice}
              variants={itemVariantes}
              className="relative"
            >
              <div className="bg-gray-800 rounded-xl p-6 h-full">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${paso.color} flex items-center justify-center mb-6 mx-auto`}>
                  {paso.icono}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 text-center">
                  {paso.titulo}
                </h3>
                <p className="text-gray-400 text-center">
                  {paso.descripcion}
                </p>
              </div>
              
              {indice < pasos.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-transparent" />
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ type: "tween", duration: 0.4, delay: 0.2 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 text-lg mb-6">
            ¿Listo para comenzar tu viaje en el desarrollo de software?
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "tween", duration: 0.2 }}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors duration-300 shadow-lg hover:shadow-purple-500/25"
          >
            Comienza Ahora
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ComoFunciona;
