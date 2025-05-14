import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { 
  FaChartLine, 
  FaDownload, 
  FaCalendarAlt, 
  FaUserGraduate,
  FaEuroSign,
  FaChartBar,
  FaUsersCog,
  FaBook,
  FaComments,
  FaFileAlt,
  FaFileExcel,
  FaFilePdf,
  FaFilter
} from 'react-icons/fa';

// Componente para gráficos (versión simulada)
const ChartPlaceholder = ({ title, height = 300 }) => (
  <div 
    className="w-full rounded-xl bg-gray-800/30 border border-gray-700/50 flex items-center justify-center"
    style={{ height: `${height}px` }}
  >
    <div className="text-center">
      <FaChartBar className="text-purple-400 text-4xl mx-auto mb-2" />
      <p className="text-gray-400">{title}</p>
      <p className="text-sm text-gray-500 mt-2">Integrar Chart.js o Recharts</p>
    </div>
  </div>
);

const AdminInformes = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('mensual');
  const [tipoInforme, setTipoInforme] = useState('ventas');
  const [fechaInicio, setFechaInicio] = useState('2024-10-01');
  const [fechaFin, setFechaFin] = useState('2024-11-15');

  // Datos de simulación para informes
  const datosInformes = {
    ventas: {
      titulo: 'Ventas e Ingresos',
      datos: [
        { id: 1, fecha: '2024-10-01', curso: 'JavaScript Avanzado', valor: 49.99, usuario: 'Carlos Martínez' },
        { id: 2, fecha: '2024-10-05', curso: 'React Native Masterclass', valor: 59.99, usuario: 'María López' },
        { id: 3, fecha: '2024-10-10', curso: 'Python para Data Science', valor: 39.99, usuario: 'Juan Pérez' },
        { id: 4, fecha: '2024-10-15', curso: 'JavaScript Avanzado', valor: 49.99, usuario: 'Ana Sánchez' },
        { id: 5, fecha: '2024-10-20', curso: 'React Native Masterclass', valor: 59.99, usuario: 'Miguel García' },
        { id: 6, fecha: '2024-10-25', curso: 'Python para Data Science', valor: 39.99, usuario: 'Laura Díaz' },
        { id: 7, fecha: '2024-11-01', curso: 'JavaScript Avanzado', valor: 49.99, usuario: 'Pedro Ruiz' },
        { id: 8, fecha: '2024-11-05', curso: 'React Native Masterclass', valor: 59.99, usuario: 'Carmen Gómez' }
      ],
      totales: {
        ingresos: 409.92,
        transacciones: 8
      }
    },
    cursos: {
      titulo: 'Rendimiento de Cursos',
      datos: [
        { id: 1, curso: 'JavaScript Avanzado', estudiantes: 342, valoracion: 4.8, completados: 124, ingresos: 14320 },
        { id: 2, curso: 'React Native Masterclass', estudiantes: 287, valoracion: 4.7, completados: 85, ingresos: 11480 },
        { id: 3, curso: 'Python para Data Science', estudiantes: 254, valoracion: 4.9, completados: 76, ingresos: 10160 },
        { id: 4, curso: 'DevOps con Docker y Kubernetes', estudiantes: 176, valoracion: 4.6, completados: 32, ingresos: 8800 }
      ],
      totales: {
        estudiantes: 1059,
        completados: 317,
        ingresos: 44760
      }
    },
    usuarios: {
      titulo: 'Actividad de Usuarios',
      datos: [
        { id: 1, fecha: '2024-10-01', nuevos: 12, activos: 145, conversion: 3.2 },
        { id: 2, fecha: '2024-10-08', nuevos: 18, activos: 167, conversion: 4.1 },
        { id: 3, fecha: '2024-10-15', nuevos: 15, activos: 178, conversion: 3.8 },
        { id: 4, fecha: '2024-10-22', nuevos: 21, activos: 189, conversion: 4.5 },
        { id: 5, fecha: '2024-10-29', nuevos: 19, activos: 193, conversion: 4.2 },
        { id: 6, fecha: '2024-11-05', nuevos: 25, activos: 201, conversion: 5.1 },
        { id: 7, fecha: '2024-11-12', nuevos: 22, activos: 215, conversion: 4.7 }
      ],
      totales: {
        nuevos: 132,
        activos: 215,
        conversion: 4.2
      }
    }
  };

  useEffect(() => {
    const comprobarSesion = async () => {
      try {
        const respuesta = await axios.get(
          'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=comprobarSesion',
          { withCredentials: true }
        );
        
        if (respuesta.data && respuesta.data.username) {
          // Verificar si el usuario es administrador
          if (respuesta.data.tipo_usuario.toLowerCase() === 'administrador') {
            setUserData(respuesta.data);
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

  const handleDescargarInforme = (formato) => {
    // En un caso real, esto se conectaría con tu backend para generar el informe
    alert(`Descargando informe de ${datosInformes[tipoInforme].titulo} en formato ${formato}`);
  };

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

  if (!userData || userData.tipo_usuario.toLowerCase() !== 'administrador') {
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
        ].map((item, index) => (
          <motion.button
            key={item.name}
            onClick={() => navigate(item.path)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center w-full p-3 rounded-xl transition-all ${
              item.path === '/admin/informes' 
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
            
            {/* Controles y filtros */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-gray-300 mb-2">Tipo de Informe</label>
                  <select 
                    value={tipoInforme}
                    onChange={(e) => setTipoInforme(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  >
                    <option value="ventas">Ventas e Ingresos</option>
                    <option value="cursos">Rendimiento de Cursos</option>
                    <option value="usuarios">Actividad de Usuarios</option>
                  </select>
                </div>
                
                <div className="flex-1">
                  <label className="block text-gray-300 mb-2">Período</label>
                  <select 
                    value={periodoSeleccionado}
                    onChange={(e) => setPeriodoSeleccionado(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  >
                    <option value="semanal">Semanal</option>
                    <option value="mensual">Mensual</option>
                    <option value="trimestral">Trimestral</option>
                    <option value="anual">Anual</option>
                    <option value="personalizado">Personalizado</option>
                  </select>
                </div>
              </div>
              
              {periodoSeleccionado === 'personalizado' && (
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                  <div className="flex-1">
                    <label className="block text-gray-300 mb-2">Fecha Inicio</label>
                    <input 
                      type="date" 
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-300 mb-2">Fecha Fin</label>
                    <input 
                      type="date"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex justify-end mt-4">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleDescargarInforme('csv')}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl transition-colors"
                  >
                    <FaFileAlt />
                    CSV
                  </button>
                  <button 
                    onClick={() => handleDescargarInforme('excel')}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl transition-colors"
                  >
                    <FaFileExcel />
                    Excel
                  </button>
                  <button 
                    onClick={() => handleDescargarInforme('pdf')}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl transition-colors"
                  >
                    <FaFilePdf />
                    PDF
                  </button>
                </div>
              </div>
            </div>
            
            {/* Gráficos y datos */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {datosInformes[tipoInforme].titulo}
                  <div className="h-0.5 w-16 bg-gradient-to-r from-purple-400 to-pink-600 mt-2 rounded-full"></div>
                </h2>
                
                {/* Métricas principales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {tipoInforme === 'ventas' && (
                    <>
                      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                        <p className="text-gray-400 text-sm mb-1">Ingresos Totales</p>
                        <h3 className="text-3xl font-bold text-white mb-1">{datosInformes.ventas.totales.ingresos.toFixed(2)}€</h3>
                        <p className="text-green-400 text-sm">+8.2% desde el mes pasado</p>
                      </div>
                      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                        <p className="text-gray-400 text-sm mb-1">Transacciones</p>
                        <h3 className="text-3xl font-bold text-white mb-1">{datosInformes.ventas.totales.transacciones}</h3>
                        <p className="text-green-400 text-sm">+12.5% desde el mes pasado</p>
                      </div>
                      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                        <p className="text-gray-400 text-sm mb-1">Valor Promedio</p>
                        <h3 className="text-3xl font-bold text-white mb-1">
                          {(datosInformes.ventas.totales.ingresos / datosInformes.ventas.totales.transacciones).toFixed(2)}€
                        </h3>
                        <p className="text-yellow-400 text-sm">-0.8% desde el mes pasado</p>
                      </div>
                    </>
                  )}
                  
                  {tipoInforme === 'cursos' && (
                    <>
                      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                        <p className="text-gray-400 text-sm mb-1">Estudiantes Totales</p>
                        <h3 className="text-3xl font-bold text-white mb-1">{datosInformes.cursos.totales.estudiantes}</h3>
                        <p className="text-green-400 text-sm">+15.3% desde el mes pasado</p>
                      </div>
                      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                        <p className="text-gray-400 text-sm mb-1">Cursos Completados</p>
                        <h3 className="text-3xl font-bold text-white mb-1">{datosInformes.cursos.totales.completados}</h3>
                        <p className="text-green-400 text-sm">+7.8% desde el mes pasado</p>
                      </div>
                      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                        <p className="text-gray-400 text-sm mb-1">Tasa de Finalización</p>
                        <h3 className="text-3xl font-bold text-white mb-1">
                          {((datosInformes.cursos.totales.completados / datosInformes.cursos.totales.estudiantes) * 100).toFixed(1)}%
                        </h3>
                        <p className="text-red-400 text-sm">-1.2% desde el mes pasado</p>
                      </div>
                    </>
                  )}
                  
                  {tipoInforme === 'usuarios' && (
                    <>
                      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                        <p className="text-gray-400 text-sm mb-1">Nuevos Usuarios</p>
                        <h3 className="text-3xl font-bold text-white mb-1">{datosInformes.usuarios.totales.nuevos}</h3>
                        <p className="text-green-400 text-sm">+23.5% desde el mes pasado</p>
                      </div>
                      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                        <p className="text-gray-400 text-sm mb-1">Usuarios Activos</p>
                        <h3 className="text-3xl font-bold text-white mb-1">{datosInformes.usuarios.totales.activos}</h3>
                        <p className="text-green-400 text-sm">+8.7% desde el mes pasado</p>
                      </div>
                      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                        <p className="text-gray-400 text-sm mb-1">Tasa de Conversión</p>
                        <h3 className="text-3xl font-bold text-white mb-1">{datosInformes.usuarios.totales.conversion}%</h3>
                        <p className="text-green-400 text-sm">+0.5% desde el mes pasado</p>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Gráfico principal */}
                <ChartPlaceholder title="Gráfico de tendencia en el tiempo" height={350} />
              </div>
              
              {/* Tabla de datos */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-400 border-b border-gray-700/50">
                        {tipoInforme === 'ventas' && (
                          <>
                            <th className="p-4">Fecha</th>
                            <th className="p-4">Curso</th>
                            <th className="p-4">Usuario</th>
                            <th className="p-4">Valor</th>
                          </>
                        )}
                        
                        {tipoInforme === 'cursos' && (
                          <>
                            <th className="p-4">Curso</th>
                            <th className="p-4">Estudiantes</th>
                            <th className="p-4">Valoración</th>
                            <th className="p-4">Completados</th>
                            <th className="p-4">Ingresos</th>
                          </>
                        )}
                        
                        {tipoInforme === 'usuarios' && (
                          <>
                            <th className="p-4">Fecha</th>
                            <th className="p-4">Nuevos Usuarios</th>
                            <th className="p-4">Usuarios Activos</th>
                            <th className="p-4">Tasa de Conversión</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {tipoInforme === 'ventas' && datosInformes.ventas.datos.map((item, index) => (
                        <motion.tr 
                          key={item.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                          className="border-b border-gray-700/30 last:border-0 hover:bg-gray-700/20"
                        >
                          <td className="p-4 text-gray-300">{item.fecha}</td>
                          <td className="p-4 text-white">{item.curso}</td>
                          <td className="p-4 text-gray-300">{item.usuario}</td>
                          <td className="p-4 text-green-400 font-medium">{item.valor.toFixed(2)}€</td>
                        </motion.tr>
                      ))}
                      
                      {tipoInforme === 'cursos' && datosInformes.cursos.datos.map((item, index) => (
                        <motion.tr 
                          key={item.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                          className="border-b border-gray-700/30 last:border-0 hover:bg-gray-700/20"
                        >
                          <td className="p-4 text-white">{item.curso}</td>
                          <td className="p-4 text-gray-300">{item.estudiantes}</td>
                          <td className="p-4">
                            <div className="flex items-center">
                              <span className="text-yellow-400 mr-1">★</span>
                              <span className="text-gray-300">{item.valoracion}</span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-300">{item.completados}</td>
                          <td className="p-4 text-green-400 font-medium">{item.ingresos}€</td>
                        </motion.tr>
                      ))}
                      
                      {tipoInforme === 'usuarios' && datosInformes.usuarios.datos.map((item, index) => (
                        <motion.tr 
                          key={item.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                          className="border-b border-gray-700/30 last:border-0 hover:bg-gray-700/20"
                        >
                          <td className="p-4 text-gray-300">{item.fecha}</td>
                          <td className="p-4 text-gray-300">{item.nuevos}</td>
                          <td className="p-4 text-white">{item.activos}</td>
                          <td className="p-4 text-purple-400 font-medium">{item.conversion}%</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInformes;
