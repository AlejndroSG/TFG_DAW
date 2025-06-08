import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCrown, FaCheck, FaTimes, FaChevronDown, FaChevronUp, FaCreditCard, FaUserGraduate, FaRocket, FaGem, FaBuilding } from 'react-icons/fa';
import PasarelaPago from './PasarelaPago';

const Suscripciones = () => {
  const [suscripcionActual, setSuscripcionActual] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [planSeleccionado, setPlanSeleccionado] = useState(null);
  const [expandirDetalles, setExpandirDetalles] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // En un caso real, aquí cargarías la suscripción del usuario desde tu API:
    // const cargarSuscripcion = async () => {
    //   try {
    //     const respuesta = await axios.get('http://localhost/TFG_DAW/backend/controlador/controlador.php?action=obtenerSuscripcion', { withCredentials: true });
    //     setSuscripcionActual(respuesta.data);
    //   } catch (error) {
    //     console.error('Error al cargar suscripción:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // cargarSuscripcion();
    
    // Simulamos datos para la demo
    setTimeout(() => {
      // Simulamos que el usuario no tiene suscripción
      setSuscripcionActual(null);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSeleccionarPlan = (plan) => {
    setPlanSeleccionado(plan);
    setMostrarModal(true);
  };

  const handleCancelarSuscripcion = () => {
    if (window.confirm('¿Estás seguro de que deseas cancelar tu suscripción? Perderás acceso a todos los cursos premium al final del período de facturación actual.')) {
      // En un caso real, aquí cancelarías la suscripción:
      // axios.post('http://localhost/TFG_DAW/backend/controlador/controlador.php?action=cancelarSuscripcion', {}, { withCredentials: true });
      
      alert('Suscripción cancelada correctamente');
      setSuscripcionActual({...suscripcionActual, estado: 'cancelada'});
    }
  };

  const handleCompletarPago = () => {
    // Simulamos la actualización de suscripción
    setSuscripcionActual({
      plan: planSeleccionado.nombre,
      fechaInicio: new Date().toISOString().split('T')[0],
      fechaRenovacion: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
      precio: planSeleccionado.precio,
      estado: 'activa',
      metodo: 'tarjeta'
    });
    setMostrarModal(false);
  };

  // Planes disponibles - Alineados con la página de inicio
  const planes = [
    {
      id: 'basico',
      nombre: 'Plan Básico',
      precio: 0,
      intervalo: 'siempre',
      caracteristicas: [
        'Acceso a cursos básicos',
        'Proyectos guiados',
        'Comunidad de estudiantes',
        'Certificados básicos',
        'Soporte por email'
      ],
      noIncluido: [
        'Mentoría personalizada',
        'Proyectos avanzados',
        'Certificados premium',
        'Acceso prioritario'
      ],
      popular: false,
      color: 'from-purple-400 to-purple-600',
      icono: FaRocket
    },
    {
      id: 'pro',
      nombre: 'Plan Pro',
      precio: 29.99,
      intervalo: 'mensual',
      caracteristicas: [
        'Todo del Plan Básico',
        'Mentoría personalizada',
        'Proyectos avanzados',
        'Certificados premium',
        'Acceso prioritario',
        'Soporte 24/7',
        'Recursos exclusivos',
        'Comunidad premium'
      ],
      noIncluido: [],
      popular: true,
      color: 'from-purple-600 to-pink-600',
      icono: FaGem
    },
    {
      id: 'enterprise',
      nombre: 'Plan Enterprise',
      precio: 99.99,
      intervalo: 'mensual',
      caracteristicas: [
        'Todo del Plan Pro',
        'Formación para equipos',
        'Panel de administración',
        'API personalizada',
        'Soporte dedicado',
        'Implementación guiada',
        'Análisis de progreso',
        'Personalización total'
      ],
      noIncluido: [],
      popular: false,
      color: 'from-pink-600 to-purple-400',
      icono: FaBuilding
    }
  ];

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-purple-600 border-r-pink-600 border-b-purple-600 border-l-pink-600 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-300">Cargando información de suscripción...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-700/50 overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          Planes y Suscripciones
          <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-pink-600 mt-2 rounded-full"></div>
        </h2>
        
        {/* Estado de suscripción actual */}
        {suscripcionActual ? (
          <div className="mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-white mr-4 flex-shrink-0">
                  <FaCrown size={24} />
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {suscripcionActual.plan}
                        {suscripcionActual.estado === 'cancelada' && (
                          <span className="ml-2 text-sm bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                            Cancelada
                          </span>
                        )}
                      </h3>
                      <p className="text-gray-400">Renovación: {new Date(suscripcionActual.fechaRenovacion).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="mt-3 md:mt-0 text-right">
                      <p className="text-xl font-bold text-white">{suscripcionActual.precio}€ <span className="text-sm text-gray-400">/ mes</span></p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-700/50 pt-4 mt-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex items-center mb-3 md:mb-0">
                        <FaCreditCard className="mr-2 text-gray-400" />
                        <span className="text-gray-300">Método de pago: {suscripcionActual.metodo === 'tarjeta' ? 'Tarjeta terminada en ****1234' : 'PayPal'}</span>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-2">
                        <button 
                          className="text-sm px-4 py-2 rounded-xl text-purple-400 border border-purple-500/50 hover:bg-purple-500/10 transition-colors"
                          onClick={() => setExpandirDetalles(!expandirDetalles)}
                        >
                          {expandirDetalles ? (
                            <>Ocultar detalles <FaChevronUp className="inline ml-1" /></>
                          ) : (
                            <>Ver detalles <FaChevronDown className="inline ml-1" /></>
                          )}
                        </button>
                        
                        {suscripcionActual.estado !== 'cancelada' && (
                          <button 
                            className="text-sm px-4 py-2 rounded-xl text-red-400 border border-red-500/50 hover:bg-red-500/10 transition-colors"
                            onClick={handleCancelarSuscripcion}
                          >
                            Cancelar suscripción
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Detalles expandibles */}
                  {expandirDetalles && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 border-t border-gray-700/50 pt-4"
                    >
                      <h4 className="text-white font-semibold mb-3">Beneficios de tu suscripción</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center text-gray-300">
                          <FaCheck className="mr-2 text-green-400" />
                          Acceso a todos los cursos
                        </li>
                        <li className="flex items-center text-gray-300">
                          <FaCheck className="mr-2 text-green-400" />
                          Certificados descargables
                        </li>
                        <li className="flex items-center text-gray-300">
                          <FaCheck className="mr-2 text-green-400" />
                          Soporte prioritario
                        </li>
                      </ul>
                      
                      {suscripcionActual.estado === 'cancelada' ? (
                        <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                          <p className="text-red-400">
                            Tu suscripción ha sido cancelada. Tendrás acceso hasta el final del período actual ({new Date(suscripcionActual.fechaRenovacion).toLocaleDateString()}).
                          </p>
                        </div>
                      ) : (
                        <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                          <p className="text-blue-400">
                            Tu próximo pago de {suscripcionActual.precio}€ se realizará el {new Date(suscripcionActual.fechaRenovacion).toLocaleDateString()}.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
              <FaUserGraduate className="text-purple-400 text-4xl mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">Mejora tu experiencia de aprendizaje</h3>
              <p className="text-gray-300 mb-4">
                Suscríbete para acceder a todos nuestros cursos premium, certificados y contenido exclusivo.
              </p>
              <p className="text-gray-400 text-sm">
                Selecciona uno de nuestros planes a continuación para comenzar.
              </p>
            </div>
          </div>
        )}
        
        {/* Planes disponibles */}
        <h3 className="text-xl font-bold text-white mb-4">Planes disponibles</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {planes.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`rounded-xl overflow-hidden border ${
                plan.popular 
                  ? 'border-pink-500/50 shadow-lg shadow-pink-500/10' 
                  : 'border-gray-700/50'
              }`}
            >
              {/* Encabezado */}
              <div className={`bg-gradient-to-r ${plan.color} p-5`}>
                {plan.popular && (
                  <div className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-2">
                    MÁS POPULAR
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-white">{plan.nombre}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-white">{plan.precio}€</span>
                  <span className="text-white/80"> / {plan.intervalo}</span>
                </div>
                
                {plan.precioMensual && (
                  <p className="text-white/80 text-sm mt-1">
                    Solo {plan.precioMensual}€ al mes
                  </p>
                )}
                
                {plan.ahorro && (
                  <div className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mt-2">
                    {plan.ahorro}
                  </div>
                )}
              </div>
              
              {/* Características */}
              <div className="bg-gray-800 p-5">
                <ul className="space-y-3 mb-6">
                  {plan.caracteristicas.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <FaCheck className="mr-2 text-green-400 mt-1 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSeleccionarPlan(plan)}
                  className={`w-full py-3 rounded-xl font-semibold ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-pink-500/20' 
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  } transition-all`}
                >
                  {suscripcionActual?.plan === plan.nombre 
                    ? 'Plan actual' 
                    : suscripcionActual 
                      ? 'Cambiar a este plan' 
                      : 'Elegir este plan'
                  }
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Aclaraciones y preguntas frecuentes */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Todas las suscripciones se renuevan automáticamente. Puedes cancelar en cualquier momento.
          </p>
          <p className="text-purple-400 text-sm mt-2 hover:text-purple-300 cursor-pointer transition-colors">
            Ver preguntas frecuentes sobre suscripciones
          </p>
        </div>
      </div>
      
      {/* Modal de pago */}
      {mostrarModal && planSeleccionado && (
        <PasarelaPago 
          curso={{
            titulo: planSeleccionado.nombre,
            precio: planSeleccionado.precio
          }}
          onClose={() => setMostrarModal(false)}
          onPaymentComplete={handleCompletarPago}
        />
      )}
    </div>
  );
};

export default Suscripciones;
