import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUser, FaTags, FaArrowRight } from 'react-icons/fa';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Introducción a React 18: Nuevas Características y Mejoras",
      excerpt: "Descubre las novedades más importantes de React 18, incluyendo Concurrent Rendering, Automatic Batching y las nuevas APIs que revolucionan el desarrollo frontend.",
      author: "Alejandro Sánchez",
      date: "15 Marzo 2024",
      tags: ["React", "JavaScript", "Frontend"],
      readTime: "8 min",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "TypeScript vs JavaScript: Cuándo y Por Qué Usar Cada Uno",
      excerpt: "Análisis detallado de las ventajas y desventajas de TypeScript frente a JavaScript. Guía práctica para elegir el lenguaje adecuado según tu proyecto.",
      author: "María González",
      date: "10 Marzo 2024",
      tags: ["TypeScript", "JavaScript", "Programación"],
      readTime: "6 min",
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=2074&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Optimización de Rendimiento en Aplicaciones Web Modernas",
      excerpt: "Estrategias prácticas y técnicas avanzadas para mejorar el rendimiento de tus aplicaciones web, desde la carga inicial hasta la experiencia del usuario.",
      author: "Carlos Ruiz",
      date: "5 Marzo 2024",
      tags: ["Performance", "Web", "Optimización"],
      readTime: "10 min",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-4">
            Blog de Desarrollo
          </h1>
          <p className="text-gray-400 text-lg">
            Explora las últimas tendencias y mejores prácticas en desarrollo web
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/20"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                  <span className="flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    {post.date}
                  </span>
                  <span className="flex items-center">
                    <FaUser className="mr-2" />
                    {post.author}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-white mb-3 hover:text-purple-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-400 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-700 text-purple-300 text-sm rounded-full"
                    >
                      <FaTags className="inline mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{post.readTime} de lectura</span>
                  <motion.button
                    whileHover={{ x: 5 }}
                    className="flex items-center text-purple-400 hover:text-pink-500 transition-colors"
                  >
                    Leer más <FaArrowRight className="ml-2" />
                  </motion.button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Blog;
