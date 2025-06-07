// Script para ejecutar en consola del navegador para inspeccionar los datos
// Copia y pega este código en la consola de Chrome/Firefox

(async function debugCursos() {
  console.group('===== DEPURACIÓN DE CURSOS =====');
  
  // 1. Comprobar sesión
  console.log('Verificando sesión...');
  const sesion = await fetch('http://localhost/TFG_DAW/backend/controlador/controlador.php?action=comprobarSesion', {
    credentials: 'include'
  }).then(r => r.json());
  console.log('Sesión actual:', sesion);
  
  // 2. Obtener cursos inscritos
  console.log('Obteniendo cursos inscritos...');
  const misCursos = await fetch('http://localhost/TFG_DAW/backend/controlador/controlador.php?action=obtenerMisCursos', {
    credentials: 'include'
  }).then(r => r.json());
  console.log('Mis cursos (respuesta completa):', misCursos);
  
  // 3. Obtener todos los cursos
  console.log('Obteniendo todos los cursos...');
  const todosCursos = await fetch('http://localhost/TFG_DAW/backend/controlador/controlador.php?action=obtenerCursos', {
    credentials: 'include'
  }).then(r => r.json());
  console.log('Todos los cursos:', todosCursos);
  
  // 4. Comprobar IDs
  if (Array.isArray(misCursos) && Array.isArray(todosCursos)) {
    const idsMisCursos = misCursos.map(c => typeof c.id_curso === 'string' ? parseInt(c.id_curso) : c.id_curso);
    console.log('IDs de mis cursos:', idsMisCursos);
    
    const idsTodosCursos = todosCursos.map(c => typeof c.id_curso === 'string' ? parseInt(c.id_curso) : c.id_curso);
    console.log('IDs de todos los cursos:', idsTodosCursos);
    
    // 5. Verificar coincidencias
    const coincidencias = todosCursos.map(curso => {
      const id = typeof curso.id_curso === 'string' ? parseInt(curso.id_curso) : curso.id_curso;
      const inscrito = idsMisCursos.includes(id);
      return {
        id: id,
        titulo: curso.titulo,
        inscrito: inscrito
      };
    });
    console.table(coincidencias);
  }
  
  console.groupEnd();
})();
