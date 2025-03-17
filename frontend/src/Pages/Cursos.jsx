import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {FaClock, FaChalkboardTeacher, FaBookReader, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Cursos = () => {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mios, setMios] = useState(false);
  const [userData, setUserData] = useState(null);

  const tecnologiaImagenes = {
    'React': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png',
    'Python': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1869px-Python-logo-notext.svg.png',
    'JavaScript': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/800px-JavaScript-logo.png',
    'Node.js': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1280px-Node.js_logo.svg.png',
    'default': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1000&auto=format&fit=crop'
  };

  useEffect(() => {
    const comprobarSesion = async () => {
      try {
        const respuesta = await axios.get(
          'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=comprobarSesion',
          { withCredentials: true }
        );
        
        if (respuesta.data && respuesta.data.username) {
          setUserData(respuesta.data);
        }
      } catch (error) {
        console.error('Error al comprobar sesión:', error);
      }
    };

    comprobarSesion();
  }, []);

  const obtenerCursos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost/TFG_DAW/backend/controlador/controlador.php?action=obtenerCursos",
        { withCredentials: true }
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCursos(response.data);
      setError(null);
      setMios(false);
    } catch (error) {
      setError("No se pudieron cargar los cursos. Por favor, intenta más tarde.");
      setCursos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerCursos();
  }, []);

  const misCursos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=obtenerMisCursos',
        { withCredentials: true }
      );
      setCursos(response.data);
      setError(null);
      setMios(true);
    } catch (error) {
      setError('No se pudieron cargar los cursos. Por favor, intenta más tarde.');
      setCursos([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-purple-600 border-r-pink-600 border-b-purple-600 border-l-pink-600 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-300">Cargando cursos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-35">
      <div className="container mx-auto px-4">
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
          
          {userData && (
            mios ? (
              <button 
                onClick={obtenerCursos} 
                className="flex items-center justify-center mt-5 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
              >
                Volver Atrás ⬅️
              </button>
            ) : (
              <button 
                onClick={misCursos} 
                className="mt-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
              >
                Ver Mis Cursos
              </button>
            )
          )}
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
            {cursos.length > 0 ? 
              cursos.map((curso, index) => (
                <motion.div
                  key={curso.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => navigate(`/curso/${curso.id}`)}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
                >
                  {/* Imagen del curso */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={tecnologiaImagenes[curso.tecnologia] || tecnologiaImagenes.default}
                      alt={curso.titulo}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                    <div className="absolute top-4 right-4 bg-purple-500/90 px-3 py-1 rounded-full text-white text-sm font-semibold">
                      {curso.tipo_curso || 'Todos los niveles'}
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors line-clamp-2">
                      {curso.titulo}
                    </h2>
                    
                    <p className="text-gray-300 leading-relaxed line-clamp-3 mb-4">
                      {curso.descripcion}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center">
                        <FaClock className="w-5 h-5 text-purple-400 mr-2" />
                        <span className="text-gray-300">{curso.duracion} horas</span>
                      </div>
                      <div className="flex items-center">
                        <FaChalkboardTeacher className="w-5 h-5 text-pink-400 mr-2" />
                        <span className="text-gray-300 truncate">{curso.profesor}</span>
                      </div>
                    </div>

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
                  </div>
                </motion.div>
              ))
              :
              <p className="text-gray-300">No hay cursos disponibles</p>
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default Cursos;
