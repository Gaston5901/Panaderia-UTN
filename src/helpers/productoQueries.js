import axios from 'axios';

const API_PRODUCTOS = import.meta.env.VITE_API_PRODUCTOS;

export const getProductos = async () => {
  const res = await axios.get(API_PRODUCTOS);
  return res.data;
};

export const addProducto = async (producto) => {
  const res = await axios.post(API_PRODUCTOS, producto);
  return res.data;
};

export const updateProducto = async (id, producto) => {
  const res = await axios.put(`${API_PRODUCTOS}/${id}`, producto);
  return res.data;
};

export const deleteProducto = async (id) => {
  const res = await axios.delete(`${API_PRODUCTOS}/${id}`);
  return res.data;
};
