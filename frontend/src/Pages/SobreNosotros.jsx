import React from 'react';
import { motion } from 'framer-motion';
import { FaLightbulb, FaUsers, FaStar, FaRocket } from 'react-icons/fa';

const SobreNosotros = () => {
  const valores = [
    {
      icono: <FaLightbulb className="w-8 h-8" />,
      titulo: "Innovación",
      descripcion: "Constantemente buscamos nuevas formas de mejorar la experiencia de aprendizaje"
    },
    {
      icono: <FaUsers className="w-8 h-8" />,
      titulo: "Comunidad",
      descripcion: "Creemos en el poder del aprendizaje colaborativo y el apoyo mutuo"
    },
    {
      icono: <FaStar className="w-8 h-8" />,
      titulo: "Excelencia",
      descripcion: "Nos comprometemos a ofrecer la más alta calidad en educación tecnológica"
    },
    {
      icono: <FaRocket className="w-8 h-8" />,
      titulo: "Crecimiento",
      descripcion: "Impulsamos el desarrollo profesional y personal de cada estudiante"
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
    <div className="min-h-screen bg-gray-900 py-35">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-white mb-6">
            Sobre Nosotros
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-600 mx-auto mb-8"></div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Somos una plataforma educativa comprometida con transformar la manera en que las personas aprenden programación
          </p>
        </motion.div>

        {/* Nuestra Historia */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-800 rounded-2xl p-8 mb-16 max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Nuestra Historia</h2>
          <p className="text-gray-400 leading-relaxed">
            Nacimos con la visión de democratizar la educación en tecnología, haciendo el aprendizaje de la programación 
            más accesible, interactivo y efectivo. Desde nuestro inicio, nos hemos dedicado a crear una plataforma que 
            combine la última tecnología con métodos de enseñanza innovadores.
          </p>
        </motion.div>

        {/* Nuestros Valores */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-12">Nuestros Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valores.map((valor, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gray-800 rounded-xl p-6 text-center hover:bg-gray-800/80 transition-colors duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-400 to-pink-600 rounded-lg p-4 transform hover:scale-110 transition-transform duration-300">
                  {valor.icono}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{valor.titulo}</h3>
                <p className="text-gray-400">{valor.descripcion}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Llamada a la acción */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-6">¿Listo para empezar?</h2>
          <p className="text-gray-400 mb-8">
            Únete a nuestra comunidad y comienza tu viaje en el mundo de la programación
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-purple-400 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300">
            Empieza Ahora
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default SobreNosotros;
