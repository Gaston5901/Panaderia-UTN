import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onBack }) => {
  const [isSignUp, setIsSignUp] = useState(true); // true: registro, false: login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (isSignUp) {
      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
      }
      try {
        const res = await axios.get(`http://localhost:3001/usuarios?username=${email}`);
        if (res.data.length > 0) {
          setError("El usuario ya existe");
          return;
        }
        await axios.post('http://localhost:3001/usuarios', { username: email, password, rol: 'usuario' });
        alert('Usuario registrado correctamente');
        setIsSignUp(false);
        setEmail(""); setPassword(""); setConfirmPassword("");
      } catch (err) {
        setError("Error al conectar con la base de datos");
      }
    } else {
      try {
        const response = await axios.get(`http://localhost:3001/usuarios?username=${email}&password=${password}`);
        if (response.data.length > 0) {
          localStorage.setItem('usuario', JSON.stringify(response.data[0]));
          alert(`Bienvenido, ${email}!`);
          window.location.reload();
        } else {
          setError("Correo o contraseña incorrectos");
        }
      } catch (err) {
        setError("Error al conectar con la base de datos");
      }
    }
  };

  return (
    <div className="login-box">
      <h2 style={{ fontWeight: 400, marginBottom: 24 }}>
        {isSignUp ? 'Bienvenido a TU PANADERÍA' : 'Iniciar sesión en TU PANADERÍA'}
      </h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuario"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {isSignUp && (
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        )}
        <button className="login-btn-full" type="submit">
          {isSignUp ? 'Registrarse' : 'Iniciar sesión'}
        </button>
      </form>
      {error && <div className="login-error">{error}</div>}
      <div className="login-switch">
        {isSignUp ? (
          <>
            ¿Ya tienes una cuenta?{' '}
            <span className="login-link" onClick={() => { setIsSignUp(false); setError(""); }}>
              Iniciar sesión
            </span>
          </>
        ) : (
          <>
            ¿No tienes una cuenta?{' '}
            <span className="login-link" onClick={() => { setIsSignUp(true); setError(""); }}>
              Registrarse
            </span>
          </>
        )}
      </div>
      {onBack && (
        <button type="button" className="login-back-btn" onClick={onBack}>
          Volver
        </button>
      )}
    </div>
  );
};

export default Login;