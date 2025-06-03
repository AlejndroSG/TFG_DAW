import React, { useState, useEffect, useRef } from 'react';
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
  FaImage,
  FaStar,
  FaSignOutAlt
} from 'react-icons/fa';

const AdminCursos = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cursos, setCursos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('todos');
  // Simplificamos el estado
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
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
          // Log para depurar el tipo de usuario
          console.log('Tipo de usuario:', respuesta.data.tipo_usuario);
          console.log('Sesión completa:', respuesta.data);
          
          // Verificar si el usuario es administrador
          if (respuesta.data.tipo_usuario && (respuesta.data.tipo_usuario.toLowerCase() === 'administrador' || respuesta.data.tipo_usuario.toLowerCase() === 'admin')) {
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

  // Obtener cursos reales de la base de datos
  const cargarCursos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=obtenerTodosCursos', 
        { withCredentials: true }
      );
      
      if (Array.isArray(response.data)) {
        setCursos(response.data);
        console.log('Cursos cargados del servidor:', response.data);
      } else if (response.data.error) {
        console.error('Error al cargar cursos:', response.data.error);
      } else {
        console.error('Formato de respuesta inesperado:', response.data);
      }
    } catch (error) {
      console.error('Error al cargar los cursos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Utiliza la función `abrirModal` para editar o crear cursos
  const abrirModal = (curso = null) => {
    // Evitar reaperturas innecesarias si ya está abierto
    if (!mostrarModal) {
      console.log('Abriendo modal con curso:', curso);
      setCursoSeleccionado(curso);
      setMostrarModal(true);
    }
  };
  
  // Manejador para cerrar el modal
  const cerrarModal = () => {
    console.log('Cerrando modal');
    setMostrarModal(false);
    // Esperar a que se cierre la animación antes de limpiar el curso seleccionado
    setTimeout(() => {
      setCursoSeleccionado(null);
    }, 300);
  };
  const fileInputRef = React.useRef(null);

  const handleCambioEstado = async (id) => {
    try {
      const curso = cursos.find(c => c.id === id);
      if (!curso) return;
      
      const nuevoEstado = !curso.publicado;
      
      // Enviar solicitud al servidor
      const response = await axios.post(
        'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=cambiarEstadoCurso',
        {
          id: id,
          campo: 'publicado',
          valor: nuevoEstado
        },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        // Actualizar la lista de cursos con los datos actualizados
        await cargarCursos();
      } else {
        console.error('Error al cambiar el estado del curso:', response.data.error);
        alert('Error al cambiar el estado del curso: ' + response.data.error);
      }
    } catch (error) {
      console.error('Error al cambiar el estado del curso:', error);
      alert('Error al cambiar el estado del curso. Intente nuevamente.');
    }
  };

  const handleCambioDestacado = async (id) => {
    try {
      const curso = cursos.find(c => c.id === id);
      if (!curso) return;
      
      const nuevoEstado = !curso.destacado;
      
      // Enviar solicitud al servidor
      const response = await axios.post(
        'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=cambiarEstadoCurso',
        {
          id: id,
          campo: 'destacado',
          valor: nuevoEstado
        },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        // Actualizar la lista de cursos con los datos actualizados
        await cargarCursos();
      } else {
        console.error('Error al cambiar el estado destacado del curso:', response.data.error);
        alert('Error al cambiar el estado destacado del curso: ' + response.data.error);
      }
    } catch (error) {
      console.error('Error al cambiar el estado destacado del curso:', error);
      alert('Error al cambiar el estado destacado del curso. Intente nuevamente.');
    }
  };

  const handleEliminarCurso = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este curso? Esta acción no se puede deshacer.')) {
      try {
        // Enviar solicitud al servidor
        const response = await axios.post(
          'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=eliminarCurso',
          { id: id },
          { withCredentials: true }
        );
        
        if (response.data.success) {
          // Actualizar la lista de cursos eliminando el curso
          setCursos(cursos.filter(curso => curso.id !== id));
          alert('Curso eliminado correctamente');
        } else {
          console.error('Error al eliminar el curso:', response.data.error);
          alert('Error al eliminar el curso: ' + response.data.error);
        }
      } catch (error) {
        console.error('Error al eliminar el curso:', error);
        alert('Error al eliminar el curso. Intente nuevamente.');
      }
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
      </div>
    </div>
  );

  // Componente modal para editar/crear curso
  // Modal como componente separado y memorizado para evitar re-renderizados innecesarios
  const ModalCurso = React.memo(({ curso, onGuardar, onCerrar }) => {
    // Estado local del formulario dentro del modal
    const [formData, setFormData] = useState({
      id_curso: curso?.id || '',
      titulo: curso?.titulo || '',
      descripcion: curso?.descripcion || '',
      contenido: curso?.contenido || '',
      imagen: curso?.imagen || '',
      precio: curso?.precio || '',
      publicado: curso?.publicado === 1,
      destacado: curso?.destacado === 1
    });
    
    // Estado para la vista previa de imagen
    const [imagenPreview, setImagenPreview] = useState(
      curso?.imagen 
        ? curso.imagen.startsWith('/') 
          ? `http://localhost/TFG_DAW/frontend${curso.imagen}` 
          : curso.imagen 
        : null
    );
    
    // Estado para indicar cuando se está subiendo una imagen
    const [subiendoImagen, setSubiendoImagen] = useState(false);
    // Estado para controlar cuando se está guardando
    const [guardando, setGuardando] = useState(false);
    
    // Efecto para actualizar el formulario cuando cambia el curso seleccionado
    // Se usa un useEffect para separar la inicialización del renderizado
    useEffect(() => {
      if (curso) {
        setFormData({
          id_curso: curso.id || '',
          titulo: curso.titulo || '',
          descripcion: curso.descripcion || '',
          contenido: curso.contenido || '',
          publicado: curso.publicado === 1,
          destacado: curso.destacado === 1,
          imagen: curso.imagen || '',
          precio: curso.precio || ''
        });
        
        // Inicializar la vista previa de la imagen
        if (curso.imagen) {
          setImagenPreview(curso.imagen.startsWith('/') 
            ? `http://localhost/TFG_DAW/frontend${curso.imagen}` 
            : curso.imagen
          );
        } else {
          setImagenPreview(null);
        }
      }
    }, [curso]);

    // Manejador genérico para inputs que actualiza el estado local sin modificar el prop original
    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    };

    // Manejador para subir imagen
    const handleSubirImagenModal = async (file) => {
      if (!file) return;
      
      setSubiendoImagen(true);
      
      const formDataImg = new FormData();
      formDataImg.append('imagen', file);
      
      try {
        const response = await axios.post(
          'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=subirImagenCurso',
          formDataImg,
          { 
            withCredentials: true,
            headers: {'Content-Type': 'multipart/form-data'}
          }
        );
        
        if (response.data.success) {
          console.log('Imagen subida:', response.data.ruta);
          // Actualizar solo el estado local del formulario
          setFormData(prev => ({
            ...prev,
            imagen: response.data.ruta
          }));
        } else {
          console.error('Error al subir imagen:', response.data.error);
          alert('Error al subir la imagen: ' + (response.data.error || 'Error desconocido'));
        }
      } catch (error) {
        console.error('Error al subir imagen:', error);
        alert('Error al subir la imagen. Intente nuevamente.');
      } finally {
        setSubiendoImagen(false);
      }
    };
    
    // Manejador para guardar curso - modificado para manejar correctamente el estado
    const handleGuardarCurso = async () => {
      if (!formData.titulo) {
        alert('El título del curso es obligatorio');
        return;
      }
      
      // Evitar múltiples clicks
      if (guardando) return;
      
      try {
        setGuardando(true);
        
        // Preparar datos para el servidor - copia explícita para evitar mutaciones
        const datosCurso = {
          titulo: formData.titulo,
          descripcion: formData.descripcion,
          contenido: formData.contenido,
          publicado: formData.publicado ? 1 : 0,
          destacado: formData.destacado ? 1 : 0,
          imagen: formData.imagen,
          precio: formData.precio
        };
        
        // Si es edición, asegurarse de que se envía el ID correcto
        if (formData.id_curso) {
          datosCurso.id = formData.id_curso;
        }
        
        console.log('Enviando datos al servidor:', datosCurso);
        
        const response = await axios.post(
          'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=guardarCurso',
          datosCurso,
          { withCredentials: true }
        );
        
        console.log('Respuesta del servidor:', response.data);
        
        if (response.data && response.data.success) {
          // Llamar onGuardar solo después de confirmar éxito
          onGuardar();
          // No necesitamos cerrar el modal aquí, lo hará el componente padre
          alert(response.data.mensaje || 'Curso guardado con éxito');
        } else {
          console.error('Error al guardar el curso:', response.data?.error || 'Error desconocido');
          alert('Error al guardar el curso: ' + (response.data?.error || 'Error desconocido'));
        }
      } catch (error) {
        console.error('Error al guardar el curso:', error);
        alert('Error al guardar el curso. Intente nuevamente.');
      } finally {
        setGuardando(false);
      }
    };
    
    // Manejador para el input de archivo
    const handleFileChangeModal = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      setImagenPreview(URL.createObjectURL(file));
      handleSubirImagenModal(file);
    };

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            {formData.id_curso ? 'Editar Curso' : 'Nuevo Curso'}
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2">Título del Curso</label>
                <input 
                  type="text" 
                  name="titulo"
                  value={formData.titulo || ''} 
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2">Descripción</label>
                <textarea 
                  rows="4"
                  name="descripcion"
                  value={formData.descripcion || ''} 
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Precio (€)</label>
                <input 
                  type="number"
                  min="0"
                  step="0.01"
                  name="precio"
                  value={formData.precio || 0} 
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Duración (horas)</label>
                <input 
                  type="number"
                  min="1"
                  name="duracion"
                  value={formData.duracion || 1} 
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Profesor</label>
                <input 
                  type="text" 
                  name="profesor"
                  value={formData.profesor || ''} 
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Tipo de Curso</label>
                <select 
                  name="tipo_curso"
                  value={formData.tipo_curso || 'Principiante'} 
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                >
                  <option value="Principiante">Principiante</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2">Imagen del Curso</label>
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    name="imgCurso"
                    value={formData.imgCurso || ''} 
                    onChange={handleInputChange}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    placeholder="Ruta de la imagen o sube una nueva"
                  />
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="bg-purple-600 text-white rounded-xl px-4 hover:bg-purple-500 transition-colors flex items-center justify-center"
                    title="Subir imagen"
                    disabled={subiendoImagen}
                  >
                    {subiendoImagen ? (
                      <div className="w-5 h-5 border-2 border-t-transparent border-white border-solid rounded-full animate-spin"></div>
                    ) : (
                      <FaImage />
                    )}
                  </button>
                  
                  {/* Input de archivo oculto */}
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChangeModal}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                
                {/* Vista previa de imagen */}
                <div className="mt-4">
                  <img 
                    src={imagenPreview || (formData.imgCurso ? (formData.imgCurso.startsWith('http') ? formData.imgCurso : `http://localhost/TFG_DAW/frontend${formData.imgCurso.replace('.', '')}`) : 'http://localhost/TFG_DAW/frontend/src/img/imgCursos/default.jpg')} 
                    alt="Vista previa del curso" 
                    className="rounded-xl max-h-48 max-w-full object-contain bg-gray-800 border border-gray-700 p-2"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-3">
                  <input 
                    type="checkbox" 
                    id="publicado" 
                    name="publicado"
                    checked={formData.publicado || false} 
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="publicado" className="ml-2 text-gray-300">Curso publicado</label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="destacado" 
                    name="destacado"
                    checked={formData.destacado || false} 
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="destacado" className="ml-2 text-gray-300">Curso destacado</label>
                </div>
              </div>
            </div>
            
            {formData.id_curso && (
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
              disabled={guardando || subiendoImagen}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl py-3 font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {guardando ? 'Guardando...' : 'Guardar Curso'}
            </button>
            <button 
              onClick={onCerrar}
              disabled={guardando || subiendoImagen}
              className="flex-1 bg-gray-700 text-gray-300 rounded-xl py-3 font-semibold hover:bg-gray-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </motion.div>
      </div>
    );
  });

  // Manejar carga de cursos después de guardar
  const handleDespuesDeGuardar = async () => {
    await cargarCursos();
    cerrarModal();
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/5">
            {/* Componente de sidebar definido localmente */}
            <div className="bg-gray-800 rounded-2xl p-5 sticky top-4">
              <h2 className="text-xl font-bold text-white mb-5">Panel Admin</h2>
              <nav className="space-y-2">
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
                    {userData?.username ? userData.username.charAt(0) : 'A'}
                  </div>
                  <div className="ml-3">
                    <p className="text-white font-semibold">{userData?.username || 'Admin'}</p>
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
                        src={curso.imgCurso ? `http://localhost/TFG_DAW/frontend${curso.imgCurso.replace('.', '')}` : 'http://localhost/TFG_DAW/frontend/src/img/imgCursos/default.jpg'}
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
                          onClick={() => abrirModal(curso)}
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
      
      {/* Modal para editar/crear curso - solo se renderiza cuando mostrarModal es true */}
      {mostrarModal && (
        <ModalCurso 
          curso={cursoSeleccionado} 
          onGuardar={handleDespuesDeGuardar} 
          onCerrar={cerrarModal} 
        />
      )}
    </div>
  );
};

export default AdminCursos;
