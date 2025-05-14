import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaLock, FaPlay, FaDownload, FaClipboardCheck, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const ProgresoModulos = ({ curso, onSeleccionarLeccion }) => {
  const [moduloExpandido, setModuloExpandido] = useState(null);

  // En un caso real, estos datos vendrían de tu API
  const modulos = [
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
      bloqueado: true,
      lecciones: [
        { id: 10, titulo: 'Planificación del proyecto', duracion: '15:20', completada: false, bloqueada: true },
        { id: 11, titulo: 'Desarrollo guiado', duracion: '35:45', completada: false, bloqueada: true },
        { id: 12, titulo: 'Pruebas y despliegue', duracion: '25:10', completada: false, bloqueada: true }
      ]
    }
  ];

  // Calcular el progreso global del curso
  const progresoTotal = Math.round(
    modulos.reduce((acc, modulo) => acc + modulo.progreso, 0) / modulos.length
  );

  const toggleModulo = (moduloId) => {
    setModuloExpandido(moduloExpandido === moduloId ? null : moduloId);
  };

  const handleSeleccionarLeccion = (leccion, modulo) => {
    if (leccion.bloqueada) return;
    
    if (onSeleccionarLeccion) {
      onSeleccionarLeccion(leccion, modulo);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50">
      {/* Barra de progreso general */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-white">Progreso del curso</h3>
          <span className="text-white font-semibold">{progresoTotal}%</span>
        </div>
        
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progresoTotal}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
          />
        </div>
        
        {progresoTotal === 100 ? (
          <div className="mt-4 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all"
            >
              <FaDownload className="mr-2" /> Descargar certificado
            </motion.button>
          </div>
        ) : progresoTotal >= 80 ? (
          <p className="text-green-400 text-sm mt-3 text-center">
            <FaClipboardCheck className="inline mr-1" /> ¡Casi lo tienes! Completa todas las lecciones para obtener tu certificado.
          </p>
        ) : (
          <p className="text-gray-400 text-sm mt-3 text-center">
            Completa el curso para obtener tu certificado de finalización.
          </p>
        )}
      </div>
      
      {/* Lista de módulos */}
      <div className="divide-y divide-gray-700/50">
        {modulos.map((modulo) => (
          <div key={modulo.id} className={modulo.bloqueado ? 'opacity-70' : ''}>
            <button
              onClick={() => !modulo.bloqueado && toggleModulo(modulo.id)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-800/70 transition-colors"
              disabled={modulo.bloqueado}
            >
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  modulo.completado 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                    : modulo.bloqueado 
                      ? 'bg-gray-700/30 text-gray-500 border border-gray-600/30' 
                      : 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                }`}>
                  {modulo.completado ? (
                    <FaCheck size={14} />
                  ) : modulo.bloqueado ? (
                    <FaLock size={14} />
                  ) : (
                    <span className="text-xs font-semibold">{modulo.progreso}%</span>
                  )}
                </div>
                
                <div>
                  <h4 className="font-semibold text-white">{modulo.titulo}</h4>
                  <p className="text-xs text-gray-400">{modulo.lecciones.length} lecciones • {modulo.completado ? 'Completado' : modulo.bloqueado ? 'Bloqueado' : 'En progreso'}</p>
                </div>
              </div>
              
              {!modulo.bloqueado && (
                <div className="text-gray-400">
                  {moduloExpandido === modulo.id ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              )}
            </button>
            
            <AnimatePresence>
              {moduloExpandido === modulo.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden bg-gray-900/50"
                >
                  <ul className="p-3">
                    {modulo.lecciones.map((leccion) => (
                      <li key={leccion.id} className="pl-11 pr-4">
                        <button 
                          onClick={() => handleSeleccionarLeccion(leccion, modulo)}
                          disabled={leccion.bloqueada}
                          className={`w-full py-3 px-4 my-1 flex items-center justify-between rounded-xl ${
                            leccion.completada 
                              ? 'bg-green-500/10 border border-green-500/20 hover:bg-green-500/15'
                              : leccion.bloqueada
                                ? 'bg-gray-800/30 border border-gray-700/30 cursor-not-allowed'
                                : 'bg-gray-800/80 border border-gray-700/50 hover:bg-gray-800 hover:border-purple-500/30'
                          } transition-all`}
                        >
                          <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                              leccion.completada 
                                ? 'bg-green-500/20 text-green-400' 
                                : leccion.bloqueada
                                  ? 'bg-gray-700 text-gray-500'
                                  : 'bg-purple-500/20 text-purple-400'
                            }`}>
                              {leccion.completada ? (
                                <FaCheck size={10} />
                              ) : leccion.bloqueada ? (
                                <FaLock size={10} />
                              ) : (
                                <FaPlay size={10} />
                              )}
                            </div>
                            
                            <div className="text-left">
                              <h5 className={leccion.bloqueada ? 'text-gray-500' : 'text-white'}>{leccion.titulo}</h5>
                              <p className="text-xs text-gray-500">{leccion.duracion}</p>
                            </div>
                          </div>
                          
                          {!leccion.bloqueada && !leccion.completada && (
                            <motion.div 
                              whileHover={{ scale: 1.1 }}
                              className="text-purple-400 bg-purple-500/10 p-1 rounded-full"
                            >
                              <FaPlay size={12} />
                            </motion.div>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgresoModulos;
