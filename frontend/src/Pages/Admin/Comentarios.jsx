import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { 
  FaComments, 
  FaSearch, 
  FaEdit, 
  FaTrash, 
  FaCheck, 
  FaBan,
  FaFilter,
  FaChartBar,
  FaUsersCog,
  FaBook,
  FaChartLine,
  FaFlag
} from 'react-icons/fa';

const AdminComentarios = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comentarios, setComentarios] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('todos');
  const [estadoFiltro, setEstadoFiltro] = useState('todos');
  const [editandoComentario, setEditandoComentario] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

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
            // Cargar los comentarios
            cargarComentarios();
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

  // Esta función se implementaría con tu backend real
  const cargarComentarios = async () => {
    // Simulamos datos de comentarios para la demo
    // En un caso real, esto sería una llamada a tu API:
    // const response = await axios.get('http://localhost/TFG_DAW/backend/controlador/controlador.php?action=obtenerComentarios', { withCredentials: true });
    // setComentarios(response.data);
    
    // Datos simulados:
    setTimeout(() => {
      const comentariosMock = [
        { 
          id: 1, 
          usuario: 'Carlos Martínez', 
          email: 'carlos@example.com',
          curso: 'JavaScript Avanzado',
          curso_id: 1,
          contenido: 'Excelente curso, muy completo y bien explicado. Lo recomendaría a cualquier persona que quiera profundizar en JavaScript.',
          valoracion: 5,
          fecha: '2024-11-15',
          estado: 'aprobado',
          reportado: false
        },
        { 
          id: 2, 
          usuario: 'María López', 
          email: 'maria@example.com',
          curso: 'React Native Masterclass',
          curso_id: 2,
          contenido: 'Buen material, pero algunas partes están un poco desactualizadas. Por lo demás, bastante útil.',
          valoracion: 4,
          fecha: '2024-11-10',
          estado: 'aprobado',
          reportado: false
        },
        { 
          id: 3, 
          usuario: 'Juan Pérez', 
          email: 'juan@example.com',
          curso: 'Python para Data Science',
          curso_id: 3,
          contenido: 'Este curso no cumple con lo prometido. Apenas toca la superficie y los ejercicios son demasiado básicos.',
          valoracion: 2,
          fecha: '2024-11-05',
          estado: 'pendiente',
          reportado: true
        },
        { 
          id: 4, 
          usuario: 'Ana Sánchez', 
          email: 'ana@example.com',
          curso: 'JavaScript Avanzado',
          curso_id: 1,
          contenido: 'Contenido inapropiado que viola las normas de la comunidad.',
          valoracion: 1,
          fecha: '2024-11-01',
          estado: 'rechazado',
          reportado: true
        },
      ];
      setComentarios(comentariosMock);
    }, 1000);
  };

  const handleAbrirModal = (comentario) => {
    setEditandoComentario(comentario);
    setMostrarModal(true);
  };

  const handleGuardarComentario = () => {
    // Actualizar comentario en el array
    setComentarios(comentarios.map(c => c.id === editandoComentario.id ? editandoComentario : c));
    
    // Cerrar modal
    setMostrarModal(false);
  };

  const handleAprobarComentario = (id) => {
    setComentarios(comentarios.map(comentario => 
      comentario.id === id ? { ...comentario, estado: 'aprobado' } : comentario
    ));
  };

  const handleRechazarComentario = (id) => {
    setComentarios(comentarios.map(comentario => 
      comentario.id === id ? { ...comentario, estado: 'rechazado' } : comentario
    ));
  };

  const handleEliminarComentario = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este comentario? Esta acción no se puede deshacer.')) {
      setComentarios(comentarios.filter(comentario => comentario.id !== id));
    }
  };

  const comentariosFiltrados = comentarios.filter(comentario => {
    // Filtrar por texto
    const coincideTexto = comentario.usuario.toLowerCase().includes(filtro.toLowerCase()) || 
                          comentario.contenido.toLowerCase().includes(filtro.toLowerCase()) ||
                          comentario.curso.toLowerCase().includes(filtro.toLowerCase());
    
    // Filtrar por curso
    const coincideCurso = tipoFiltro === 'todos' || comentario.curso_id === parseInt(tipoFiltro);
    
    // Filtrar por estado
    const coincideEstado = estadoFiltro === 'todos' || 
                          (estadoFiltro === 'reportados' && comentario.reportado) ||
                          comentario.estado === estadoFiltro;
    
    return coincideTexto && coincideCurso && coincideEstado;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-purple-600 border-r-pink-600 border-b-purple-600 border-l-pink-600 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-300">Cargando gestión de comentarios...</p>
        </div>
      </div>
    );
  }

  if (!userData || userData.tipo_usuario !== 'admin') {
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
              item.path === '/admin/comentarios' 
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

  // Componente modal para editar comentario
  const ModalComentario = () => {
    if (!mostrarModal || !editandoComentario) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800 rounded-2xl p-6 w-full max-w-xl"
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            Editar Comentario
          </h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-gray-300 mb-1">Usuario:</p>
              <p className="text-white font-medium">{editandoComentario.usuario}</p>
            </div>
            
            <div>
              <p className="text-gray-300 mb-1">Curso:</p>
              <p className="text-white font-medium">{editandoComentario.curso}</p>
            </div>
            
            <div>
              <p className="text-gray-300 mb-1">Valoración:</p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span 
                    key={star}
                    className={`text-xl ${star <= editandoComentario.valoracion ? 'text-yellow-400' : 'text-gray-600'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Contenido del Comentario</label>
              <textarea 
                rows="4"
                value={editandoComentario.contenido || ''} 
                onChange={(e) => setEditandoComentario({...editandoComentario, contenido: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Estado</label>
              <select 
                value={editandoComentario.estado || 'pendiente'} 
                onChange={(e) => setEditandoComentario({...editandoComentario, estado: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              >
                <option value="pendiente">Pendiente de revisión</option>
                <option value="aprobado">Aprobado</option>
                <option value="rechazado">Rechazado</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="reportado" 
                checked={editandoComentario.reportado || false} 
                onChange={(e) => setEditandoComentario({...editandoComentario, reportado: e.target.checked})}
                className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="reportado" className="ml-2 text-gray-300">Comentario reportado</label>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button 
              onClick={handleGuardarComentario}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl py-3 font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all"
            >
              Guardar Cambios
            </button>
            <button 
              onClick={() => setMostrarModal(false)}
              className="flex-1 bg-gray-700 text-gray-300 rounded-xl py-3 font-semibold hover:bg-gray-600 transition-all"
            >
              Cancelar
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

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
              Gestión de Comentarios
              <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-pink-600 mt-2 rounded-full"></div>
            </motion.h1>
            
            {/* Filtros */}
            <div className="flex flex-col lg:flex-row gap-4 items-start md:items-center mb-6">
              <div className="relative flex-1 min-w-[240px]">
                <input 
                  type="text" 
                  placeholder="Buscar comentarios..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 pl-10 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              <select 
                value={tipoFiltro}
                onChange={(e) => setTipoFiltro(e.target.value)}
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              >
                <option value="todos">Todos los cursos</option>
                <option value="1">JavaScript Avanzado</option>
                <option value="2">React Native Masterclass</option>
                <option value="3">Python para Data Science</option>
              </select>
              
              <select 
                value={estadoFiltro}
                onChange={(e) => setEstadoFiltro(e.target.value)}
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              >
                <option value="todos">Todos los estados</option>
                <option value="pendiente">Pendientes</option>
                <option value="aprobado">Aprobados</option>
                <option value="rechazado">Rechazados</option>
                <option value="reportados">Reportados</option>
              </select>
            </div>
            
            {/* Lista de comentarios */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden"
            >
              {comentariosFiltrados.length > 0 ? (
                <div className="divide-y divide-gray-700/30">
                  {comentariosFiltrados.map((comentario, index) => (
                    <motion.div
                      key={comentario.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="p-5 hover:bg-gray-700/20 transition-colors"
                    >
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
                          {comentario.usuario.charAt(0)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                            <h3 className="font-bold text-white">{comentario.usuario}</h3>
                            <p className="text-sm text-gray-400">
                              Sobre: <span className="text-purple-400">{comentario.curso}</span>
                            </p>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span 
                                  key={star}
                                  className={`text-sm ${star <= comentario.valoracion ? 'text-yellow-400' : 'text-gray-600'}`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <p className="text-sm text-gray-500">{comentario.fecha}</p>
                          </div>
                          
                          <p className="text-gray-300 mb-4">{comentario.contenido}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                comentario.estado === 'aprobado' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : comentario.estado === 'rechazado'
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {comentario.estado === 'aprobado' 
                                  ? 'Aprobado' 
                                  : comentario.estado === 'rechazado'
                                    ? 'Rechazado'
                                    : 'Pendiente'
                                }
                              </span>
                              
                              {comentario.reportado && (
                                <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                                  <FaFlag className="mr-1" size={10} /> Reportado
                                </span>
                              )}
                            </div>
                            
                            <div className="flex space-x-3">
                              {comentario.estado === 'pendiente' && (
                                <>
                                  <button 
                                    onClick={() => handleAprobarComentario(comentario.id)}
                                    className="text-green-400 hover:text-green-300 transition-colors"
                                    title="Aprobar comentario"
                                  >
                                    <FaCheck />
                                  </button>
                                  <button 
                                    onClick={() => handleRechazarComentario(comentario.id)}
                                    className="text-red-400 hover:text-red-300 transition-colors"
                                    title="Rechazar comentario"
                                  >
                                    <FaBan />
                                  </button>
                                </>
                              )}
                              <button 
                                onClick={() => handleAbrirModal(comentario)}
                                className="text-purple-400 hover:text-purple-300 transition-colors"
                                title="Editar comentario"
                              >
                                <FaEdit />
                              </button>
                              <button 
                                onClick={() => handleEliminarComentario(comentario.id)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                                title="Eliminar comentario"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400">
                  No se encontraron comentarios que coincidan con los criterios de búsqueda
                </div>
              )}
            </motion.div>
            
            {/* Paginación */}
            <div className="flex justify-between items-center mt-6 text-gray-400">
              <div>Mostrando {comentariosFiltrados.length} de {comentarios.length} comentarios</div>
              <div className="flex space-x-1">
                <button className="px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">Anterior</button>
                <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white">1</button>
                <button className="px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">Siguiente</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal para editar comentario */}
      <ModalComentario />
    </div>
  );
};

export default AdminComentarios;
