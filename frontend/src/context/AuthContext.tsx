import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authAPI } from '../api/services'
import toast from 'react-hot-toast'

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN';
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  signUp: (data: any) => Promise<User>;
  signIn: (data: any) => Promise<User>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser  = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')

    const bootstrapAuth = async () => {
      if (!savedUser || !savedToken) {
        setLoading(false)
        return
      }

      try {
        const res = await authAPI.getMe()
        const currentUser = res.data.data
        localStorage.setItem('user', JSON.stringify(currentUser))
        setUser(currentUser)
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    bootstrapAuth()
  }, [])

  const signUp = async (data: any) => {
    const res = await authAPI.signUp(data)
    const { token, ...userData } = res.data.data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    toast.success(`Welcome, ${userData.name}!`)
    return userData
  }

  const signIn = async (data: any) => {
    const res = await authAPI.signIn(data)
    const { token, ...userData } = res.data.data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    toast.success(`Welcome back, ${userData.name}!`)
    return userData
  }

  const signOut = () => {
    localStorage.clear()
    setUser(null)
    toast.success('Signed out')
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isLoggedIn: !!user,
      isAdmin: user?.role === 'ADMIN',
      signUp, signIn, signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
