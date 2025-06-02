import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaLightbulb, 
  FaUsers, 
  FaRocket, 
  FaHeart, 
  FaCalendarAlt, 
  FaGlobe, 
  FaAward,
  FaChalkboardTeacher, 
  FaLaptopCode, 
  FaHandshake, 
  FaStar, 
  FaCode, 
  FaGraduationCap
} from 'react-icons/fa';
import { BiCodeAlt } from 'react-icons/bi';
import { BsArrowRight } from 'react-icons/bs';

const SobreNosotros = () => {
  const [userData, setUserData] = useState(null);

  // Verificar si el usuario ha iniciado sesión
  useEffect(() => {
    const comprobarSesion = async () => {
      try {
        const respuesta = await axios.get(
          'http://localhost/TFG_DAW/backend/controlador/controlador.php?action=comprobarSesion',
          { withCredentials: true }
        );
        
        if (respuesta.data && respuesta.data.username) {
          console.log('Sesión activa en SobreNosotros:', respuesta.data);
          setUserData(respuesta.data);
        } else {
          console.log('No hay sesión activa en SobreNosotros');
          setUserData(null);
        }
      } catch (error) {
        console.error('Error al comprobar sesión:', error);
        setUserData(null);
      }
    };

    comprobarSesion();
  }, []);

  const valores = [
    {
      icono: <FaLightbulb className="w-8 h-8 text-white" />,
      titulo: "Innovación",
      descripcion: "Constantemente buscamos nuevas formas de mejorar la experiencia de aprendizaje, incorporando las últimas tecnologías y metodologías.",
      color: "from-purple-500 to-indigo-600"
    },
    {
      icono: <FaUsers className="w-8 h-8 text-white" />,
      titulo: "Comunidad",
      descripcion: "Creemos en el poder del aprendizaje colaborativo y el apoyo mutuo. Juntos crecemos más rápido y llegamos más lejos.",
      color: "from-pink-500 to-rose-600"
    },
    {
      icono: <FaStar className="w-8 h-8 text-white" />,
      titulo: "Excelencia",
      descripcion: "Nos comprometemos a ofrecer la más alta calidad en educación tecnológica, con contenidos actualizados y relevantes.",
      color: "from-purple-400 to-pink-600"
    },
    {
      icono: <FaRocket className="w-8 h-8 text-white" />,
      titulo: "Crecimiento",
      descripcion: "Impulsamos el desarrollo profesional y personal de cada estudiante, ayudándoles a alcanzar su máximo potencial.",
      color: "from-indigo-500 to-purple-600"
    }
  ];

  // Equipo
  const equipo = [
    {
      nombre: "Alejandro Sánchez",
      cargo: "Fundador & CEO",
      bio: "Desarrollador Full Stack con más de 10 años de experiencia en la industria tecnológica. Apasionado por la educación y la tecnología.",
      imagen: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop",
      redes: {
        linkedin: "#",
        twitter: "#",
        github: "#"
      }
    },
    {
      nombre: "Laura Martínez",
      cargo: "Directora de Contenido",
      bio: "Especialista en educación con enfoque en metodologías innovadoras de enseñanza. Creadora de contenido educativo de alta calidad.",
      imagen: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2076&auto=format&fit=crop",
      redes: {
        linkedin: "#",
        twitter: "#",
        github: "#"
      }
    },
    {
      nombre: "Carlos Rodríguez",
      cargo: "CTO",
      bio: "Ingeniero de software con experiencia en arquitectura de sistemas y desarrollo de plataformas educativas interactivas.",
      imagen: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop",
      redes: {
        linkedin: "#",
        twitter: "#",
        github: "#"
      }
    }
  ];

  // Hitos
  const hitos = [
    {
      año: "2020",
      titulo: "Fundación",
      descripcion: "Comenzamos con la visión de transformar la educación en tecnología",
      icono: <FaCalendarAlt className="text-purple-400" />
    },
    {
      año: "2021",
      titulo: "Primera Plataforma",
      descripcion: "Lanzamos nuestra primera versión de la plataforma educativa",
      icono: <FaRocket className="text-pink-500" />
    },
    {
      año: "2022",
      titulo: "Expansión",
      descripcion: "Alcanzamos los 10,000 estudiantes y expandimos nuestro catálogo de cursos",
      icono: <FaGlobe className="text-purple-400" />
    },
    {
      año: "2023",
      titulo: "Reconocimiento",
      descripcion: "Recibimos premios por innovación en educación tecnológica",
      icono: <FaAward className="text-pink-500" />
    }
  ];

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6
      }
    },
    hover: {
      y: -10,
      boxShadow: "0 25px 50px -12px rgba(124, 58, 237, 0.25)",
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden pt-20">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-40 left-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-40 left-1/2 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Encabezado Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-block mb-4">
            <span className="inline-block py-1 px-3 rounded-full bg-purple-900/30 text-purple-300 text-sm font-medium mb-2">
              NUESTRA MISIÓN
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Transformando
            </span> 
            <br />
            <span className="text-white">la educación tecnológica</span>
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-pink-600 mx-auto mb-8"></div>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
            Somos una plataforma educativa comprometida con transformar la manera en que las personas aprenden programación, haciendo el conocimiento accesible, interactivo y efectivo.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/cursos" className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center">
              Explorar Cursos <BsArrowRight className="ml-2" />
            </Link>
            <Link to="/contacto" className="px-8 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300">
              Contactar
            </Link>
          </div>
        </motion.div>

        {/* Nuestra Historia - Con diseño mejorado */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl transform rotate-3 scale-105 opacity-30 blur-sm"></div>
                <div className="relative overflow-hidden rounded-2xl shadow-xl shadow-purple-900/20">
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
                    alt="Nuestro equipo trabajando"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </motion.div>
            </div>
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <span className="text-purple-400 font-semibold mb-2 block">NUESTRA HISTORIA</span>
                <h2 className="text-3xl font-bold text-white mb-6 relative">
                  <span className="relative z-10">De la visión a la realidad</span>
                  <span className="absolute bottom-0 left-0 w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-600"></span>
                </h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Nacimos con la visión de democratizar la educación en tecnología, haciendo el aprendizaje de la programación 
                  más accesible, interactivo y efectivo para todos. Desde nuestro inicio en 2020, nos hemos dedicado a crear una plataforma que 
                  combine la última tecnología con métodos de enseñanza innovadores.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Hoy, miles de estudiantes de todo el mundo han transformado sus carreras a través de nuestra plataforma, y seguimos comprometidos con nuestra misión de hacer que la educación tecnológica sea accesible para todos.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Nuestros Valores - Con tarjetas mejoradas */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="text-center mb-16">
            <span className="text-purple-400 font-semibold mb-2 block">LO QUE NOS DEFINE</span>
            <h2 className="text-3xl font-bold text-white mb-4">Nuestros Valores</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valores.map((valor, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover="hover"
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
              >
                <div className={`h-2 bg-gradient-to-r ${valor.color}`}></div>
                <div className="p-6">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-lg p-4 bg-gradient-to-r ${valor.color} transform hover:scale-110 transition-transform duration-300`}>
                    {valor.icono}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{valor.titulo}</h3>
                  <p className="text-gray-300">{valor.descripcion}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Línea de tiempo - Hitos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="text-center mb-16">
            <span className="text-purple-400 font-semibold mb-2 block">NUESTRO CAMINO</span>
            <h2 className="text-3xl font-bold text-white mb-4">Hitos Importantes</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-600 mx-auto"></div>
          </div>

          <div className="relative">
            {/* Línea central */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
            
            <div className="space-y-12">
              {hitos.map((hito, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className="w-1/2 flex justify-center">
                    <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
                      <div className="flex items-center mb-3">
                        {hito.icono}
                        <span className="ml-2 text-sm font-semibold text-purple-400">{hito.año}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{hito.titulo}</h3>
                      <p className="text-gray-300">{hito.descripcion}</p>
                    </div>
                  </div>
                  <div className="w-1/2 relative flex justify-center">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-400 to-pink-600 z-10"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Nuestro Equipo */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="text-center mb-16">
            <span className="text-purple-400 font-semibold mb-2 block">LAS MENTES CREATIVAS</span>
            <h2 className="text-3xl font-bold text-white mb-4">Nuestro Equipo</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {equipo.map((persona, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-70"></div>
                  <img 
                    src={persona.imagen} 
                    alt={persona.nombre}
                    className="w-full h-64 object-cover object-center"
                  />
                  <div className="absolute bottom-0 left-0 w-full p-6">
                    <h3 className="text-xl font-bold text-white mb-1">{persona.nombre}</h3>
                    <p className="text-purple-300 font-medium">{persona.cargo}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-300 mb-4">{persona.bio}</p>
                  <div className="flex space-x-4">
                    <a href={persona.redes.linkedin} className="text-purple-400 hover:text-purple-300 transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-linkedin" viewBox="0 0 16 16">
                        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                      </svg>
                    </a>
                    <a href={persona.redes.twitter} className="text-purple-400 hover:text-purple-300 transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-twitter" viewBox="0 0 16 16">
                        <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                      </svg>
                    </a>
                    <a href={persona.redes.github} className="text-purple-400 hover:text-purple-300 transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Llamada a la acción - Solo visible si no hay sesión iniciada */}
        {(userData === null || !userData) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl shadow-lg"
          >
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-6">¿Listo para transformar tu futuro?</h2>
              <p className="text-gray-300 text-lg mb-8">
                Únete a nuestra comunidad y comienza tu viaje en el mundo de la programación con los mejores recursos y apoyo.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('openRegistro'))}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center"
                >
                  Empieza Ahora <BsArrowRight className="ml-2" />
                </button>
                <Link to="/cursos" className="px-8 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300">
                  Ver Cursos
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SobreNosotros;
