import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { cartAPI } from '../api/services'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

export interface CartItem {
  id: string;
  quantity: number;
  foodItem: {
    id: string;
    name: string;
    price: number;
  };
  subtotal: number;
}

export interface Cart {
  id: string;
  userId: string;
  cartItems: CartItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (foodItemId: string, quantity?: number) => Promise<void>;
  updateItem: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn, isAdmin } = useAuth()
  const [cart, setCart]         = useState<Cart | null>(null)
  const [loading, setLoading]   = useState(false)

  // Normalize backend cart response to frontend shape
  const normalizeCart = (serverCart: any): Cart | null => {
    if (!serverCart) return null
    const normalizedItems: CartItem[] = (serverCart.items || []).map((i: any) => ({
      id: i.id,
      quantity: i.quantity,
      foodItem: {
        id: i.foodItemId,
        name: i.foodItemName,
        price: i.unitPrice,
      },
      subtotal: i.subtotal,
    }))

    return {
      id: serverCart.id,
      userId: serverCart.userId,
      cartItems: normalizedItems,
      totalAmount: serverCart.totalAmount,
      createdAt: serverCart.createdAt,
      updatedAt: serverCart.updatedAt,
    }
  }

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn || isAdmin) return
    try {
      setLoading(true)
      const res = await cartAPI.getCart()
      setCart(normalizeCart(res.data.data))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [isLoggedIn, isAdmin])

  useEffect(() => { fetchCart() }, [fetchCart])

  const addItem = async (foodItemId: string, quantity = 1) => {
    try {
      const res = await cartAPI.addItem({ foodItemId, quantity })
      setCart(normalizeCart(res.data.data))
      toast.success('Added to cart!')
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to add item')
    }
  }

  const updateItem = async (cartItemId: string, quantity: number) => {
    try {
      const res = await cartAPI.updateItem(cartItemId, quantity)
      setCart(normalizeCart(res.data.data))
    } catch (e) {
      toast.error('Failed to update')
    }
  }

  const removeItem = async (cartItemId: string) => {
    try {
      const res = await cartAPI.removeItem(cartItemId)
      setCart(normalizeCart(res.data.data))
      toast.success('Item removed')
    } catch (e) {
      toast.error('Failed to remove')
    }
  }

  const clearCart = async () => {
    try {
      const res = await cartAPI.clearCart()
      setCart(normalizeCart(res.data.data))
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

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
