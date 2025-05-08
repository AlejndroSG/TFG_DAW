import { motion, useAnimation, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useEffect, useRef, useState } from "react";
import Caracteristicas from "../components/Caracteristicas";
import Tecnologias from "../components/Tecnologias";
import ComoFunciona from '../components/ComoFunciona';
import Testimonios from '../components/Testimonios';
import Precios from '../components/Precios';
import { FaRocket, FaLightbulb, FaBrain, FaGraduationCap } from 'react-icons/fa';

const Banner = () => {
  const canvasRef = useRef(null);
  const particulasRef = useRef([]);
  const particulasFlotantesRef = useRef([]);
  const mousePos = useMotionValue({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const controls = useAnimation();
  const [currentFeature, setCurrentFeature] = useState(0);
  let meteoros = [];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const crearMeteoros = (cantidad) => {
      for (let i = 0; i < cantidad; i++) {
        meteoros.push({
          x: Math.random() * (canvas.width + 400) - 200,
          y: Math.random() * canvas.height - canvas.height / 2,
          longitud: Math.random() * 180 + 80,
          velocidad: Math.random() * 5 + 2,
          opacidad: Math.random() * 0.5 + 0.5,
          grosorInicio: Math.random() * 0.5 + 0.2,
          grosorFin: Math.random() * 2.5 + 1,
          color: "rgba(193, 96, 255, 0.7)",
        });
      }
    };

    const crearParticulasFlotantes = (cantidad) => {
      for (let i = 0; i < cantidad; i++) {
        particulasFlotantesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          tamaño: Math.random() * 2 + 1,
          velocidadX: (Math.random() - 0.5) * 0.2,
          velocidadY: (Math.random() - 0.5) * 0.2,
          opacidad: Math.random() * 0.2 + 0.1,
        });
      }
    };

    crearMeteoros(20);
    crearParticulasFlotantes(40);

    const dibujarMeteoros = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";

      meteoros.forEach((m) => {
        const finX = m.x - m.longitud * Math.cos(Math.PI / 4);
        const finY = m.y + m.longitud * Math.sin(Math.PI / 4);

        const gradiente = ctx.createLinearGradient(m.x, m.y, finX, finY);
        gradiente.addColorStop(0, "rgba(193, 96, 255, 0)");
        gradiente.addColorStop(1, m.color);

        ctx.strokeStyle = gradiente;
        ctx.lineWidth = m.grosorFin;
        ctx.lineCap = "round";
        ctx.globalAlpha = m.opacidad;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(finX, finY);
        ctx.stroke();

        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(finX, finY, m.grosorFin * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 150, 255, 0.5)";
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(255, 150, 255, 0.6)";
        ctx.fill();
        ctx.shadowBlur = 0;

        m.x -= m.velocidad * Math.cos(Math.PI / 4);
        m.y += m.velocidad * Math.sin(Math.PI / 4);

        if (m.y > canvas.height || m.x < -200) {
          m.x = Math.random() * (canvas.width + 400) + 200;
          m.y = Math.random() * -canvas.height;
        }
      });
    };

    const dibujarParticulas = () => {
      particulasRef.current.forEach((p, indice) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.tamaño, 0, Math.PI * 1);
        ctx.fillStyle = `rgba(255, ${p.color}, ${255 - p.color}, ${p.opacidad})`;
        ctx.fill();

        p.x += p.velocidadX;
        p.y += p.velocidadY;
        p.opacidad -= 0.02;

        if (p.opacidad <= 0) {
          particulasRef.current.splice(indice, 1);
        }
      });
    };

    const dibujarParticulasFlotantes = () => {
      particulasFlotantesRef.current.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.tamaño, 0, Math.PI * 1);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacidad})`;
        ctx.fill();

        p.x += p.velocidadX;
        p.y += p.velocidadY;

        if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
        }
      });
    };

    const animar = () => {
      dibujarMeteoros();
      dibujarParticulas();
      dibujarParticulasFlotantes();
      requestAnimationFrame(animar);
    };

    animar();

    return () => {
      cancelAnimationFrame(animar);
    };
  }, []);

  const manejarClic = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvasRef.current.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvasRef.current.height;
  
    let nuevasParticulas = [];
    for (let i = 0; i < 20; i++) {
      nuevasParticulas.push({
        x,
        y,
        tamaño: Math.random() * 3 + 1,
        velocidadX: (Math.random() - 0.5) * 4,
        velocidadY: (Math.random() - 0.5) * 4,
        opacidad: 1,
        color: Math.random() * 255,
      });
    }
    particulasRef.current.push(...nuevasParticulas);
  };

  // Características destacadas con iconos y animaciones
  const features = [
    { icon: <FaRocket className="text-pink-600" />, title: "Aprende más rápido", desc: "Tecnología de IA para acelerar tu aprendizaje" },
    { icon: <FaBrain className="text-purple-500" />, title: "Personalizado para ti", desc: "Contenido adaptado a tu estilo de aprendizaje" },
    { icon: <FaLightbulb className="text-amber-400" />, title: "Innovación educativa", desc: "Las técnicas más avanzadas en pedagogía" },
    { icon: <FaGraduationCap className="text-blue-400" />, title: "Certifica tu conocimiento", desc: "Obtén reconocimiento a nivel global" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  // Manejar movimiento del mouse para efectos parallax
  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    
    mousePos.set({ x, y });
  };

  const rotateX = useTransform(mousePos, (value) => value.y * -15);
  const rotateY = useTransform(mousePos, (value) => value.x * 15);
  const translateZ = useTransform(mousePos, (value) => isHovering ? '50px' : '0px');

  return (
    <>
      <div 
        className="relative w-full h-screen flex items-center justify-center bg-gray-900 overflow-hidden" 
        onClick={manejarClic}
        onMouseMove={handleMouseMove}
      >
        {/* Efecto de brillos y partículas */}
        <div className="contenedorBanner absolute inset-0">
          <canvas ref={canvasRef} className="w-full h-full"></canvas>
          
          {/* Círculos decorativos difuminados */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/30 rounded-full filter blur-[80px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full filter blur-[100px] animate-pulse delay-700"></div>
          <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-indigo-600/20 rounded-full filter blur-[90px] animate-pulse delay-1000"></div>
          
          {/* Rejilla decorativa */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Columna de texto principal */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1, type: "spring" }} 
            className="md:w-1/2 text-left text-white"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1 mb-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full backdrop-blur-sm border border-purple-500/20"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 font-medium">Innovamos con IA</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <TypeAnimation 
                sequence={[
                  "Aprendizaje Inteligente", 
                  2000, 
                  "Educación sin Límites", 
                  2000, 
                  "Revolución Educativa", 
                  2000
                ]} 
                wrapper="span" 
                speed={50} 
                repeat={Infinity} 
                className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
              />
            </h1>
            
            <p className="mt-4 text-xl opacity-80 leading-relaxed max-w-xl">
              Impulsa tu aprendizaje con la plataforma educativa más avanzada en Inteligencia Artificial. Contenidos personalizados, seguimiento en tiempo real y una experiencia única.  
            </p>
            
            <div className="mt-10 flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(139, 92, 246, 0.25)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow-xl shadow-purple-500/20"
              >
                Comienza Ahora
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent text-white rounded-full font-semibold border-2 border-purple-500/30 hover:border-purple-500/60 transition-colors"
              >
                Ver Demostración
              </motion.button>
            </div>
            
            {/* Características destacadas animadas */}
            <div className="mt-12 relative h-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeature}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="absolute flex items-center gap-3"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-md">
                    {features[currentFeature].icon}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{features[currentFeature].title}</p>
                    <p className="text-sm text-gray-300">{features[currentFeature].desc}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {/* Indicadores de características */}
              <div className="absolute -bottom-8 flex gap-2">
                {features.map((_, index) => (
                  <button 
                    key={index}
                    onClick={() => setCurrentFeature(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${currentFeature === index ? 'bg-pink-500 w-4' : 'bg-gray-500/50'}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Columna con imagen/elemento 3D */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1, delay: 0.3, type: "spring" }}
            className="md:w-1/2 flex justify-center"
            onHoverStart={() => setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
          >
            <motion.div
              style={{ 
                rotateX,
                rotateY,
                translateZ,
                transition: "transform 0.3s ease-out"
              }}
              className="relative w-full max-w-lg aspect-square"
            >
              {/* Tarjeta principal 3D */}
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                className="absolute inset-0 rounded-3xl overflow-hidden backdrop-blur-md border border-purple-500/20 bg-gradient-to-br from-purple-900/40 to-pink-900/40 shadow-[0_0_40px_rgba(139,92,246,0.3)] p-8 flex flex-col"
              >
                {/* Efecto de partículas flotantes */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 rounded-full bg-purple-400/40"
                      initial={{ 
                        x: Math.random() * 100 + '%', 
                        y: Math.random() * 100 + '%',
                        opacity: 0.2 + Math.random() * 0.3
                      }}
                      animate={{ 
                        y: [null, `${-20 + Math.random() * 40}%`],
                        opacity: [null, 0.1 + Math.random() * 0.2]
                      }}
                      transition={{ 
                        duration: 2 + Math.random() * 3,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut',
                        delay: Math.random() * 2
                      }}
                    />
                  ))}
                </div>
                
                {/* Sección superior con logo y decoración */}
                <div className="flex justify-center mb-12 mt-4 relative">
                  <div className="absolute w-40 h-40 bg-gradient-to-tr from-purple-600/20 via-purple-400/5 to-pink-600/10 rounded-full blur-2xl -top-8"></div>
                  <motion.div 
                    className="flex flex-col items-center justify-center relative z-10"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, type: 'spring' }}
                  >
                    <motion.div
                      className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-tr from-purple-500/50 to-pink-500/50 p-0.5"
                      animate={{ 
                        boxShadow: ['0 0 20px rgba(139, 92, 246, 0.3)', '0 0 30px rgba(139, 92, 246, 0.5)', '0 0 20px rgba(139, 92, 246, 0.3)']
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="rounded-full bg-gray-900 w-full h-full flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: 'conic-gradient(from 0deg, rgba(168, 85, 247, 0.4), rgba(168, 85, 247, 0), rgba(168, 85, 247, 0.4))'
                          }}
                        />
                        <motion.div
                          className="text-white text-3xl z-10"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M50 10C77.6142 10 100 32.3858 100 60C100 87.6142 77.6142 110 50 110C22.3858 110 0 87.6142 0 60C0 32.3858 22.3858 10 50 10Z" fillOpacity="0" />
                            <path d="M67.5 40C67.5 47.5 62.5 55 50 55C37.5 55 32.5 47.5 32.5 40C32.5 32.5 37.5 25 50 25C62.5 25 67.5 32.5 67.5 40Z" fill="url(#gradient1)" />
                            <path d="M67.5 80C67.5 87.5 62.5 95 50 95C37.5 95 32.5 87.5 32.5 80C32.5 72.5 37.5 65 50 65C62.5 65 67.5 72.5 67.5 80Z" fill="url(#gradient2)" />
                            <path d="M44 60C44 60 38 60 38 54.5C38 49 44 42.5 44 42.5" stroke="url(#gradient3)" strokeWidth="3" strokeLinecap="round" />
                            <path d="M56 60C56 60 62 60 62 54.5C62 49 56 42.5 56 42.5" stroke="url(#gradient4)" strokeWidth="3" strokeLinecap="round" />
                            <defs>
                              <linearGradient id="gradient1" x1="32.5" y1="25" x2="67.5" y2="55" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#A78BFA" />
                                <stop offset="1" stopColor="#EC4899" />
                              </linearGradient>
                              <linearGradient id="gradient2" x1="32.5" y1="65" x2="67.5" y2="95" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#A78BFA" />
                                <stop offset="1" stopColor="#EC4899" />
                              </linearGradient>
                              <linearGradient id="gradient3" x1="38" y1="42.5" x2="44" y2="60" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#A78BFA" />
                                <stop offset="1" stopColor="#EC4899" />
                              </linearGradient>
                              <linearGradient id="gradient4" x1="56" y1="42.5" x2="62" y2="60" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#A78BFA" />
                                <stop offset="1" stopColor="#EC4899" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </motion.div>
                      </div>
                    </motion.div>
                    
                    <motion.h3
                      className="mt-6 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      LearnIA
                    </motion.h3>
                    
                    <motion.div
                      className="mt-2 text-gray-300 text-sm font-medium tracking-wider"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.8 }}
                      transition={{ delay: 0.5 }}
                    >
                      REVOLUCIONA TU APRENDIZAJE
                    </motion.div>
                  </motion.div>
                </div>
                
                {/* Sección central con características */}
                <div className="flex flex-col space-y-5 mb-8">
                  {[
                    { icon: '✨', text: 'Experiencia personalizada' },
                    { icon: '🧠', text: 'Inteligencia artificial avanzada' },
                    { icon: '🚀', text: 'Progreso acelerado' }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/5 rounded-lg border border-purple-500/10"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + (i * 0.2) }}
                    >
                      <div className="w-8 h-8 rounded-md bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-xl">
                        {item.icon}
                      </div>
                      <span className="text-gray-200 font-medium">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
                
                {/* Sección inferior con CTA */}
                <div className="mt-auto pt-6 border-t border-purple-500/10">
                  <motion.button
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium shadow-lg flex items-center justify-center gap-2"
                    whileTap={{ scale: 0.98 }}
                    animate={{ boxShadow: ['0 4px 12px rgba(139, 92, 246, 0.3)', '0 4px 20px rgba(139, 92, 246, 0.4)', '0 4px 12px rgba(139, 92, 246, 0.3)'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span>Comenzar ahora</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </motion.button>
                </div>
                
                {/* Elementos decorativos animados */}
                <div className="absolute top-0 right-0 -mt-5 -mr-5 w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-blue-600 opacity-80 blur-xl animate-pulse" />
                <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-700 opacity-70 blur-xl animate-pulse delay-700" />
              </motion.div>
              
              {/* Tarjeta decorativa de fondo */}
              <motion.div
                initial={{ rotate: -5, y: 20 }}
                animate={{ rotate: -5, y: 30 }}
                transition={{ 
                  y: { repeat: Infinity, repeatType: "reverse", duration: 2 }
                }}
                className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900/30 to-purple-800/30 border border-indigo-500/10 -z-10 transform translate-x-6"
              />
              
              {/* Tarjeta decorativa de fondo */}
              <motion.div
                initial={{ rotate: 5, y: 40 }}
                animate={{ rotate: 5, y: 50 }}
                transition={{ 
                  y: { repeat: Infinity, repeatType: "reverse", duration: 2, delay: 0.5 }
                }}
                className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-br from-pink-900/30 to-purple-800/30 border border-pink-500/10 -z-20 transform -translate-x-6"
              />
            </motion.div>
          </motion.div>
        </div>
        
        {/* Indicador de desplazamiento */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        >
          <span className="text-gray-400 text-sm mb-2">Descubre más</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 border-2 border-purple-500/30 rounded-full flex justify-center p-1"
          >
            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-2 h-2 bg-purple-500 rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>
      <Caracteristicas />
      <Tecnologias />
      <ComoFunciona />
      <Testimonios />
      <Precios />
    </>
  );
};

export default Banner;
