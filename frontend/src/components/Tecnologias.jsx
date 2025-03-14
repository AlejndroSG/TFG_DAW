import React from 'react';
import { motion } from 'framer-motion';

const Tecnologias = () => {
  const tecnologias = [
    {
      categoria: "Frontend",
      color: "from-blue-500 to-cyan-400",
      elementos: [
        { icono: "/src/img/tech-logos/react-original.svg", nombre: "React" },
        { icono: "/src/img/tech-logos/vuejs-original.svg", nombre: "Vue.js" },
        { icono: "/src/img/tech-logos/angularjs-original.svg", nombre: "Angular" },
        { icono: "/src/img/tech-logos/javascript-original.svg", nombre: "JavaScript" }
      ]
    },
    {
      categoria: "Backend",
      color: "from-purple-600 to-pink-600",
      elementos: [
        { icono: "/src/img/tech-logos/nodejs-original.svg", nombre: "Node.js" },
        { icono: "/src/img/tech-logos/python-original.svg", nombre: "Python" },
        { icono: "/src/img/tech-logos/php-original.svg", nombre: "PHP" },
        { icono: "/src/img/tech-logos/mysql-original.svg", nombre: "SQL" }
      ]
    },
    {
      categoria: "Bases de Datos",
      color: "from-green-500 to-emerald-400",
      elementos: [
        { icono: "/src/img/tech-logos/mongodb-original.svg", nombre: "MongoDB" },
        { icono: "/src/img/tech-logos/postgresql-original.svg", nombre: "PostgreSQL" },
        { icono: "/src/img/tech-logos/mysql-original.svg", nombre: "MySQL" },
        { icono: "/src/img/tech-logos/redis-original.svg", nombre: "Redis" }
      ]
    },
    {
      categoria: "DevOps & Cloud",
      color: "from-orange-500 to-red-500",
      elementos: [
        { icono: "/src/img/tech-logos/docker-original.svg", nombre: "Docker" },
        { icono: "/src/img/tech-logos/kubernetes.svg", nombre: "Kubernetes" },
        { icono: "/src/img/tech-logos/amazon_aws-icon.svg", nombre: "AWS" },
        { icono: "/src/img/tech-logos/google-cloud.svg", nombre: "Google Cloud" }
      ]
    }
  ];

  const contenedorVariantes = {
    oculto: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const elementoVariantes = {
    oculto: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="tecnologias" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Tecnologías que Aprenderás
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Domina las tecnologías más demandadas en la industria
          </p>
        </motion.div>

        <motion.div
          variants={contenedorVariantes}
          initial="oculto"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {tecnologias.map((tecnologia, indice) => (
            <motion.div
              key={tecnologia.categoria}
              variants={elementoVariantes}
              className="bg-gray-800 rounded-2xl p-6 hover:bg-gray-700 transition-colors"
            >
              <h3 className={`text-xl font-semibold mb-6 bg-gradient-to-r ${tecnologia.color} bg-clip-text text-transparent`}>
                {tecnologia.categoria}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {tecnologia.elementos.map((elemento) => (
                  <div
                    key={elemento.nombre}
                    className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <img src={elemento.icono} alt={elemento.nombre} className="w-12 h-12 mb-2" />
                    <span className="text-gray-300 text-sm">{elemento.nombre}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 text-lg mb-6">
            Y muchas más tecnologías actualizadas constantemente
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "tween", duration: 0.2 }}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:opacity-90 transition-opacity duration-300 shadow-lg"
          >
            Ver Todas las Tecnologías
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Tecnologias;
