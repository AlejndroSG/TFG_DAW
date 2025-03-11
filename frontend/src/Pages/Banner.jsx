import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";

const Banner = () => {
  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Fondo de partículas */}
      <div className="absolute inset-0 z-0">
        <canvas id="particlesCanvas" className="w-full h-full"></canvas>
      </div>

      {/* Contenido del banner */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="relative z-10 text-center text-white px-6"
      >
        <h1 className="text-5xl md:text-7xl font-bold">
          <TypeAnimation
            sequence={["Aprendizaje Inteligente", 2000, "Educación sin Límites", 2000, "LearnIA Revoluciona la Formación", 2000]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
          />
        </h1>
        <p className="mt-4 text-lg md:text-2xl opacity-80">Descubre el poder de la IA en la educación</p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-md"
        >
          Empieza Ahora
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Banner