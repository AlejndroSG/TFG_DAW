import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUser, FaTags, FaArrowLeft, FaShare, FaBookmark, FaRegBookmark, FaTwitter, FaFacebook, FaLinkedin, FaQuoteLeft, FaLightbulb, FaCode, FaImage, FaListUl } from 'react-icons/fa';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState([]);

  // Simulamos la obtención de datos del blog desde una API
  useEffect(() => {
    // En un caso real, aquí haríamos una llamada a API
    const fetchPost = () => {
      // Datos de ejemplo de los posts
      const blogPosts = [
        {
          id: 1,
          title: "Introducción a React 18: Nuevas Características y Mejoras",
          content: [
            {
              type: "paragraph",
              text: "React 18 representa un hito significativo en la evolución de esta popular biblioteca de JavaScript para la construcción de interfaces de usuario. Con un enfoque principal en la mejora del rendimiento y la experiencia del desarrollador, React 18 introduce varias características clave que prometen transformar la forma en que construimos aplicaciones web modernas."
            },
            {
              type: "heading",
              text: "Concurrent Rendering: El núcleo de React 18"
            },
            {
              type: "paragraph",
              text: "El cambio más fundamental en React 18 es la introducción del Concurrent Rendering, una arquitectura interna reimaginada que permite a React preparar múltiples versiones de la interfaz de usuario al mismo tiempo. Esta capacidad de 'concurrencia' permite que React comience a renderizar antes, interrumpa renderizados de baja prioridad para atender actualizaciones más urgentes, y incluso oculte artefactos visuales no deseados durante las actualizaciones."
            },
            {
              type: "image",
              url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
              caption: "Visualización conceptual del Concurrent Rendering en React 18"
            },
            {
              type: "paragraph",
              text: "Es importante destacar que Concurrent Rendering no es una característica que los desarrolladores utilicen directamente, sino una arquitectura interna que permite nuevas capacidades. Las APIs de nivel superior como Suspense y transiciones aprovechan esta arquitectura para ofrecer experiencias de usuario más fluidas."
            },
            {
              type: "heading",
              text: "Automatic Batching: Mejorando el rendimiento por defecto"
            },
            {
              type: "paragraph",
              text: "Otra mejora significativa en React 18 es el 'Automatic Batching'. En versiones anteriores, React agrupaba múltiples actualizaciones de estado dentro de controladores de eventos para mejorar el rendimiento. Sin embargo, esta agrupación no ocurría en promesas, setTimeout, controladores de eventos nativos u otros eventos. React 18 introduce el 'Automatic Batching', que garantiza que todas las actualizaciones se agrupen, independientemente de su origen."
            },
            {
              type: "code",
              language: "javascript",
              code: `// Antes de React 18:
setTimeout(() => {
  setCount(c => c + 1); // Causa una renderización
  setFlag(f => !f);    // Causa otra renderización
}, 1000);

// Con React 18 y Automatic Batching:
setTimeout(() => {
  setCount(c => c + 1); // No causa una renderización inmediata
  setFlag(f => !f);    // Ambas actualizaciones se agrupan en una sola renderización
}, 1000);`
            },
            {
              type: "paragraph",
              text: "Esta mejora resulta en menos renderizaciones y mejor rendimiento sin necesidad de cambios en el código existente."
            },
            {
              type: "heading",
              text: "Nuevas APIs: Suspense, useTransition y useDeferredValue"
            },
            {
              type: "paragraph",
              text: "React 18 también introduce nuevas APIs que aprovechan el poder del Concurrent Rendering:"
            },
            {
              type: "list",
              items: [
                "<strong>Suspense:</strong> Ahora soporta completamente el streaming de HTML en el servidor y la hidratación selectiva en el cliente.",
                "<strong>useTransition:</strong> Permite marcar ciertas actualizaciones como 'transiciones', indicando que no son urgentes y pueden ser interrumpidas.",
                "<strong>useDeferredValue:</strong> Permite crear una versión retrasada de un valor que puede priorizarse por debajo de actualizaciones más urgentes."
              ]
            },
            {
              type: "image",
              url: "https://images.unsplash.com/photo-1581276879432-15e50529f34b?q=80&w=2070&auto=format&fit=crop",
              caption: "Las nuevas APIs de React 18 ofrecen un mayor control sobre el flujo de renderizado"
            },
            {
              type: "paragraph",
              text: "Estas nuevas herramientas dan a los desarrolladores un control sin precedentes sobre la prioridad de las actualizaciones, permitiendo mantener la interfaz de usuario receptiva incluso durante operaciones intensivas."
            },
            {
              type: "heading",
              text: "Conclusión: El futuro de React"
            },
            {
              type: "paragraph",
              text: "React 18 no solo mejora el rendimiento y la experiencia del desarrollador, sino que también establece las bases para futuras innovaciones. La arquitectura Concurrent abre posibilidades para características como el streaming de servidor mejorado, la renderización parcial y optimizaciones automáticas que antes eran imposibles. Para los desarrolladores, el camino de actualización es relativamente sencillo, ya que muchas de las mejoras funcionan automáticamente, mientras que las nuevas características son completamente opcionales y pueden adoptarse gradualmente."
            },
            {
              type: "paragraph",
              text: "En resumen, React 18 representa un avance significativo que mantiene a React a la vanguardia del desarrollo de interfaces de usuario modernas, preparando el terreno para experiencias de usuario aún más rápidas y fluidas en el futuro."
            }
          ],
          author: "Alejandro Sánchez",
          authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
          authorBio: "Desarrollador Frontend con 5 años de experiencia especializado en React y tecnologías modernas de JavaScript.",
          date: "15 Marzo 2024",
          tags: ["React", "JavaScript", "Frontend"],
          readTime: "8 min",
          image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop"
        },
        {
          id: 2,
          title: "TypeScript vs JavaScript: Cuándo y Por Qué Usar Cada Uno",
          content: [
            {
              type: "paragraph",
              text: "En el mundo del desarrollo web moderno, la elección entre TypeScript y JavaScript es una decisión fundamental que puede afectar significativamente la calidad, mantenibilidad y escalabilidad de tu proyecto. Ambos lenguajes tienen sus propias fortalezas y casos de uso ideales, y comprender las diferencias clave puede ayudarte a tomar una decisión más informada."
            },
            {
              type: "heading",
              text: "¿Qué es TypeScript y por qué fue creado?"
            },
            {
              type: "paragraph",
              text: "TypeScript, desarrollado y mantenido por Microsoft, es un superconjunto de JavaScript que añade tipado estático opcional y otras características avanzadas al lenguaje. Fue creado para abordar las limitaciones de JavaScript en proyectos grandes, donde la falta de tipos puede llevar a errores difíciles de detectar y dificultar el mantenimiento del código a largo plazo."
            },
            {
              type: "image",
              url: "https://images.unsplash.com/photo-1555066931-bf19f8fd1a83?q=80&w=2070&auto=format&fit=crop",
              caption: "TypeScript añade capas de seguridad y estructura a JavaScript"
            },
            {
              type: "quote",
              text: "TypeScript es JavaScript con sintaxis para tipos. TypeScript es un lenguaje de programación fuertemente tipado que se basa en JavaScript, proporcionando mejores herramientas a cualquier escala.",
              author: "Documentación oficial de TypeScript"
            },
            {
              type: "heading",
              text: "Ventajas de TypeScript"
            },
            {
              type: "list",
              items: [
                "<strong>Detección temprana de errores:</strong> El sistema de tipos permite identificar errores en tiempo de compilación, antes de que lleguen a producción.",
                "<strong>Mejor documentación:</strong> Los tipos sirven como documentación integrada sobre cómo deben usarse las funciones y componentes.",
                "<strong>Mejor soporte IDE:</strong> Proporciona autocompletado más preciso, navegación de código y refactorización.",
                "<strong>Mantenibilidad mejorada:</strong> Facilita el trabajo en equipos grandes y en bases de código complejas."
              ]
            },
            {
              type: "code",
              language: "typescript",
              code: "// Ejemplo de TypeScript\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n  age?: number; // Propiedad opcional\n}\n\nfunction greetUser(user: User): string {\n  return 'Hola, ' + user.name + '! Tu email es ' + user.email;\n}\n\n// El compilador detectará si falta alguna propiedad requerida\nconst newUser: User = {\n  id: 1,\n  name: \"Ana\",\n  email: \"ana@example.com\"\n};\n\nconsole.log(greetUser(newUser));"
            },
            {
              type: "heading",
              text: "Cuándo elegir JavaScript puro"
            },
            {
              type: "paragraph",
              text: "A pesar de las ventajas de TypeScript, hay escenarios donde JavaScript sigue siendo la opción más adecuada. JavaScript brilla particularmente en proyectos pequeños, prototipos rápidos, y situaciones donde la flexibilidad y la velocidad de desarrollo son prioritarias sobre la seguridad de tipos."
            },
            {
              type: "list",
              items: [
                "<strong>Proyectos pequeños:</strong> En aplicaciones simples, la sobrecarga de configurar TypeScript puede no justificar sus beneficios.",
                "<strong>Prototipado rápido:</strong> Cuando necesitas iterar rápidamente sin preocuparte por definir tipos.",
                "<strong>Scripts simples:</strong> Para automatizaciones o scripts de un solo uso.",
                "<strong>Equipos con poca experiencia en TS:</strong> Si el equipo no está familiarizado con TypeScript, la curva de aprendizaje puede ralentizar el desarrollo inicialmente."
              ]
            },
            {
              type: "code",
              language: "javascript",
              code: "// Ejemplo de JavaScript moderno\nconst user = {\n  id: 1,\n  name: \"Ana\",\n  email: \"ana@example.com\"\n};\n\nfunction greetUser(user) {\n  return 'Hola, ' + user.name + '! Tu email es ' + user.email;\n}\n\nconsole.log(greetUser(user));\n\n// JavaScript es flexible (pero puede ser propenso a errores)\nconsole.log(greetUser({name: \"Bob\"})); // No dará error pero resulta en: \"Hola, Bob! Tu email es undefined\"" 
            },
            {
              type: "image",
              url: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070&auto=format&fit=crop",
              caption: "JavaScript ofrece mayor flexibilidad y simplicidad para ciertos casos de uso"
            },
            {
              type: "heading",
              text: "Cómo tomar la decisión"
            },
            {
              type: "paragraph",
              text: "La elección entre TypeScript y JavaScript debe basarse en varios factores específicos de tu proyecto y equipo. No existe una respuesta universal, pero puedes considerar estas preguntas para guiar tu decisión:"
            },
            {
              type: "list",
              items: [
                "<strong>Tamaño y duración del proyecto:</strong> Proyectos grandes y a largo plazo se benefician más de TypeScript.",
                "<strong>Tamaño del equipo:</strong> Equipos más grandes generalmente obtienen mayores beneficios de TypeScript.",
                "<strong>Criticidad del sistema:</strong> Aplicaciones con altos requisitos de confiabilidad deben considerar TypeScript.",
                "<strong>Integraciones externas:</strong> TypeScript brinda mayor seguridad al trabajar con APIs externas."
              ]
            },
            {
              type: "paragraph",
              text: "Recuerda que no es una decisión binaria. Puedes adoptar TypeScript gradualmente en un proyecto de JavaScript existente, o usar JavaScript en partes de un proyecto de TypeScript donde tenga más sentido. La interoperabilidad entre ambos lenguajes es uno de sus puntos fuertes."
            },
            {
              type: "heading",
              text: "Conclusión"
            },
            {
              type: "paragraph",
              text: "Tanto TypeScript como JavaScript tienen su lugar en el ecosistema de desarrollo moderno. TypeScript brinda seguridad de tipos, mejores herramientas y mayor mantenibilidad para proyectos complejos, mientras que JavaScript ofrece simplicidad, flexibilidad y una barrera de entrada más baja. Lo importante es evaluar tu caso de uso específico y elegir la herramienta que mejor se adapte a tus necesidades, recordando que no estás limitado a usar exclusivamente uno u otro."
            }
          ],
          author: "María González",
          authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
          authorBio: "Desarrolladora Full Stack con especialización en TypeScript y arquitecturas modernas de JavaScript. Conferenciante y autora de artículos técnicos.",
          date: "10 Marzo 2024",
          tags: ["TypeScript", "JavaScript", "Programación"],
          readTime: "6 min",
          image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=2074&auto=format&fit=crop"
        },
        {
          id: 3,
          title: "Optimización de Rendimiento en Aplicaciones Web Modernas",
          content: [
            {
              type: "paragraph",
              text: "La optimización del rendimiento es un aspecto crucial en el desarrollo de aplicaciones web modernas. Un rendimiento lento puede afectar negativamente la experiencia del usuario, lo que puede llevar a una disminución en la satisfacción del cliente y, en última instancia, a una pérdida de ingresos."
            },
            {
              type: "heading",
              text: "¿Por qué es importante la optimización del rendimiento?"
            },
            {
              type: "paragraph",
              text: "La optimización del rendimiento es importante porque puede mejorar significativamente la experiencia del usuario. Un sitio web rápido y receptivo puede aumentar la satisfacción del cliente, lo que puede llevar a una mayor lealtad y, en última instancia, a una mayor conversión."
            },
            {
              type: "list",
              items: [
                "<strong>Mejora la experiencia del usuario:</strong> Un sitio web rápido y receptivo puede mejorar significativamente la experiencia del usuario.",
                "<strong>Aumenta la satisfacción del cliente:</strong> Un sitio web rápido y receptivo puede aumentar la satisfacción del cliente, lo que puede llevar a una mayor lealtad.",
                "<strong>Mejora la conversión:</strong> Un sitio web rápido y receptivo puede mejorar la conversión, lo que puede llevar a una mayor cantidad de ventas y, en última instancia, a una mayor cantidad de ingresos."
              ]
            },
            {
              type: "heading",
              text: "Técnicas de optimización del rendimiento"
            },
            {
              type: "paragraph",
              text: "Existen varias técnicas que se pueden utilizar para optimizar el rendimiento de una aplicación web moderna. Algunas de las técnicas más comunes incluyen:"
            },
            {
              type: "list",
              items: [
                "<strong>Minificar y comprimir archivos:</strong> Minificar y comprimir archivos puede reducir significativamente el tamaño de los archivos, lo que puede mejorar el rendimiento.",
                "<strong>Usar caché:</strong> Usar caché puede reducir la cantidad de solicitudes que se realizan al servidor, lo que puede mejorar el rendimiento.",
                "<strong>Optimizar imágenes:</strong> Optimizar imágenes puede reducir significativamente el tamaño de las imágenes, lo que puede mejorar el rendimiento.",
                "<strong>Usar CDN:</strong> Usar CDN puede reducir la latencia y mejorar el rendimiento."
              ]
            },
            {
              type: "heading",
              text: "Herramientas de optimización del rendimiento"
            },
            {
              type: "paragraph",
              text: "Existen varias herramientas que se pueden utilizar para optimizar el rendimiento de una aplicación web moderna. Algunas de las herramientas más comunes incluyen:"
            },
            {
              type: "list",
              items: [
                "<strong>Google PageSpeed Insights:</strong> Google PageSpeed Insights es una herramienta que se puede utilizar para analizar el rendimiento de una página web y proporcionar recomendaciones para mejorar el rendimiento.",
                "<strong>GTmetrix:</strong> GTmetrix es una herramienta que se puede utilizar para analizar el rendimiento de una página web y proporcionar recomendaciones para mejorar el rendimiento.",
                "<strong>WebPageTest:</strong> WebPageTest es una herramienta que se puede utilizar para analizar el rendimiento de una página web y proporcionar recomendaciones para mejorar el rendimiento."
              ]
            },
            {
              type: "heading",
              text: "Conclusión"
            },
            {
              type: "paragraph",
              text: "La optimización del rendimiento es un aspecto crucial en el desarrollo de aplicaciones web modernas. Un rendimiento lento puede afectar negativamente la experiencia del usuario, lo que puede llevar a una disminución en la satisfacción del cliente y, en última instancia, a una pérdida de ingresos. Al utilizar técnicas y herramientas de optimización del rendimiento, se puede mejorar significativamente la experiencia del usuario y aumentar la satisfacción del cliente."
            }
          ],
          author: "Carlos Ruiz",
          authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
          authorBio: "Desarrollador Full Stack con especialización en optimización del rendimiento y arquitecturas modernas de JavaScript. Conferenciante y autor de artículos técnicos.",
          date: "5 Marzo 2024",
          tags: ["Performance", "Web", "Optimización"],
          readTime: "10 min",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
          // Contenido completo omitido por brevedad
        }
      ];

      // Buscar el post con el ID del parámetro
      const foundPost = blogPosts.find(post => post.id === parseInt(id));
      setPost(foundPost);

      // Establecer posts relacionados basados en tags similares
      if (foundPost) {
        const related = blogPosts
          .filter(p => p.id !== foundPost.id) // Excluir el post actual
          .filter(p => p.tags.some(tag => foundPost.tags.includes(tag))) // Incluir posts con tags similares
          .slice(0, 2); // Limitar a 2 posts relacionados
        setRelatedPosts(related);
      }
    };

    fetchPost();
  }, [id]);

  // Manejar el toggle de bookmark
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  // Manejar el toggle de opciones de compartir
  const toggleShareOptions = () => {
    setShowShareOptions(!showShareOptions);
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="p-8 rounded-lg bg-gray-800 shadow-xl">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white mt-4 text-center">Cargando artículo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Navegación de regreso */}
        <Link to="/blog" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 transition-colors">
          <FaArrowLeft className="mr-2" />
          Volver a todos los artículos
        </Link>

        {/* Cabecera del artículo */}
        <div className="mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-6"
          >
            {post.title}
          </motion.h1>
          
          <div className="flex flex-wrap items-center text-gray-400 gap-6 mb-6">
            <span className="flex items-center">
              <FaCalendarAlt className="mr-2" />
              {post.date}
            </span>
            <span className="flex items-center">
              <FaUser className="mr-2" />
              {post.author}
            </span>
            <span>{post.readTime} de lectura</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-800 text-purple-300 text-sm rounded-full"
              >
                <FaTags className="inline mr-1" />
                {tag}
              </span>
            ))}
          </div>

          {/* Imagen principal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="rounded-xl overflow-hidden mb-8 shadow-lg shadow-purple-900/20"
          >
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-[400px] object-cover"
            />
          </motion.div>

          {/* Acciones del artículo */}
          <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg mb-10">
            <div className="flex items-center space-x-4">
              <img 
                src={post.authorAvatar} 
                alt={post.author} 
                className="w-12 h-12 rounded-full border-2 border-purple-500"
              />
              <div>
                <p className="text-white font-medium">{post.author}</p>
                <p className="text-gray-400 text-sm">{post.date}</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={toggleBookmark}
                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                aria-label="Guardar artículo"
              >
                {isBookmarked ? 
                  <FaBookmark className="text-purple-400" /> : 
                  <FaRegBookmark className="text-gray-400 hover:text-purple-400" />
                }
              </button>
              <div className="relative">
                <button 
                  onClick={toggleShareOptions}
                  className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                  aria-label="Compartir artículo"
                >
                  <FaShare className="text-gray-400 hover:text-purple-400" />
                </button>
                {showShareOptions && (
                  <div className="absolute right-0 mt-2 p-2 bg-gray-800 rounded-lg shadow-lg z-10 flex space-x-2">
                    <button className="p-2 hover:bg-gray-700 rounded-full text-blue-400" aria-label="Compartir en Twitter">
                      <FaTwitter />
                    </button>
                    <button className="p-2 hover:bg-gray-700 rounded-full text-blue-600" aria-label="Compartir en Facebook">
                      <FaFacebook />
                    </button>
                    <button className="p-2 hover:bg-gray-700 rounded-full text-blue-500" aria-label="Compartir en LinkedIn">
                      <FaLinkedin />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contenido del artículo */}
        <div className="prose prose-lg max-w-none prose-invert prose-purple mb-16 relative">
          {/* Elementos decorativos de fondo */}
          <div className="absolute -z-10 top-1/3 -right-20 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -z-10 top-2/3 -left-20 w-40 h-40 bg-pink-600/10 rounded-full blur-3xl"></div>
          
          {post.content.map((block, index) => {
            switch (block.type) {
              case 'paragraph':
                // Alternar entre diferentes estilos de párrafos para mayor variedad visual
                const isSpecialParagraph = index % 5 === 3; // Cada 5 párrafos, hacer uno especial
                
                if (isSpecialParagraph) {
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.5 }}
                      className="my-10 p-6 rounded-xl bg-gradient-to-r from-gray-800/80 to-gray-800/40 border-l-4 border-purple-500 shadow-lg shadow-purple-900/10"
                    >
                      <div className="flex">
                        <FaLightbulb className="text-purple-400 text-xl mt-1 mr-4 flex-shrink-0" />
                        <p className="text-gray-200 leading-relaxed m-0">
                          {block.text}
                        </p>
                      </div>
                    </motion.div>
                  );
                }
                
                return (
                  <motion.p 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    className="text-gray-300 mb-6 leading-relaxed text-lg"
                  >
                    {block.text}
                  </motion.p>
                );
                
              case 'heading':
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    className="mt-12 mb-8 relative"
                  >
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent relative">
                      {block.text}
                      <div className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                    </h2>
                  </motion.div>
                );
                
              case 'image':
                return (
                  <motion.figure 
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    className="my-12 group"
                  >
                    <div className="rounded-xl overflow-hidden shadow-xl shadow-purple-900/20 border border-gray-700/50 p-1 bg-gradient-to-br from-gray-800 to-gray-900">
                      <div className="overflow-hidden rounded-lg">
                        <img 
                          src={block.url} 
                          alt={block.caption} 
                          className="w-full h-auto transform transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    </div>
                    {block.caption && (
                      <figcaption className="flex items-center justify-center text-gray-400 mt-4 text-sm italic">
                        <FaImage className="mr-2 text-purple-400" />
                        {block.caption}
                      </figcaption>
                    )}
                  </motion.figure>
                );
                
              case 'list':
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    className="my-8 p-5 rounded-xl bg-gray-800/50 border border-gray-700/50"
                  >
                    <div className="flex items-center mb-3">
                      <FaListUl className="text-purple-400 mr-2" />
                      <h3 className="text-lg font-semibold text-white">Puntos clave</h3>
                    </div>
                    <ul className="space-y-3 text-gray-300">
                      {block.items.map((item, i) => (
                        <li key={i} className="flex">
                          <span className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0 mr-3 mt-1 flex items-center justify-center text-xs font-bold">{i+1}</span>
                          <span dangerouslySetInnerHTML={{ __html: item }} />
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
                
              case 'code':
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    className="my-10"
                  >
                    <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden shadow-lg">
                      <div className="bg-gray-800 px-4 py-2 flex items-center">
                        <FaCode className="text-purple-400 mr-2" />
                        <span className="text-sm font-mono text-gray-300">código.js</span>
                      </div>
                      <pre className="p-4 overflow-x-auto" style={{ background: 'linear-gradient(to right, rgba(31,41,55,0.5), rgba(17,24,39,0.8))' }}>
                        <code className="text-sm text-gray-300 font-mono">
                          {block.code}
                        </code>
                      </pre>
                    </div>
                  </motion.div>
                );
                
              // Añadir un caso para citas (aún cuando no existe en el modelo de datos actual, lo procesamos si existe)
              case 'quote':
                return (
                  <motion.blockquote
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 * index, duration: 0.7 }}
                    className="my-10 pl-6 border-l-4 border-purple-500 py-1"
                  >
                    <div className="relative">
                      <FaQuoteLeft className="text-3xl text-purple-400/30 absolute -top-4 -left-8" />
                      <p className="text-xl italic text-gray-300 leading-relaxed">{block.text}</p>
                      {block.author && (
                        <footer className="mt-2 text-right text-gray-400">
                          — <cite>{block.author}</cite>
                        </footer>
                      )}
                    </div>
                  </motion.blockquote>
                );
                
              default:
                return null;
            }
          })}
          
          {/* Añadir una cita destacada en medio del contenido para hacerlo más visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="my-16 p-8 rounded-xl bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/20 relative overflow-hidden"
          >
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl"></div>
            <FaQuoteLeft className="text-4xl text-purple-400/30 mb-4" />
            <p className="text-2xl font-light text-gray-200 leading-relaxed relative z-10">
              Las nuevas APIs de React 18 transforman la forma en que construimos experiencias fluidas y receptivas para los usuarios.
            </p>
            <div className="mt-4 text-right text-purple-300 relative z-10">
              — Equipo de React
            </div>
          </motion.div>
        </div>

        {/* Información del autor */}
        <div className="p-6 bg-gray-800 rounded-xl mb-16">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-sm"></div>
              <img
                src={post.authorAvatar}
                alt={post.author}
                className="w-24 h-24 rounded-full border-2 border-purple-500 relative z-10"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{post.author}</h3>
              <p className="text-gray-300 mb-4">{post.authorBio}</p>
              <div className="flex space-x-4">
                <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                  <FaTwitter />
                </a>
                <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                  <FaLinkedin />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Artículos relacionados */}
        {relatedPosts.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-white mb-8">Artículos Relacionados</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedPosts.map((relatedPost) => (
                <motion.article
                  key={relatedPost.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/20"
                >
                  <Link to={`/blog/${relatedPost.id}`}>
                    <div className="h-48 overflow-hidden">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                        <span className="flex items-center">
                          <FaCalendarAlt className="mr-2" />
                          {relatedPost.date}
                        </span>
                        <span>{relatedPost.readTime} de lectura</span>
                      </div>
                      <h2 className="text-xl font-semibold text-white mb-3 hover:text-purple-400 transition-colors">
                        {relatedPost.title}
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {relatedPost.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-gray-700 text-purple-300 text-sm rounded-full"
                          >
                            <FaTags className="inline mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BlogPost;
