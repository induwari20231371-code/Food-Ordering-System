import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { cartAPI } from '../api/services'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { isLoggedIn, isAdmin } = useAuth()
  const [cart, setCart]         = useState(null)
  const [loading, setLoading]   = useState(false)

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn || isAdmin) return
    try {
      setLoading(true)
      const res = await cartAPI.getCart()
      setCart(res.data.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [isLoggedIn, isAdmin])

  useEffect(() => { fetchCart() }, [fetchCart])

  const addItem = async (foodItemId, quantity = 1) => {
    try {
      const res = await cartAPI.addItem({ foodItemId, quantity })
      setCart(res.data.data)
      toast.success('Added to cart!')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to add item')
    }
  }

  const updateItem = async (cartItemId, quantity) => {
    try {
      const res = await cartAPI.updateItem(cartItemId, quantity)
      setCart(res.data.data)
    } catch (e) {
      toast.error('Failed to update')
    }
  }

  const removeItem = async (cartItemId) => {
    try {
      const res = await cartAPI.removeItem(cartItemId)
      setCart(res.data.data)
      toast.success('Item removed')
    } catch (e) {
      toast.error('Failed to remove')
    }
  }

  const clearCart = async () => {
    try {
      const res = await cartAPI.clearCart()
      setCart(res.data.data)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      fetchCart,
      addItem,
      updateItem,
      removeItem,
      clearCart,
      itemCount:   cart?.cartItems?.length ?? 0,
      totalAmount: cart?.totalAmount ?? 0,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
