import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaBook, FaPlay, FaLock, FaCheck, FaImage } from 'react-icons/fa';
import { toast } from 'react-toastify';

const MisCursos = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerCursosInscritos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(
          'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=obtenerMisCursos',
          { withCredentials: true }
        );
        
        console.log('Respuesta de obtenerMisCursos:', response.data);
        
        if (response.data && Array.isArray(response.data)) {
          setCursos(response.data);
        } else if (response.data && response.data.error) {
          setError(response.data.error);
          toast.error(`Error: ${response.data.error}`);
        } else {
          setError('No se pudieron cargar los cursos');
          toast.error('No se pudieron cargar los cursos');
        }
      } catch (err) {
        console.error('Error al obtener cursos inscritos:', err);
        setError('Error de conexión al servidor');
        toast.error('Error de conexión al servidor');
      } finally {
        setLoading(false);
      }
    };

    obtenerCursosInscritos();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-700/50">
        <div className="flex items-center border-b border-purple-500/30 pb-4 mb-6">
          <span className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-full p-2 mr-3">
            <FaBook className="w-5 h-5 text-white" />
          </span>
          <h2 className="text-2xl font-semibold text-white">Mis Cursos</h2>
        </div>
        
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <span className="ml-3 text-white">Cargando tus cursos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-700/50">
      <div className="flex items-center border-b border-purple-500/30 pb-4 mb-6">
        <span className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-full p-2 mr-3">
          <FaBook className="w-5 h-5 text-white" />
        </span>
        <h2 className="text-2xl font-semibold text-white">Mis Cursos</h2>
      </div>
      
      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4 mb-6 text-red-200">
          <p>{error}</p>
        </div>
      )}

      {!error && cursos.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-400 mb-4">Aún no te has inscrito en ningún curso</p>
          <Link to="/cursos" 
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
            Explorar cursos disponibles
          </Link>
        </div>
      )}
      
      {cursos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cursos.map(curso => (
            <motion.div
              key={curso.id_curso || `curso-${Math.random()}`}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700/50 group"
            >
              <div className="h-48 overflow-hidden relative">
                {curso.imgCurso ? (
                  <img 
                    src={curso.imgCurso} 
                    alt={curso.titulo || 'Imagen de curso'} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-500" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-900 to-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <FaImage className="h-16 w-16 mx-auto text-gray-500/70" />
                      <p className="text-gray-400 mt-2 text-sm">{curso.titulo || 'Curso'}</p>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center">
                    <span className="bg-purple-600/90 text-white text-xs font-medium px-2 py-1 rounded-md">
                      {new Date(curso.fecha_inscripcion).toLocaleDateString()}
                    </span>
                    {curso.progreso_completado && (
                      <span className="ml-2 bg-green-600/90 text-white text-xs font-medium px-2 py-1 rounded-md flex items-center">
                        <FaCheck className="mr-1" /> Completado
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {curso.titulo || 'Curso sin título'}
                </h3>
                <p className="text-gray-400 mb-4 line-clamp-2">{curso.descripcion || 'Sin descripción'}</p>
                <div className="mt-auto flex justify-between items-center">
                  <div className="text-sm text-gray-400">
                    <span className="block">
                      Progreso: {curso.progreso || 0}%
                    </span>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600" 
                        style={{width: `${curso.progreso || 0}%`}}
                      ></div>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/curso/${curso.id_curso}`}
                    className="flex items-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                  >
                    <FaPlay className="mr-2" /> Continuar
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisCursos;
