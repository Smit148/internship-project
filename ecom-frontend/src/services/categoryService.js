import axiosInstance from '../utils/axiosInstance';

export const getAllCategories  = ()         => axiosInstance.get('/categories');
export const getCategoryById   = (id)       => axiosInstance.get(`/categories/${id}`);
export const createCategory    = (data)     => axiosInstance.post('/admin/categories', data);
export const updateCategory    = (id, data) => axiosInstance.put(`/admin/categories/${id}`, data);
export const deleteCategory    = (id)       => axiosInstance.delete(`/admin/categories/${id}`);
