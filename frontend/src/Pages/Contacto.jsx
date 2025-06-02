import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn, FaCheckCircle, FaClock, FaGraduationCap } from 'react-icons/fa';
import { BiMessageDetail, BiSupport } from 'react-icons/bi';
import { BsArrowRight, BsFacebook, BsTwitter, BsInstagram, BsLinkedin, BsGithub } from 'react-icons/bs';
import { MdSchool, MdPayment } from 'react-icons/md';

const Contacto = () => {
  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });

  // Estado para mensaje de éxito
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log('Formulario enviado:', formData);
    
    // Simulamos el envío exitoso
    setFormSubmitted(true);
    
    // Resetear el formulario después de 3 segundos
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        nombre: '',
        email: '',
        asunto: '',
        mensaje: ''
      });
    }, 3000);
  };

  // Información de contacto
  const infoContacto = [
    {
      icono: <FaMapMarkerAlt className="text-white text-xl" />,
      titulo: "Dirección",
      info: "Calle Ejemplo 123, Madrid, España",
      color: "from-purple-400 to-purple-600"
    },
    {
      icono: <FaPhone className="text-white text-xl" />,
      titulo: "Teléfono",
      info: "+34 912 345 678",
      color: "from-pink-400 to-pink-600"
    },
    {
      icono: <FaEnvelope className="text-white text-xl" />,
      titulo: "Email",
      info: "info@techacademy.com",
      color: "from-indigo-400 to-indigo-600"
    },
    {
      icono: <FaClock className="text-white text-xl" />,
      titulo: "Horario",
      info: "Lun-Vie: 9:00 - 18:00",
      color: "from-blue-400 to-blue-600"
    },
  ];
  
  // Redes sociales
  const redesSociales = [
    {
      icon: <BsFacebook />,
      url: "https://facebook.com",
      color: "hover:bg-blue-600"
    },
    {
      icon: <BsTwitter />,
      url: "https://twitter.com",
      color: "hover:bg-blue-400"
    },
    {
      icon: <BsInstagram />,
      url: "https://instagram.com",
      color: "hover:bg-pink-600"
    },
    {
      icon: <BsLinkedin />,
      url: "https://linkedin.com",
      color: "hover:bg-blue-700"
    },
    {
      icon: <BsGithub />,
      url: "https://github.com",
      color: "hover:bg-gray-600"
    }
  ];
  
  // Preguntas frecuentes
  const faqs = [
    {
      pregunta: "¿Cómo puedo inscribirme en un curso?",
      respuesta: "Para inscribirte en un curso, simplemente navega a la página de cursos, selecciona el que te interese y haz clic en el botón 'Inscribirme'. Después de completar el proceso de pago, tendrás acceso inmediato al contenido."
    },
    {
      pregunta: "¿Ofrecen certificados al completar los cursos?",
      respuesta: "Sí, todos nuestros cursos incluyen un certificado de finalización que podrás descargar y compartir en tu perfil profesional una vez que hayas completado todas las lecciones y evaluaciones requeridas."
    },
    {
      pregunta: "¿Cuál es la política de reembolso?",
      respuesta: "Ofrecemos una garantía de satisfacción de 30 días. Si no estás satisfecho con el curso, puedes solicitar un reembolso completo dentro de los primeros 30 días después de la compra."
    }
  ];
  
  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden pt-20">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      
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
              ESTAMOS AQUÍ PARA AYUDARTE
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Contacta 
            </span> 
            <span className="text-white"> con nosotros</span>
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-pink-600 mx-auto mb-8"></div>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
            ¿Tienes alguna pregunta o necesitas ayuda? Nuestro equipo está listo para asistirte en lo que necesites.
          </p>
        </motion.div>

        {/* Sección principal de contacto */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
          {/* Información de Contacto */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-purple-500/10 transition-all duration-300 h-full">
              <h2 className="text-2xl font-bold text-white mb-8 relative">
                <span className="relative z-10">Información de Contacto</span>
                <span className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-600"></span>
              </h2>
              
              <div className="space-y-8 mb-12">
                {infoContacto.map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index + 0.3 }}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center shadow-lg`}>
                      {item.icono}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{item.titulo}</h3>
                      <p className="text-gray-300">{item.info}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-4">Síguenos</h3>
                <div className="flex space-x-3">
                  {redesSociales.map((red, index) => (
                    <a 
                      key={index} 
                      href={red.url} 
                      className={`w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 hover:text-white transition-colors duration-300 ${red.color}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {red.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Formulario */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
              {formSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaCheckCircle className="text-green-500 text-4xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">¡Mensaje Enviado!</h3>
                  <p className="text-gray-300 mb-8">Gracias por contactarnos. Te responderemos lo antes posible.</p>
                </motion.div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-white relative">
                      <span className="relative z-10">Envíanos un mensaje</span>
                      <span className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-600"></span>
                    </h2>
                    <BiMessageDetail className="text-purple-400 text-2xl" />
                  </div>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="nombre" className="block text-white mb-2 font-medium">Nombre</label>
                        <input
                          type="text"
                          id="nombre"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          className="w-full bg-gray-700/70 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600 hover:border-purple-400 transition-colors duration-300"
                          required
                          placeholder="Tu nombre completo"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-white mb-2 font-medium">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full bg-gray-700/70 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600 hover:border-purple-400 transition-colors duration-300"
                          required
                          placeholder="ejemplo@correo.com"
                        />
                      </div>
                    </div>
                    <div className="mb-6">
                      <label htmlFor="asunto" className="block text-white mb-2 font-medium">Asunto</label>
                      <input
                        type="text"
                        id="asunto"
                        name="asunto"
                        value={formData.asunto}
                        onChange={handleChange}
                        className="w-full bg-gray-700/70 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600 hover:border-purple-400 transition-colors duration-300"
                        required
                        placeholder="Asunto de tu mensaje"
                      />
                    </div>
                    <div className="mb-8">
                      <label htmlFor="mensaje" className="block text-white mb-2 font-medium">Mensaje</label>
                      <textarea
                        id="mensaje"
                        name="mensaje"
                        value={formData.mensaje}
                        onChange={handleChange}
                        rows="5"
                        className="w-full bg-gray-700/70 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600 hover:border-purple-400 transition-colors duration-300"
                        required
                        placeholder="Escribe tu mensaje aquí..."
                      ></textarea>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.5)" }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-95 transition-all duration-300 flex items-center justify-center"
                    >
                      Enviar Mensaje <BsArrowRight className="ml-2" />
                    </motion.button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* Preguntas Frecuentes */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="text-center mb-16">
            <span className="text-purple-400 font-semibold mb-2 block">PREGUNTAS FRECUENTES</span>
            <h2 className="text-3xl font-bold text-white mb-4">Respuestas a tus dudas</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-600 mx-auto"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div 
                  key={index} 
                  variants={itemVariants}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-md hover:shadow-purple-500/10 transition-all duration-300"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-3 flex items-start">
                      <span className="text-purple-400 mr-3 text-2xl">Q.</span>
                      {faq.pregunta}
                    </h3>
                    <p className="text-gray-300 pl-8">{faq.respuesta}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Llamada a la acción */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl shadow-lg"
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">¿Listo para comenzar tu viaje de aprendizaje?</h2>
            <p className="text-gray-300 text-lg mb-8">
              Explora nuestros cursos y comienza a transformar tu futuro con las habilidades tecnológicas más demandadas.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/cursos" className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center">
                Ver Cursos <BsArrowRight className="ml-2" />
              </a>
              <a href="/registro" className="px-8 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300">
                Registrarse
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contacto;
