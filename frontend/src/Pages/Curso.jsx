import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {FaClock, FaChalkboardTeacher, FaBookReader, FaStar, FaPlay, FaCheck } from 'react-icons/fa';

const Curso = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Crear el FormData usando el nombre correcto del parámetro
  const identifier = new FormData();
  identifier.append('id_curso', id); // Usar id_curso en lugar de id para el backend
  
  console.log('ID del curso desde URL:', id);
  
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [inscrito, setInscrito] = useState(false);
  const [cursosInscritos, setCursosInscritos] = useState([]);

  const getImageUrl = (relativePath) => {
    if (!relativePath) {
      return 'http://localhost/TFG_DAW/frontend/src/img/imgCursos/default.jpg';
    }
    
    // Si ya es una URL completa, la devolvemos tal cual
    if (relativePath.startsWith('http')) {
      return relativePath;
    }
    
    // Construimos la URL completa para rutas relativas
    return `http://localhost/TFG_DAW/frontend${relativePath}`;
  };

  const tecnologiaImagenes = {
    'React': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png',
    'Python': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1869px-Python-logo-notext.svg.png',
    'JavaScript': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/800px-JavaScript-logo.png',
    'Node.js': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1280px-Node.js_logo.svg.png',
    'default': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1000&auto=format&fit=crop'
  };

  const obtenerCursos = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost/TFG_DAW/backend/controlador/controlador.php?action=obtenerCurso`,
        identifier,
        { withCredentials: true }
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (response.data) {
        setCurso(response.data);
        setError(null);
      } else {
        setError("No se encontró el curso solicitado.");
        setCurso(null);
      }
    } catch (error) {
      setError("No se pudo cargar el curso. Por favor, intenta más tarde.");
      setCurso(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerCursos();
    comprobarSesion();
  }, []);
  
  const comprobarSesion = async () => {
    try {
      const respuesta = await axios.get(
        'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=comprobarSesion',
        { withCredentials: true }
      );
      
      console.log('Respuesta comprobar sesión:', respuesta.data);
      
      if (respuesta.data && respuesta.data.username) {
        setUserData(respuesta.data);
        // Si el usuario está autenticado, verificamos directamente si está inscrito en este curso
        verificarInscripcion();
      } else {
        // Usuario no autenticado, no mostrar error
        setUserData(null);
        setInscrito(false);
      }
    } catch (error) {
      console.error('Error al comprobar sesión:', error);
      // En caso de error, asumimos que el usuario no está autenticado
      setUserData(null);
      setInscrito(false);
    }
  };
  
  // Método optimizado para verificar directamente inscripción
  const verificarInscripcion = async () => {
    try {
      console.log('Verificando inscripción directa para curso ID:', id);
      
      // Crear FormData con el id del curso
      const formData = new FormData();
      formData.append('id_curso', id);
      
      const respuesta = await axios.post(
        'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=verificarInscripcion',
        formData,
        { withCredentials: true }
      );
      
      console.log('Respuesta verificación directa:', respuesta.data);
      
      // Actualizar estado según respuesta
      if (respuesta.data && respuesta.data.inscrito === true) {
        console.log('¡USUARIO INSCRITO! Mostrando interfaz de inscrito');
        setInscrito(true);
      } else {
        console.log('Usuario NO inscrito. Mostrando interfaz de no inscrito');
        setInscrito(false);
      }
    } catch (error) {
      console.error('Error al verificar inscripción:', error);
      setInscrito(false);
    }
  };
  
  const obtenerCursosInscritos = async () => {
    try {
      console.log('Obteniendo cursos inscritos para página de detalle, ID del curso actual:', id);
      const response = await axios.get(
        'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=obtenerMisCursos',
        { withCredentials: true }
      );
      
      console.log('Respuesta de obtenerMisCursos:', response.data);
      
      if (response.data && !response.data.error && Array.isArray(response.data)) {
        setCursosInscritos(response.data);
        
        // Comprobar si el usuario está inscrito en este curso (múltiples comparaciones para mayor seguridad)
        const idNumerico = parseInt(id);
        const estaInscrito = response.data.some(curso => {
          const cursoId = curso.id_curso || curso.id; // Intentar con id_curso primero, luego con id
          const cursoIdNum = parseInt(cursoId);
          
          const coincide = 
            cursoIdNum === idNumerico || 
            String(cursoIdNum) === String(idNumerico);
            
          console.log(`Comparando curso ${curso.titulo} [ID: ${cursoId}] con curso actual [ID: ${id}]: coincide=${coincide}`);
          return coincide;
        });
        
        console.log('¿El usuario está inscrito en este curso?', estaInscrito);
        setInscrito(estaInscrito);
      } else {
        console.log('No se obtuvieron cursos inscritos o el formato no es correcto');
        setInscrito(false);
      }
    } catch (error) {
      console.error('Error al obtener cursos inscritos:', error);
      setInscrito(false);
    }
  };

  const misCursos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=obtenerMisCursos',
        { withCredentials: true }
      );
      setCurso(response.data);
      setError(null);
      setMios(true);
    } catch (error) {
      setError('No se pudieron cargar los cursos. Por favor, intenta más tarde.');
      setCurso([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    misCursos();
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-purple-600 border-r-pink-600 border-b-purple-600 border-l-pink-600 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-300">Cargando curso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-35">
      <div className="container mx-auto px-4">
        {error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center text-red-300 max-w-2xl mx-auto"
          >
            {error}
          </motion.div>
        ) : curso ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            {/* Hero Section */}
            {userData && !inscrito && (
              <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-xl p-4 mb-6 flex items-center">
                <div className="text-yellow-400 mr-3 text-xl">⚠️</div>
                <div className="text-yellow-300">No estás inscrito en este curso. Es necesario inscribirse para acceder al contenido.</div>
                <button 
                  onClick={() => document.querySelector('#inscripcion-section').scrollIntoView({ behavior: 'smooth' })}
                  className="ml-auto bg-yellow-600/30 hover:bg-yellow-600/50 text-yellow-200 px-4 py-2 rounded-lg text-sm transition-colors duration-300"
                >
                  Inscribirse
                </button>
              </div>
            )}
            
            <div className="relative rounded-3xl overflow-hidden mb-12 bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-gray-800">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm"></div>
              <div className="relative z-10 p-8 md:p-12">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text"
                >
                  {curso.titulo}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl"
                >
                  {curso.descripcion}
                </motion.p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center space-x-3 bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm"
                  >
                    <FaClock className="w-6 h-6 text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-400">Duración</p>
                      <p className="text-white font-semibold">{curso.duracion} horas</p>
                    </div>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center space-x-3 bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm"
                  >
                    <FaChalkboardTeacher className="w-6 h-6 text-pink-400" />
                    <div>
                      <p className="text-sm text-gray-400">Profesor</p>
                      <p className="text-white font-semibold">{curso.profesor}</p>
                    </div>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center space-x-3 bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm"
                  >
                    <FaBookReader className="w-6 h-6 text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-400">Nivel</p>
                      <p className="text-white font-semibold">{curso.tipo_curso || 'Todos los niveles'}</p>
                    </div>
                  </motion.div>
                </div>
                <motion.div 
                  id="inscripcion-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-col md:flex-row items-center justify-between bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm"
                >
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="text-3xl font-bold text-white mr-2">{curso.precio}€</div>
                    <div className="text-gray-400">/ curso completo</div>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    {userData ? (
                      // Interfaz para usuarios autenticados
                      <>
                        {inscrito ? (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(`/curso-visor/${id}`)}
                            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center justify-center"
                          >
                            <FaPlay className="mr-2" size={14} /> Acceder al Curso
                          </motion.button>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => alert('Necesitas inscribirte a este curso para acceder al contenido')}
                            className="px-8 py-3 bg-gray-500 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center opacity-70"
                            disabled
                          >
                            <FaPlay className="mr-2" size={14} /> Acceder al Curso
                          </motion.button>
                        )}
                        {!inscrito ? (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(`/pago/${id}`)}
                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                          >
                            Inscribirse Ahora
                          </motion.button>
                        ) : (
                          <motion.div
                            className="px-8 py-3 bg-green-600/20 text-green-400 rounded-xl font-semibold flex items-center justify-center border border-green-500/30"
                          >
                            <FaCheck className="mr-2" size={14} /> Ya inscrito
                          </motion.div>
                        )}
                      </>
                    ) : (
                      // Interfaz para usuarios NO autenticados
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          // Emitir evento para abrir el modal de login
                          window.dispatchEvent(new CustomEvent('openLogin'));
                        }}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                      >
                        Iniciar sesión para inscribirse
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Course Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="relative rounded-2xl overflow-hidden mb-12 aspect-video"
            >
              <img
                src={getImageUrl(curso.imgCurso)}
                alt={curso.titulo}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
            </motion.div>

            {/* Course Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div className="bg-gray-800/30 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/50">
                <h3 className="text-2xl font-bold text-white mb-4">Lo que aprenderás</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <FaStar className="w-5 h-5 text-purple-400 mt-1" />
                    <span className="text-gray-300">Dominarás los fundamentos de {curso.tecnologia}</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <FaStar className="w-5 h-5 text-pink-400 mt-1" />
                    <span className="text-gray-300">Crearás proyectos reales y prácticos</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <FaStar className="w-5 h-5 text-purple-400 mt-1" />
                    <span className="text-gray-300">Aprenderás las mejores prácticas de la industria</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-800/30 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/50">
                <h3 className="text-2xl font-bold text-white mb-4">Requisitos previos</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <FaStar className="w-5 h-5 text-purple-400 mt-1" />
                    <span className="text-gray-300">Conocimientos básicos de programación</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <FaStar className="w-5 h-5 text-pink-400 mt-1" />
                    <span className="text-gray-300">Ganas de aprender y practicar</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <div className="text-center text-gray-300">No se encontró el curso</div>
        )}
      </div>
    </div>
  );
};

export default Curso;
