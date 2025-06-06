import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlay, 
  FaPause, 
  FaExpand, 
  FaCompress, 
  FaVolumeUp, 
  FaVolumeMute,
  FaCog,
  FaLock,
  FaDownload,
  FaListUl
} from 'react-icons/fa';

const ReproductorVideo = ({ leccion, bloqueado = false, videoUrl = null, onComplete = () => {}, cursoId = null }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const containerRef = useRef(null);

  const [reproduciendo, setReproduciendo] = useState(false);
  const [pantallaCompleta, setPantallaCompleta] = useState(false);
  const [silenciado, setSilenciado] = useState(false);
  const [duracion, setDuracion] = useState(0);
  const [tiempoActual, setTiempoActual] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [mostrarControles, setMostrarControles] = useState(true);
  const [volumen, setVolumen] = useState(1);
  const [mostrarAjustes, setMostrarAjustes] = useState(false);
  const [calidad, setCalidad] = useState('720p');
  const [velocidad, setVelocidad] = useState(1);
  const [completado, setCompletado] = useState(false);
  
  // Controladores de temporizador para ocultar controles
  const hideControlsTimerRef = useRef(null);
  
  // Si no se proporciona una URL específica, usamos una URL predeterminada
  // Asegurarnos que siempre tenemos un valor válido para videoSrc y que nunca sea undefined
  const videoSrc = !bloqueado && (videoUrl || 'https://player.vimeo.com/external/369906533.sd.mp4?s=56153d60c46dfc3956fc7d065a109a378675e7b8&profile_id=165&oauth2_token_id=57447761');
  
  // Simular carga de video
  useEffect(() => {
    if (!bloqueado) {
      const timer = setTimeout(() => {
        setCargando(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [bloqueado]);
  
  // Configuración inicial
  useEffect(() => {
    if (videoRef.current && !bloqueado) {
      videoRef.current.volume = volumen;
      
      videoRef.current.addEventListener('loadedmetadata', () => {
        setDuracion(videoRef.current.duration);
      });
      
      videoRef.current.addEventListener('timeupdate', () => {
        setTiempoActual(videoRef.current.currentTime);
        
        // Marcar como completado si se reprodujo el 95% del video
        if (!completado && (videoRef.current.currentTime / videoRef.current.duration) > 0.95) {
          setCompletado(true);
          onComplete();
        }
      });
    }
    
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadedmetadata', () => {});
        videoRef.current.removeEventListener('timeupdate', () => {});
      }
    };
  }, [bloqueado, completado, onComplete]);
  
  // Gestión de mostrar/ocultar controles
  useEffect(() => {
    const handleMouseMove = () => {
      setMostrarControles(true);
      
      if (hideControlsTimerRef.current) {
        clearTimeout(hideControlsTimerRef.current);
      }
      
      if (reproduciendo) {
        hideControlsTimerRef.current = setTimeout(() => {
          setMostrarControles(false);
        }, 3000);
      }
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', () => {
        if (reproduciendo) {
          setMostrarControles(false);
        }
      });
    }
    
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', () => {});
      }
      if (hideControlsTimerRef.current) {
        clearTimeout(hideControlsTimerRef.current);
      }
    };
  }, [reproduciendo]);
  
  const toggleReproduccion = () => {
    if (videoRef.current) {
      if (reproduciendo) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setReproduciendo(!reproduciendo);
    }
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !silenciado;
      setSilenciado(!silenciado);
    }
  };
  
  const togglePantallaCompleta = () => {
    if (!containerRef.current) return;
    
    if (!pantallaCompleta) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.mozRequestFullScreen) {
        containerRef.current.mozRequestFullScreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setPantallaCompleta(isFullscreen);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);
  
  const handleProgressClick = (e) => {
    if (!videoRef.current || !progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * duracion;
  };
  
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolumen(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setSilenciado(true);
    } else if (silenciado) {
      setSilenciado(false);
    }
  };
  
  const handleSetQuality = (newQuality) => {
    setCalidad(newQuality);
    setMostrarAjustes(false);
    // En un caso real, aquí cambiarías la fuente del video
  };
  
  const handleSetSpeed = (newSpeed) => {
    setVelocidad(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
    setMostrarAjustes(false);
  };
  
  // Formatear tiempo (segundos a MM:SS)
  const formatTime = (time) => {
    if (isNaN(time)) return '00:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Contenido para mostrar cuando el video está bloqueado
  if (bloqueado) {
    return (
      <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center text-center p-6">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 border-2 border-gray-700">
            <FaLock size={24} className="text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Contenido bloqueado</h3>
          <p className="text-gray-400 max-w-md mb-6">
            Este contenido está disponible solo para estudiantes inscritos. 
            Matricúlate en este curso para acceder a todas las lecciones.
          </p>
          <motion.button
            onClick={() => navigate(`/pago/${cursoId}`)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all"
          >
            Inscribirse al curso
          </motion.button>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative aspect-video bg-black rounded-2xl overflow-hidden"
    >
      {cargando && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
          <div className="w-12 h-12 border-4 border-t-purple-600 border-r-pink-600 border-b-purple-600 border-l-pink-600 border-solid rounded-full animate-spin"></div>
        </div>
      )}
      
      {videoSrc ? (
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-cover rounded-t-xl"
          preload="auto"
          playsInline
          onPlay={() => setReproduciendo(true)}
          onPause={() => setReproduciendo(false)}
          onEnded={() => {
            setReproduciendo(false);
            // Marcar como completado
            if (!completado) {
              setCompletado(true);
              onComplete();
            }
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
          <div className="text-center p-6">
            <FaLock size={40} className="mx-auto mb-4 text-pink-500" />
            <h3 className="text-xl font-bold mb-2">Contenido bloqueado</h3>
            <p className="text-gray-300">
              Este video está disponible al comprar el curso completo.
            </p>
          </div>
        </div>
      )}
      
      {/* Overlay para controles */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: mostrarControles ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Título de la lección */}
      <motion.div
        className="absolute top-0 left-0 right-0 p-5 pointer-events-none"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: mostrarControles ? 1 : 0, y: mostrarControles ? 0 : -20 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-white font-semibold text-lg drop-shadow-md">
          {leccion?.titulo || 'Título de la lección'}
        </h3>
      </motion.div>
      
      {/* Controles de reproducción */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: mostrarControles ? 1 : 0, y: mostrarControles ? 0 : 20 }}
        transition={{ duration: 0.3 }}
      >
        {/* Barra de progreso */}
        <div 
          ref={progressRef}
          className="relative h-1.5 bg-gray-600/50 rounded-full mb-4 cursor-pointer"
          onClick={handleProgressClick}
        >
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
            style={{ width: `${(tiempoActual / duracion) * 100}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Botón play/pause */}
            <button 
              onClick={toggleReproduccion}
              className="text-white hover:text-purple-400 transition-colors"
            >
              {reproduciendo ? <FaPause size={18} /> : <FaPlay size={18} />}
            </button>
            
            {/* Tiempos */}
            <div className="text-white text-sm">
              <span>{formatTime(tiempoActual)}</span>
              <span className="mx-1">/</span>
              <span>{formatTime(duracion)}</span>
            </div>
            
            {/* Control de volumen */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleMute}
                className="text-white hover:text-purple-400 transition-colors"
              >
                {silenciado ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
              </button>
              
              <input 
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volumen}
                onChange={handleVolumeChange}
                className="w-16 h-1 accent-purple-500 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Menú de ajustes */}
            <div className="relative">
              <button 
                onClick={() => setMostrarAjustes(!mostrarAjustes)}
                className="text-white hover:text-purple-400 transition-colors relative"
              >
                <FaCog size={18} className={mostrarAjustes ? "animate-spin" : ""} />
              </button>
              
              {mostrarAjustes && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute bottom-10 right-0 bg-gray-800 rounded-xl shadow-xl border border-gray-700/50 p-3 w-44"
                >
                  <div className="mb-3">
                    <p className="text-gray-400 text-xs mb-1">Calidad</p>
                    <div className="grid grid-cols-3 gap-1">
                      {['1080p', '720p', '480p'].map((q) => (
                        <button 
                          key={q}
                          onClick={() => handleSetQuality(q)}
                          className={`text-xs py-1 px-2 rounded ${
                            calidad === q
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Velocidad</p>
                    <div className="grid grid-cols-4 gap-1">
                      {[0.5, 1, 1.5, 2].map((s) => (
                        <button 
                          key={s}
                          onClick={() => handleSetSpeed(s)}
                          className={`text-xs py-1 px-2 rounded ${
                            velocidad === s
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Botón de descargar */}
            <button 
              className="text-white hover:text-purple-400 transition-colors"
              title="Descargar recursos"
            >
              <FaDownload size={18} />
            </button>
            
            {/* Botón de capítulos */}
            <button 
              className="text-white hover:text-purple-400 transition-colors"
              title="Ver capítulos"
            >
              <FaListUl size={18} />
            </button>
            
            {/* Botón pantalla completa */}
            <button 
              onClick={togglePantallaCompleta}
              className="text-white hover:text-purple-400 transition-colors"
              title={pantallaCompleta ? "Salir de pantalla completa" : "Pantalla completa"}
            >
              {pantallaCompleta ? <FaCompress size={18} /> : <FaExpand size={18} />}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReproductorVideo;
