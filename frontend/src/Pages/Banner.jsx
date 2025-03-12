import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useEffect, useRef } from "react";

const Banner = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let meteors = [];

    const createMeteors = (count) => {
      for (let i = 0; i < count; i++) {
        meteors.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          length: Math.random() * 120 + 50,
          speed: Math.random() * 4 + 1,
          opacity: Math.random() * 0.5 + 0.5,
          thicknessStart: Math.random() * 0.5 + 0.2, // Empieza fina
          thicknessEnd: Math.random() * 2.5 + 1, // Termina más gruesa
          color: "rgba(193, 96, 255, 0.7)", // Color del meteoro
        });
      }
    };

    createMeteors(50);

    const drawMeteors = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";

      meteors.forEach((m) => {
        const endX = m.x - m.length * Math.cos(Math.PI / 4);
        const endY = m.y + m.length * Math.sin(Math.PI / 4);

        // Gradiente para hacer el efecto de línea que se hace más gruesa
        const gradient = ctx.createLinearGradient(m.x, m.y, endX, endY);
        gradient.addColorStop(0, "rgba(193, 96, 255, 0)"); // Inicio invisible
        gradient.addColorStop(1, m.color); // Fin visible

        ctx.strokeStyle = gradient;
        ctx.lineWidth = m.thicknessEnd;
        ctx.lineCap = "round";
        ctx.globalAlpha = m.opacity;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Efecto de brillo en la cola del meteoro (la parte más gruesa)
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(endX, endY, m.thicknessEnd * 1.2, 0, Math.PI * 2); // Brillo más sutil
        ctx.fillStyle = "rgba(255, 150, 255, 0.5)";
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(255, 150, 255, 0.6)";
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    };

    const updateMeteors = () => {
      meteors.forEach((m) => {
        m.x -= m.speed * Math.cos(Math.PI / 4);
        m.y += m.speed * Math.sin(Math.PI / 4);

        if (m.y > canvas.height || m.x < 0) {
          m.x = Math.random() * canvas.width + 200;
          m.y = -50;
        }
      });
    };

    const animate = () => {
      drawMeteors();
      updateMeteors();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animate);
    };
  }, []);

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Fondo de lluvia de meteoros */}
      <div className="contenedorBanner absolute inset-0">
        <canvas ref={canvasRef} className="w-full h-full"></canvas>
      </div>

      {/* Contenido del banner */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="relative z-10 text-center text-white drop-shadow-[0_10px_10px_rgba(0,0,0,.7)]"
      >
        <h1 className="text-5xl md:text-7xl font-bold">
          <TypeAnimation
            sequence={[
              "Aprendizaje Inteligente",
              2000,
              "Educación sin Límites",
              2000,
              "LearnIA Revoluciona la Formación",
              2000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
          />
        </h1>
        <p className="mt-4 text-lg md:text-2xl opacity-80">
          Descubre el poder de la IA en la educación
        </p>
      </motion.div>
    </div>
  );
};

export default Banner;
