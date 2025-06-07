import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

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

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col">
          {/* Main Content */}
          <div className="w-full space-y-6">
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
