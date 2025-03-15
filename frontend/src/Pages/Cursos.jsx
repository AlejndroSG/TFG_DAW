import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaGraduationCap, FaClock, FaChalkboardTeacher, FaBookReader } from 'react-icons/fa';

const Cursos = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerCursos = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost/TFG_DAW/backend/controlador/controlador.php?action=obtenerCursos');
        // Agregamos un delay artificial de 1 segundo
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCursos(response.data);
        setError(null);
      } catch (error) {
        console.error('Error al obtener los cursos:', error);
        setError('No se pudieron cargar los cursos. Por favor, intenta más tarde.');
        setCursos([]);
      } finally {
        setLoading(false);
      }
    };

    obtenerCursos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-purple-600 border-r-pink-600 border-b-purple-600 border-l-pink-600 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-300">Cargando cursos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-35">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Explora Nuestros Cursos
            <div className="h-1 w-24 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mt-4 rounded-full"></div>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto mt-6"
          >
            Descubre nuestra selección de cursos diseñados para impulsar tu carrera en tecnología
          </motion.p>
        </div>

        {error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center text-red-300 max-w-2xl mx-auto"
          >
            {error}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cursos.map((curso, index) => (
              <motion.div
                key={curso.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
              >
                {/* Icono decorativo */}
                <div className="absolute -top-6 right-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <FaBookReader className="w-6 h-6 text-purple-400" />
                  </div>
                </div>

                {/* Contenido del curso */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                    {curso.titulo}
                  </h2>
                  <p className="text-gray-300 leading-relaxed line-clamp-3">
                    {curso.descripcion}
                  </p>
                </div>

                {/* Detalles del curso */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <FaClock className="w-5 h-5 text-purple-400 mr-2" />
                    <span className="text-gray-300">{curso.duracion} horas</span>
                  </div>
                  <div className="flex items-center">
                    <FaChalkboardTeacher className="w-5 h-5 text-pink-400 mr-2" />
                    <span className="text-gray-300">{curso.profesor}</span>
                  </div>
                </div>

                {/* Precio y botón */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-700/50">
                  <div className="text-2xl font-bold text-white">
                    {curso.precio}€
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                  >
                    Inscribirse
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cursos;
