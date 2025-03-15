import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FaUser, FaLock, FaTimes } from 'react-icons/fa';

const Login = ({ isOpen, onClose, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const datos = new FormData();
    datos.append('username', formData.username);
    datos.append('password', formData.password);

    try {
      const respuesta = await axios.post(
        'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=iniciarSesion',
        datos,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      if (respuesta.data.nombre != null) {
        onSuccess(respuesta.data);
        setFormData({ username: '', password: '' }); // Limpiar el formulario
        localStorage.setItem('username', respuesta.data.nombre);
        localStorage.setItem('tipo_usuario', respuesta.data.tipo_usuario);
        localStorage.setItem('id', respuesta.data.id);
      } else {
        onError("Usuario o contraseña incorrectos");
      }
    } catch (error) {
      onError("Error al conectar con el servidor");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
              <h2 className="text-2xl font-bold text-white">Iniciar Sesión</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Usuario"
                  className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-3 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                />
              </div>

              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Contraseña"
                  className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-3 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-700 text-purple-600 focus:ring-purple-500/20"
                  />
                  <span className="ml-2 text-sm text-gray-400">Recordarme</span>
                </label>
                <a href="#" className="text-sm text-purple-500 hover:text-purple-400">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
              >
                Iniciar Sesión
              </motion.button>

              <p className="text-center text-gray-400 text-sm">
                ¿No tienes una cuenta?{' '}
                <a href="#" className="text-purple-500 hover:text-purple-400">
                  Regístrate
                </a>
              </p>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Login;