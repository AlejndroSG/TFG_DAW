import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useEffect, useRef } from "react";
import Features from "../components/Features";
import Technologies from "../components/Technologies";
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import Pricing from '../components/Pricing';

const Banner = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const floatingParticlesRef = useRef([]);
  let meteors = [];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const createMeteors = (count) => {
      for (let i = 0; i < count; i++) {
        meteors.push({
          x: Math.random() * (canvas.width + 400) - 200,
          y: Math.random() * canvas.height - canvas.height / 2,
          length: Math.random() * 180 + 80,
          speed: Math.random() * 5 + 2,
          opacity: Math.random() * 0.5 + 0.5,
          thicknessStart: Math.random() * 0.5 + 0.2,
          thicknessEnd: Math.random() * 2.5 + 1,
          color: "rgba(193, 96, 255, 0.7)",
        });
      }
    };

    const createFloatingParticles = (count) => {
      for (let i = 0; i < count; i++) {
        floatingParticlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.2,
          speedY: (Math.random() - 0.5) * 0.2,
          opacity: Math.random() * 0.2 + 0.1,
        });
      }
    };

    createMeteors(50);
    createFloatingParticles(80);

    const drawMeteors = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";

      meteors.forEach((m) => {
        const endX = m.x - m.length * Math.cos(Math.PI / 4);
        const endY = m.y + m.length * Math.sin(Math.PI / 4);

        const gradient = ctx.createLinearGradient(m.x, m.y, endX, endY);
        gradient.addColorStop(0, "rgba(193, 96, 255, 0)");
        gradient.addColorStop(1, m.color);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = m.thicknessEnd;
        ctx.lineCap = "round";
        ctx.globalAlpha = m.opacity;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(endX, endY, m.thicknessEnd * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 150, 255, 0.5)";
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(255, 150, 255, 0.6)";
        ctx.fill();
        ctx.shadowBlur = 0;

        m.x -= m.speed * Math.cos(Math.PI / 4);
        m.y += m.speed * Math.sin(Math.PI / 4);

        if (m.y > canvas.height || m.x < -200) {
          m.x = Math.random() * (canvas.width + 400) + 200;
          m.y = Math.random() * -canvas.height;
        }
      });
    };

    const drawParticles = () => {
      particlesRef.current.forEach((p, index) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 1);
        ctx.fillStyle = `rgba(255, ${p.color}, ${255 - p.color}, ${p.opacity})`;
        ctx.fill();

        p.x += p.velocityX;
        p.y += p.velocityY;
        p.opacity -= 0.02;

        if (p.opacity <= 0) {
          particlesRef.current.splice(index, 1);
        }
      });
    };

    const drawFloatingParticles = () => {
      floatingParticlesRef.current.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 1);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
        }
      });
    };

    const animate = () => {
      drawMeteors();
      drawParticles();
      drawFloatingParticles();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animate);
    };
  }, []);

  const handleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvasRef.current.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvasRef.current.height;
  
    let newParticles = [];
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        x,
        y,
        size: Math.random() * 3 + 1,
        velocityX: (Math.random() - 0.5) * 4,
        velocityY: (Math.random() - 0.5) * 4,
        opacity: 1,
        color: Math.random() * 255,
      });
    }
    particlesRef.current.push(...newParticles);
  };

  return (
    <>
      <div className="relative w-full h-screen flex items-center justify-center bg-black overflow-hidden" onClick={handleClick}>
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
      <Features />
      <Technologies />
      <HowItWorks />
      <Testimonials />
      <Pricing />
    </>
  );
};

export default Banner;
