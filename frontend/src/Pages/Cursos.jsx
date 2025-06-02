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
      
      // Verificar si la respuesta es un array
      if (Array.isArray(response.data)) {
        setCursos(response.data);
        setError(null);
        setMios(false);
      } else {
        setError('Error al obtener los cursos');
        setCursos([]);
        setMios(false);
      }
    } catch (error) {
      console.error('Error al obtener los cursos:', error);
      setError('Error al cargar los cursos');
      setCursos([]);
      setMios(false);
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
    <div className="min-h-screen bg-gray-900 relative overflow-hidden pt-20">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-40 left-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-40 right-10 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Encabezado Hero */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block mb-4">
              <span className="inline-block py-1 px-3 rounded-full bg-purple-900/30 text-purple-300 text-sm font-medium mb-2">
                FORMACIÓN TECNOLÓGICA
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Explora Nuestros
              </span> 
              <span className="text-white"> Cursos</span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-pink-600 mx-auto mb-8"></div>
            <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
              Descubre nuestra selección de cursos diseñados para impulsar tu carrera en tecnología y transformar tu futuro profesional
            </p>
          </motion.div>
          
          {userData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-8"
            >
              {mios ? (
                <button 
                  onClick={obtenerCursos} 
                  className="flex items-center justify-center px-6 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300 mx-auto"
                >
                  <span className="mr-2">Volver a todos los cursos</span> ⬅️
                </button>
              ) : (
                <button 
                  onClick={misCursos} 
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
                >
                  Ver Mis Cursos
                </button>
              )}
            </motion.div>
          )}
        </div>

        {error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center text-red-300 max-w-2xl mx-auto mb-12"
          >
            <div className="flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-medium">Error</span>
            </div>
            <p>{error}</p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >            
            {cursos.length > 0 ? 
              cursos.map((curso, index) => (
                <motion.div
                  key={curso.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => navigate(`/curso/${curso.id}`)}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                >
                  {/* Imagen del curso con efecto de superposición */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={curso.imgCurso}
                      alt={curso.titulo}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent opacity-70"></div>
                    
                    {/* Etiqueta de nivel */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-purple-600 px-3 py-1 rounded-full text-white text-sm font-semibold shadow-lg">
                      {curso.tipo_curso || 'Todos los niveles'}
                    </div>
                    
                    {/* Nombre del profesor con avatar */}
                    <div className="absolute bottom-4 left-4 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center mr-2 text-white text-xs font-bold">
                        {curso.profesor ? curso.profesor.charAt(0).toUpperCase() : 'P'}
                      </div>
                      <span className="text-white text-sm font-medium">{curso.profesor}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Título del curso */}
                    <h2 className="text-2xl font-bold mb-3 group-hover:text-purple-400 transition-colors line-clamp-2">
                      <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        {curso.titulo}
                      </span>
                    </h2>
                    
                    {/* Descripción */}
                    <p className="text-gray-300 leading-relaxed line-clamp-3 mb-5">
                      {curso.descripcion}
                    </p>

                    {/* Características del curso */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center bg-gray-800/50 rounded-lg p-2">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-2">
                          <FaClock className="text-purple-400" />
                        </div>
                        <span className="text-gray-300 text-sm">{curso.duracion} horas</span>
                      </div>
                      <div className="flex items-center bg-gray-800/50 rounded-lg p-2">
                        <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center mr-2">
                          <FaStar className="text-pink-400" />
                        </div>
                        <span className="text-gray-300 text-sm">4.8/5 rating</span>
                      </div>
                    </div>

                    {/* Precio y botones */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-700/50">
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-sm">Precio</span>
                        <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                          {curso.precio}€
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05, boxShadow: "0 5px 15px -5px rgba(124, 58, 237, 0.3)" }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/curso-visor/${curso.id}`);
                          }}
                          className="px-4 py-2 bg-gray-800 border border-purple-500/30 text-purple-400 rounded-xl font-medium hover:bg-gray-700 hover:text-purple-300 transition-all duration-300"
                        >
                          Ver curso
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.5)" }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/pago/${curso.id}`);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:opacity-95 transition-all duration-300 flex items-center"
                        >
                          Inscribirse
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
              :
              <div className="col-span-full text-center py-16">
                <div className="bg-gray-800/50 rounded-2xl p-8 max-w-lg mx-auto">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaBookReader className="text-purple-400 text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">No hay cursos disponibles</h3>
                  <p className="text-gray-300">
                    {mios ? 
                      "No estás inscrito en ningún curso aún. Explora nuestro catálogo para encontrar el curso perfecto para ti." :
                      "Actualmente no hay cursos disponibles. Por favor, vuelve a consultar más tarde."}
                  </p>
                </div>
              </div>
            }
          </motion.div>
        )}
        
        {/* Sección de llamada a la acción */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl shadow-lg mt-20"
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">¿Listo para mejorar tus habilidades?</h2>
            <p className="text-gray-300 text-lg mb-8">
              Nuestros cursos están diseñados por expertos de la industria para ayudarte a dominar las tecnologías más demandadas.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/registro" className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300">
                Comenzar Ahora
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Cursos;
