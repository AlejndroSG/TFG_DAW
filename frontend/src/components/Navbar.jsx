import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Login from '../Pages/Login';
// import IniciarSesion from './IniciarSesion';
// import CerrarSesion from './CerrarSesion';

const Navbar = () => {

  let [comprobar, setComprobar] = useState(false);
  let [comprobar2, setComprobar2] = useState(false);
  let [datos, setDatos] = useState([]);
  let [error, setError] = useState("");

  let verificar = () => {
    console.log("hola");
    setComprobar(true);    
  }

  let dates = (dats) => {
    setDatos(dats);
    console.log(...datos+" estos son los datos")
  }

  return (
    <ul className='flex gap-5 justify-center'>
      {
        comprobar2 == false ? 
          <button onClick={() => setComprobar2(true)}>Iniciar Sesión</button>
          :
          comprobar == false ?
            <Login verificar={() => verificar()} dates={() => dates()} error={() => setError()} >Iniciar Sesión</Login>
            :
          <>
            <Link to="/"><li>LearnIA</li></Link>
            <Link to="/"><li>Cursos</li></Link>
            <Link to="/"><li>IA CHAT</li></Link>
            <li></li>
            <Link to="/" onClick={() => {
              setComprobar(false),
              setDatos([])
            }}><li>Cerrar Sesión</li></Link>
          </>
      }
    </ul>
  )
}

export default Navbar