import React from 'react';
import { motion } from 'framer-motion';

const Tecnologias = () => {
  const tecnologias = [
    {
      categoria: "Frontend",
      icono: <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
      elementos: [
        { icono: "/src/img/tech-logos/react-original.svg", nombre: "React" },
        { icono: "/src/img/tech-logos/vuejs-original.svg", nombre: "Vue.js" },
        { icono: "/src/img/tech-logos/angularjs-original.svg", nombre: "Angular" },
        { icono: "/src/img/tech-logos/javascript-original.svg", nombre: "JavaScript" }
      ]
    },
    {
      categoria: "Backend",
      icono: <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>,
      elementos: [
        { icono: "/src/img/tech-logos/nodejs-original.svg", nombre: "Node.js" },
        { icono: "/src/img/tech-logos/python-original.svg", nombre: "Python" },
        { icono: "/src/img/tech-logos/php-original.svg", nombre: "PHP" },
        { icono: "/src/img/tech-logos/mysql-original.svg", nombre: "SQL" }
      ]
    },
    {
      categoria: "Bases de Datos",
      icono: <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
      elementos: [
        { icono: "/src/img/tech-logos/mongodb-original.svg", nombre: "MongoDB" },
        { icono: "/src/img/tech-logos/postgresql-original.svg", nombre: "PostgreSQL" },
        { icono: "/src/img/tech-logos/mysql-original.svg", nombre: "MySQL" },
        { icono: "/src/img/tech-logos/redis-original.svg", nombre: "Redis" }
      ]
    },
    {
      categoria: "DevOps & Cloud",
      icono: <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
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
    <section id="tecnologias" className="py-24 bg-gray-900 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute -top-40 right-20 w-72 h-72 bg-indigo-600/30 rounded-full filter blur-[100px] animate-pulse"></div>
        <div className="absolute -bottom-40 -left-20 w-72 h-72 bg-indigo-700/20 rounded-full filter blur-[120px] animate-pulse delay-700"></div>
        <div className="absolute right-1/4 top-1/3 w-64 h-64 bg-blue-600/10 rounded-full filter blur-[80px] animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1 mb-6 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-full backdrop-blur-sm border border-indigo-500/20"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400 font-medium">Stack Tecnológico Completo</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">
              Tecnologías que <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Dominarás</span>
            </span>
          </h2>
          
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Las herramientas más innovadoras y demandadas del mercado tech actual
          </p>
        </motion.div>

        <motion.div
          variants={contenedorVariantes}
          initial="oculto"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
        >
          {tecnologias.map((tecnologia, indice) => (
            <motion.div
              key={tecnologia.categoria}
              variants={elementoVariantes}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative overflow-hidden bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 shadow-xl group"
            >
              {/* Elementos decorativos */}
              <div className="absolute -right-16 -top-16 w-32 h-32 bg-indigo-800/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-indigo-700/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-md bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {tecnologia.categoria}
                  </h3>
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  {tecnologia.elementos.map((elemento) => (
                    <motion.div
                      key={elemento.nombre}
                      whileHover={{ scale: 1.05 }}
                      className="flex flex-col items-center p-3 rounded-xl bg-indigo-900/10 hover:bg-indigo-800/20 border border-indigo-600/10 transition-colors duration-300"
                    >
                      <div className="relative w-14 h-14 mb-3 flex items-center justify-center">
                        <div className="absolute inset-0 bg-indigo-500/5 rounded-full filter blur-md"></div>
                        <img src={elemento.icono} alt={elemento.nombre} className="w-12 h-12 relative z-10" />
                      </div>
                      <span className="text-gray-300 font-medium text-sm">{elemento.nombre}</span>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-6 h-1 w-full bg-gradient-to-r from-indigo-600/0 via-indigo-600/20 to-indigo-600/0 rounded-full"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Tecnologias;
