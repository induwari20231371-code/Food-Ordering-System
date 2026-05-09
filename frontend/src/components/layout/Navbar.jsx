import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { FiShoppingCart, FiLogOut, FiUser, FiMenu, FiX } from 'react-icons/fi'
import { useState } from 'react'

export default function Navbar() {
  const { user, isLoggedIn, isAdmin, signOut } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleSignOut = () => { signOut(); navigate('/') }

  return (
    <nav className="bg-orange-500 text-white shadow-lg sticky top-0 z-50">
      <div className="w-full px-3 sm:px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight">🍔 FoodOrder</Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/menu" className="hover:text-orange-100 transition-colors">Menu</Link>

          {isLoggedIn ? (
            <>
              {isAdmin ? (
                <Link to="/admin" className="hover:text-orange-100 transition-colors">Admin Panel</Link>
              ) : (
                <>
                  <Link to="/orders" className="hover:text-orange-100 transition-colors">My Orders</Link>
                  <Link to="/cart" className="relative hover:text-orange-100 transition-colors">
                    <FiShoppingCart size={20} />
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-white text-orange-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                </>
              )}
              <div className="flex items-center gap-2 bg-orange-600 px-3 py-1.5 rounded-full">
                <FiUser size={14} />
                <span>{user?.name}</span>
                <span className="text-orange-200 text-xs">({user?.role})</span>
              </div>
              <button onClick={handleSignOut} className="flex items-center gap-1 bg-white text-orange-500 px-3 py-1.5 rounded-full hover:bg-orange-50 transition-colors">
                <FiLogOut size={14} /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-orange-100 transition-colors">Login</Link>
              <Link to="/register" className="bg-white text-orange-500 px-4 py-1.5 rounded-full hover:bg-orange-50 transition-colors">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-orange-600 px-4 pb-4 flex flex-col gap-3 text-sm font-medium">
          <Link to="/menu" onClick={() => setOpen(false)}>Menu</Link>
          {isLoggedIn ? (
            <>
              {!isAdmin && <Link to="/cart" onClick={() => setOpen(false)}>Cart ({itemCount})</Link>}
              {!isAdmin && <Link to="/orders" onClick={() => setOpen(false)}>My Orders</Link>}
              {isAdmin  && <Link to="/admin" onClick={() => setOpen(false)}>Admin Panel</Link>}
              <button onClick={handleSignOut} className="text-left">Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login"    onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
