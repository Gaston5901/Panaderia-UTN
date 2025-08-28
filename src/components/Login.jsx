import React, { useState } from 'react';

const Login = () => {
  // Estados para el nombre de usuario y la contraseña
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Función para manejar el envío del formulario
  const handleSubmit = (event) => {
    // Previene el comportamiento por defecto del formulario (recargar la página)
    event.preventDefault();

    // Aquí puedes agregar la lógica para enviar los datos a un servidor
    console.log('Usuario:', username);
    console.log('Contraseña:', password);

    // Por ahora, solo mostramos los datos en la consola
    alert(`Iniciando sesión con usuario: ${username}`);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Nombre de usuario:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>
            Contraseña:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <div style={{ marginTop: '20px' }}>
          <button type="submit">Entrar</button>
        </div>
      </form>
    </div>
  );
};

export default Login;