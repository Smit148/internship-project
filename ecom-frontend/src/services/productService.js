import axiosInstance from '../utils/axiosInstance';

export const getAllProducts   = (params) => axiosInstance.get('/products', { params });
export const getProductById  = (id)     => axiosInstance.get(`/products/${id}`);
export const createProduct   = (data)   => axiosInstance.post('/admin/products', data);
export const updateProduct   = (id, data) => axiosInstance.put(`/admin/products/${id}`, data);
export const deleteProduct   = (id)     => axiosInstance.delete(`/admin/products/${id}`);
