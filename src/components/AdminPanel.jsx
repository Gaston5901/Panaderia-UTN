
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

const AdminPanel = () => {
  const [productos, setProductos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ nombre: "", precio: "", descripcion: "", imagen: "" });
  const [mensaje, setMensaje] = useState("");
  const [pedidos, setPedidos] = useState([]);
  // Usuarios
  const [usuarios, setUsuarios] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [userForm, setUserForm] = useState({ username: "", password: "", rol: "usuario" });
  // Mostrar/ocultar contraseña
  const [showPass, setShowPass] = useState(false);

  const cargarProductos = async () => {
    const res = await axios.get("http://localhost:3001/productos");
    setProductos(res.data);
  };
  const cargarPedidos = async () => {
    try {
      const res = await axios.get("http://localhost:3001/pedidos");
      setPedidos(res.data);
    } catch { setPedidos([]); }
  };
  const cargarUsuarios = async () => {
    try {
      const res = await axios.get("http://localhost:3001/usuarios");
      setUsuarios(res.data);
    } catch { setUsuarios([]); }
  };
  useEffect(() => { cargarProductos(); cargarPedidos(); cargarUsuarios(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleUserChange = e => setUserForm({ ...userForm, [e.target.name]: e.target.value });

  const handleAgregar = async e => {
    e.preventDefault();
    if (!form.nombre || !form.precio || !form.descripcion || !form.imagen) {
      setMensaje("Completa todos los campos"); return;
    }
    await axios.post("http://localhost:3001/productos", form);
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
    if (!form.nombre || !form.precio || !form.descripcion || !form.imagen) {
      setMensaje("Completa todos los campos para guardar");
      return;
    }
    try {
      await axios.put(`http://localhost:3001/productos/${editId}`, form);
      setMensaje("Producto editado correctamente");
      setEditId(null);
      setForm({ nombre: "", precio: "", descripcion: "", imagen: "" });
      cargarProductos();
    } catch (err) {
      setMensaje("Error al guardar cambios. Verifica los datos y el servidor.");
    }
  };
  const handleEliminar = async id => {
    await axios.delete(`http://localhost:3001/productos/${id}`);
    setMensaje("Producto eliminado");
    cargarProductos();
  };

  // USUARIOS
  const handleUserEdit = user => {
    setEditUserId(user.id);
    setUserForm({ username: user.username, password: user.password, rol: user.rol });
  };
  const handleUserSave = async e => {
    e.preventDefault();
    if (!userForm.username || !userForm.password || !userForm.rol) {
      setMensaje("Completa todos los campos de usuario");
      return;
    }
    try {
      await axios.put(`http://localhost:3001/usuarios/${editUserId}`, userForm);
      setMensaje("Usuario editado correctamente");
      setEditUserId(null);
      setUserForm({ username: "", password: "", rol: "usuario" });
      cargarUsuarios();
    } catch (err) {
      setMensaje("Error al guardar usuario. Verifica los datos y el servidor.");
    }
  };
  const handleUserDelete = async id => {
    await axios.delete(`http://localhost:3001/usuarios/${id}`);
    cargarUsuarios();
  };
  const handleUserAdd = async e => {
    e.preventDefault();
    if (!userForm.username || !userForm.password || !userForm.rol) {
      setMensaje("Completa todos los campos de usuario");
      return;
    }
    try {
      await axios.post("http://localhost:3001/usuarios", userForm);
      setMensaje("Usuario agregado correctamente");
      setUserForm({ username: "", password: "", rol: "usuario" });
      cargarUsuarios();
    } catch (err) {
      setMensaje("Error al agregar usuario. Verifica los datos y el servidor.");
    }
  };

  return (
    <div className="admin-panel">
      <h2>Panel Administrativo</h2>
      {/* Productos */}
      <form className="admin-form" onSubmit={editId ? handleGuardar : handleAgregar}>
        <input name="nombre" placeholder="Nombre del producto" value={form.nombre} onChange={handleChange} />
        <input name="precio" placeholder="Precio (poner $)" value={form.precio} onChange={handleChange} />
        <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} />
        <input name="imagen" placeholder="URL de la imagen" value={form.imagen} onChange={handleChange} />
        <button type="submit">{editId ? "Guardar cambios" : "Agregar producto"}</button>
        {editId && <button type="button" onClick={()=>{setEditId(null);setForm({nombre:"",precio:"",descripcion:"",imagen:""});}}>Cancelar</button>}
      </form>
  {mensaje && <div className="admin-msg" style={{marginTop:10, color: mensaje.includes('Error') ? '#d32f2f' : '#388e3c'}}>{mensaje}</div>}
      <h3 style={{marginTop:30}}>Productos</h3>
      <div className="productos-lista">
        {productos.map(prod => (
          <div className="producto-card" key={prod.id}>
            <img src={prod.imagen} alt={prod.nombre} className="producto-img" />
            <div className="producto-info">
              <h3>{prod.nombre}</h3>
              <p className="producto-precio">{ prod.precio}</p>
              <p className="producto-desc">{prod.descripcion}</p>
              <button onClick={()=>handleEditar(prod)} style={{marginRight:8}}>Editar</button>
              <button onClick={()=>handleEliminar(prod.id)} style={{background:'#d32f2f',color:'#fff'}}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
      {/* Usuarios */}
      <h3 style={{marginTop:40}}>Usuarios</h3>
      <form className="admin-form" onSubmit={editUserId ? handleUserSave : handleUserAdd}>
        <input name="username" placeholder="Usuario" value={userForm.username} onChange={handleUserChange} />
        <div style={{position:'relative',width:'100%'}}>
          <input name="password" placeholder="Contraseña" value={userForm.password} onChange={handleUserChange} type={showPass ? "text" : "password"} style={{width:'100%'}} />
          <button type="button" style={{position:'absolute',right:8,top:8,fontSize:12}} onClick={()=>setShowPass(v=>!v)} tabIndex={-1}>
            {showPass ? "Ocultar" : "Ver"}
          </button>
        </div>
        <select name="rol" value={userForm.rol} onChange={handleUserChange}>
          <option value="usuario">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
        <button type="submit">{editUserId ? "Guardar usuario" : "Agregar usuario"}</button>
        {editUserId && <button type="button" onClick={()=>{setEditUserId(null);setUserForm({username:"",password:"",rol:"usuario"});}}>Cancelar</button>}
      </form>
      <div style={{marginTop:10,background:'#fff',borderRadius:8,padding:10,maxHeight:200,overflowY:'auto'}}>
        {usuarios.length === 0 && <p>No hay usuarios.</p>}
        {usuarios.map(u => (
          <div key={u.id} style={{borderBottom:'1px solid #eee',marginBottom:6,paddingBottom:4,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span><b>{u.username}</b> ({u.rol})</span>
            <span>
              <button onClick={()=>handleUserEdit(u)} style={{marginRight:8}}>Editar</button>
              <button onClick={()=>handleUserDelete(u.id)} style={{background:'#d32f2f',color:'#fff'}}>Eliminar</button>
            </span>
          </div>
        ))}
      </div>
      {/* Contabilidad */}
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
