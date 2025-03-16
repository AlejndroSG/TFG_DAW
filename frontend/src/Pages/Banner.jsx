import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useEffect, useRef } from "react";
import Caracteristicas from "../components/Caracteristicas";
import Tecnologias from "../components/Tecnologias";
import ComoFunciona from '../components/ComoFunciona';
import Testimonios from '../components/Testimonios';
import Precios from '../components/Precios';

const Banner = () => {
  const canvasRef = useRef(null);
  const particulasRef = useRef([]);
  const particulasFlotantesRef = useRef([]);
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

  return (
    <>
      <div className="relative w-full h-screen flex items-center justify-center bg-black overflow-hidden" onClick={manejarClic}>
        <div className="contenedorBanner absolute inset-0">
          <canvas ref={canvasRef} className="w-full h-full"></canvas>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1.5 }} 
          className="relative z-10 text-center text-white drop-shadow-[0_10px_10px_rgba(0,0,0,.7)]"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <TypeAnimation 
              sequence={[
                "Aprendizaje Inteligente", 
                2000, 
                "Educación sin Límites", 
                2000, 
                "LearnIA Revoluciona la Formación", 
                2000
              ]} 
              wrapper="span" 
              speed={50} 
              repeat={Infinity} 
            />
          </h1>
          <p className="mt-4 text-lg md:text-2xl opacity-80">
            Descubre el poder de la IA en la educación
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 px-8 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors duration-300"
          >
            Comienza Ahora
          </motion.button>
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
