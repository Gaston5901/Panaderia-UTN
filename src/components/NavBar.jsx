import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">Panadería Delicias UTN</div>
      <div className="navbar-links">
        <Link className="navbar-link" to="/">Inicio</Link>
        {!usuario && <Link className="navbar-link" to="/login">Login</Link>}
        {usuario?.rol === "admin" && <Link className="navbar-link" to="/admin">Panel Admin</Link>}
        {usuario?.rol === "usuario" && <Link className="navbar-link" to="/pedidos">Encargar</Link>}
        {usuario && (
          <span className="navbar-link" onClick={handleLogout} style={{color:'#d32f2f'}}>Cerrar sesión</span>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
