import api from './axiosClient'

// AUTH
export const authAPI = {
  signUp: (data: any) => api.post('/auth/signup', data),
  signIn: (data: any) => api.post('/auth/signin', data),
  getMe: () => api.get('/auth/me'),
}

// CATEGORIES
export const categoryAPI = {
  getAll:       ()                  => api.get('/categories'),
  getById:      (id: string | number)        => api.get(`/categories/${id}`),
  create:       (data: any)         => api.post('/categories', data),
  update:       (id: string | number, data: any)  => api.put(`/categories/${id}`, data),
  delete:       (id: string | number)        => api.delete(`/categories/${id}`),
}

// FOOD ITEMS
export const foodAPI = {
  getAll:         ()                  => api.get('/food-items'),
  getAvailable:   ()                  => api.get('/food-items/available'),
  getById:        (id: string | number)        => api.get(`/food-items/${id}`),
  getByCategory:  (catId: string | number)     => api.get(`/food-items/category/${catId}`),
  search:         (name: string)      => api.get(`/food-items/search?name=${name}`),
  create:         (data: any)         => api.post('/food-items', data),
  update:         (id: string | number, data: any)=> api.put(`/food-items/${id}`, data),
  delete:         (id: string | number)        => api.delete(`/food-items/${id}`),
}

// CART
export const cartAPI = {
  getCart:      ()                                      => api.get('/cart'),
  addItem:      (data: any)                             => api.post('/cart/items', data),
  updateItem:   (cartItemId: string | number, quantity: number)  => api.put(`/cart/items/${cartItemId}?quantity=${quantity}`),
  removeItem:   (cartItemId: string | number)                    => api.delete(`/cart/items/${cartItemId}`),
  clearCart:    ()                                      => api.delete('/cart'),
}

// ORDERS  — your backend uses GET /api/orders for both admin (all) and customer (own)
export const orderAPI = {
  placeOrder:     (data: any)               => api.post('/orders', data),
  getOrders:      ()                        => api.get('/orders'),
  getById:        (id: string | number)              => api.get(`/orders/${id}`),
  updateStatus:   (id: string | number, s: string)   => api.put(`/orders/${id}/status?status=${s}`),
  cancelOrder:    (id: string | number)              => api.post(`/orders/${id}/cancel`),
}

// PAYMENTS
export const paymentAPI = {
  getAll:         ()                        => api.get('/payments'),
  getById:        (id: string | number)              => api.get(`/payments/${id}`),
  getByOrderId:   (oid: string | number)             => api.get(`/payments/order/${oid}`),
  process:        (oid: string | number)             => api.post(`/payments/order/${oid}/process`),
}

// USERS
export const userAPI = {
  getMe:    ()                      => api.get('/users/me'),
  getAll:   ()                      => api.get('/users'),
  getById:  (id: string | number)   => api.get(`/users/${id}`),
  delete:   (id: string | number)   => api.delete(`/users/${id}`),
}
