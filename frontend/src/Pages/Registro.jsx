import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FaUser, FaLock, FaEnvelope, FaTimes } from 'react-icons/fa';

const Registro = ({ isOpen, onClose, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es obligatorio';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const datos = new FormData();
    datos.append('username', formData.username);
    datos.append('email', formData.email);
    datos.append('password', formData.password);

    try {
      console.log('Enviando datos de registro:', {
        username: formData.username,
        email: formData.email,
        password: formData.password ? '***' : 'no proporcionada'
      });
      
      const respuesta = await axios.post(
        'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=registrarUsuario',
        datos,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        }
      );

      console.log('Respuesta registro:', respuesta.data);

      if (respuesta.data && respuesta.data.success) {
        // Limpiar el formulario
        setFormData({ username: '', email: '', password: '', confirmPassword: '' });
        
        // Llamar a onSuccess con los datos correctos
        onSuccess({
          nombre: formData.username,
          mensaje: respuesta.data.mensaje || 'Registro exitoso'
        });
        
        // Cerrar el modal de registro
        onClose();
      } else if (respuesta.data.error) {
        console.log('Error de registro:', respuesta.data.error);
        onError(respuesta.data.error);
      } else {
        console.log('Respuesta inesperada:', respuesta.data);
        onError("Error al registrar el usuario");
      }
    } catch (error) {
      console.error('Error completo:', error);
      
      // Información detallada del error para depuración
      if (error.response) {
        // La solicitud fue realizada y el servidor respondió con un código de estado
        // que no está en el rango 2xx
        console.error('Datos de respuesta:', error.response.data);
        console.error('Estado HTTP:', error.response.status);
        console.error('Cabeceras:', error.response.headers);
        onError(`Error ${error.response.status}: ${error.response.data?.error || 'Error en el servidor'}`);
      } else if (error.request) {
        // La solicitud fue realizada pero no se recibió respuesta
        console.error('Solicitud sin respuesta:', error.request);
        onError('No se recibió respuesta del servidor');
      } else {
        // Algo ocurrió al configurar la solicitud que desencadenó un error
        console.error('Error de configuración:', error.message);
        onError(`Error de configuración: ${error.message}`);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Limpiar el error cuando el usuario comienza a escribir
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleModalClick = (e) => {
    // Evitar que los clics dentro del modal lo cierren
    e.stopPropagation();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-gray-900 rounded-xl shadow-xl z-50 p-8"
            onClick={handleModalClick}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Crear Cuenta</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Nombre de usuario"
                  className={`w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-3 border ${errors.username ? 'border-red-500' : 'border-gray-700'} focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all`}
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                )}
              </div>

              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Correo electrónico"
                  className={`w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-700'} focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Contraseña"
                  className={`w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-700'} focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all`}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirmar contraseña"
                  className={`w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-700'} focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                >
                  Crear Cuenta
                </motion.button>
              </div>

              <p className="text-center text-gray-400 text-sm">
                ¿Ya tienes una cuenta?{' '}
                <button 
                  type="button"
                  onClick={() => {
                    onClose();
                    // Emitir un evento personalizado para abrir el modal de login
                    window.dispatchEvent(new CustomEvent('openLogin'));
                  }}
                  className="text-purple-500 hover:text-purple-400"
                >
                  Inicia Sesión
                </button>
              </p>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Registro;
