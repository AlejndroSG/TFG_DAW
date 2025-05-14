import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserEdit, FaCheck, FaTimes, FaKey, FaUser, FaEnvelope, FaIdCard, FaCreditCard, FaGraduationCap, FaBook, FaCrown } from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HistorialPagos from '../components/Pagos/HistorialPagos';
import Suscripciones from '../components/Pagos/Suscripciones';

const Perfil = () => {
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('perfil');
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    tipo_usuario: '',
    password_actual: '',
    password_nuevo: '',
    password_confirm: ''
  });

  // Obtener datos del usuario al cargar el componente
  useEffect(() => {
    const obtenerDatosUsuario = async () => {
      try {
        const respuesta = await axios.get(
          'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=obtenerPerfil',
          { withCredentials: true }
        );
        
        if (respuesta.data && respuesta.data.id) {
          setUserData(respuesta.data);
          setFormData({
            nombre: respuesta.data.nombre,
            email: respuesta.data.email,
            tipo_usuario: respuesta.data.tipo_usuario,
            password_actual: '',
            password_nuevo: '',
            password_confirm: ''
          });
        }
      } catch (error) {
        console.error('Error al obtener datos del perfil:', error);
      }
    };

    obtenerDatosUsuario();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Para los campos de contraseña, solo permitir cambios cuando se está editando
    if (name.startsWith('password_') && !editing) {
      return;
    }

    // Asegurarnos de que el valor no sea undefined
    const safeValue = value || '';

    setFormData({
      ...formData,
      [name]: safeValue
    });
  };

  const handleCancel = () => {
    setEditing(false);
    if (userData) {
      setFormData({
        nombre: userData.nombre,
        email: userData.email,
        tipo_usuario: userData.tipo_usuario,
        password_actual: '',
        password_nuevo: '',
        password_confirm: ''
      });
    }
  };

  const handleSave = async () => {
    try {
      // Validar que las contraseñas coincidan si se está cambiando la contraseña
      if (formData.password_nuevo && formData.password_nuevo !== formData.password_confirm) {
        toast.error('Las contraseñas no coinciden');
        return;
      }

      // Mostrar toast de carga
      const toastId = toast.loading('Guardando cambios...');

      // Primero actualizar el perfil
      const datosPerfil = new FormData();
      datosPerfil.append('nombre', formData.nombre);
      datosPerfil.append('email', formData.email);

      const respuestaPerfil = await axios.post(
        'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=actualizarPerfil',
        datosPerfil,
        { 
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true 
        }
      );

      if (respuestaPerfil.data.success) {
        // Si hay cambios de contraseña, actualizarlos
        if (formData.password_nuevo && formData.password_nuevo !== '') {
          const datosPassword = new FormData();
          datosPassword.append('password_actual', formData.password_actual);
          datosPassword.append('password_nuevo', formData.password_nuevo);

          const respuestaPassword = await axios.post(
            'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=cambiarPassword',
            datosPassword,
            { 
              headers: { 'Content-Type': 'multipart/form-data' },
              withCredentials: true 
            }
          );

          if (respuestaPassword.data.success) {
            setEditing(false);
            setFormData({
              ...formData,
              password_actual: '',
              password_nuevo: '',
              password_confirm: ''
            });
            setUserData({
              ...userData,
              nombre: formData.nombre,
              email: formData.email
            });
            // Actualizar el toast a éxito
            toast.update(toastId, { 
              render: 'Perfil y contraseña actualizados correctamente', 
              type: 'success', 
              isLoading: false,
              autoClose: 3000
            });
          } else if (respuestaPassword.data.error) {
            console.error('Error al cambiar la contraseña:', respuestaPassword.data.error);
            // Actualizar el toast a error
            toast.update(toastId, { 
              render: `Error al cambiar la contraseña: ${respuestaPassword.data.error}`, 
              type: 'error', 
              isLoading: false,
              autoClose: 3000
            });
          }
        } else {
          setEditing(false);
          setUserData({
            ...userData,
            nombre: formData.nombre,
            email: formData.email
          });
          // Actualizar el toast a éxito
          toast.update(toastId, { 
            render: 'Perfil actualizado correctamente', 
            type: 'success', 
            isLoading: false,
            autoClose: 3000
          });
        }
      } else if (respuestaPerfil.data.error) {
        console.error('Error al actualizar el perfil:', respuestaPerfil.data.error);
        // Actualizar el toast a error
        toast.update(toastId, { 
          render: `Error al actualizar el perfil: ${respuestaPerfil.data.error}`, 
          type: 'error', 
          isLoading: false,
          autoClose: 3000
        });
      }
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      // Mostrar toast de error
      toast.error(`Error al guardar los cambios: ${error.message}`);
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-purple-600 border-r-pink-600 border-b-purple-600 border-l-pink-600 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-300">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <ToastContainer position="top-right" theme="dark" />
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Mi Perfil
            <div className="h-1 w-24 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mt-4 rounded-full"></div>
          </motion.h1>
        </div>
        
        {/* Pestañas de navegación */}
        <div className="max-w-4xl mx-auto mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap gap-2"
          >
            <button
              onClick={() => setActiveTab('perfil')}
              className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'perfil' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/20' 
                : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700/80'}`}
            >
              <FaUser className="mr-2" /> Información personal
            </button>
            
            <button
              onClick={() => setActiveTab('mis-cursos')}
              className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'mis-cursos' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/20' 
                : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700/80'}`}
            >
              <FaGraduationCap className="mr-2" /> Mis cursos
            </button>
            
            <button
              onClick={() => setActiveTab('pagos')}
              className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'pagos' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/20' 
                : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700/80'}`}
            >
              <FaCreditCard className="mr-2" /> Historial de pagos
            </button>
            
            <button
              onClick={() => setActiveTab('suscripciones')}
              className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'suscripciones' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/20' 
                : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700/80'}`}
            >
              <FaCrown className="mr-2" /> Suscripciones
            </button>
          </motion.div>
        </div>

        {/* Contenido según la pestaña seleccionada */}
        {activeTab === 'perfil' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto shadow-lg border border-gray-700/50"
          >
            <div className="space-y-8">
              <div className="flex justify-between items-center border-b border-purple-500/30 pb-4">
                <h2 className="text-2xl font-semibold text-white flex items-center">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-full p-2 mr-3">
                    <FaUser className="w-5 h-5 text-white" />
                  </span>
                  Información Personal
                </h2>
              {!editing && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setEditing(true);
                    // Obtener la contraseña actual del usuario
                    axios.get(
                      'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=obtenerPassword',
                      { withCredentials: true }
                    )
                    .then(response => {
                      console.log('Respuesta de obtenerPassword:', response.data);
                      if (response.data && response.data.contraseña) {
                        setFormData(prev => ({
                          ...prev,
                          password_actual: response.data.contraseña
                        }));
                      }
                    })
                    .catch(error => {
                      console.error('Error al obtener la contraseña:', error);
                    });
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-2 rounded-full hover:shadow-lg transition-all duration-300"
                >
                  <FaUserEdit className="w-5 h-5" />
                </motion.button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div className="relative group">
                <label className="text-gray-300 mb-2 font-medium flex items-center">
                  <FaUser className="mr-2 text-purple-400" />
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className="w-full bg-gray-800/80 text-white rounded-xl px-4 py-3 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all group-hover:border-purple-400"
                />
                {editing && <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 pointer-events-none"></div>}
              </div>

              <div className="relative group">
                <label className="text-gray-300 mb-2 font-medium flex items-center">
                  <FaEnvelope className="mr-2 text-purple-400" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className="w-full bg-gray-800/80 text-white rounded-xl px-4 py-3 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all group-hover:border-purple-400"
                />
                {editing && <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 pointer-events-none"></div>}
              </div>

              <div className="col-span-2 relative group">
                <label className="text-gray-300 mb-2 font-medium flex items-center">
                  <FaIdCard className="mr-2 text-purple-400" />
                  Tipo de Usuario
                </label>
                <input
                  type="text"
                  name="tipo_usuario"
                  value={formData.tipo_usuario}
                  disabled
                  className="w-full bg-gray-800/80 text-white rounded-xl px-4 py-3 border border-gray-700 outline-none"
                />
              </div>

              {editing && (
                <div className="col-span-2 space-y-8 mt-6 border-t border-purple-500/30 pt-6">
                  <h3 className="text-xl font-semibold text-white flex items-center">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-full p-2 mr-3">
                      <FaKey className="w-4 h-4 text-white" />
                    </span>
                    Cambiar Contraseña
                  </h3>
                  
                  <div className="relative group">
                    <label className="text-gray-300 mb-2 font-medium flex items-center">
                      Contraseña Actual
                    </label>
                    <input
                      type="password"
                      name="password_actual"
                      value={formData.password_actual || ''}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800/80 text-white rounded-xl px-4 py-3 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all group-hover:border-purple-400"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 pointer-events-none"></div>
                  </div>

                  <div className="relative group">
                    <label className="text-gray-300 mb-2 font-medium flex items-center">
                      Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      name="password_nuevo"
                      value={formData.password_nuevo || ''}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800/80 text-white rounded-xl px-4 py-3 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all group-hover:border-purple-400"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 pointer-events-none"></div>
                  </div>

                  <div className="relative group">
                    <label className="text-gray-300 mb-2 font-medium flex items-center">
                      Confirmar Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      name="password_confirm"
                      value={formData.password_confirm || ''}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800/80 text-white rounded-xl px-4 py-3 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all group-hover:border-purple-400"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 pointer-events-none"></div>
                  </div>
                </div>
              )}
            </div>

            {editing && (
              <div className="flex justify-end space-x-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/20 transition-all flex items-center font-semibold"
                >
                  <FaCheck className="mr-2" />
                  Guardar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancel}
                  className="bg-gray-700 text-white px-6 py-3 rounded-xl hover:bg-gray-600 hover:shadow-lg transition-all flex items-center font-semibold"
                >
                  <FaTimes className="mr-2" />
                  Cancelar
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
        )}

        {/* Sección de Mis Cursos */}
        {activeTab === 'mis-cursos' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-700/50">
              <div className="flex items-center border-b border-purple-500/30 pb-4 mb-6">
                <span className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-full p-2 mr-3">
                  <FaBook className="w-5 h-5 text-white" />
                </span>
                <h2 className="text-2xl font-semibold text-white">Mis Cursos</h2>
              </div>
              
              {/* Este sería tu componente de cursos del usuario, que ya deberías tener implementado */}
              <div className="text-center py-10">
                <p className="text-gray-400">Aquí irían tus cursos inscritos.</p>
                <button 
                  className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                >
                  Ir a mis cursos
                </button>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Sección de Historial de Pagos */}
        {activeTab === 'pagos' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <HistorialPagos />
          </motion.div>
        )}
        
        {/* Sección de Suscripciones */}
        {activeTab === 'suscripciones' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <Suscripciones />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Perfil;
