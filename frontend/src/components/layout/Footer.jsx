import { Link } from 'react-router-dom'
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img src="/images/quickbite-logo.png" alt="Quick Bite" className="h-8 w-8 object-contain" />
              <h2 className="text-white text-2xl font-bold">Quick Bite</h2>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Fresh food delivered fast. Order your favourite meals from the comfort of your home.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/"        className="hover:text-orange-400 transition-colors">Home</Link></li>
              <li><Link to="/menu"    className="hover:text-orange-400 transition-colors">Menu</Link></li>
              <li><Link to="/login"   className="hover:text-orange-400 transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-orange-400 transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          {/* Customer */}
          <div>
            <h3 className="text-white font-semibold mb-4">My Account</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/orders" className="hover:text-orange-400 transition-colors">My Orders</Link></li>
              <li><Link to="/cart"   className="hover:text-orange-400 transition-colors">My Cart</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <FiMapPin size={14} className="text-orange-400 flex-shrink-0" />
                <span className="text-gray-400">123 Food Street, Colombo, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-2">
                <FiPhone size={14} className="text-orange-400 flex-shrink-0" />
                <span className="text-gray-400">+94 77 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <FiMail size={14} className="text-orange-400 flex-shrink-0" />
                <span className="text-gray-400">info@foodorder.lk</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>© 2024 Quick Bite. All rights reserved.</p>
          <p>CMJD Assignment — Batch 112/113 | IJSE</p>
        </div>
      </div>
    </footer>
  )
}
