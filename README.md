<div align="center">
  <h1>LearnIA - Plataforma de Aprendizaje de IA</h1>
  <p>Una plataforma educativa moderna para el aprendizaje de Inteligencia Artificial y tecnologías relacionadas</p>

  <div>
    <img src="https://img.shields.io/badge/React-18.2.0-blue?logo=react" alt="React 18.2.0"/>
    <img src="https://img.shields.io/badge/PHP-8.0.30-purple?logo=php" alt="PHP 8.0.30"/>
    <img src="https://img.shields.io/badge/MySQL-10.4.32-orange?logo=mysql" alt="MySQL 10.4.32"/>
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC?logo=tailwind-css" alt="Tailwind CSS"/>
    <img src="https://img.shields.io/badge/Framer_Motion-latest-ff69b4" alt="Framer Motion"/>
    <img src="https://img.shields.io/badge/license-MIT-green" alt="License"/>
  </div>
</div>

---

## 📌 Tabla de Contenidos

- [Vista General](#vista-general)
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Capturas de Pantalla](#capturas-de-pantalla)
- [Instalación y Configuración](#instalación-y-configuración)
- [Uso](#uso)
- [API Reference](#api-reference)
- [Roadmap](#roadmap)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)
- [Contacto](#contacto)

---

## 🔍 Vista General

LearnIA es una plataforma de educación online especializada en cursos de Inteligencia Artificial, Machine Learning y tecnologías relacionadas. Desarrollada como un Trabajo de Fin de Grado (TFG) para el ciclo de Desarrollo de Aplicaciones Web (DAW), esta plataforma ofrece una experiencia de aprendizaje completa e interactiva.

La aplicación permite a los usuarios:
- Explorar catálogos de cursos con información detallada
- Inscribirse y acceder a cursos pagados o gratuitos
- Consumir contenido multimedia educativo organizado por módulos y lecciones
- Seguir su progreso de aprendizaje
- Gestionar su perfil y suscripciones

Para administradores, ofrece herramientas completas de gestión de usuarios, cursos y contenidos.

---

## ✨ Características

### Para Estudiantes
- **Catálogo de cursos** con diferentes categorías y niveles
- **Sistema de inscripción y pagos** integrado
- **Reproductor de video** optimizado para contenido educativo
- **Seguimiento de progreso** personalizado
- **Sistema de suscripciones** con diferentes planes
- **Perfil de usuario** personalizable

### Para Profesores
- **Creación y gestión de cursos**
- **Herramientas de análisis** del progreso de estudiantes
- **Carga de material didáctico** en múltiples formatos

### Para Administradores
- **Panel de administración** completo
- **Gestión de usuarios** (estudiantes y profesores)
- **Estadísticas y análisis** de la plataforma
- **Configuración de planes de suscripción**
- **Moderación de contenido**

---

## 🛠 Tecnologías

### Frontend
- **React** - Biblioteca principal para la interfaz de usuario
- **React Router** - Navegación entre páginas
- **Axios** - Cliente HTTP para realizar peticiones a la API
- **Framer Motion** - Animaciones y transiciones
- **Tailwind CSS** - Framework CSS utilitario
- **React Icons** - Iconografía
- **Video.js** - Reproductor de video avanzado

### Backend
- **PHP** - Lenguaje principal del servidor
- **MySQL** - Sistema de gestión de base de datos
- **Arquitectura MVC** - Modelo-Vista-Controlador para la organización del código

### Herramientas de Desarrollo
- **Vite** - Entorno de desarrollo
- **ESLint** - Linter para JavaScript/React
- **XAMPP** - Pila de desarrollo local (Apache, MySQL, PHP)

---

## 📂 Estructura del Proyecto

```
TFG_DAW/
├── backend/                # Servidor PHP
│   ├── controlador/        # Controladores MVC
│   ├── modelo/             # Modelos para la base de datos
│   └── vista/              # Vistas (principalmente JSON)
├── frontend/               # Aplicación React
│   ├── public/             # Recursos públicos
│   └── src/                # Código fuente
│       ├── components/     # Componentes reutilizables
│       ├── Pages/          # Páginas principales
│       ├── hooks/          # Custom React hooks
│       ├── layout/         # Componentes de layout
│       └── assets/         # Recursos estáticos
└── docs/                   # Documentación
```

## 🚀 Instalación y Configuración

### Requisitos Previos

- XAMPP (o similar) con:
  - PHP 8.0 o superior
  - MySQL 10.4 o superior
  - Apache
- Node.js (v14 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/yourusername/TFG_DAW.git
   cd TFG_DAW
   ```

2. **Configurar la Base de Datos**
   - Importar el archivo `TFG_DAW.sql` en phpMyAdmin
   - Ajustar la configuración de la conexión en `backend/modelo/bd.php`

3. **Instalar Dependencias del Frontend**
   ```bash
   cd frontend
   npm install
   ```

4. **Configurar Variables de Entorno**
   - Renombrar `.env.example` a `.env`
   - Ajustar las variables según sea necesario

5. **Iniciar el Servidor de Desarrollo**
   ```bash
   # Desde la carpeta frontend
   npm run dev
   ```

6. **Acceder a la Aplicación**
   - Frontend: http://localhost:5173
   - Acceso a API: http://localhost/TFG_DAW/backend/controlador/controlador.php

---

## 💻 Uso

### Cuentas de Prueba

| Rol          | Email               | Contraseña |
|--------------|---------------------|------------|
| Administrador| admin@example.com   | admin      |
| Estudiante   | alejandro@gmail.com | alejandro  |
| Profesor     | carlos@example.com  | profesor789|

### Flujo Principal
1. Registrarse o iniciar sesión
2. Explorar el catálogo de cursos
3. Inscribirse en un curso
4. Acceder al visor de curso para ver las lecciones
5. Seguir tu progreso desde el perfil

---

## 📘 API Reference

La API sigue un patrón REST con el siguiente punto de entrada:
```
http://localhost/TFG_DAW/backend/controlador/controlador.php?action=[ACCIÓN]
```

Documentación completa de endpoints disponible en `docs/api.md`.

---

## 🗓 Roadmap

- [x] Versión 1.0: Funcionalidades básicas
- [ ] Versión 1.1: Sistema de notificaciones
- [ ] Versión 1.2: Foro de discusión para cursos
- [ ] Versión 2.0: Aplicación móvil complementaria

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

---

## 📄 Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.

---

## 📬 Contacto

Alejandro - [github.com/AlejndroSG](https://github.com/AlejndroSG)

Link del Proyecto: [https://github.com/AlejndroSG/TFG_DAW](https://github.com/AlejndroSG/TFG_DAW)

---

<div align="center">
  <sub>Desarrollado con ❤️ como Trabajo de Fin de Grado para DAW</sub>
</div>
