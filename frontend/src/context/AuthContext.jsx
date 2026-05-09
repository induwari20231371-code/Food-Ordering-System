import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api/services'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser  = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')
    if (savedUser && savedToken) setUser(JSON.parse(savedUser))
    setLoading(false)
  }, [])

  const signUp = async (data) => {
    const res = await authAPI.signUp(data)
    const { token, ...userData } = res.data.data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    toast.success(`Welcome, ${userData.name}!`)
    return userData
  }

  const signIn = async (data) => {
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

export const useAuth = () => useContext(AuthContext)
