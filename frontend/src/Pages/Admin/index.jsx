import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import Usuarios from './Usuarios';
import Cursos from './Cursos';
import Comentarios from './Comentarios';
import Informes from './Informes';

const AdminIndex = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/usuarios" element={<Usuarios />} />
      <Route path="/cursos" element={<Cursos />} />
      <Route path="/comentarios" element={<Comentarios />} />
      <Route path="/informes" element={<Informes />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminIndex;
