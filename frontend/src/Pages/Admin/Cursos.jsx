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
  FaImage,
  FaStar
} from 'react-icons/fa';

const AdminCursos = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cursos, setCursos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('todos');
  const [editandoCurso, setEditandoCurso] = useState({});
  const [formValues, setFormValues] = useState({});
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

  const handleAbrirModal = (curso = null) => {
    const cursoData = curso ? {
      // Para editar, asegurarse de usar el campo id_curso como id
      id_curso: curso.id_curso || curso.id, // Primero intentamos id_curso, luego id
      titulo: curso.titulo || '',
      descripcion: curso.descripcion || '',
      imgCurso: curso.imgCurso || '',
      precio: parseFloat(curso.precio) || 0,
      profesor: curso.profesor || '',
      duracion: parseInt(curso.duracion) || 0,
      tipo_curso: curso.tipo_curso || 'Principiante',
      publicado: !!curso.publicado,
      destacado: !!curso.destacado,
      id_profesor: curso.id_profesor || 3 // Valor por defecto para profesor
    } : {
      // Para crear nuevo
      titulo: '',
      descripcion: '',
      imgCurso: '',
      precio: 0,
      profesor: '',
      duracion: 0,
      tipo_curso: 'Principiante',
      publicado: false,
      destacado: false,
      id_profesor: 3 // Valor por defecto para profesor
    };
    
    // Actualizamos ambos estados con los mismos datos iniciales
    setEditandoCurso(cursoData);
    setFormValues(cursoData);
    setMostrarModal(true);
    // Reiniciar vista previa de imagen
    setImagenPreview(null);
    console.log('Curso a editar:', cursoData);
  };

  // Subir imagen del curso
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [imagenPreview, setImagenPreview] = useState(null);
  const fileInputRef = React.useRef(null);
  
  const handleSubirImagen = async (file) => {
    if (!file) return;
    
    setSubiendoImagen(true);
    
    try {
      // Crear un objeto FormData para enviar el archivo
      const formData = new FormData();
      formData.append('imagen', file);
      
      // Realizar la petición para subir la imagen
      const response = await axios.post(
        'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=subirImagenCurso',
        formData,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.data.success) {
        // Actualizar la ruta de la imagen en el estado del curso
        const rutaImagen = `http://localhost/TFG_DAW/frontend${response.data.ruta}`;
        // Actualizar en el estado separado para el formulario
        setFormValues(prev => ({...prev, imgCurso: rutaImagen}));
        console.log('Imagen subida correctamente:', rutaImagen);
      } else if (response.data.error) {
        console.error('Error al subir imagen:', response.data.error);
        alert('Error al subir la imagen: ' + response.data.error);
      }
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      alert('Error al subir la imagen. Intente nuevamente.');
    } finally {
      setSubiendoImagen(false);
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Mostrar preview de la imagen
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagenPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Subir la imagen al servidor
    handleSubirImagen(file);
  };
  
  const handleClickImagenBtn = () => {
    fileInputRef.current.click();
  };
  
  // Guardar curso (crear o actualizar)
  const handleGuardarCurso = async () => {
    if (!formValues.titulo) {
      alert('El título del curso es obligatorio');
      return;
    }
    
    try {
      setLoading(true);
      
      // Preparar datos finales a enviar
      const datosCurso = {
        ...formValues
      };
      
      // Asegurar que el id_curso se mapea a id para el backend
      if (formValues.id_curso) {
        datosCurso.id = formValues.id_curso;
      }
      
      console.log('Enviando datos al servidor:', datosCurso);
      
      // Enviar datos al servidor
      const response = await axios.post(
        'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=guardarCurso',
        datosCurso,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        // Recargar la lista de cursos para obtener los datos actualizados
        await cargarCursos();
        setMostrarModal(false);
        
        // Mostrar mensaje de éxito
        alert(response.data.mensaje);
      } else {
        console.error('Error al guardar el curso:', response.data.error);
        alert('Error al guardar el curso: ' + response.data.error);
      }
    } catch (error) {
      console.error('Error al guardar el curso:', error);
      alert('Error al guardar el curso. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

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
            {formValues.id_curso ? 'Editar Curso' : 'Nuevo Curso'}
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2">Título del Curso</label>
                <input 
                  type="text" 
                  value={formValues.titulo || ''} 
                  onChange={(e) => {
                    const nuevoValor = e.target.value;
                    setFormValues(prev => ({...prev, titulo: nuevoValor}));
                  }}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2">Descripción</label>
                <textarea 
                  rows="4"
                  value={formValues.descripcion || ''} 
                  onChange={(e) => {
                    const nuevoValor = e.target.value;
                    setFormValues(prev => ({...prev, descripcion: nuevoValor}));
                  }}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Precio (€)</label>
                <input 
                  type="number"
                  min="0"
                  step="0.01"
                  value={formValues.precio || 0} 
                  onChange={(e) => {
                    const nuevoValor = parseFloat(e.target.value);
                    setFormValues(prev => ({...prev, precio: nuevoValor}));
                  }}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Duración (horas)</label>
                <input 
                  type="number"
                  min="1"
                  value={formValues.duracion || 1} 
                  onChange={(e) => {
                    const nuevoValor = parseInt(e.target.value);
                    setFormValues(prev => ({...prev, duracion: nuevoValor}));
                  }}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Profesor</label>
                <input 
                  type="text" 
                  value={formValues.profesor || ''} 
                  onChange={(e) => {
                    const nuevoValor = e.target.value;
                    setFormValues(prev => ({...prev, profesor: nuevoValor}));
                  }}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Tipo de Curso</label>
                <select 
                  value={formValues.tipo_curso || 'Principiante'} 
                  onChange={(e) => {
                    const nuevoValor = e.target.value;
                    setFormValues(prev => ({...prev, tipo_curso: nuevoValor}));
                  }}
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
                    value={formValues.imgCurso || ''} 
                    onChange={(e) => {
                    const nuevoValor = e.target.value;
                    setFormValues(prev => ({...prev, imgCurso: nuevoValor}));
                  }}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    placeholder="Ruta de la imagen o sube una nueva"
                  />
                  <button 
                    type="button"
                    onClick={handleClickImagenBtn}
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
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                
                {/* Vista previa de imagen */}
                <div className="mt-4">
                  <img 
                    src={imagenPreview || (formValues.imgCurso ? (formValues.imgCurso.startsWith('http') ? formValues.imgCurso : `http://localhost/TFG_DAW/frontend${formValues.imgCurso.replace('.', '')}`) : 'http://localhost/TFG_DAW/frontend/src/img/imgCursos/default.jpg')} 
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
                    checked={formValues.publicado || false} 
                    onChange={(e) => setFormValues(prev => ({...prev, publicado: e.target.checked}))}
                    className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="publicado" className="ml-2 text-gray-300">Curso publicado</label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="destacado" 
                    checked={formValues.destacado || false} 
                    onChange={(e) => setFormValues(prev => ({...prev, destacado: e.target.checked}))}
                    className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="destacado" className="ml-2 text-gray-300">Curso destacado</label>
                </div>
              </div>
            </div>
            
            {formValues.id_curso && (
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
