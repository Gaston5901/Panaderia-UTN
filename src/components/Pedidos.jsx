import React, { useEffect, useState } from "react";

const Pedidos = () => {
  const [productos, setProductos] = useState([]);
  const [pedido, setPedido] = useState({ producto: "", cantidad: 1 });
  const [mensaje, setMensaje] = useState("");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    fetch("http://localhost:3001/productos")
      .then(res => res.json())
      .then(setProductos);
  }, []);

  const handleChange = e => {
    setPedido({ ...pedido, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!pedido.producto || !pedido.cantidad) {
      setMensaje("Selecciona producto y cantidad");
      return;
    }
    await fetch("http://localhost:3001/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: usuario.username,
        producto: pedido.producto,
        cantidad: pedido.cantidad,
        fecha: new Date().toLocaleString()
      })
    });
    setMensaje("¡Pedido realizado!");
    setPedido({ producto: "", cantidad: 1 });
  };

  return (
    <div style={{maxWidth:400,margin:"40px auto",background:"#fffbe7",padding:24,borderRadius:16}}>
      <h2>Realizar pedido</h2>
      <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:12}}>
        <select name="producto" value={pedido.producto} onChange={handleChange} required>
          <option value="">Selecciona un producto</option>
          {productos.map(p => (
            <option key={p.id} value={p.nombre}>{p.nombre}</option>
          ))}
        </select>
        <input type="number" name="cantidad" min="1" value={pedido.cantidad} onChange={handleChange} required placeholder="Cantidad" />
        <button type="submit">Encargar</button>
      </form>
      {mensaje && <div style={{marginTop:10,color:'#388e3c'}}>{mensaje}</div>}
    </div>
  );
};

export default Pedidos;
