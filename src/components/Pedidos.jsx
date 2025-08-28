
import React, { useEffect, useState } from "react";
import axios from "axios";

const Pedidos = () => {
  const [productos, setProductos] = useState([]);
  const [pedido, setPedido] = useState({ producto: "", cantidad: 1 });
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    axios.get("http://localhost:3001/productos")
      .then(res => setProductos(res.data));
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
    setCargando(true);
    try {
      await axios.post("http://localhost:3001/pedidos", {
        nombre: usuario.username,
        producto: pedido.producto,
        cantidad: pedido.cantidad,
        fecha: new Date().toLocaleString()
      });
      setMensaje("¡Pedido realizado!");
      setPedido({ producto: "", cantidad: 1 });
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setMensaje("No se pudo realizar el pedido porque el sistema no está conectado. (Colección 'pedidos' no encontrada)");
      } else {
        setMensaje("Error al realizar el pedido. Intenta de nuevo o contacta al administrador.");
      }
    }
  setTimeout(() => setMensaje("") , 3000);
    setCargando(false);
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
        <button type="submit" disabled={cargando} style={{position:'relative'}}>
          {cargando ? (
            <span style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span className="spinner" style={{width:18,height:18,border:'2px solid #ccc',borderTop:'2px solid #388e3c',borderRadius:'50%',display:'inline-block',marginRight:8,animation:'spin 1s linear infinite'}}></span>
              Enviando...
            </span>
          ) : "Encargar"}
        </button>
      </form>
      {mensaje && <div style={{marginTop:10,color: mensaje.includes('Error') ? '#d32f2f' : '#388e3c'}}>{mensaje}</div>}
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }
      `}</style>
    </div>
  );
};

export default Pedidos;
