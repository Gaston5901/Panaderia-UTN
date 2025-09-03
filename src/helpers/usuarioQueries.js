import axios from 'axios';

const API_USUARIOS = import.meta.env.VITE_API_USUARIOS;

export const getUsuarios = async () => {
  const res = await axios.get(API_USUARIOS);
  return res.data;
};

export const addUsuario = async (usuario) => {
  const res = await axios.post(API_USUARIOS, usuario);
  return res.data;
};

export const updateUsuario = async (id, usuario) => {
  const res = await axios.put(`${API_USUARIOS}/${id}`, usuario);
  return res.data;
};

export const deleteUsuario = async (id) => {
  const res = await axios.delete(`${API_USUARIOS}/${id}`);
  return res.data;
};
