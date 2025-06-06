import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaLightbulb, FaEdit, FaDownload, FaStar, FaShare, FaLock, FaCheck, FaPlay, 
  FaCrown, FaInfoCircle, FaRegClock, FaUserLock, FaEye, FaMagic, FaGem, FaFireAlt } from 'react-icons/fa';
import ProgresoModulos from '../components/Curso/ProgresoModulos';
import ReproductorVideo from '../components/Curso/ReproductorVideo';
import axios from 'axios';
// Importar datos de videos para el curso de IA
import videosIA from '../data/videosIA';

// Componente para contenido bloqueado
const ContenidoBloqueado = ({ onClick, titulo }) => (
  <motion.div 
    whileHover={{ scale: 1.01 }}
    className="relative overflow-hidden rounded-xl cursor-pointer group"
    onClick={onClick}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg z-10"></div>
    <div className="absolute inset-0 bg-gray-900/60 z-20"></div>
    
    <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl border border-purple-500/20 shadow-xl max-w-[80%] text-center"
      >
        <div className="mb-3 text-center">
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="inline-block"
          >
            <FaLock className="text-4xl text-pink-500 mb-2 mx-auto" />
          </motion.div>
          <h3 className="text-lg font-bold text-white mb-1">{titulo || 'Contenido Bloqueado'}</h3>
          <p className="text-sm text-gray-300 mb-3">Inicia sesión para desbloquear este contenido</p>
        </div>
        
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg font-semibold text-sm"
        >
          <FaEye className="mr-1" /> Desbloquear
        </motion.div>
      </motion.div>
    </div>
    
    <div className="p-6 blur-sm">
      <div className="w-full h-12 bg-gray-600/30 rounded animate-pulse"></div>
      <div className="w-4/5 h-4 bg-gray-600/30 rounded mt-4 animate-pulse"></div>
      <div className="w-3/4 h-4 bg-gray-600/30 rounded mt-2 animate-pulse"></div>
    </div>
  </motion.div>
);

const VisorCurso = () => {
  const { cursoId } = useParams();
  const navigate = useNavigate();
  
  const [curso, setCurso] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [leccionActual, setLeccionActual] = useState(null);
  const [moduloActual, setModuloActual] = useState(null);
  const [pestanaActiva, setPestanaActiva] = useState('contenido');
  const [mensaje, setMensaje] = useState(null);
  const [haComprado, setHaComprado] = useState(false);
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);
  const [modoVistaPreviaSinLogin, setModoVistaPreviaSinLogin] = useState(false);
  const [videoActualUrl, setVideoActualUrl] = useState(null);
  const [esCursoIA, setEsCursoIA] = useState(false);
  
  useEffect(() => {
    comprobarSesion();
    obtenerDatosCurso();
    
    // Comprobar si este es el curso de IA basado en el ID
    // Si el ID del curso coincide con el de Introducción a la IA
    setEsCursoIA(cursoId === videosIA.cursoId);
  }, [cursoId, navigate]);
  
  useEffect(() => {
    if (usuarioAutenticado) {
      verificarInscripcion();
    }
  }, [usuarioAutenticado, cursoId]);
  
  const comprobarSesion = async () => {
    try {
      const respuesta = await axios.get(
        'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=comprobarSesion',
        { withCredentials: true }
      );
      
      if (!respuesta.data || !respuesta.data.username) {
        // Si no hay sesión iniciada, mostrar vista previa
        setUsuarioAutenticado(false);
        setModoVistaPreviaSinLogin(true);
        setMensaje({
          tipo: 'info',
          texto: 'Estás viendo una versión limitada del curso. Inicia sesión para acceder a todo el contenido.'
        });
      } else {
        setUsuarioAutenticado(true);
        setModoVistaPreviaSinLogin(false);
      }
    } catch (error) {
      console.error('Error al comprobar sesión:', error);
      setUsuarioAutenticado(false);
      setModoVistaPreviaSinLogin(true);
      setMensaje({
        tipo: 'warning',
        texto: 'No se pudo verificar la sesión. Algunas funciones estarán limitadas.'
      });
    }
  };
  
  const verificarInscripcion = async () => {
    try {
      const response = await axios.get(
        'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=obtenerMisCursos',
        { withCredentials: true }
      );
      
      if (response.data && !response.data.error) {
        const estaInscrito = response.data.some(curso => curso.id == cursoId);
        setHaComprado(estaInscrito);
        
        if (!estaInscrito) {
          setMensaje({
            tipo: 'advertencia',
            texto: 'No estás inscrito en este curso. Es necesario inscribirse para acceder al contenido.'
          });
        }
      }
    } catch (error) {
      console.error('Error al verificar inscripción:', error);
    }
  };
  
  const obtenerDatosCurso = async () => {
    try {
      setCargando(true);
      
      // Obtener datos del curso desde la API
      const identifier = new FormData();
      identifier.append('id', cursoId);
      const response = await axios.post(
        `http://localhost/TFG_DAW/backend/controlador/controlador.php?action=obtenerCurso`,
        identifier,
        { withCredentials: true }
      );
      
      if (response.data) {
        // Crear datos estructurados del curso con la información recibida
        const cursoData = {
          id: response.data.id,
          titulo: response.data.titulo,
          descripcion: response.data.descripcion,
          instructor: {
            id: 1,
            nombre: response.data.profesor,
            avatar: 'https://i.pravatar.cc/150?img=37',
            rol: 'Instructor'
          },
          precio: response.data.precio,
          duracion: response.data.duracion, // Añadir duración del curso desde el backend
          valoracion: 4.8,
          numValoraciones: 125,
          fechaActualizacion: '2025-05-16',
          modulos: [
            {
              id: 1,
              titulo: 'Introducción al curso',
              completado: false,
              progreso: 0,
              // Solo la primera lección está disponible para usuarios no autenticados
              lecciones: [
                { id: 1, titulo: 'Bienvenida y presentación', duracion: '03:00', completada: false, bloqueada: !haComprado },
                { id: 2, titulo: 'Requisitos previos', duracion: '08:45', completada: false, bloqueada: !haComprado },
                { id: 3, titulo: 'Configuración del entorno', duracion: '12:20', completada: false, bloqueada: !haComprado }
              ]
            },
            {
              id: 2,
              titulo: 'Fundamentos básicos',
              completado: usuarioAutenticado ? true : false,
              progreso: usuarioAutenticado ? 100 : 0,
              bloqueado: !haComprado,
              lecciones: [
                { 
                  id: 4, 
                  titulo: 'Conceptos fundamentales', 
                  duracion: '15:10', 
                  completada: usuarioAutenticado ? true : false,
                  bloqueada: !haComprado 
                },
                { 
                  id: 5, 
                  titulo: 'Primeros ejemplos prácticos', 
                  duracion: '18:30', 
                  completada: usuarioAutenticado ? true : false,
                  bloqueada: !haComprado 
                },
                { 
                  id: 6, 
                  titulo: 'Ejercicios guiados', 
                  duracion: '22:15', 
                  completada: usuarioAutenticado ? true : false,
                  bloqueada: !haComprado 
                }
              ]
            },
            {
              id: 3,
              titulo: 'Técnicas avanzadas',
              completado: usuarioAutenticado ? false : false,
              progreso: usuarioAutenticado ? 33 : 0,
              bloqueado: !haComprado,
              lecciones: [
                { 
                  id: 7, 
                  titulo: 'Patrones avanzados', 
                  duracion: '20:45', 
                  completada: usuarioAutenticado ? true : false,
                  bloqueada: !haComprado 
                },
                { 
                  id: 8, 
                  titulo: 'Optimización y buenas prácticas', 
                  duracion: '25:30', 
                  completada: false,
                  bloqueada: !haComprado 
                },
                { 
                  id: 9, 
                  titulo: 'Casos de estudio reales', 
                  duracion: '30:00', 
                  completada: false,
                  bloqueada: !haComprado 
                }
              ]
            },
            {
              id: 4,
              titulo: 'Proyecto final',
              completado: false,
              progreso: 0,
              bloqueado: !haComprado,
              lecciones: [
                { 
                  id: 10, 
                  titulo: 'Planificación del proyecto', 
                  duracion: '15:20', 
                  completada: false, 
                  bloqueada: !haComprado 
                },
                { 
                  id: 11, 
                  titulo: 'Desarrollo guiado', 
                  duracion: '35:45', 
                  completada: false, 
                  bloqueada: !haComprado 
                },
                { 
                  id: 12, 
                  titulo: 'Pruebas y despliegue', 
                  duracion: '25:10', 
                  completada: false, 
                  bloqueada: !haComprado 
                }
              ]
            }
          ],
          recursos: [
            { 
              id: 1, 
              titulo: 'Documentación de referencia', 
              tipo: 'pdf', 
              tamano: '2.4 MB',
              bloqueado: !haComprado
            },
            { 
              id: 2, 
              titulo: 'Código fuente de ejemplos', 
              tipo: 'zip', 
              tamano: '4.8 MB',
              bloqueado: !haComprado
            },
            { 
              id: 3, 
              titulo: 'Plantillas de proyecto', 
              tipo: 'zip', 
              tamano: '1.7 MB',
              bloqueado: !haComprado
            },
            { 
              id: 4, 
              titulo: 'Muestra gratuita del curso', 
              tipo: 'pdf', 
              tamano: '0.8 MB',
              bloqueado: !haComprado // Incluso las muestras gratuitas requieren inscripción
            }
          ],
          preguntas: [
            { 
              id: 1, 
              usuario: 'Carlos R.', 
              fecha: '2025-05-01', 
              texto: '¿Hay algún requisito específico para seguir este curso?',
              respuesta: 'Solo necesitas conocimientos básicos de programación y una computadora con conexión a internet.',
              avatarUsuario: 'https://i.pravatar.cc/150?img=68'
            },
            { 
              id: 2, 
              usuario: 'Laura M.', 
              fecha: '2025-04-28', 
              texto: '¿Se incluye soporte tras finalizar el curso?',
              respuesta: 'Ofrecemos soporte durante 3 meses después de la compra del curso para resolver dudas.',
              avatarUsuario: 'https://i.pravatar.cc/150?img=47'
            },
            { 
              id: 3, 
              usuario: 'Miguel P.', 
              fecha: '2025-04-15', 
              texto: '¿El certificado tiene alguna acreditación oficial?',
              respuesta: 'Nuestro certificado demuestra la finalización del curso pero no está acreditado por ninguna institución educativa oficial.',
              avatarUsuario: 'https://i.pravatar.cc/150?img=12'
            }
          ]
        };
        
        setCurso(cursoData);
        
        // Iniciar con la primera lección del primer módulo
        if (cursoData.modulos.length > 0 && cursoData.modulos[0].lecciones.length > 0) {
          setModuloActual(cursoData.modulos[0]);
          setLeccionActual(cursoData.modulos[0].lecciones[0]);
        }
      } else {
        setMensaje({
          tipo: 'error',
          texto: 'No se encontró información del curso'
        });
      }
    } catch (error) {
      console.error('Error al obtener curso:', error);
      setMensaje({
        tipo: 'error',
        texto: 'Error al cargar el curso'
      });
    } finally {
      setCargando(false);
    }
  };
    
  const handleSeleccionLeccion = (modulo, leccion) => {
    // Si la lección está bloqueada y el usuario no ha comprado, mostrar mensaje
    if (leccion.bloqueada && !haComprado) {
      setMensaje({
        tipo: 'info',
        texto: 'Necesitas inscribirte en el curso para acceder a esta lección'
      });
      return;
    }
    
    setModuloActual(modulo);
    setLeccionActual(leccion);
    // Scrollear al reproductor de video
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCambiarPestana = (pestana) => {
    setPestanaActiva(pestana);
  };
  
  const handleComprarCurso = () => {
    navigate(`/pago/${cursoId}`);
  };
  
  const handleMarcarCompletada = (leccionId) => {
    if (!haComprado) {
      setMensaje({
        tipo: 'info',
        texto: 'Necesitas inscribirte en el curso para marcar lecciones como completadas'
      });
      return;
    }
    
    // Actualizar el estado local
    // En producción, esto enviaría una petición al servidor
    setCurso(prevCurso => {
      const nuevoCurso = { ...prevCurso };
      const todosModulos = [...nuevoCurso.modulos];
      
      // Encontrar la lección y marcarla como completada
      for (let i = 0; i < todosModulos.length; i++) {
        const modulo = todosModulos[i];
        const leccionIndex = modulo.lecciones.findIndex(l => l.id === leccionId);
        
        if (leccionIndex >= 0) {
          // Actualizar la lección
          modulo.lecciones[leccionIndex].completada = true;
          
          // Actualizar el progreso del módulo
          const leccionesCompletadas = modulo.lecciones.filter(l => l.completada).length;
          modulo.progreso = Math.round((leccionesCompletadas / modulo.lecciones.length) * 100);
          modulo.completado = modulo.progreso === 100;
          
          break;
        }
      }
      
      nuevoCurso.modulos = todosModulos;
      return nuevoCurso;
    });
    
    // Mostrar mensaje de éxito
    setMensaje({
      tipo: 'exito',
      texto: '¡Lección marcada como completada!'
    });
  };
  
  // Renderizar estado de carga
  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center pt-20">
        <div className="text-center flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-purple-600 border-r-pink-600 border-b-purple-600 border-l-pink-600 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-300">Cargando curso...</p>
        </div>
      </div>
    );
  }
  
  // Renderizar error si no hay datos del curso
  if (!curso) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center pt-20">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-gray-700/50 text-center">
          <div className="text-red-500 text-5xl mb-4">
            <span role="img" aria-label="Error">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-4">No se pudo cargar el curso</h2>
          <p className="text-gray-300 mb-6">{mensaje?.texto || 'Ha ocurrido un error al cargar el curso'}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/cursos')}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all"
          >
            Volver a Cursos
          </motion.button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 pt-20 relative">
      {modoVistaPreviaSinLogin && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-800/90 to-pink-700/90 backdrop-blur-lg p-4 z-50 border-t border-purple-500/30 shadow-lg shadow-purple-900/50"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <div className="relative mr-3">
                <FaUserLock className="text-white text-2xl" />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400 rounded-full"
                />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Modo Vista Previa</h3>
                <p className="text-white/80 text-sm">Descubre más iniciando sesión en nuestra plataforma</p>
              </div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <Link 
                to="/login" 
                state={{ returnUrl: `/curso-visor/${cursoId}` }} 
                className="relative flex items-center px-6 py-3 bg-gray-900 rounded-xl text-white font-bold hover:bg-gray-800 transition-all"
              >
                <span className="mr-2">Desbloquear Curso</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <FaLock className="text-pink-400" />
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}
      {/* Navbar superior */}
      <div className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/cursos')}
              className="text-white hover:text-purple-400 mr-4 transition-colors"
            >
              <FaArrowLeft size={20} />
            </button>
            <h1 className="text-lg sm:text-xl font-bold truncate max-w-[250px] sm:max-w-md">
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                {curso.titulo}
              </span>
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {!haComprado && !modoVistaPreviaSinLogin && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleComprarCurso}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/20 transition-all"
              >
                Inscribirse ({curso.precio}€)
              </motion.button>
            )}
            {modoVistaPreviaSinLogin && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login', { state: { returnUrl: `/curso-visor/${cursoId}` } })}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/20 transition-all"
              >
                <FaLock className="mr-2" size={14} /> Iniciar sesión
              </motion.button>
            )}
            {haComprado && (
              <div className="flex items-center px-4 py-2 bg-green-600/20 text-green-400 rounded-xl font-semibold text-sm border border-green-500/30">
                <FaCheck className="mr-2" size={14} /> Inscrito
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mensaje de estado */}
      <AnimatePresence>
        {mensaje && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mx-auto max-w-4xl mt-4 px-4 ${mensaje.tipo === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-300' : mensaje.tipo === 'exito' ? 'bg-green-500/10 border-green-500/30 text-green-300' : mensaje.tipo === 'advertencia' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300' : 'bg-blue-500/10 border-blue-500/30 text-blue-300'} border rounded-xl p-4 flex items-start`}
          >
            <div className="flex-shrink-0 mr-3">
              {mensaje.tipo === 'error' && <span className="text-xl">⚠️</span>}
              {mensaje.tipo === 'exito' && <FaCheck />}
              {mensaje.tipo === 'advertencia' && <span className="text-xl">⚠️</span>}
              {mensaje.tipo === 'info' && <FaLightbulb />}
            </div>
            <div className="flex-1">
              <p>{mensaje.texto}</p>
            </div>
            <button 
              onClick={() => setMensaje(null)}
              className="ml-auto flex-shrink-0 text-gray-400 hover:text-white"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!haComprado && !modoVistaPreviaSinLogin && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-7xl px-4 sm:px-6 py-3 mb-4"
        >
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-4 border border-pink-600/30 flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gray-800 p-3 rounded-full mr-4">
                <FaCrown className="text-yellow-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-1">Acceso limitado al contenido</h3>
                <p className="text-gray-300 max-w-xl">Inscríbete en este curso para desbloquear todas las lecciones, recursos y ejercicios.</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleComprarCurso}
              className="hidden md:flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all"
            >
              Inscribirse ahora ({curso?.precio || 0}€)
            </motion.button>
          </div>
        </motion.div>
      )}
      
      {modoVistaPreviaSinLogin && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="mx-auto max-w-7xl px-4 sm:px-6 py-3 mb-4"
        >
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-4 border border-pink-600/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tl from-pink-500/20 to-purple-500/20 rounded-full filter blur-3xl translate-y-1/3 -translate-x-1/4"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center">
                <div className="relative mr-4">
                  <div className="bg-gray-800 p-3 rounded-full">
                    <FaMagic className="text-purple-400" size={24} />
                  </div>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ 
                      repeat: Infinity,
                      duration: 3
                    }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full blur-sm"
                  />
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <h3 className="text-lg font-bold text-white mr-3">Modo Vista Previa</h3>
                    <span className="bg-purple-600/30 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-600/20">
                      Solo demostración
                    </span>
                  </div>
                  <p className="text-gray-300 max-w-xl">Estás viendo una versión limitada. Inicia sesión para acceder a todas las funciones.</p>
                </div>
              </div>
              
              <Link 
                to="/login" 
                state={{ returnUrl: `/curso-visor/${cursoId}` }}
                className="flex-shrink-0 group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-75 blur-sm group-hover:opacity-100 transition duration-200"></div>
                <div className="relative flex items-center px-6 py-3 bg-gray-900 rounded-xl text-white font-bold transition-colors group-hover:bg-gray-800">
                  <span className="mr-2">Desbloquear Ahora</span>
                  <FaLock className="text-pink-400 group-hover:text-pink-300" />
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda: Reproductor de video y pestañas */}
          <div className="lg:col-span-2">
            {/* Reproductor de video */}
            <div className="mb-6 bg-gray-800 rounded-2xl overflow-hidden border border-gray-700/50 relative">
              {leccionActual && (
                <>
                  <ReproductorVideo 
                    videoUrl={esCursoIA && leccionActual ? videosIA.videos.find(v => Number(v.id) === Number(leccionActual.id))?.videoUrl || null : null} 
                    titulo={leccionActual.titulo || ''}
                    bloqueado={(leccionActual.bloqueada && !haComprado) || false}
                    leccion={leccionActual}
                    cursoId={curso.id}
                    onComplete={() => actualizarProgreso(moduloActual?.id, leccionActual?.id)}
                  />
                  
                  {(!haComprado && moduloActual && moduloActual.id > 1) || modoVistaPreviaSinLogin ? (
                    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 p-6 text-center">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" }}
                        className="w-20 h-20 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full flex items-center justify-center mb-4 border border-pink-600/50 relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 animate-pulse"></div>
                        <FaLock className="text-pink-400 relative z-10" size={30} />
                        <motion.div 
                          animate={{ 
                            rotate: 360,
                            scale: [1, 1.1, 1] 
                          }}
                          transition={{ 
                            rotate: { repeat: Infinity, duration: 10, ease: "linear" },
                            scale: { repeat: Infinity, duration: 2 }
                          }}
                          className="absolute inset-0 rounded-full border-2 border-dashed border-pink-500/30"
                        />
                      </motion.div>
                      
                      <motion.h3 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl font-bold text-white mb-2"
                      >
                        {modoVistaPreviaSinLogin ? "Contenido Bloqueado" : "Contenido exclusivo"}
                      </motion.h3>
                      
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-gray-300 mb-6 max-w-md"
                      >
                        {modoVistaPreviaSinLogin 
                          ? "Es necesario iniciar sesión para ver el contenido completo del curso." 
                          : "Esta lección solo está disponible para estudiantes inscritos en el curso completo."}
                      </motion.p>
                      
                      {modoVistaPreviaSinLogin ? (
                        <Link 
                          to="/login" 
                          state={{ returnUrl: `/curso-visor/${cursoId}` }}
                          className="group relative"
                        >
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-70 blur group-hover:opacity-100 transition duration-200"></div>
                          <div className="relative px-8 py-3 bg-gray-900 rounded-xl text-white font-bold flex items-center group-hover:bg-gray-800 transition-colors">
                            <span className="mr-2">Iniciar Sesión</span>
                            <motion.div
                              animate={{ x: [0, 5, 0] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                              <FaLock className="text-pink-400" />
                            </motion.div>
                          </div>
                        </Link>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleComprarCurso}
                          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                        >
                          Inscribirse por {curso.precio}€
                        </motion.button>
                      )}
                    </div>
                  ) : null}
                </>
              )}
            </div>
            
            {/* Pestañas de contenido */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex border-b border-gray-700 mb-6">
                <button
                  onClick={() => handleCambiarPestana('contenido')}
                  className={`px-4 py-3 font-medium transition-colors ${pestanaActiva === 'contenido' ? 'border-b-2 border-purple-500 text-white' : 'text-gray-400 hover:text-gray-300'}`}
                >
                  Contenido
                </button>
                <button
                  onClick={() => handleCambiarPestana('recursos')}
                  className={`px-4 py-3 font-medium transition-colors ${pestanaActiva === 'recursos' ? 'border-b-2 border-purple-500 text-white' : 'text-gray-400 hover:text-gray-300'}`}
                >
                  Recursos
                </button>
                <button
                  onClick={() => handleCambiarPestana('preguntas')}
                  className={`px-4 py-3 font-medium transition-colors ${pestanaActiva === 'preguntas' ? 'border-b-2 border-purple-500 text-white' : 'text-gray-400 hover:text-gray-300'}`}
                >
                  Preguntas
                </button>
              </div>
              
              {/* Contenido de las pestañas */}
              {pestanaActiva === 'contenido' && (
                <div>
                  {/* Cabecera con degradado */}
                  <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-xl p-6 mb-8 border border-gray-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm"></div>
                    <div className="relative z-10">
                      <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                        {curso.titulo}
                      </h2>
                      <p className="text-gray-300 mb-4">
                        {curso.descripcion}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="bg-purple-600/20 text-purple-400 text-xs px-3 py-1 rounded-full border border-purple-600/30">
                          {curso.tipo_curso || 'Todos los niveles'}
                        </span>
                        <span className="bg-pink-600/20 text-pink-400 text-xs px-3 py-1 rounded-full border border-pink-600/30">
                          {(() => {
                            // Formatear la duración según el valor y unidad
                            const duracion = curso.duracion;
                            if (!duracion) return '0 horas de contenido';
                            
                            // Si ya viene en formato "X horas" o similar, usarlo directamente
                            if (typeof duracion === 'string' && (duracion.includes('h') || duracion.includes('min'))) {
                              return `${duracion} de contenido`;
                            }
                            
                            // Si es un número, formatearlo como horas
                            return `${duracion} horas de contenido`;
                          })()}
                        </span>
                        <span className="bg-gray-700/30 text-gray-300 text-xs px-3 py-1 rounded-full border border-gray-700">
                          Actualizado {curso.fechaActualizacion}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Información sobre el instructor */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 w-1 h-6 rounded mr-3"></span>
                      Sobre el instructor
                    </h3>
                    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center">
                        <img 
                          src={curso.instructor.avatar} 
                          alt={curso.instructor.nombre}
                          className="w-16 h-16 rounded-full mb-4 sm:mb-0 sm:mr-6 border-2 border-purple-500/30" 
                        />
                        <div>
                          <h4 className="text-xl font-semibold text-white mb-1">{curso.instructor.nombre}</h4>
                          <p className="text-gray-400 mb-3">{curso.instructor.rol}</p>
                          <p className="text-gray-300">
                            Experto con amplia experiencia en enseñanza. Ha impartido más de 20 cursos en línea 
                            y ha ayudado a miles de estudiantes a desarrollar sus habilidades en este campo.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lo que aprenderás */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 w-1 h-6 rounded mr-3"></span>
                      Lo que aprenderás
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        'Dominarás los conceptos fundamentales de este campo',
                        'Aplicarás técnicas avanzadas en casos reales',
                        'Desarrollarás proyectos profesionales completos',
                        'Optimizarás tu flujo de trabajo con buenas prácticas',
                        'Resolverás problemas comunes de manera eficiente',
                        'Implementarás soluciones escalables y mantenibles'
                      ].map((item, index) => (
                        <div key={index} className="flex items-start p-3 bg-gray-800/20 rounded-lg border border-gray-700/30">
                          <FaCheck className="text-green-400 mt-1 mr-3 flex-shrink-0" />
                          <p className="text-gray-300">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Estadísticas del curso */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 w-1 h-6 rounded mr-3"></span>
                      Estadísticas del curso
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700/50 text-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-1">
                          {curso.numValoraciones}
                        </div>
                        <p className="text-gray-400">Estudiantes inscritos</p>
                      </div>
                      <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700/50 text-center">
                        <div className="flex justify-center text-yellow-400 mb-1">
                          {[...Array(5)].map((_, index) => (
                            <FaStar 
                              key={index}
                              className={index < Math.floor(curso.valoracion) ? 'text-yellow-400' : 'text-gray-600'}
                              size={20}
                            />
                          ))}
                        </div>
                        <p className="text-gray-400">{curso.valoracion} valoración promedio</p>
                      </div>
                      <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700/50 text-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-1">
                          {curso.duracion || '0'} h
                        </div>
                        <p className="text-gray-400">Duración total</p>
                      </div>
                    </div>
                  </div>

                  {/* Requisitos previos */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 w-1 h-6 rounded mr-3"></span>
                      Requisitos previos
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li>Conocimientos básicos de programación</li>
                      <li>Familiaridad con entornos de desarrollo</li>
                      <li>Ordenador con acceso a internet</li>
                      <li>Interés en aprender y practicar los conceptos</li>
                    </ul>
                  </div>

                  {/* Para quién es este curso */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 w-1 h-6 rounded mr-3"></span>
                      Para quién es este curso
                    </h3>
                    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                      <ul className="space-y-4">
                        <li className="flex items-start">
                          <div className="bg-purple-600/20 p-2 rounded-lg mr-4 flex-shrink-0">
                            <FaPlay className="text-purple-400" size={14} />
                          </div>
                          <div>
                            <h4 className="text-white font-medium mb-1">Principiantes con conocimientos básicos</h4>
                            <p className="text-gray-400">Personas con fundamentos que quieren profundizar sus habilidades</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-pink-600/20 p-2 rounded-lg mr-4 flex-shrink-0">
                            <FaPlay className="text-pink-400" size={14} />
                          </div>
                          <div>
                            <h4 className="text-white font-medium mb-1">Profesionales buscando actualización</h4>
                            <p className="text-gray-400">Desarrolladores que necesitan ponerse al día con las nuevas técnicas</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-purple-600/20 p-2 rounded-lg mr-4 flex-shrink-0">
                            <FaPlay className="text-purple-400" size={14} />
                          </div>
                          <div>
                            <h4 className="text-white font-medium mb-1">Estudiantes de carreras técnicas</h4>
                            <p className="text-gray-400">Complemento perfecto para reforzar conocimientos académicos</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {pestanaActiva === 'recursos' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">
                    Recursos del curso
                  </h2>
                  
                  {!haComprado && (
                    <div className="bg-gray-800/50 rounded-xl p-5 mb-6 border border-gray-700/50">
                      <div className="flex items-start">
                        <FaInfoCircle className="text-purple-400 mt-1 mr-3 flex-shrink-0" size={18} />
                        <p className="text-gray-300">
                          <span className="font-semibold text-white">Acceso limitado a recursos:</span> Solo los estudiantes inscritos pueden descargar todos los recursos del curso. Inscríbete para desbloquear {curso.recursos.filter(r => r.bloqueado).length} recursos adicionales.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {curso.recursos.map(recurso => (
                      <motion.div 
                        key={recurso.id}
                        whileHover={!recurso.bloqueado ? { y: -2 } : {}}
                        className={`p-4 rounded-xl ${recurso.bloqueado ? 'bg-gray-800/50' : 'bg-gray-700/30'} flex items-center justify-between ${recurso.bloqueado && !haComprado ? 'border border-gray-700/50' : ''}`}
                      >
                        <div className="flex items-center">
                          <div className="mr-3">
                            {recurso.tipo === 'pdf' && <FaDownload className={`${recurso.bloqueado && !haComprado ? 'text-gray-500' : 'text-purple-400'}`} size={18} />}
                            {recurso.tipo === 'zip' && <FaDownload className={`${recurso.bloqueado && !haComprado ? 'text-gray-500' : 'text-blue-400'}`} size={18} />}
                          </div>
                          <div>
                            <p className={`font-medium ${recurso.bloqueado && !haComprado ? 'text-gray-500' : 'text-white'}`}>
                              {recurso.titulo}
                            </p>
                            <p className="text-sm text-gray-400">{recurso.tamano}</p>
                          </div>
                        </div>
                        
                        {recurso.bloqueado && !haComprado ? (
                          <div className="flex items-center">
                            <div className="bg-gray-800 p-1 rounded-lg border border-gray-700">
                              <FaLock size={14} className="text-pink-400" />
                            </div>
                            <span className="ml-2 text-gray-400 text-sm">Contenido premium</span>
                          </div>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                          >
                            Descargar
                          </motion.button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              
              {pestanaActiva === 'preguntas' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">
                    Preguntas frecuentes
                  </h2>
                  <div className="space-y-6">
                    {curso.preguntas.map(pregunta => (
                      <div key={pregunta.id} className="border-b border-gray-700 pb-6 last:border-b-0 last:pb-0">
                        <div className="flex items-start mb-3">
                          <img 
                            src={pregunta.avatarUsuario} 
                            alt={pregunta.usuario}
                            className="w-8 h-8 rounded-full mr-3" 
                          />
                          <div>
                            <p className="text-white font-medium">{pregunta.usuario}</p>
                            <p className="text-xs text-gray-400">{pregunta.fecha}</p>
                          </div>
                        </div>
                        <p className="text-gray-200 mb-3">{pregunta.texto}</p>
                        <div className="bg-gray-700/30 rounded-xl p-4 ml-6">
                          <p className="text-gray-300">{pregunta.respuesta}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Columna derecha: Progreso del curso */}
          <div className="lg:sticky lg:top-24 self-start">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-bold text-white mb-6">Contenido del curso</h2>
              
              {!haComprado && (
                <div className="mb-6 p-4 bg-gray-900/60 rounded-xl border border-gray-700">
                  <div className="flex items-center mb-3">
                    <div className="bg-purple-600/20 p-2 rounded-full mr-3">
                      <FaRegClock className="text-purple-400" size={16} />
                    </div>
                    <h3 className="text-white font-medium">Acceso de prueba</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">Tienes acceso gratuito al primer módulo del curso. Inscríbete para acceder a:</p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-300 text-sm">
                      <FaCheck className="text-green-400 mr-2" size={12} /> Todos los módulos y lecciones
                    </li>
                    <li className="flex items-center text-gray-300 text-sm">
                      <FaCheck className="text-green-400 mr-2" size={12} /> Recursos y materiales descargables
                    </li>
                    <li className="flex items-center text-gray-300 text-sm">
                      <FaCheck className="text-green-400 mr-2" size={12} /> Acceso de por vida y actualizaciones
                    </li>
                  </ul>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleComprarCurso}
                    className="w-full mt-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all text-sm"
                  >
                    Inscribirme ahora
                  </motion.button>
                </div>
              )}
              
              <ProgresoModulos 
                modulos={curso.modulos}
                moduloActual={moduloActual}
                leccionActual={leccionActual}
                onSeleccionarLeccion={handleSeleccionLeccion}
                haComprado={haComprado}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisorCurso;
