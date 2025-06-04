import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  
  // Verificar si la ruta actual es curso-visor
  const isCursoVisor = location.pathname.includes('/curso-visor/');

  useEffect(() => {
    const verificarAutenticacion = async () => {
      try {
        const respuesta = await axios.get(
          'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=comprobarSesion',
          {
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            withCredentials: true
          }
        );

        if (respuesta.data && respuesta.data.username) {
          setIsAuthenticated(true);
          setUserData(respuesta.data);
        } else {
          setIsAuthenticated(false);
          toast.error('Debes iniciar sesión para acceder a esta página');
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        setIsAuthenticated(false);
        toast.error('Error de autenticación');
      } finally {
        setIsLoading(false);
      }
    };

    verificarAutenticacion();
  }, []);

  if (isLoading) {
    // Puedes mostrar un spinner o alguna indicación de carga
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Si no está autenticado y no es la página de curso-visor, redirigir al inicio
  if (!isAuthenticated && !isCursoVisor) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Verificar el rol si es requerido
  if (requiredRole && userData && userData.tipo_usuario.toLowerCase() !== requiredRole.toLowerCase()) {
    toast.error('No tienes permisos para acceder a esta página');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Si está autenticado y tiene el rol correcto (si es requerido), mostrar el contenido
  return children;
};

export default ProtectedRoute;
