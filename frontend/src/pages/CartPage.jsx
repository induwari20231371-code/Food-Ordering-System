import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { orderAPI } from '../api/services'
import { useNavigate, Link } from 'react-router-dom'
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { cart, updateItem, removeItem, clearCart, totalAmount, fetchCart } = useCart()
  const navigate = useNavigate()
  const deliveryFee = 200
  const [address,  setAddress]  = useState('')
  const [notes,    setNotes]    = useState('')
  const [method,   setMethod]   = useState('CASH_ON_DELIVERY')
  const [placing,  setPlacing]  = useState(false)

  const items = cart?.cartItems ?? []

  // Ensure cart is synced when this page mounts
  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const handlePlaceOrder = async () => {
    if (!address.trim()) { toast.error('Please enter a delivery address'); return }
    setPlacing(true)
    try {
      await orderAPI.placeOrder({ deliveryAddress: address, specialInstructions: notes, paymentMethod: method })
      clearCart()
      toast.success('Order placed! 🎉')
      navigate('/orders')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  if (items.length === 0) return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center gap-4">
      <div className="text-8xl">🛒</div>
      <h2 className="text-2xl font-bold text-gray-700">Your cart is empty</h2>
      <Link to="/menu" className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 transition-colors">
        Browse Menu
      </Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-orange-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">🛒 Your Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Items */}
          <div className="flex-1 space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
                <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">🍽️</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">{item.foodItem?.name}</h3>
                  <p className="text-orange-500 font-bold text-sm">LKR {parseFloat(item.foodItem?.price ?? 0).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => item.quantity > 1 ? updateItem(item.id, item.quantity - 1) : removeItem(item.id)}
                    className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-200">
                    <FiMinus size={12} />
                  </button>
                  <span className="w-6 text-center font-semibold">{item.quantity}</span>
                  <button onClick={() => updateItem(item.id, item.quantity + 1)}
                    className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-200">
                    <FiPlus size={12} />
                  </button>
                </div>
                <span className="font-bold text-gray-700 w-28 text-right text-sm">
                  LKR {(parseFloat(item.foodItem?.price ?? 0) * item.quantity).toFixed(2)}
                </span>
                <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600">
                  <FiTrash2 size={18} />
                </button>
              </div>
            ))}
            <button onClick={() => {
              if (window.confirm('Are you sure you want to clear your entire cart?')) {
                clearCart()
              }
            }} className="text-sm text-red-400 hover:text-red-600 flex items-center gap-1">
              <FiTrash2 size={14} /> Clear cart
            </button>
          </div>

          {/* Summary */}
          <div className="w-full lg:w-80">
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4 sticky top-20">
              <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
              <div className="flex justify-between text-gray-600 text-sm"><span>Subtotal</span><span>LKR {parseFloat(totalAmount).toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-600 text-sm"><span>Delivery</span><span className="text-orange-500 font-medium">LKR {deliveryFee.toFixed(2)}</span></div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span><span className="text-orange-500">LKR {(parseFloat(totalAmount) + deliveryFee).toFixed(2)}</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
                <textarea value={address} onChange={e => setAddress(e.target.value)} rows={2}
                  placeholder="Enter your full address"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select value={method} onChange={e => setMethod(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                  <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
                  <option value="CARD">Card</option>
                  <option value="UPI">Digital Wallet</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                <input value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. No onions please"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>

              <button onClick={handlePlaceOrder} disabled={placing}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                <FiShoppingBag /> {placing ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
