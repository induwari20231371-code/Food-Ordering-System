import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function HomePage() {
  const { isLoggedIn, isAdmin } = useAuth()

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-24 px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">Delicious Food,<br/>Delivered Fast 🍕</h1>
        <p className="text-orange-100 text-lg mb-10 max-w-xl mx-auto">
          Order from your favourite restaurants. Fresh, hot, and delivered right to your door.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/menu"
            className="bg-white text-orange-500 font-bold px-8 py-3 rounded-full text-lg hover:bg-orange-50 transition-colors shadow-lg"
          >
            Browse Menu
          </Link>
          {!isLoggedIn && (
            <Link
              to="/register"
              className="border-2 border-white text-white font-bold px-8 py-3 rounded-full text-lg hover:bg-orange-600 transition-colors"
            >
              Sign Up Free
            </Link>
          )}
          {isLoggedIn && !isAdmin && (
            <Link
              to="/orders"
              className="border-2 border-white text-white font-bold px-8 py-3 rounded-full text-lg hover:bg-orange-600 transition-colors"
            >
              My Orders
            </Link>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {[
          { icon: '🍔', title: 'Wide Selection', desc: 'Browse hundreds of food items across multiple categories.' },
          { icon: '⚡', title: 'Fast Delivery',  desc: 'We prepare your order quickly and deliver it hot to your door.' },
          { icon: '🔒', title: 'Secure Payment', desc: 'Multiple payment methods with secure JWT-protected transactions.' },
        ].map(f => (
          <div key={f.title} className="bg-white rounded-2xl shadow-md p-8">
            <div className="text-5xl mb-4">{f.icon}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{f.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
