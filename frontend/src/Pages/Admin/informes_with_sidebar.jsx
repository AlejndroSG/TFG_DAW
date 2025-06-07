import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  FaChartBar,
  FaBook,
  FaChartLine,
  FaUsersCog,
  FaComments,
  FaSignOutAlt,
  FaSpinner
} from 'react-icons/fa';

const Informes = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);
  const [ventas, setVentas] = useState([]);

  // Cargar datos de ventas
  const cargarVentas = async () => {
    setLoadingData(true);
    setError(null);
    try {
      const url = 'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=obtenerEstadisticasVentas';
      console.log('Solicitando datos de ventas:', url);
      
      const respuesta = await axios.get(url, { withCredentials: true });
      
      if (respuesta.data && !respuesta.data.error) {
        console.log('Datos recibidos:', respuesta.data);
        setVentas(respuesta.data.datos || []);
      } else {
        setError(respuesta.data?.error || 'Error al cargar datos de ventas');
      }
    } catch (error) {
      setError(`Error de conexión: ${error.message || 'Desconocido'}`);
      console.error('Error al cargar datos de ventas:', error);
    } finally {
      setLoadingData(false);
    }
  };

  // Comprobar sesión y permisos de administrador
  useEffect(() => {
    const comprobarSesion = async () => {
      try {
        const respuesta = await axios.get(
          'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=comprobarSesion',
          { withCredentials: true }
        );
        
        if (respuesta.data && respuesta.data.username) {
          // Verificar si el usuario es administrador
          if (respuesta.data.tipo_usuario.toLowerCase() === 'administrador' || respuesta.data.tipo_usuario === 'admin') {
            setUserData(respuesta.data);
            // Cargar datos iniciales de ventas
            cargarVentas();
          } else {
            // Redirigir si no es administrador
            navigate('/');
          }
        } else {
          // Redirigir si no hay sesión
          navigate('/login');
        }
      } catch (error) {
        console.error('Error al comprobar sesión:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    comprobarSesion();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-purple-600 border-r-pink-600 border-b-purple-600 border-l-pink-600 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-300">Cargando informes...</p>
        </div>
      </div>
    );
  }

  if (!userData || (userData.tipo_usuario.toLowerCase() !== 'administrador' && userData.tipo_usuario.toLowerCase() !== 'admin')) {
    return <Navigate to="/" />;
  }

  // Menú de navegación lateral (mismo que en Dashboard)
  const Sidebar = () => (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 flex flex-col h-full">
      <h2 className="text-2xl font-bold text-white mb-8">Panel Admin</h2>
      
      <nav className="space-y-2 flex-1">
        {[
          { name: 'Dashboard', icon: <FaChartBar />, path: '/admin' },
          { name: 'Usuarios', icon: <FaUsersCog />, path: '/admin/usuarios' },
          { name: 'Cursos', icon: <FaBook />, path: '/admin/cursos' },
          { name: 'Comentarios', icon: <FaComments />, path: '/admin/comentarios' },
          { name: 'Informes', icon: <FaChartLine />, path: '/admin/informes' },
        ].map((item) => (
          <motion.button
            key={item.name}
            onClick={() => navigate(item.path)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center w-full p-3 rounded-xl transition-all ${
              window.location.pathname === item.path 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </motion.button>
        ))}
      </nav>
      
      <div className="pt-6 mt-6 border-t border-gray-700/50">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-white font-bold">
            {userData.username.charAt(0)}
          </div>
          <div className="ml-3">
            <p className="text-white font-semibold">{userData.username}</p>
            <p className="text-gray-400 text-sm">Administrador</p>
          </div>
        </div>
        
        {/* Botón de cerrar sesión */}
        <motion.button
          onClick={() => {
            axios.get('http://localhost/TFG_DAW/backend/controlador/controlador.php?action=desconectar', { withCredentials: true })
              .finally(() => {
                navigate('/');
              });
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-4 w-full bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl py-2 px-4 font-semibold flex items-center justify-center hover:shadow-lg hover:shadow-red-500/20 transition-all"
        >
          <FaSignOutAlt className="mr-2" />
          Cerrar Sesión
        </motion.button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/5">
            <Sidebar />
          </div>
          
          {/* Main Content */}
          <div className="lg:w-4/5 space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold text-white mb-6"
            >
              Informes y Analíticas
              <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-pink-600 mt-2 rounded-full"></div>
            </motion.h1>
            
            {/* Estado de carga o error */}
            {loadingData && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <FaSpinner className="text-purple-500 animate-spin text-3xl" />
                  <p className="mt-3 text-gray-300">Cargando datos...</p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-900/30 backdrop-blur-sm rounded-2xl border border-red-700/50 p-6">
                <div className="flex items-center space-x-3">
                  <div className="text-red-400 text-xl">⚠️</div>
                  <div>
                    <h3 className="text-lg font-medium text-red-300">Error al cargar datos</h3>
                    <p className="text-red-200">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Tabla de ventas */}
            {!loadingData && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                {/* Tabla de datos de ventas */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-gray-400 border-b border-gray-700/50">
                          <th className="p-4">Fecha</th>
                          <th className="p-4">Curso</th>
                          <th className="p-4">Usuario</th>
                          <th className="p-4">Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ventas.length > 0 ? (
                          ventas.map((venta, index) => (
                            <tr 
                              key={index} 
                              className={`border-b border-gray-700/30 text-gray-300 hover:bg-gray-700/30 transition-colors ${index % 2 === 0 ? 'bg-gray-800/30' : ''}`}
                            >
                              <td className="p-4">{venta.fecha}</td>
                              <td className="p-4">{venta.curso}</td>
                              <td className="p-4">{venta.usuario}</td>
                              <td className="p-4">{venta.valor}€</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="p-4 text-center text-gray-500">
                              No se encontraron ventas
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Informes;
