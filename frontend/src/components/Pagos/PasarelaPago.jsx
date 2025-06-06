import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCreditCard, FaPaypal, FaLock, FaShieldAlt, FaArrowLeft, FaCheck, FaGraduationCap } from 'react-icons/fa';

const PasarelaPago = ({ curso, onClose, onPaymentComplete }) => {
  // Verificar que el curso tiene la información necesaria
  if (!curso) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-400 mb-3">
          <span role="img" aria-label="Error">⚠️</span>
        </div>
        <p className="text-gray-300">No se ha podido cargar la información del curso</p>
      </div>
    );
  }
  const [metodo, setMetodo] = useState('tarjeta');
  const [paso, setPaso] = useState(1);
  const [datosTarjeta, setDatosTarjeta] = useState({
    numero: '',
    nombre: '',
    expiracion: '',
    cvv: '',
    guardarTarjeta: false
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const handleChangeTarjeta = (e) => {
    const { name, value, type, checked } = e.target;
    setDatosTarjeta({
      ...datosTarjeta,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmitTarjeta = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Validaciones básicas
    if (!datosTarjeta.numero || !datosTarjeta.nombre || !datosTarjeta.expiracion || !datosTarjeta.cvv) {
      setError('Por favor, completa todos los campos');
      return;
    }

    setCargando(true);
    
    // Simulación de proceso de pago
    try {
      // En un caso real, aquí se conectaría con una API de pago:
      // const respuesta = await axios.post('URL_API_PAGO', { ...datosTarjeta, cursoId: curso.id });
      
      // Simulamos un tiempo de espera y éxito
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulamos éxito
      setCargando(false);
      setPaso(3); // Paso de éxito
      
      // Notificar al componente padre
      setTimeout(() => {
        onPaymentComplete();
      }, 2000);
      
    } catch (error) {
      setCargando(false);
      setError('Error al procesar el pago. Por favor, inténtalo de nuevo.');
    }
  };

  const handlePayPal = async () => {
    setError(null);
    setCargando(true);
    
    // Simulación de redirección a PayPal
    try {
      // En un caso real, aquí se iniciaría un proceso OAuth con PayPal
      // window.location.href = URL_PAYPAL_AUTH;
      
      // Simulamos un tiempo de espera y éxito
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulamos éxito
      setCargando(false);
      setPaso(3); // Paso de éxito
      
      // Notificar al componente padre
      setTimeout(() => {
        onPaymentComplete();
      }, 2000);
      
    } catch (error) {
      setCargando(false);
      setError('Error al conectar con PayPal. Por favor, inténtalo de nuevo.');
    }
  };

  const handleVolver = () => {
    if (paso > 1) {
      setPaso(paso - 1);
    } else {
      onClose();
    }
  };

  // Contenido según el paso actual
  const renderContenido = () => {
    switch (paso) {
      case 1:
        return (
          <div className="space-y-6 py-2">
            <div className="mb-6 p-4 bg-gray-800/70 rounded-xl border border-gray-700">
              <div className="flex items-center mb-3">
                <FaGraduationCap className="text-purple-400 mr-2" size={18} />
                <h3 className="text-lg font-bold text-white">{curso.titulo}</h3>
              </div>
              <div className="text-xl font-bold text-white mb-2">{curso.precio}€</div>
              <p className="text-sm text-gray-400">Instructor: {curso.profesor}</p>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-6">Selecciona método de pago</h2>
            
            {/* Tarjeta de crédito */}
            <motion.button
              onClick={() => { setMetodo('tarjeta'); setPaso(2); }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center p-4 rounded-xl ${
                metodo === 'tarjeta' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              } transition-all duration-300`}
            >
              <FaCreditCard size={24} className="mr-4" />
              <div className="flex-1 text-left">
                <p className="font-semibold">Tarjeta de crédito/débito</p>
                <p className="text-sm opacity-75">Visa, Mastercard, American Express</p>
              </div>
            </motion.button>
            
            {/* PayPal */}
            <motion.button
              onClick={() => { setMetodo('paypal'); setPaso(2); }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center p-4 rounded-xl ${
                metodo === 'paypal' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              } transition-all duration-300`}
            >
              <FaPaypal size={24} className="mr-4" />
              <div className="flex-1 text-left">
                <p className="font-semibold">PayPal</p>
                <p className="text-sm opacity-75">Paga de forma segura con tu cuenta PayPal</p>
              </div>
            </motion.button>
          </div>
        );
        
      case 2:
        return (
          <div className="py-2">
            <div className="flex items-center mb-6">
              <button 
                onClick={handleVolver}
                className="text-gray-400 hover:text-white mr-4"
              >
                <FaArrowLeft />
              </button>
              <h2 className="text-2xl font-bold text-white">
                {metodo === 'tarjeta' ? 'Datos de tarjeta' : 'Pago con PayPal'}
              </h2>
            </div>
            
            {metodo === 'tarjeta' ? (
              <form onSubmit={handleSubmitTarjeta} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Número de tarjeta</label>
                  <input 
                    type="text" 
                    name="numero"
                    placeholder="1234 5678 9012 3456"
                    value={datosTarjeta.numero}
                    onChange={handleChangeTarjeta}
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Nombre en la tarjeta</label>
                  <input 
                    type="text" 
                    name="nombre"
                    placeholder="NOMBRE APELLIDOS"
                    value={datosTarjeta.nombre}
                    onChange={handleChangeTarjeta}
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Fecha de expiración</label>
                    <input 
                      type="text" 
                      name="expiracion"
                      placeholder="MM/AA"
                      value={datosTarjeta.expiracion}
                      onChange={handleChangeTarjeta}
                      className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">CVV</label>
                    <input 
                      type="text" 
                      name="cvv"
                      placeholder="123"
                      value={datosTarjeta.cvv}
                      onChange={handleChangeTarjeta}
                      className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                  </div>
                </div>
                
                <div className="flex items-center mt-2">
                  <input 
                    type="checkbox" 
                    id="guardarTarjeta" 
                    name="guardarTarjeta"
                    checked={datosTarjeta.guardarTarjeta}
                    onChange={handleChangeTarjeta}
                    className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="guardarTarjeta" className="ml-2 text-gray-300">
                    Guardar esta tarjeta para futuros pagos
                  </label>
                </div>
                
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
                    {error}
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center text-gray-400 text-sm">
                    <FaLock className="mr-1" /> Pago seguro con encriptación
                  </div>
                  <div className="text-right">
                    <p className="text-gray-300 text-sm mb-1">Total a pagar</p>
                    <p className="text-2xl font-bold text-white">{curso.precio}€</p>
                  </div>
                </div>
                
                <button 
                  type="submit"
                  disabled={cargando}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl py-3 font-semibold mt-4 hover:shadow-lg hover:shadow-purple-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {cargando ? (
                    <span className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                      Procesando...
                    </span>
                  ) : (
                    'Realizar pago'
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <p className="text-gray-300">
                  Serás redirigido a PayPal para completar el pago de forma segura.
                </p>
                
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
                    {error}
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center text-gray-400 text-sm">
                    <FaLock className="mr-1" /> Pago seguro con PayPal
                  </div>
                  <div className="text-right">
                    <p className="text-gray-300 text-sm mb-1">Total a pagar</p>
                    <p className="text-2xl font-bold text-white">{curso.precio}€</p>
                  </div>
                </div>
                
                <button 
                  onClick={handlePayPal}
                  disabled={cargando}
                  className="w-full bg-[#0070ba] text-white rounded-xl py-3 font-semibold mt-4 hover:bg-[#005ea6] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {cargando ? (
                    <span className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                      Conectando con PayPal...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <FaPaypal className="mr-2" /> Pagar con PayPal
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        );
        
      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center text-white mb-6">
              <FaCheck size={30} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">¡Pago completado!</h2>
            <p className="text-gray-300 mb-6">
              Tu pago por <span className="text-white font-semibold">{curso.precio}€</span> ha sido procesado correctamente.
            </p>
            <p className="text-gray-300 mb-8">
              Ya puedes acceder al curso <span className="text-purple-400 font-semibold">{curso.titulo}</span>.
            </p>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-green-500/30 mb-6">
              <div className="flex items-start">
                <FaShieldAlt className="text-green-500 mr-3 mt-1" size={20} />
                <div className="text-left">
                  <p className="text-gray-300 text-sm">
                    Hemos enviado un recibo a tu correo electrónico. Puedes ver todos tus cursos y facturas en tu perfil.
                  </p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={onPaymentComplete}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl py-3 px-6 font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all"
            >
              Ir al curso
            </button>
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-black/90 to-purple-900/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900/95 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md border border-purple-500/20 shadow-lg shadow-purple-500/10"
      >
        {/* Encabezado del modal */}
        {paso !== 3 && (
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Matriculación en curso</h3>
              <p className="text-gray-400 text-sm">{curso.titulo}</p>
            </div>
            
            {paso === 1 && (
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ×
              </button>
            )}
          </div>
        )}
        
        {/* Contenido basado en el paso actual */}
        {renderContenido()}
      </motion.div>
    </div>
  );
};

export default PasarelaPago;
