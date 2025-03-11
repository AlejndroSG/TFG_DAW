import React, { useState } from 'react';
import axios from 'axios';

const Login = (props) => {
  let [respuesta, setRespuesta] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const datos = new FormData();
    datos.append('username', formData.username);
    datos.append('password', formData.password);

    respuesta = await axios.post('http://localhost/TFG_DAW/backend/controlador/controlador.php?action=iniciarSesion', datos,
        {
            headers: { 'Content-Type': 'multipart/form-data' },
        }
    );
    setRespuesta(respuesta.data);
    console.log(respuesta.data)
    if (respuesta.data.nombre != null) {
        // console.log(respuesta.data);
        props.verificar(true);
        props.dates(respuesta.data);
    }else{
        props.error("Usuario o contraseña incorrectos");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" name="username" className='ml-2' value={formData.username} onChange={handleChange} />
      </label>
      <label className='mx-5'>
        Password:
        <input type="password" name="password" className='ml-2' value={formData.password} onChange={handleChange} />
      </label>
      <button type="submit" className='cursor-pointer bg-amber-300 border-2 p-3'>Iniciar sesión</button>
    </form>
  );
};

export default Login;