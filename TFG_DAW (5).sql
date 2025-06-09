-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-06-2025 a las 12:01:12
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `TFG_DAW`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cursos`
--

CREATE TABLE `cursos` (
  `id_curso` int(11) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `duracion` int(11) DEFAULT NULL COMMENT 'Duración en horas',
  `id_profesor` int(11) DEFAULT NULL,
  `tipo_Curso` varchar(100) NOT NULL,
  `imgCurso` varchar(300) NOT NULL,
  `publicado` tinyint(1) NOT NULL DEFAULT 0,
  `destacado` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cursos`
--

INSERT INTO `cursos` (`id_curso`, `titulo`, `descripcion`, `precio`, `duracion`, `id_profesor`, `tipo_Curso`, `imgCurso`, `publicado`, `destacado`) VALUES
(1, 'Introducción a la IA', 'Curso básico sobre inteligencia artificial', 49.99, 20, 3, 'Básico', './src/img/imgCursos/IA.jpg', 1, 1),
(2, 'Machine Learning Avanzado', 'Técnicas avanzadas de aprendizaje automático', 99.99, 40, 3, 'Avanzado', './src/img/imgCursos/MachineLearning.jpg', 1, 0),
(3, 'Desarrollo Web con Python', 'Creación de aplicaciones web con Flask y Django', 79.99, 30, 3, 'Intermedio', './src/img/imgCursos/django.png', 1, 0),
(8, 'werewrwer', 'werwerwerw', 10000.00, 0, 3, 'Básico', '/src/img/imgCursos/curso_6845e36ba083f.jpg', 1, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inscripciones`
--

CREATE TABLE `inscripciones` (
  `id_inscripcion` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_curso` int(11) NOT NULL,
  `fecha_inscripcion` date NOT NULL DEFAULT curdate(),
  `estado` varchar(50) DEFAULT 'activo',
  `progreso` int(11) DEFAULT 0,
  `completado` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inscripciones`
--

INSERT INTO `inscripciones` (`id_inscripcion`, `id_usuario`, `id_curso`, `fecha_inscripcion`, `estado`, `progreso`, `completado`) VALUES
(26, 5, 3, '2025-06-07', 'activo', 0, 0),
(27, 1, 1, '2025-06-07', 'activo', 0, 0),
(31, 5, 1, '2025-06-09', 'activo', 0, 0),
(32, 5, 8, '2025-06-09', 'activo', 0, 0),
(33, 9, 8, '2025-06-09', 'activo', 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id_pago` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_curso` int(11) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha_pago` date NOT NULL DEFAULT curdate(),
  `metodo_pago` enum('Tarjeta','PayPal','Transferencia') NOT NULL,
  `estado` varchar(50) NOT NULL,
  `referencia` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pagos`
--

INSERT INTO `pagos` (`id_pago`, `id_usuario`, `id_curso`, `monto`, `fecha_pago`, `metodo_pago`, `estado`, `referencia`) VALUES
(1, 1, 0, 20.00, '2025-03-10', 'Tarjeta', '', ''),
(2, 2, 0, 40.00, '2025-03-10', 'PayPal', '', ''),
(3, 1, 0, 80.00, '2025-03-10', 'Transferencia', '', ''),
(4, 5, 3, 79.99, '2025-06-07', 'Tarjeta', 'completado', 'INV-2025-4317'),
(5, 5, 7, 300.00, '2025-06-07', 'Tarjeta', 'completado', 'INV-2025-2269'),
(6, 5, 1, 49.99, '2025-06-07', 'Tarjeta', 'completado', 'INV-2025-7839'),
(7, 5, 2, 99.99, '2025-06-07', 'Tarjeta', 'completado', 'INV-2025-5842'),
(8, 5, 3, 79.99, '2025-06-07', 'Tarjeta', 'completado', 'INV-2025-6559'),
(9, 1, 1, 49.99, '2025-06-07', 'Tarjeta', 'completado', 'INV-2025-1969'),
(10, 5, 1, 49.99, '2025-06-08', 'Tarjeta', 'completado', 'INV-2025-2105'),
(11, 5, 2, 99.99, '2025-06-08', 'Tarjeta', 'completado', 'INV-2025-0348'),
(12, 5, 8, 10000.00, '2025-06-08', 'Tarjeta', 'completado', 'INV-2025-7887'),
(13, 5, 1, 49.99, '2025-06-09', 'Tarjeta', 'completado', 'INV-2025-8646'),
(14, 5, 8, 10000.00, '2025-06-09', 'Tarjeta', 'completado', 'INV-2025-2098'),
(15, 9, 8, 10000.00, '2025-06-09', 'Tarjeta', 'completado', 'INV-2025-2295');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `planes`
--

CREATE TABLE `planes` (
  `id_plan` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `precio_mensual` decimal(10,2) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `planes`
--

INSERT INTO `planes` (`id_plan`, `nombre`, `precio_mensual`, `descripcion`) VALUES
(1, 'Básico', 20.00, 'Acceso a cursos gratuitos y recursos básicos'),
(2, 'Pro', 40.00, 'Acceso a cursos premium y certificaciones'),
(3, 'Empresa', 99.99, 'Planes personalizados para empresas y grupos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `tipo_usuario` enum('Estudiante','Profesor','Administrador') NOT NULL,
  `id_plan` int(11) DEFAULT NULL,
  `cookie_consent` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `email`, `contraseña`, `tipo_usuario`, `id_plan`, `cookie_consent`) VALUES
(0, 'admin', 'admin@example.com', '$2y$10$mQ8msFtdNrNvQE1wZptT0uDvDuxSVefaqend5vFWZ6dacvKbMC0gK', 'Administrador', NULL, 0),
(1, 'Juan Pérez', 'juan@example.com', '$2y$10$lEx0hEGcVJb0tF5nQZB1LemkvxlcG5q8MxFzjuaD35mozMJ3fROYC', 'Estudiante', 1, 0),
(2, 'María López', 'maria@example.com', '$2y$10$lpBnuwNVD//sldWB15V7Duo7zb7gZ8TL1WZq8mwqLEdymkcyiYf3G', 'Estudiante', 2, 0),
(3, 'Carlos Sánchez', 'carlos@example.com', '$2y$10$OWwZ0nL.4/rawKd98mXWKeNNj1FCT1pDVK9q5KQENkY/WAcPYOHES', 'Profesor', NULL, 0),
(5, 'alejandro', 'alejandro@gmail.com', '$2y$10$B2V7c7VrSBQQ1FQb53wku.NbuP6fIvrep7SEtnav1ymNpij2JXmb.', 'Estudiante', NULL, 0),
(7, 'Juande', 'juande@gmail.com', '$2y$10$r4kBFqy8C0cDeerbF./Vw.nxGFKeY5V./FADa/Obj1kOZqooy0DIG', 'Estudiante', NULL, 0),
(9, 'Juanca', 'juanca@gmail.com', '$2y$10$BpBjlQvoJxxmz.Lud43DGuXZIyWLV/3dXzY9/9QXU7cAJQbgRYAde', 'Estudiante', NULL, 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cursos`
--
ALTER TABLE `cursos`
  ADD PRIMARY KEY (`id_curso`),
  ADD KEY `id_profesor` (`id_profesor`);

--
-- Indices de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD PRIMARY KEY (`id_inscripcion`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_curso` (`id_curso`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id_pago`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `planes`
--
ALTER TABLE `planes`
  ADD PRIMARY KEY (`id_plan`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `id_plan` (`id_plan`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cursos`
--
ALTER TABLE `cursos`
  MODIFY `id_curso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  MODIFY `id_inscripcion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id_pago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `planes`
--
ALTER TABLE `planes`
  MODIFY `id_plan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cursos`
--
ALTER TABLE `cursos`
  ADD CONSTRAINT `cursos_ibfk_1` FOREIGN KEY (`id_profesor`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD CONSTRAINT `inscripciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `inscripciones_ibfk_2` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
