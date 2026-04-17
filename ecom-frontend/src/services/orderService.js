import axiosInstance from '../utils/axiosInstance';

export const getOrders   = ()      => axiosInstance.get('/orders');
export const placeOrder  = (data)  => axiosInstance.post('/orders', data);
export const getAllOrders = ()      => axiosInstance.get('/admin/orders');
export const updateOrderStatus = (id, status) =>
  axiosInstance.put(`/admin/orders/${id}/status`, { status });
