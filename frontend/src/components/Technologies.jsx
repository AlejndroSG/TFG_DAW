import React from 'react';
import { motion } from 'framer-motion';

const Technologies = () => {
  const technologies = [
    {
      category: "Frontend",
      color: "from-blue-500 to-cyan-400",
      items: [
        { icon: "/src/img/tech-logos/react-original.svg", name: "React" },
        { icon: "/src/img/tech-logos/vuejs-original.svg", name: "Vue.js" },
        { icon: "/src/img/tech-logos/angularjs-original.svg", name: "Angular" },
        { icon: "/src/img/tech-logos/javascript-original.svg", name: "JavaScript" }
      ]
    },
    {
      category: "Backend",
      color: "from-purple-600 to-pink-600",
      items: [
        { icon: "/src/img/tech-logos/nodejs-original.svg", name: "Node.js" },
        { icon: "/src/img/tech-logos/python-original.svg", name: "Python" },
        { icon: "/src/img/tech-logos/php-original.svg", name: "PHP" },
        { icon: "/src/img/tech-logos/mysql-original.svg", name: "SQL" }
      ]
    },
    {
      category: "Bases de Datos",
      color: "from-green-500 to-emerald-400",
      items: [
        { icon: "/src/img/tech-logos/mongodb-original.svg", name: "MongoDB" },
        { icon: "/src/img/tech-logos/postgresql-original.svg", name: "PostgreSQL" },
        { icon: "/src/img/tech-logos/mysql-original.svg", name: "MySQL" },
        { icon: "/src/img/tech-logos/redis-original.svg", name: "Redis" }
      ]
    },
    {
      category: "DevOps & Cloud",
      color: "from-orange-500 to-red-500",
      items: [
        { icon: "/src/img/tech-logos/docker-original.svg", name: "Docker" },
        { icon: "/src/img/tech-logos/kubernetes.svg", name: "Kubernetes" },
        { icon: "/src/img/tech-logos/amazon_aws-icon.svg", name: "AWS" },
        { icon: "/src/img/tech-logos/google-cloud.svg", name: "Google Cloud" }
      ]
    }
  ];

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

  return (
    <section id="technologies" className="py-20 bg-gray-900">
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
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.category}
              variants={itemVariants}
              className="bg-gray-800 rounded-2xl p-6 hover:bg-gray-700 transition-colors"
            >
              <h3 className={`text-xl font-semibold mb-6 bg-gradient-to-r ${tech.color} bg-clip-text text-transparent`}>
                {tech.category}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {tech.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <img src={item.icon} alt={item.name} className="w-12 h-12 mb-2" />
                    <span className="text-gray-300 text-sm">{item.name}</span>
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:opacity-90 transition-opacity duration-300 shadow-lg"
          >
            Ver Todas las Tecnologías
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Technologies;
