import React, { useState } from 'react';
import axios from 'axios';

const Login = (props) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const datos = new FormData();
    datos.append('username', formData.username);
    datos.append('password', formData.password);

    const respuesta = await axios.post('http://localhost/TFG_DAW/backend/controlador/controlador.php?action=iniciarSesion', datos,
        {
            headers: { 'Content-Type': 'multipart/form-data' },
        }
    );
    console.log(respuesta.data);
    if (respuesta.data.nombre != null) {
        console.log("PUTA")
        console.log(respuesta.data);
        props.verificar(true);
        props.dates(respuesta.data);
    }else{
        props.error();
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" name="username" value={formData.username} onChange={handleChange} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" name="password" value={formData.password} onChange={handleChange} />
      </label>
      <br />
      <button type="submit" className='cursor-pointer'>Iniciar sesión</button>
    </form>
  );
};

export default Login;