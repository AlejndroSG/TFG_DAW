import React from 'react';
import { motion } from 'framer-motion';

const Recursos = () => {
  return (
    <div className="min-h-screen bg-gray-900 pt-24">
      <div className="container mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-white text-center"
        >
          Recursos de Aprendizaje
        </motion.h1>
      </div>
    </div>
  );
};

export default Recursos;
