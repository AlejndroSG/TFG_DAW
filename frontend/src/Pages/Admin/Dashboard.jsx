import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaGraduationCap, 
  FaChartLine, 
  FaEuroSign, 
  FaUsersCog,
  FaBook,
  FaComments,
  FaChartBar
} from 'react-icons/fa';

// Componentes estadísticos (mock - reemplazar con Chart.js o Recharts)
const StatCard = ({ icon, title, value, change, gradient }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 hover:border-${gradient}-500/50 transition-all duration-300`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
          <p className={`text-sm ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change >= 0 ? '+' : ''}{change}% desde el mes pasado
          </p>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br from-${gradient}-400 to-${gradient}-600 text-white`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

const RecentActivity = () => {
  // Mock data - reemplazar con datos reales de la API
  const activities = [
    { id: 1, user: 'Carlos Martínez', action: 'se inscribió en', target: 'JavaScript Avanzado', time: '5 minutos' },
    { id: 2, user: 'María López', action: 'completó', target: 'HTML & CSS Básico', time: '1 hora' },
    { id: 3, user: 'Juan Pérez', action: 'dejó una valoración en', target: 'React para principiantes', time: '3 horas' },
    { id: 4, user: 'Ana Sánchez', action: 'realizó un pago por', target: 'Angular Masterclass', time: '5 horas' }
  ];

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
      <h3 className="text-xl font-bold text-white mb-4">Actividad Reciente</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div 
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex items-start gap-4 pb-4 border-b border-gray-700/30 last:border-0"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-white font-bold">
              {activity.user.charAt(0)}
            </div>
            <div>
              <p className="text-gray-300">
                <span className="font-semibold text-white">{activity.user}</span> {activity.action}{' '}
                <span className="text-purple-400">{activity.target}</span>
              </p>
              <p className="text-gray-500 text-sm">Hace {activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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
          <p className="mt-4 text-gray-300">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  if (!userData || (userData.tipo_usuario.toLowerCase() !== 'administrador' && userData.tipo_usuario !== 'admin')) {
    return <Navigate to="/" />;
  }

  // Menú de navegación lateral
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
              Dashboard
              <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-pink-600 mt-2 rounded-full"></div>
            </motion.h1>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                icon={<FaUsers size={24} />}
                title="Usuarios Totales"
                value="2,543"
                change={12.6}
                gradient="purple"
              />
              <StatCard 
                icon={<FaGraduationCap size={24} />}
                title="Estudiantes Activos"
                value="1,789"
                change={8.1}
                gradient="pink"
              />
              <StatCard 
                icon={<FaBook size={24} />}
                title="Cursos Publicados"
                value="48"
                change={4.3}
                gradient="purple"
              />
              <StatCard 
                icon={<FaEuroSign size={24} />}
                title="Ingresos Mensuales"
                value="8,942€"
                change={-2.4}
                gradient="pink"
              />
            </div>
            
            {/* Charts & Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              {/* Main Chart - ocupar 2/3 del espacio */}
              <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
                <h3 className="text-xl font-bold text-white mb-4">Rendimiento del Mes</h3>
                <div className="h-64 flex items-center justify-center">
                  <p className="text-gray-400">Gráfico de rendimiento (integrar Chart.js o Recharts)</p>
                </div>
              </div>
              
              {/* Recent Activity - ocupar 1/3 del espacio */}
              <div className="lg:col-span-1">
                <RecentActivity />
              </div>
            </div>
            
            {/* Top Courses Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 mt-6">
              <h3 className="text-xl font-bold text-white mb-4">Cursos Destacados</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-700/50">
                      <th className="pb-3">Curso</th>
                      <th className="pb-3">Estudiantes</th>
                      <th className="pb-3">Valoración</th>
                      <th className="pb-3">Ingresos</th>
                      <th className="pb-3">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 1, name: 'JavaScript Avanzado', students: 342, rating: 4.8, revenue: '14,320€' },
                      { id: 2, name: 'React Native Masterclass', students: 287, rating: 4.7, revenue: '11,480€' },
                      { id: 3, name: 'Python para Data Science', students: 254, rating: 4.9, revenue: '10,160€' },
                    ].map((course, index) => (
                      <motion.tr 
                        key={course.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="border-b border-gray-700/30 last:border-0"
                      >
                        <td className="py-4 text-white font-medium">{course.name}</td>
                        <td className="py-4 text-gray-300">{course.students}</td>
                        <td className="py-4">
                          <div className="flex items-center">
                            <span className="text-yellow-400 mr-1">★</span>
                            <span className="text-gray-300">{course.rating}</span>
                          </div>
                        </td>
                        <td className="py-4 text-gray-300">{course.revenue}</td>
                        <td className="py-4">
                          <button className="text-purple-400 hover:text-purple-300 transition-colors">
                            Ver detalles
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
