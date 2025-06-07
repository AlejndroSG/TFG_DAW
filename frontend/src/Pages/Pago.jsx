import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PasarelaPago from '../components/Pagos/PasarelaPago';
import axios from 'axios';
import { FaArrowLeft, FaShieldAlt, FaLock } from 'react-icons/fa';

const Pago = () => {
  const { cursoId } = useParams();
  const navigate = useNavigate();
  
  const [curso, setCurso] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [completado, setCompletado] = useState(false);
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
        } else {
          // Si no hay sesión iniciada, redirigir al login
          navigate('/login', { state: { returnUrl: `/pago/${cursoId}` } });
        }
      } catch (error) {
        console.error('Error al comprobar sesión:', error);
        setError('Es necesario iniciar sesión para realizar un pago');
      }
    };

    comprobarSesion();
    
    // Obtener datos del curso
    const obtenerCurso = async () => {
      try {
        setCargando(true);
        
        // Obtener datos reales del curso desde la API
        const identifier = new FormData();
        identifier.append('id', cursoId);
        const response = await axios.post(
          `http://localhost/TFG_DAW/backend/controlador/controlador.php?action=obtenerCurso`,
          identifier,
          { withCredentials: true }
        );
        
        if (response.data) {
          setCurso(response.data);
        } else {
          setError('No se encontró información del curso');
        }
        setCargando(false);
      } catch (error) {
        console.error('Error al cargar el curso:', error);
        setError('No se pudo cargar la información del curso');
        setCargando(false);
      }
    };
    
    obtenerCurso();
  }, [cursoId, navigate]);
  
  const handleCompletarPago = async () => {
    try {
      // Mostrar estado de inicio del proceso
      console.log('Iniciando proceso de inscripción y pago para el curso:', cursoId);
      console.log('Datos del curso:', curso);
      setError('');
      
      // Datos para registrar la inscripción y el pago
      const formData = new FormData();
      formData.append('id_curso', cursoId);
      
      // Si el curso tiene precio, también añadimos la información del pago
      if (curso && curso.precio) {
        const precioNum = parseFloat(curso.precio);
        formData.append('precio', precioNum);
        formData.append('metodo_pago', 'tarjeta'); // Por defecto, asumimos pago con tarjeta
        formData.append('registrar_pago', 'true'); // Flag para indicar que se debe registrar el pago (como string para evitar problemas)
        
        console.log('Datos del pago:', {
          precio: precioNum,
          metodo_pago: 'tarjeta',
          registrar_pago: 'true'
        });
      } else {
        console.log('El curso no tiene precio definido, no se registrará pago');
      }
      
      console.log('Enviando solicitud de inscripción...');
      const response = await axios.post(
        'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=inscribirCurso',
        formData,
        { withCredentials: true }
      );
      
      console.log('Respuesta completa recibida:', response);
      
      if (response.data && response.data.success) {
        console.log('Inscripción completada con éxito:', response.data);
        
        // Verificar si hubo éxito en el pago o algún problema
        if (response.data.pago) {
          console.log('Pago registrado correctamente:', response.data.pago);
        } else if (response.data.error_pago) {
          console.warn('La inscripción fue exitosa pero hubo un problema con el pago:', response.data.error_pago);
          // Aunque hubo problema en el pago, la inscripción fue exitosa, así que continuamos
        }
        
        setCompletado(true);
        
        // Después de 3 segundos, redirigimos al curso
        setTimeout(() => {
          navigate(`/curso-visor/${cursoId}`);
        }, 3000);
      } else {
        // Maneja los diferentes formatos de respuesta de error
        const mensajeError = response.data?.message || response.data?.error || 'Error al procesar la inscripción';
        console.error('Error en la inscripción:', mensajeError);
        console.error('Datos completos de error:', response.data);
        setError(mensajeError);
      }
    } catch (error) {
      console.error('Error al procesar la inscripción:', error);
      setError('Error al procesar la inscripción. Por favor, inténtalo de nuevo.');
    }
  };
  
  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center pt-20">
        <div className="text-center flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-purple-600 border-r-pink-600 border-b-purple-600 border-l-pink-600 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-300">Cargando información del pago...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center pt-20">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-gray-700/50 text-center">
          <div className="text-red-500 text-5xl mb-4">
            <span role="img" aria-label="Error">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-4">Ha ocurrido un error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
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
  
  if (completado) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 pt-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-gray-700/50 text-center"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <FaLock className="text-green-400 text-3xl" />
            </motion.div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">¡Pago completado!</h2>
          <p className="text-gray-300 mb-6">
            Tu pago ha sido procesado correctamente. En breve serás redirigido al curso.
          </p>
          <div className="w-full bg-gray-700/50 h-2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3 }}
              className="h-full bg-gradient-to-r from-green-500 to-green-400"
            />
          </div>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 pt-30 px-4 sm:px-6 pb-16">
      <div className="max-w-4xl w-full mx-auto">
        <button 
          onClick={() => navigate(`/curso/${cursoId}`)}
          className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Volver al curso
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
          {/* Columna izquierda - Información del curso */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-700/50 lg:sticky lg:top-8">
              <h2 className="text-xl font-bold text-white mb-4">Resumen de compra</h2>
              
              {curso && (
                <>
                  <div className="relative h-40 rounded-xl overflow-hidden mb-4">
                    <img 
                      src={curso.imgCurso ? 
                        (curso.imgCurso.startsWith('http') ? curso.imgCurso : `http://localhost/TFG_DAW/frontend${curso.imgCurso}`) : 
                        'http://localhost/TFG_DAW/frontend/src/img/imgCursos/default.jpg'
                      } 
                      alt={curso.titulo}
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-1">{curso.titulo}</h3>
                  <p className="text-gray-400 text-sm mb-4">Por {curso.profesor}</p>
                  
                  <div className="border-t border-gray-700/50 my-4 pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Precio del curso</span>
                      <span className="text-white font-medium">{curso.precio}€</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">IVA (21%)</span>
                      <span className="text-white font-medium">{(curso.precio * 0.21).toFixed(2)}€</span>
                    </div>
                    <div className="border-t border-gray-700/50 my-3 pt-3 flex justify-between">
                      <span className="text-white font-bold">Total</span>
                      <span className="text-white font-bold">{(curso.precio * 1.21).toFixed(2)}€</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/70 rounded-xl p-4 mt-6 border border-gray-700/50">
                    <div className="flex items-start">
                      <FaShieldAlt className="text-green-400 mt-1 mr-3" />
                      <div>
                        <p className="text-green-400 font-medium mb-1">Garantía de devolución de 30 días</p>
                        <p className="text-gray-400 text-sm">
                          Si no estás satisfecho con el curso, puedes solicitar un reembolso completo dentro de los primeros 30 días.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Columna derecha - Pasarela de pago */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 mt-70 sm:p-6 border border-gray-700/50">
              {curso && (
                <PasarelaPago 
                  curso={curso} 
                  onClose={() => navigate(`/curso/${cursoId}`)} 
                  onPaymentComplete={handleCompletarPago} 
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pago;
