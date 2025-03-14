import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Cursos = () => {

  let [cursos, setCursos] = useState([]);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await axios.get('http://localhost/TFG_DAW/backend/controlador/controlador.php?action=obtenerCursos');
        setCursos(response.data);
      } catch (error) {
        console.error('Error al obtener los cursos:', error);
      }
    };
    fetchCursos();
  }, []);


  return (
    <div className="min-h-screen bg-gray-900 pt-24">
      <div className="container mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-white text-center"
        >
          Nuestros Cursos
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {
          cursos.length > 0 ?
            cursos.map(curso => (
              <motion.div
                key={curso.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors"
              >
                <h2 className="text-xl font-bold text-white mb-2">{curso.nombre}</h2>
                <p className="text-gray-400 mb-2">{curso.descripcion}</p>
                <p className="text-gray-400">{curso.precio}</p>
              </motion.div>
            ))
          :
            <p className="text-gray-400 text-center">No hay cursos disponibles</p>
          }
        </div>
      </div>
    </div>
  );
};

export default Cursos;
