import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { 
  FaBook, 
  FaSearch, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaEyeSlash,
  FaPlus,
  FaChartBar,
  FaUsersCog,
  FaComments,
  FaChartLine,
  FaSort,
  FaFilter,
  FaImage
} from 'react-icons/fa';

const AdminCursos = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cursos, setCursos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('todos');
  const [editandoCurso, setEditandoCurso] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [ordenarPor, setOrdenarPor] = useState('recientes');

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
            // Cargar la lista de cursos
            cargarCursos();
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
  const cargarCursos = async () => {
    // Simulamos datos de cursos para la demo
    // En un caso real, esto sería una llamada a tu API:
    // const response = await axios.get('http://localhost/TFG_DAW/backend/controlador/controlador.php?action=obtenerTodosCursos', { withCredentials: true });
    // setCursos(response.data);
    
    // Datos simulados:
    setTimeout(() => {
      const cursosMock = [
        { 
          id: 1, 
          titulo: 'JavaScript Avanzado', 
          descripcion: 'Domina los conceptos avanzados de JavaScript, incluyendo promesas, async/await, y patrones de diseño modernos.',
          imgCurso: 'https://placehold.co/600x400/2a2a2a/purple?text=JavaScript+Avanzado',
          precio: 49.99,
          profesor: 'Carlos Martínez', 
          duracion: 12,
          estudiantes: 342,
          valoracion: 4.8,
          publicado: true,
          destacado: true,
          tipo_curso: 'Avanzado',
          fecha_creacion: '2024-09-15',
          modulos: 8
        },
        { 
          id: 2, 
          titulo: 'React Native Masterclass', 
          descripcion: 'Aprende a crear aplicaciones móviles nativas para iOS y Android con React Native. Incluye proyectos prácticos y deployment.',
          imgCurso: 'https://placehold.co/600x400/2a2a2a/pink?text=React+Native',
          precio: 59.99,
          profesor: 'María López', 
          duracion: 15,
          estudiantes: 287,
          valoracion: 4.7,
          publicado: true,
          destacado: true,
          tipo_curso: 'Intermedio',
          fecha_creacion: '2024-10-05',
          modulos: 10
        },
        { 
          id: 3, 
          titulo: 'Python para Data Science', 
          descripcion: 'Introducción a la ciencia de datos con Python. Aprende pandas, numpy, matplotlib y técnicas de análisis de datos.',
          imgCurso: 'https://placehold.co/600x400/2a2a2a/blue?text=Python+Data',
          precio: 39.99,
          profesor: 'Juan Pérez', 
          duracion: 10,
          estudiantes: 254,
          valoracion: 4.9,
          publicado: true,
          destacado: false,
          tipo_curso: 'Principiante',
          fecha_creacion: '2024-08-20',
          modulos: 6
        },
        { 
          id: 4, 
          titulo: 'DevOps con Docker y Kubernetes', 
          descripcion: 'Domina las herramientas esenciales de DevOps. Contenedores, orquestación y CI/CD para implementaciones modernas.',
          imgCurso: 'https://placehold.co/600x400/2a2a2a/cyan?text=DevOps',
          precio: 69.99,
          profesor: 'Ana Sánchez', 
          duracion: 18,
          estudiantes: 176,
          valoracion: 4.6,
          publicado: false,
          destacado: false,
          tipo_curso: 'Avanzado',
          fecha_creacion: '2024-11-10',
          modulos: 12
        },
      ];
      setCursos(cursosMock);
    }, 1000);
  };

  const handleAbrirModal = (curso = null) => {
    setEditandoCurso(curso || {
      titulo: '',
      descripcion: '',
      imgCurso: 'https://placehold.co/600x400/2a2a2a/purple?text=Nuevo+Curso',
      precio: 0,
      profesor: '',
      duracion: 0,
      tipo_curso: 'Principiante',
      publicado: false,
      destacado: false
    });
    setMostrarModal(true);
  };

  const handleGuardarCurso = () => {
    // Actualizar curso existente o crear uno nuevo
    if (editandoCurso.id) {
      // Si es un curso existente, actualizarlo en el array
      setCursos(cursos.map(c => c.id === editandoCurso.id ? editandoCurso : c));
    } else {
      // Si es un curso nuevo, agregarlo al array con un id simulado
      const nuevoId = Math.max(...cursos.map(c => c.id), 0) + 1;
      const nuevoCurso = {
        ...editandoCurso,
        id: nuevoId,
        fecha_creacion: new Date().toISOString().split('T')[0],
        estudiantes: 0,
        valoracion: 0,
        modulos: 0
      };
      setCursos([...cursos, nuevoCurso]);
    }
    
    // Cerrar modal
    setMostrarModal(false);
  };

  const handleCambioEstado = (id) => {
    setCursos(cursos.map(curso => 
      curso.id === id ? { ...curso, publicado: !curso.publicado } : curso
    ));
  };

  const handleCambioDestacado = (id) => {
    setCursos(cursos.map(curso => 
      curso.id === id ? { ...curso, destacado: !curso.destacado } : curso
    ));
  };

  const handleEliminarCurso = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este curso? Esta acción no se puede deshacer.')) {
      setCursos(cursos.filter(curso => curso.id !== id));
    }
  };

  const cursosFiltrados = cursos.filter(curso => {
    // Filtrar por texto
    const coincideTexto = curso.titulo.toLowerCase().includes(filtro.toLowerCase()) || 
                          curso.descripcion.toLowerCase().includes(filtro.toLowerCase());
    
    // Filtrar por tipo
    const coincideTipo = tipoFiltro === 'todos' || curso.tipo_curso.toLowerCase() === tipoFiltro;
    
    return coincideTexto && coincideTipo;
  }).sort((a, b) => {
    // Ordenar según el criterio seleccionado
    switch (ordenarPor) {
      case 'recientes':
        return new Date(b.fecha_creacion) - new Date(a.fecha_creacion);
      case 'populares':
        return b.estudiantes - a.estudiantes;
      case 'valorados':
        return b.valoracion - a.valoracion;
      case 'precio_asc':
        return a.precio - b.precio;
      case 'precio_desc':
        return b.precio - a.precio;
      default:
        return new Date(b.fecha_creacion) - new Date(a.fecha_creacion);
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-purple-600 border-r-pink-600 border-b-purple-600 border-l-pink-600 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-300">Cargando gestión de cursos...</p>
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
              item.path === '/admin/cursos' 
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

  // Componente modal para editar/crear curso
  const ModalCurso = () => {
    if (!mostrarModal) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            {editandoCurso.id ? 'Editar Curso' : 'Nuevo Curso'}
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2">Título del Curso</label>
                <input 
                  type="text" 
                  value={editandoCurso.titulo || ''} 
                  onChange={(e) => setEditandoCurso({...editandoCurso, titulo: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2">Descripción</label>
                <textarea 
                  rows="4"
                  value={editandoCurso.descripcion || ''} 
                  onChange={(e) => setEditandoCurso({...editandoCurso, descripcion: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Precio (€)</label>
                <input 
                  type="number"
                  min="0"
                  step="0.01"
                  value={editandoCurso.precio || 0} 
                  onChange={(e) => setEditandoCurso({...editandoCurso, precio: parseFloat(e.target.value)})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Duración (horas)</label>
                <input 
                  type="number"
                  min="1"
                  value={editandoCurso.duracion || 1} 
                  onChange={(e) => setEditandoCurso({...editandoCurso, duracion: parseInt(e.target.value)})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Profesor</label>
                <input 
                  type="text" 
                  value={editandoCurso.profesor || ''} 
                  onChange={(e) => setEditandoCurso({...editandoCurso, profesor: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Tipo de Curso</label>
                <select 
                  value={editandoCurso.tipo_curso || 'Principiante'} 
                  onChange={(e) => setEditandoCurso({...editandoCurso, tipo_curso: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                >
                  <option value="Principiante">Principiante</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2">URL Imagen (Portada)</label>
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    value={editandoCurso.imgCurso || ''} 
                    onChange={(e) => setEditandoCurso({...editandoCurso, imgCurso: e.target.value})}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                  <button 
                    className="bg-purple-600 text-white rounded-xl px-4 hover:bg-purple-500 transition-colors"
                    title="Seleccionar imagen"
                  >
                    <FaImage />
                  </button>
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-3">
                  <input 
                    type="checkbox" 
                    id="publicado" 
                    checked={editandoCurso.publicado || false} 
                    onChange={(e) => setEditandoCurso({...editandoCurso, publicado: e.target.checked})}
                    className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="publicado" className="ml-2 text-gray-300">Curso publicado</label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="destacado" 
                    checked={editandoCurso.destacado || false} 
                    onChange={(e) => setEditandoCurso({...editandoCurso, destacado: e.target.checked})}
                    className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="destacado" className="ml-2 text-gray-300">Curso destacado</label>
                </div>
              </div>
            </div>
            
            {editandoCurso.id && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Módulos y Lecciones</h3>
                <button className="bg-purple-600/20 border border-purple-600/50 text-purple-400 rounded-xl p-3 w-full hover:bg-purple-600/30 transition-all">
                  Gestionar Contenido del Curso
                </button>
              </div>
            )}
          </div>
          
          <div className="flex gap-3 mt-6">
            <button 
              onClick={handleGuardarCurso}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl py-3 font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all"
            >
              Guardar Curso
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
              Gestión de Cursos
              <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-pink-600 mt-2 rounded-full"></div>
            </motion.h1>
            
            {/* Filtros y acciones */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="relative flex-1 min-w-[240px]">
                  <input 
                    type="text" 
                    placeholder="Buscar cursos..."
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
                  <option value="todos">Todos los niveles</option>
                  <option value="principiante">Principiante</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
                
                <select 
                  value={ordenarPor}
                  onChange={(e) => setOrdenarPor(e.target.value)}
                  className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                >
                  <option value="recientes">Más recientes</option>
                  <option value="populares">Más populares</option>
                  <option value="valorados">Mejor valorados</option>
                  <option value="precio_asc">Precio: menor a mayor</option>
                  <option value="precio_desc">Precio: mayor a menor</option>
                </select>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAbrirModal()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl px-6 py-3 font-semibold flex items-center justify-center hover:shadow-lg hover:shadow-purple-500/20 transition-all w-full md:w-auto"
              >
                <FaPlus className="mr-2" />
                Nuevo Curso
              </motion.button>
            </div>
            
            {/* Grid de cursos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cursosFiltrados.length > 0 ? (
                cursosFiltrados.map((curso, index) => (
                  <motion.div
                    key={curso.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
                  >
                    {/* Imagen del curso */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={curso.imgCurso}
                        alt={curso.titulo}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                      
                      {/* Badges */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          curso.publicado 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {curso.publicado ? 'Publicado' : 'Borrador'}
                        </span>
                        
                        {curso.destacado && (
                          <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-semibold">
                            Destacado
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5">
                      <h2 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
                        {curso.titulo}
                      </h2>
                      
                      <p className="text-gray-300 text-sm line-clamp-3 mb-4">
                        {curso.descripcion}
                      </p>

                      <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                        <div>Profesor: {curso.profesor}</div>
                        <div>{curso.duracion} horas</div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="text-yellow-400 mr-1">★</div>
                          <span className="text-gray-300">{curso.valoracion}</span>
                          <span className="text-gray-500 mx-2">•</span>
                          <span className="text-gray-300">{curso.estudiantes} estudiantes</span>
                        </div>
                        <div className="text-xl font-bold text-white">{curso.precio}€</div>
                      </div>
                      
                      {/* Acciones */}
                      <div className="grid grid-cols-4 gap-2 mt-4 border-t border-gray-700/50 pt-4">
                        <button 
                          onClick={() => handleAbrirModal(curso)}
                          className="flex items-center justify-center p-2 text-purple-400 hover:bg-purple-500/20 rounded-lg transition-colors"
                          title="Editar curso"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleCambioEstado(curso.id)}
                          className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
                            curso.publicado 
                              ? 'text-red-400 hover:bg-red-500/20' 
                              : 'text-green-400 hover:bg-green-500/20'
                          }`}
                          title={curso.publicado ? 'Despublicar' : 'Publicar'}
                        >
                          {curso.publicado ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        <button 
                          onClick={() => handleCambioDestacado(curso.id)}
                          className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
                            curso.destacado 
                              ? 'text-yellow-400 hover:bg-yellow-500/20' 
                              : 'text-gray-400 hover:bg-gray-500/20'
                          }`}
                          title={curso.destacado ? 'Quitar destacado' : 'Destacar'}
                        >
                          <FaStar />
                        </button>
                        <button 
                          onClick={() => handleEliminarCurso(curso.id)}
                          className="flex items-center justify-center p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Eliminar curso"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full bg-gray-800/50 rounded-2xl p-8 text-center text-gray-400">
                  No se encontraron cursos que coincidan con los criterios de búsqueda
                </div>
              )}
            </div>
            
            {/* Paginación */}
            <div className="flex justify-between items-center mt-6 text-gray-400">
              <div>Mostrando {cursosFiltrados.length} de {cursos.length} cursos</div>
              <div className="flex space-x-1">
                <button className="px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">Anterior</button>
                <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white">1</button>
                <button className="px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">2</button>
                <button className="px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">Siguiente</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal para editar/crear curso */}
      <ModalCurso />
    </div>
  );
};

export default AdminCursos;
