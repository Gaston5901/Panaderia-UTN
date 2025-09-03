import React, { useEffect, useState } from "react";
import AdminPanel from "../components/AdminPanel";
import "../App.css";

function Home() {
  const [productos, setProductos] = useState([]);
  const [usuario, setUsuario] = useState(null);

  const cargarProductos = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_PRODUCTOS);
      const data = await res.json();
      setProductos(data);
    } catch {
      setProductos([]);
    }
  };

  useEffect(() => {
    cargarProductos();
    const user = localStorage.getItem('usuario');
    if (user) setUsuario(JSON.parse(user));
  }, []);

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Panadería Delicias UTN</h1>
        <p>¡El mejor pan recién horneado, todos los días!</p>
      </header>
      {usuario?.rol === 'admin' && (
        <AdminPanel onProductoAgregado={cargarProductos} />
      )}
      <section className="productos-lista">
        {productos.map((prod, idx) => (
          <div className="producto-card" key={idx}>
            <img src={prod.imagen} alt={prod.nombre} className="producto-img" />
            <div className="producto-info">
              <h3>{prod.nombre}</h3>
              <p className="producto-precio">{prod.precio}</p>
              <p className="producto-desc">{prod.descripcion}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Home;
