import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { 
  FaUsersCog, 
  FaSearch, 
  FaEdit, 
  FaTrash, 
  FaLock, 
  FaUnlock,
  FaUserPlus,
  FaChartBar,
  FaBook,
  FaComments,
  FaChartLine,
  FaSignOutAlt
} from 'react-icons/fa';

const AdminUsuarios = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('todos');
  const [editandoUsuario, setEditandoUsuario] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    const comprobarSesion = async () => {
      try {
        const respuesta = await axios.get(
          'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=comprobarSesion',
          { withCredentials: true }
        );
        
        if (respuesta.data && respuesta.data.username) {
          // Log para depurar el tipo de usuario
          console.log('Tipo de usuario:', respuesta.data.tipo_usuario);
          console.log('Sesión completa:', respuesta.data);
          
          // Verificar si el usuario es administrador
          if (respuesta.data.tipo_usuario && (respuesta.data.tipo_usuario.toLowerCase() === 'administrador' || respuesta.data.tipo_usuario.toLowerCase() === 'admin')) {
            setUserData(respuesta.data);
            // Cargar la lista de usuarios
            cargarUsuarios();
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

  // Obtener usuarios reales de la base de datos
  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=obtenerUsuarios', 
        { withCredentials: true }
      );
      
      if (Array.isArray(response.data)) {
        setUsuarios(response.data);
      } else if (response.data.error) {
        console.error('Error al cargar usuarios:', response.data.error);
      } else {
        console.error('Formato de respuesta inesperado:', response.data);
      }
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirModal = (usuario = null) => {
    setEditandoUsuario(usuario || {
      nombre: '',
      email: '',
      tipo_usuario: 'estudiante',
      activo: true
    });
    setMostrarModal(true);
  };

  const handleGuardarUsuario = async () => {
    try {
      // Crear una copia del usuario para no modificar el estado mientras enviamos
      const usuarioData = {...editandoUsuario};
      
      // Enviar datos al servidor
      const response = await axios({
        method: 'post',
        url: 'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=guardarUsuario',
        data: usuarioData,
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      if (response.data.error) {
        alert(`Error: ${response.data.error}`);
        return;
      }
      
      if (response.data.success) {
        // Actualizar la lista de usuarios
        if (editandoUsuario.id) {
          // Si es un usuario existente, actualizarlo en el array
          setUsuarios(usuarios.map(u => u.id === editandoUsuario.id ? {
            ...u,
            ...response.data,
            id: editandoUsuario.id // Aseguramos que el id no cambie
          } : u));
        } else {
          // Si es un usuario nuevo, agregarlo al array
          const nuevoUsuario = {
            ...response.data,
            fecha_registro: new Date().toISOString().split('T')[0],
            cursos_inscritos: 0
          };
          setUsuarios([...usuarios, nuevoUsuario]);
        }
        
        // Cerrar modal
        setMostrarModal(false);
      }
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      alert(`Error: ${error.message || 'No se pudo guardar el usuario'}`);
    }
  };

  const handleCambioEstado = (id) => {
    setUsuarios(usuarios.map(usuario => 
      usuario.id === id ? { ...usuario, activo: !usuario.activo } : usuario
    ));
  };

  const handleEliminarUsuario = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) {
      try {
        // Enviar solicitud al backend para eliminar el usuario
        const response = await axios({
          method: 'post',
          url: 'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=eliminarUsuario',
          data: { id: id },
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
        
        // Verificar respuesta
        if (response.data.error) {
          alert(`Error: ${response.data.error}`);
          return;
        }
        
        if (response.data.success) {
          // Eliminar el usuario del estado local solo si la eliminación en el backend fue exitosa
          setUsuarios(usuarios.filter(usuario => usuario.id !== id));
          alert('Usuario eliminado correctamente');
        }
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert(`Error: ${error.message || 'No se pudo eliminar el usuario'}`);
      }
    }
  };

  const usuariosFiltrados = usuarios.filter(usuario => {
    // Filtrar por texto
    const coincideTexto = usuario.nombre.toLowerCase().includes(filtro.toLowerCase()) || 
                          usuario.email.toLowerCase().includes(filtro.toLowerCase());
    
    // Filtrar por tipo
    const coincideTipo = tipoFiltro === 'todos' || usuario.tipo_usuario === tipoFiltro;
    
    return coincideTexto && coincideTipo;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-purple-600 border-r-pink-600 border-b-purple-600 border-l-pink-600 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-300">Cargando gestión de usuarios...</p>
        </div>
      </div>
    );
  }

  if (!userData || (userData.tipo_usuario.toLowerCase() !== 'administrador' && userData.tipo_usuario !== 'admin')) {
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

  // Componente modal para editar/crear usuario
  const ModalUsuario = () => {
    if (!mostrarModal) return null;
    
    // Estado local para el formulario, evita refrescos innecesarios
    const [formData, setFormData] = React.useState({
      ...editandoUsuario
    });
    
    // Manejador genérico para cambios en campos de texto
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };
    
    // Manejador para checkbox
    const handleCheckboxChange = (e) => {
      const { name, checked } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    };
    
    // Función para guardar los cambios al estado principal
    const handleSubmit = () => {
      // Actualizar el estado principal con los datos del formulario
      setEditandoUsuario(formData);
      // Llamar a la función para guardar
      handleGuardarUsuario();
    };

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800 rounded-2xl p-6 w-full max-w-md"
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            {formData.id ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Nombre</label>
              <input 
                type="text" 
                name="nombre"
                value={formData.nombre || ''} 
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email || ''} 
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Tipo de Usuario</label>
              <select 
                name="tipo_usuario"
                value={formData.tipo_usuario || 'estudiante'} 
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              >
                <option value="estudiante">Estudiante</option>
                <option value="profesor">Profesor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="activo" 
                name="activo"
                checked={formData.activo || false} 
                onChange={handleCheckboxChange}
                className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="activo" className="ml-2 text-gray-300">Usuario activo</label>
            </div>
            
            {!formData.id && (
              <div>
                <label className="block text-gray-300 mb-2">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password || ''}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  placeholder="Contraseña para el nuevo usuario"
                />
              </div>
            )}
            
            {formData.id && (
              <div>
                <label className="block text-gray-300 mb-2">Contraseña</label>
                <button 
                  className="w-full bg-amber-600/20 border border-amber-600/50 text-amber-400 rounded-xl p-3 hover:bg-amber-600/30 transition-all"
                >
                  Restablecer contraseña
                </button>
              </div>
            )}
          </div>
          
          <div className="flex gap-3 mt-6">
            <button 
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl py-3 font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all"
            >
              Guardar
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
              Gestión de Usuarios
              <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-pink-600 mt-2 rounded-full"></div>
            </motion.h1>
            
            {/* Filtros y acciones */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="relative flex-1 min-w-[240px]">
                  <input 
                    type="text" 
                    placeholder="Buscar por nombre o email..."
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
                  <option value="todos">Todos los tipos</option>
                  <option value="estudiante">Estudiantes</option>
                  <option value="profesor">Profesores</option>
                  <option value="admin">Administradores</option>
                </select>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAbrirModal()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl px-6 py-3 font-semibold flex items-center justify-center hover:shadow-lg hover:shadow-purple-500/20 transition-all w-full md:w-auto"
              >
                <FaUserPlus className="mr-2" />
                Nuevo Usuario
              </motion.button>
            </div>
            
            {/* Tabla de usuarios */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-700/50">
                      <th className="p-4">Nombre</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Tipo</th>
                      <th className="p-4">Registro</th>
                      <th className="p-4">Cursos</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosFiltrados.length > 0 ? (
                      usuariosFiltrados.map((usuario, index) => (
                        <motion.tr 
                          key={usuario.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                          className="border-b border-gray-700/30 last:border-0 hover:bg-gray-700/20"
                        >
                          <td className="p-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-white font-bold mr-3">
                                {usuario.nombre.charAt(0)}
                              </div>
                              <span className="text-white font-medium">{usuario.nombre}</span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-300">{usuario.email}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              usuario.tipo_usuario === 'admin' 
                                ? 'bg-pink-500/20 text-pink-400' 
                                : usuario.tipo_usuario === 'profesor'
                                  ? 'bg-purple-500/20 text-purple-400'
                                  : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {usuario.tipo_usuario}
                            </span>
                          </td>
                          <td className="p-4 text-gray-300">{usuario.fecha_registro}</td>
                          <td className="p-4 text-gray-300">{usuario.cursos_inscritos}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              usuario.activo 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {usuario.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleAbrirModal(usuario)}
                                className="text-purple-400 hover:text-purple-300 transition-colors"
                                title="Editar usuario"
                              >
                                <FaEdit />
                              </button>
                              <button 
                                onClick={() => handleCambioEstado(usuario.id)}
                                className={`${usuario.activo ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'} transition-colors`}
                                title={usuario.activo ? 'Desactivar usuario' : 'Activar usuario'}
                              >
                                {usuario.activo ? <FaLock /> : <FaUnlock />}
                              </button>
                              <button 
                                onClick={() => handleEliminarUsuario(usuario.id)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                                title="Eliminar usuario"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="p-4 text-center text-gray-400">
                          No se encontraron usuarios que coincidan con los criterios de búsqueda
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
            
            {/* Paginación */}
            <div className="flex justify-between items-center mt-6 text-gray-400">
              <div>Mostrando {usuariosFiltrados.length} de {usuarios.length} usuarios</div>
              <div className="flex space-x-1">
                <button className="px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">Anterior</button>
                <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white">1</button>
                <button className="px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">2</button>
                <button className="px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">3</button>
                <button className="px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">Siguiente</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal para editar/crear usuario */}
      <ModalUsuario />
    </div>
  );
};

export default AdminUsuarios;
