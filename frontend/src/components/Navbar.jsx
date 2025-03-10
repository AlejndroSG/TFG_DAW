import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import IniciarSesion from './IniciarSesion';
import CerrarSesion from './CerrarSesion';

const Navbar = () => {
  return (
    <ul className='flex gap-5 justify-center'>
        <Link to="/"><li>LearnIA</li></Link>
        <Link to="/"><li>Cursos</li></Link>
        <Link to="/"><li>IA CHAT</li></Link>
        <IniciarSesion/>
    </ul>
  )
}

export default Navbar