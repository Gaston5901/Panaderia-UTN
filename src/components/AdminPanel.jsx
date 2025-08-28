import React, { useEffect, useState } from "react";
import "../App.css";

const AdminPanel = () => {
  const [productos, setProductos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ nombre: "", precio: "", descripcion: "", imagen: "" });
  const [mensaje, setMensaje] = useState("");
  const [pedidos, setPedidos] = useState([]);

  const cargarProductos = async () => {
    const res = await fetch("http://localhost:3001/productos");
    setProductos(await res.json());
  };
  const cargarPedidos = async () => {
    try {
      const res = await fetch("http://localhost:3001/pedidos");
      setPedidos(await res.json());
    } catch { setPedidos([]); }
  };
  useEffect(() => { cargarProductos(); cargarPedidos(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAgregar = async e => {
    e.preventDefault();
    if (!form.nombre || !form.precio || !form.descripcion || !form.imagen) {
      setMensaje("Completa todos los campos"); return;
    }
    await fetch("http://localhost:3001/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setMensaje("Producto agregado");
    setForm({ nombre: "", precio: "", descripcion: "", imagen: "" });
    cargarProductos();
  };

  const handleEditar = prod => {
    setEditId(prod.id);
    setForm({ nombre: prod.nombre, precio: prod.precio, descripcion: prod.descripcion, imagen: prod.imagen });
  };
  const handleGuardar = async e => {
    e.preventDefault();
    await fetch(`http://localhost:3001/productos/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setMensaje("Producto editado");
    setEditId(null);
    setForm({ nombre: "", precio: "", descripcion: "", imagen: "" });
    cargarProductos();
  };
  const handleEliminar = async id => {
    await fetch(`http://localhost:3001/productos/${id}`, { method: "DELETE" });
    setMensaje("Producto eliminado");
    cargarProductos();
  };

  return (
    <div className="admin-panel">
      <h2>Panel Administrativo</h2>
      <form className="admin-form" onSubmit={editId ? handleGuardar : handleAgregar}>
        <input name="nombre" placeholder="Nombre del producto" value={form.nombre} onChange={handleChange} />
        <input name="precio" placeholder="Precio" value={form.precio} onChange={handleChange} />
        <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} />
        <input name="imagen" placeholder="URL de la imagen" value={form.imagen} onChange={handleChange} />
        <button type="submit">{editId ? "Guardar cambios" : "Agregar producto"}</button>
        {editId && <button type="button" onClick={()=>{setEditId(null);setForm({nombre:"",precio:"",descripcion:"",imagen:""});}}>Cancelar</button>}
      </form>
      {mensaje && <div className="admin-msg">{mensaje}</div>}
      <h3 style={{marginTop:30}}>Productos</h3>
      <div className="productos-lista">
        {productos.map(prod => (
          <div className="producto-card" key={prod.id}>
            <img src={prod.imagen} alt={prod.nombre} className="producto-img" />
            <div className="producto-info">
              <h3>{prod.nombre}</h3>
              <p className="producto-precio">{prod.precio}</p>
              <p className="producto-desc">{prod.descripcion}</p>
              <button onClick={()=>handleEditar(prod)} style={{marginRight:8}}>Editar</button>
              <button onClick={()=>handleEliminar(prod.id)} style={{background:'#d32f2f',color:'#fff'}}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
      <h3 style={{marginTop:40}}>Contabilidad (Pedidos)</h3>
      <div style={{maxHeight:200,overflowY:'auto',background:'#fff',borderRadius:8,padding:10}}>
        {pedidos.length === 0 && <p>No hay pedidos aún.</p>}
        {pedidos.map(p => (
          <div key={p.id} style={{borderBottom:'1px solid #eee',marginBottom:6,paddingBottom:4}}>
            <b>{p.nombre}</b> pidió <b>{p.producto}</b> x{p.cantidad} - <span>{p.fecha}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
