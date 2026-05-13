import React, { ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

import Navbar      from './components/layout/Navbar'
import Footer     from './components/layout/Footer'
import HomePage    from './pages/HomePage'
import LoginPage   from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MenuPage    from './pages/MenuPage'
import CartPage    from './pages/CartPage'
import OrdersPage  from './pages/OrdersPage'
import AdminPage   from './pages/AdminPage'

// Protect routes that need login
function PrivateRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>
  return isLoggedIn ? children : <Navigate to="/login" />
}

// Protect routes that need ADMIN role
function AdminRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn, isAdmin, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>
  if (!isLoggedIn) return <Navigate to="/login" />
  if (!isAdmin)    return <Navigate to="/" />
  return children
}

function AppRoutes() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/"         element={<HomePage />} />
          <Route path="/menu"     element={<MenuPage />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/cart" element={
            <PrivateRoute><CartPage /></PrivateRoute>
          } />
          <Route path="/orders" element={
            <PrivateRoute><OrdersPage /></PrivateRoute>
          } />
          <Route path="/admin" element={
            <AdminRoute><AdminPage /></AdminRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
