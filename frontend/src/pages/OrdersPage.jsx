import { useState, useEffect } from 'react'
import { orderAPI, paymentAPI } from '../api/services'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  PLACED:     'bg-blue-100 text-blue-700',
  PREPARING:  'bg-yellow-100 text-yellow-700',
  DELIVERED:  'bg-green-100 text-green-700',
  CANCELLED:  'bg-red-100 text-red-500',
}

const PAYMENT_COLORS = {
  PENDING:   'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-green-100 text-green-700',
  FAILED:    'bg-red-100 text-red-500',
}

export default function OrdersPage() {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getOrders()
      setOrders(res.data.data)
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const handleCancel = async (orderId) => {
    const confirmed = window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')
    if (!confirmed) return

    try {
      await orderAPI.cancelOrder(orderId)
      toast.success('Order cancelled')
      fetchOrders()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel order')
    }
  }

  const handlePayNow = async (orderId) => {
    try {
      await paymentAPI.process(orderId)
      toast.success('Payment successful! ✅')
      fetchOrders()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed')
    }
  }

  if (loading) return <div className="min-h-screen bg-orange-50 flex items-center justify-center text-gray-400 text-lg">Loading orders...</div>

  if (orders.length === 0) return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center gap-4">
      <div className="text-7xl">📦</div>
      <h2 className="text-2xl font-bold text-gray-700">No orders yet</h2>
      <a href="/menu" className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 transition-colors">
        Start Ordering
      </a>
    </div>
  )

  return (
    <div className="min-h-screen bg-orange-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">📦 My Orders</h1>

        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Order header */}
              <div
                className="p-5 cursor-pointer flex flex-wrap gap-3 items-center justify-between"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-bold text-gray-800">Order #{order.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>
                  {order.payment && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PAYMENT_COLORS[order.payment.status] || 'bg-gray-100'}`}>
                      💳 {order.payment.status}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-orange-500 font-bold">LKR {parseFloat(order.totalAmount).toFixed(2)}</span>
                  <span className="text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString()}</span>
                  <span className="text-gray-400">{expanded === order.id ? '▲' : '▼'}</span>
                </div>
              </div>

              {/* Expanded details */}
              {expanded === order.id && (
                <div className="border-t px-5 pb-5 pt-4 space-y-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-gray-700">Delivery to: </span>{order.deliveryAddress}
                  </div>
                  {order.specialInstructions && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-gray-700">Instructions: </span>{order.specialInstructions}
                    </div>
                  )}

                  {/* Items */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2 text-sm">Items:</h4>
                    <div className="space-y-1">
                      {order.items?.map(item => (
                        <div key={item.id} className="flex justify-between text-sm text-gray-600">
                          <span>{item.foodItemName} × {item.quantity}</span>
                          <span>LKR {parseFloat(item.subtotal).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3 flex-wrap pt-2">
                    {order.status === 'PLACED' && (
                      <button onClick={() => handleCancel(order.id)}
                        className="text-sm bg-red-50 text-red-500 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors">
                        Cancel Order
                      </button>
                    )}
                    {order.payment?.status === 'PENDING' && order.status !== 'CANCELLED' && (
                      <button onClick={() => handlePayNow(order.id)}
                        className="text-sm bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
