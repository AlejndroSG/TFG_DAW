import React, { useState } from 'react'

const IniciarSesion = () => {

    let [comprobar, setComprobar] = useState(true);

  return (
    <>
        <button href="/" onClick={() => setComprobar(!comprobar)}>{comprobar ? "Iniciar Sesion" : "Cerrar Sesion"}</button>
    </>
  )
}

export default IniciarSesion