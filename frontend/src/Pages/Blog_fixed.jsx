import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaTags, FaArrowRight, FaSearch, FaBookReader, FaFire, FaClock } from 'react-icons/fa';

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

  const [activeTag, setActiveTag] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  const allTags = ['Todos', ...new Set(blogPosts.flatMap(post => post.tags))];
  
  const filteredPosts = blogPosts.filter(post => {
    // Filter by tag
    const tagMatch = activeTag === 'Todos' || post.tags.includes(activeTag);
    
    // Filter by search query
    const searchMatch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    return tagMatch && searchMatch;
  });

  const featuredPost = blogPosts[0]; // Assuming the first post is featured

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden pt-20">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-40 left-10 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Encabezado Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="inline-block py-1 px-3 rounded-full bg-purple-900/30 text-purple-300 text-sm font-medium mb-2">
                CONOCIMIENTO TECNOLÓGICO
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Blog de
              </span> 
              <span className="text-white">Desarrollo</span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-pink-600 mx-auto mb-8"></div>
            <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
              Explora las últimas tendencias, tutoriales y mejores prácticas en desarrollo web y programación
            </p>
          </div>

          {/* Buscador y filtros */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50">
              <div className="relative w-full md:w-1/2">
                <input
                  type="text"
                  placeholder="Buscar artículos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-700/50 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center">
                {allTags.map(tag => (
                  <motion.button
                    key={tag}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeTag === tag
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/20'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {tag}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Artículo destacado */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <FaFire className="text-orange-500 mr-2" />
              Artículo Destacado
            </h2>
            
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-purple-500/20 transition-all duration-300 border border-gray-700/50">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="h-64 md:h-auto overflow-hidden relative">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent opacity-60"></div>
                  <div className="absolute bottom-4 left-4 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center mr-3 text-white text-xs font-bold">
                      {featuredPost.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium">{featuredPost.author}</p>
                      <p className="text-gray-300 text-sm flex items-center">
                        <FaCalendarAlt className="mr-1 text-xs" /> {featuredPost.date}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {featuredPost.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full"
                        >
                          <FaTags className="inline mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 hover:text-purple-400 transition-colors">
                      {featuredPost.title}
                    </h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400 flex items-center">
                      <FaClock className="mr-1" /> {featuredPost.readTime} de lectura
                    </span>
                    <Link to={`/blog/${featuredPost.id}`}>
                      <motion.button
                        whileHover={{ x: 5 }}
                        className="flex items-center text-purple-400 hover:text-pink-500 transition-colors font-medium"
                      >
                        Leer artículo completo <FaArrowRight className="ml-2" />
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <FaBookReader className="text-purple-400 mr-2" />
              Artículos Recientes
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(124, 58, 237, 0.3)' }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent opacity-60"></div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm rounded-full shadow-lg">
                        {post.tags[0]}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                      <span className="flex items-center bg-gray-700/50 px-3 py-1 rounded-full">
                        <FaCalendarAlt className="mr-2 text-purple-400" />
                        {post.date}
                      </span>
                      <span className="flex items-center bg-gray-700/50 px-3 py-1 rounded-full">
                        <FaClock className="mr-2 text-pink-400" />
                        {post.readTime}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-bold mb-3 group-hover:text-purple-400 transition-colors line-clamp-2">
                      <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        {post.title}
                      </span>
                    </h2>
                    
                    <p className="text-gray-300 mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center mr-2 text-white text-xs font-bold">
                          {post.author.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-300">{post.author}</span>
                      </div>
                      
                      <Link to={`/blog/${post.id}`}>
                        <motion.button
                          whileHover={{ x: 5, color: '#ec4899' }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center text-purple-400 hover:text-pink-500 transition-colors font-medium"
                        >
                          Leer más <FaArrowRight className="ml-2" />
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="bg-gray-800/50 rounded-2xl p-8 max-w-lg mx-auto">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaSearch className="text-purple-400 text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">No se encontraron artículos</h3>
                  <p className="text-gray-300">
                    No hay artículos que coincidan con tu búsqueda. Intenta con otros términos o etiquetas.
                  </p>
                  <button
                    onClick={() => {setSearchQuery(''); setActiveTag('Todos');}}
                    className="mt-4 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Sección de suscripción al newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl shadow-lg mt-20"
          >
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-6">Mantente al día con nuestro newsletter</h2>
              <p className="text-gray-300 text-lg mb-8">
                Suscríbete para recibir los últimos artículos, tutoriales y noticias sobre desarrollo web y programación.
              </p>
              <div className="flex flex-col sm:flex-row max-w-lg mx-auto gap-4">
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="flex-grow px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300">
                  Suscribirse
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Blog;
