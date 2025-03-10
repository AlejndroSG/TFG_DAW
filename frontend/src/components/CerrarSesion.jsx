import React from 'react'

const CerrarSesion = ({comprobar}) => {
  
    const cerrarSesion = () =>{
        comprobar(false)
    }
  
  return (
    <>
        <button href="/" onClick={cerrarSesion}>Cerrar Sesion</button>
    </>
  )
}

export default CerrarSesion