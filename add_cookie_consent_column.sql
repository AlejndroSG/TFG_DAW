-- Script SQL para añadir la columna cookie_consent a la tabla usuarios
ALTER TABLE `usuarios` ADD COLUMN IF NOT EXISTS `cookie_consent` TINYINT(1) DEFAULT 0;
