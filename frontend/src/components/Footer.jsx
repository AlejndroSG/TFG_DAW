import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-screen-xl mx-auto px-4 text-center">
        <p className="text-lg">© 2025 LearnIA. Todos los derechos reservados.</p>
        <div className="mt-4 space-x-6">
          <a href="/about" className="hover:text-blue-500">Sobre nosotros</a>
          <a href="/privacy" className="hover:text-blue-500">Privacidad</a>
          <a href="/terms" className="hover:text-blue-500">Términos de uso</a>
        </div>
        <div className="mt-4">
          <p className="text-sm">Conectando estudiantes de todo el mundo con inteligencia artificial.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;