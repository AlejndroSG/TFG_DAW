import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaLightbulb, FaEdit, FaDownload, FaStar, FaShare, FaLock, FaCheck, FaPlay } from 'react-icons/fa';
import ProgresoModulos from '../components/Curso/ProgresoModulos';
import ReproductorVideo from '../components/Curso/ReproductorVideo';
import axios from 'axios';

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
  
  // Simulamos datos del curso (en producción vendrían de tu API)
  useEffect(() => {
    // Simulación de una llamada a la API
    const fetchCurso = async () => {
      try {
        // En producción, esta sería una llamada real a tu API
        // const response = await axios.get(`/api/cursos/${cursoId}`);
        
        // Datos simulados
        const cursoSimulado = {
          id: cursoId,
          titulo: 'Curso completo de desarrollo web',
          descripcion: 'Aprende a crear sitios web profesionales desde cero con las últimas tecnologías.',
          instructor: {
            id: 1,
            nombre: 'María González',
            avatar: 'https://i.pravatar.cc/150?img=37',
            rol: 'Desarrolladora Web Senior'
          },
          precio: 49.99,
          valoracion: 4.8,
          numValoraciones: 256,
          fechaActualizacion: '2025-04-20',
          modulos: [
            {
              id: 1,
              titulo: 'Introducción al curso',
              completado: true,
              progreso: 100,
              lecciones: [
                { id: 1, titulo: 'Bienvenida y presentación', duracion: '05:30', completada: true },
                { id: 2, titulo: 'Requisitos previos', duracion: '08:45', completada: true },
                { id: 3, titulo: 'Configuración del entorno', duracion: '12:20', completada: true }
              ]
            },
            {
              id: 2,
              titulo: 'Fundamentos básicos',
              completado: true,
              progreso: 100,
              lecciones: [
                { id: 4, titulo: 'Conceptos fundamentales', duracion: '15:10', completada: true },
                { id: 5, titulo: 'Primeros ejemplos prácticos', duracion: '18:30', completada: true },
                { id: 6, titulo: 'Ejercicios guiados', duracion: '22:15', completada: true }
              ]
            },
            {
              id: 3,
              titulo: 'Técnicas avanzadas',
              completado: false,
              progreso: 33,
              lecciones: [
                { id: 7, titulo: 'Patrones avanzados', duracion: '20:45', completada: true },
                { id: 8, titulo: 'Optimización y buenas prácticas', duracion: '25:30', completada: false },
                { id: 9, titulo: 'Casos de estudio reales', duracion: '30:00', completada: false }
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
            { id: 1, titulo: 'Presentación del curso', tipo: 'pdf', tamano: '2.4 MB' },
            { id: 2, titulo: 'Código fuente de ejemplos', tipo: 'zip', tamano: '15 MB' },
            { id: 3, titulo: 'Guía de referencia rápida', tipo: 'pdf', tamano: '1.8 MB' },
            { id: 4, titulo: 'Plantillas de proyectos', tipo: 'zip', tamano: '8.5 MB', premium: true }
          ],
          preguntas: [
            { 
              id: 1, 
              usuario: 'Carlos S.', 
              fecha: '2025-05-01', 
              texto: '¿Este curso es adecuado para principiantes?',
              respuesta: 'Sí, el curso está diseñado para todos los niveles, comenzamos desde lo básico y avanzamos gradualmente.',
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
        
        setCurso(cursoSimulado);
        
        // Establecer la primera lección como actual
        if (cursoSimulado.modulos.length > 0 && cursoSimulado.modulos[0].lecciones.length > 0) {
          setLeccionActual(cursoSimulado.modulos[0].lecciones[0]);
          setModuloActual(cursoSimulado.modulos[0]);
        }
        
        setCargando(false);
      } catch (error) {
        console.error('Error al cargar los datos del curso:', error);
        setMensaje({
          tipo: 'error',
          texto: 'No se pudo cargar el curso. Por favor, inténtalo de nuevo.'
        });
        setCargando(false);
      }
    };
    
    fetchCurso();
    
    // Verificamos si el usuario ha comprado el curso (simulado)
    const verificarCompra = async () => {
      try {
        // En un caso real, esto sería una llamada a tu API
        // const response = await axios.get(`/api/usuarios/cursos/${cursoId}/verificar-compra`);
        // setHaComprado(response.data.comprado);
        
        // Por ahora, lo simulamos con un estado falso (no ha comprado)
        setHaComprado(false);
      } catch (error) {
        console.error('Error al verificar la compra:', error);
      }
    };
    
    verificarCompra();
  }, [cursoId]);
  
  const handleSeleccionarLeccion = (leccion, modulo) => {
    // En un caso real, verificaríamos si la lección está desbloqueada
    if (leccion.bloqueada) {
      setMensaje({
        tipo: 'advertencia',
        texto: 'Esta lección está bloqueada. Adquiere el curso completo para acceder a todo el contenido.'
      });
      return;
    }
    
    setLeccionActual(leccion);
    setModuloActual(modulo);
    
    // En un caso real, aquí registraríamos el progreso del usuario
    // axios.post('/api/progreso', { leccionId: leccion.id, cursoId });
  };
  
  const completarLeccion = () => {
    // En un caso real, marcaríamos la lección como completada en la base de datos
    // y actualizaríamos el estado local
    console.log('Lección completada:', leccionActual?.id);
    
    // Actualizar el estado de leccionActual para mostrarla como completada
    if (leccionActual) {
      setLeccionActual({
        ...leccionActual,
        completada: true
      });
      
      // En un caso real, aquí se actualizaría también el estado del curso completo
      // con la lección marcada como completada
    }
  };
  
  const handleComprarCurso = () => {
    // Redirigir a la página de pago
    navigate(`/pago/${cursoId}`);
  };
  
  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-purple-600 border-r-pink-600 border-b-purple-600 border-l-pink-600 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!curso) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Curso no encontrado</h2>
          <p className="mb-4">No pudimos encontrar el curso que estás buscando.</p>
          <button 
            onClick={() => navigate('/cursos')}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:shadow-lg hover:shadow-purple-500/20"
          >
            Ver todos los cursos
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 pt-20">
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
            <h1 className="text-lg sm:text-xl font-bold text-white truncate max-w-[250px] sm:max-w-md">
              {curso.titulo}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {!haComprado && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleComprarCurso}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/20 transition-all"
              >
                Comprar ({curso.precio}€)
              </motion.button>
            )}
            
            <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-800 text-white transition-colors">
              <FaShare size={16} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mensaje de notificación */}
      <AnimatePresence>
        {mensaje && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg ${
              mensaje.tipo === 'error' ? 'bg-red-500' : 
              mensaje.tipo === 'exito' ? 'bg-green-500' : 
              'bg-amber-500'
            } text-white`}
          >
            <p>{mensaje.texto}</p>
            <button 
              onClick={() => setMensaje(null)}
              className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center text-white/70 hover:text-white"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel izquierdo - Reproductor y detalles */}
          <div className="lg:col-span-2 space-y-6">
            {/* Reproductor de video */}
            <ReproductorVideo 
              leccion={leccionActual} 
              bloqueado={leccionActual?.bloqueada}
              onComplete={completarLeccion} 
            />
            
            {/* Información de la lección */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-bold text-white mb-2">{leccionActual?.titulo}</h2>
              <div className="flex items-center space-x-2 text-gray-400 text-sm mb-6">
                <span>{moduloActual?.titulo}</span>
                <span>•</span>
                <span>{leccionActual?.duracion}</span>
                {leccionActual?.completada && (
                  <>
                    <span>•</span>
                    <span className="flex items-center text-green-400">
                      <FaCheck size={12} className="mr-1" /> Completada
                    </span>
                  </>
                )}
              </div>
              
              {/* Pestañas de contenido */}
              <div className="border-b border-gray-700/50 mb-6">
                <div className="flex space-x-6">
                  {['contenido', 'recursos', 'preguntas'].map((tab) => (
                    <button 
                      key={tab}
                      onClick={() => setPestanaActiva(tab)}
                      className={`pb-3 px-2 font-medium capitalize ${
                        pestanaActiva === tab 
                          ? 'text-purple-400 border-b-2 border-purple-400' 
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Contenido de pestañas */}
              <div>
                {pestanaActiva === 'contenido' && (
                  <div className="prose prose-invert max-w-none">
                    <p>
                      En esta lección aprenderás conceptos fundamentales sobre desarrollo web moderno.
                      Exploraremos las mejores prácticas de la industria y cómo implementarlas en tus proyectos.
                    </p>
                    <h3>Objetivos de aprendizaje</h3>
                    <ul>
                      <li>Comprender la estructura básica de una aplicación web</li>
                      <li>Familiarizarse con las herramientas de desarrollo esenciales</li>
                      <li>Crear componentes reutilizables siguiendo estándares actuales</li>
                      <li>Implementar sistemas de diseño escalables</li>
                    </ul>
                    <div className="bg-gray-800/70 p-4 rounded-xl border border-gray-700/50 flex items-start mt-6">
                      <div className="text-yellow-400 mr-3 mt-1">
                        <FaLightbulb size={20} />
                      </div>
                      <div>
                        <h4 className="text-yellow-400 font-semibold mb-1">Consejo profesional</h4>
                        <p className="text-sm text-gray-300">
                          Siempre prueba tu código en diferentes navegadores para asegurar la compatibilidad.
                          Herramientas como BrowserStack pueden ayudarte a simular diferentes entornos.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {pestanaActiva === 'recursos' && (
                  <div>
                    <ul className="divide-y divide-gray-700/50">
                      {curso.recursos.map((recurso) => (
                        <li key={recurso.id} className="py-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`w-10 h-10 rounded-lg mr-4 flex items-center justify-center ${
                                recurso.tipo === 'pdf' ? 'bg-red-500/20' : 
                                recurso.tipo === 'zip' ? 'bg-blue-500/20' : 
                                'bg-green-500/20'
                              }`}>
                                <span className="uppercase text-xs font-bold">{recurso.tipo}</span>
                              </div>
                              <div>
                                <h4 className="text-white font-medium">{recurso.titulo}</h4>
                                <p className="text-gray-400 text-sm">{recurso.tamano}</p>
                              </div>
                            </div>
                            
                            {recurso.premium && !haComprado ? (
                              <div className="flex items-center text-gray-500">
                                <FaLock size={14} className="mr-2" />
                                <span>Premium</span>
                              </div>
                            ) : (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
                              >
                                <FaDownload size={14} />
                              </motion.button>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                    
                    {!haComprado && (
                      <div className="mt-4 p-4 border border-gray-700/50 rounded-xl bg-gray-800/50 text-center">
                        <p className="text-gray-300 mb-3">
                          Adquiere este curso para desbloquear todos los recursos premium.
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleComprarCurso}
                          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                        >
                          Comprar curso ahora
                        </motion.button>
                      </div>
                    )}
                  </div>
                )}
                
                {pestanaActiva === 'preguntas' && (
                  <div>
                    <ul className="space-y-5">
                      {curso.preguntas.map((pregunta) => (
                        <li key={pregunta.id} className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                          <div className="flex items-start mb-3">
                            <img 
                              src={pregunta.avatarUsuario} 
                              alt={pregunta.usuario} 
                              className="w-10 h-10 rounded-full mr-3 object-cover"
                            />
                            <div>
                              <div className="flex items-baseline">
                                <h4 className="text-white font-medium mr-2">{pregunta.usuario}</h4>
                                <span className="text-gray-500 text-xs">{pregunta.fecha}</span>
                              </div>
                              <p className="text-gray-300 mt-1">{pregunta.texto}</p>
                            </div>
                          </div>
                          
                          {pregunta.respuesta && (
                            <div className="ml-12 pl-4 border-l-2 border-purple-500/30">
                              <div className="flex items-baseline">
                                <h5 className="text-purple-400 font-medium mr-2">Instructor</h5>
                                <span className="text-gray-500 text-xs">Respuesta</span>
                              </div>
                              <p className="text-gray-400 mt-1">{pregunta.respuesta}</p>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-6">
                      <h4 className="text-white font-medium mb-3">Haz una pregunta</h4>
                      <textarea 
                        className="w-full bg-gray-800/30 border border-gray-700/50 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none h-24"
                        placeholder="Escribe tu pregunta aquí..."
                      />
                      <div className="flex justify-end mt-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                        >
                          Enviar pregunta
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Valoraciones y reseñas */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Valoraciones y reseñas</h3>
                <div className="flex items-center">
                  <div className="flex items-center text-yellow-400 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} size={16} className={i < Math.floor(curso.valoracion) ? "text-yellow-400" : "text-gray-600"} />
                    ))}
                  </div>
                  <span className="text-white font-semibold">{curso.valoracion}</span>
                  <span className="text-gray-400 ml-1">({curso.numValoraciones})</span>
                </div>
              </div>
              
              {/* Aquí irían las reseñas, pero las omitimos por brevedad */}
              <div className="text-center py-4">
                <p className="text-gray-400 mb-4">
                  {haComprado 
                    ? '¿Has completado el curso? Comparte tu experiencia con otros estudiantes.'
                    : 'Las valoraciones están disponibles solo para estudiantes que han completado el curso.'}
                </p>
                
                {haComprado ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                  >
                    <FaEdit className="inline mr-2" />
                    Escribir reseña
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleComprarCurso}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                  >
                    Comprar curso
                  </motion.button>
                )}
              </div>
            </div>
          </div>
          
          {/* Panel derecho - Progreso y módulos */}
          <div className="space-y-6">
            {/* Información del instructor */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-bold text-white mb-4">Sobre el instructor</h3>
              <div className="flex items-center mb-4">
                <img 
                  src={curso.instructor.avatar} 
                  alt={curso.instructor.nombre}
                  className="w-16 h-16 rounded-full mr-4 object-cover border-2 border-purple-500"
                />
                <div>
                  <h4 className="text-white font-medium">{curso.instructor.nombre}</h4>
                  <p className="text-gray-400 text-sm">{curso.instructor.rol}</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                Profesional con más de 10 años de experiencia en desarrollo web y educación tecnológica.
                Especialista en crear contenido didáctico para todos los niveles.
              </p>
              <div className="mt-4">
                <button className="text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors">
                  Ver perfil completo
                </button>
              </div>
            </div>
            
            {/* Componente de progreso */}
            <ProgresoModulos 
              curso={curso} 
              onSeleccionarLeccion={handleSeleccionarLeccion} 
            />
            
            {/* Información adicional */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-bold text-white mb-4">Detalles del curso</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span className="text-gray-400">Última actualización</span>
                  <span className="text-white">{curso.fechaActualizacion}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-400">Total de lecciones</span>
                  <span className="text-white">
                    {curso.modulos.reduce((acc, modulo) => acc + modulo.lecciones.length, 0)}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-400">Nivel</span>
                  <span className="text-white">Todos los niveles</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-400">Idioma</span>
                  <span className="text-white">Español</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-400">Certificado</span>
                  <span className="text-white">Sí, al completar</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisorCurso;
