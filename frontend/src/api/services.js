import api from './axiosClient'

// AUTH
export const authAPI = {
  signUp: (data) => api.post('/auth/signup', data),
  signIn: (data) => api.post('/auth/signin', data),
}

// CATEGORIES
export const categoryAPI = {
  getAll:       ()          => api.get('/categories'),
  getById:      (id)        => api.get(`/categories/${id}`),
  create:       (data)      => api.post('/categories', data),
  update:       (id, data)  => api.put(`/categories/${id}`, data),
  delete:       (id)        => api.delete(`/categories/${id}`),
}

// FOOD ITEMS
export const foodAPI = {
  getAll:         ()        => api.get('/food-items'),
  getAvailable:   ()        => api.get('/food-items/available'),
  getById:        (id)      => api.get(`/food-items/${id}`),
  getByCategory:  (catId)   => api.get(`/food-items/category/${catId}`),
  search:         (name)    => api.get(`/food-items/search?name=${name}`),
  create:         (data)    => api.post('/food-items', data),
  update:         (id, data)=> api.put(`/food-items/${id}`, data),
  delete:         (id)      => api.delete(`/food-items/${id}`),
}

// CART
export const cartAPI = {
  getCart:      ()                        => api.get('/cart'),
  addItem:      (data)                    => api.post('/cart/items', data),
  updateItem:   (cartItemId, quantity)    => api.put(`/cart/items/${cartItemId}?quantity=${quantity}`),
  removeItem:   (cartItemId)              => api.delete(`/cart/items/${cartItemId}`),
  clearCart:    ()                        => api.delete('/cart'),
}

// ORDERS  — your backend uses GET /api/orders for both admin (all) and customer (own)
export const orderAPI = {
  placeOrder:     (data)    => api.post('/orders', data),
  getOrders:      ()        => api.get('/orders'),
  getById:        (id)      => api.get(`/orders/${id}`),
  updateStatus:   (id, s)   => api.put(`/orders/${id}/status?status=${s}`),
  cancelOrder:    (id)      => api.post(`/orders/${id}/cancel`),
}

// PAYMENTS
export const paymentAPI = {
  getAll:         ()        => api.get('/payments'),
  getById:        (id)      => api.get(`/payments/${id}`),
  getByOrderId:   (oid)     => api.get(`/payments/order/${oid}`),
  process:        (oid)     => api.post(`/payments/order/${oid}/process`),
}

// USERS
export const userAPI = {
  getMe:    ()    => api.get('/users/me'),
  getAll:   ()    => api.get('/users'),
  getById:  (id)  => api.get(`/users/${id}`),
  delete:   (id)  => api.delete(`/users/${id}`),
}
