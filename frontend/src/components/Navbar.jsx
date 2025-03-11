import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Login from '../Pages/Login';
// import IniciarSesion from './IniciarSesion';
// import CerrarSesion from './CerrarSesion';

const Navbar = () => {

  let [comprobar, setComprobar] = useState(false);
  let [comprobar2, setComprobar2] = useState(false);
  let [datos, setDatos] = useState({});
  let [error, setError] = useState("");

  let verificar = () => {
    console.log("hola");
    setComprobar(true);    
  }

  let dates = (dats) => {
    setDatos(dats);
    console.log(dats)
  }

  return (
    <ul className='flex gap-5 justify-space-around'>
      {
        comprobar2 == false ? 
          <button onClick={() => setComprobar2(true)}>Iniciar Sesión</button>
          :
          comprobar == false ?
            <div className='flex-col'>
              {
                <Login verificar={() => verificar()} dates={(dats) => dates(dats)} error={(err) => setError(err)} >Iniciar Sesión</Login>
              }
            {
              error != "" ?
                <p style={{color: "red"}}>{error}</p>
                :
                <p></p>
            }
            </div>
            
            :
          <>
          <div className='flex gap-5'>
            <Link to="/"><li>LearnIA</li></Link>
            <Link to="/"><li>Cursos</li></Link>
            <Link to="/"><li>IA CHAT</li></Link>
            <Link to="/" onClick={() => {
              setComprobar(false),
              setDatos([]),
              setComprobar2(false),
              sessionStorage.clear()
            }}><li>Cerrar Sesión</li></Link>
          </div>
          <div>
            {
              datos != null ?
                <div className='flex gap-5 ml-10'>
                  <p className='highlight'>{datos.nombre}</p>
                  <p className='font-bold'>{datos.tipo_usuario}</p>
                </div>
                :
                <p>{error}</p>
            }
          </div>
          </>
      }
    </ul>
  )
}

export default Navbar