import { useState, useEffect } from 'react'
import { foodAPI, categoryAPI } from '../api/services'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { FiSearch, FiShoppingCart, FiTag } from 'react-icons/fi'
import toast from 'react-hot-toast'

function FoodCard({ item }) {
  const { addItem }           = useCart()
  const { isLoggedIn, isAdmin } = useAuth()
  const isAvailable = item.status === 'AVAILABLE'

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      <div className="h-44 bg-orange-100 flex items-center justify-center text-6xl">
        {item.imageUrl
          ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
          : '🍽️'}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-gray-800 text-lg leading-tight">{item.name}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ml-2 ${
            isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'
          }`}>
            {isAvailable ? 'Available' : 'Out of Stock'}
          </span>
        </div>
        <p className="text-gray-500 text-sm mb-2 line-clamp-2 flex-1">{item.description}</p>
        <div className="flex items-center gap-1 text-xs text-orange-400 mb-3">
          <FiTag size={11} /><span>{item.categoryName}</span>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-orange-500 font-bold text-xl">
            LKR {parseFloat(item.price).toFixed(2)}
          </span>
          {isLoggedIn && !isAdmin && isAvailable && (
            <button
              onClick={() => addItem(item.id)}
              className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white text-sm px-3 py-2 rounded-lg transition-colors"
            >
              <FiShoppingCart size={14} /> Add
            </button>
          )}
          {!isLoggedIn && isAvailable && (
            <span className="text-xs text-gray-400">Login to order</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MenuPage() {
  const [items,      setItems]      = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCat, setSelectedCat] = useState('all')
  const [search,     setSearch]     = useState('')
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    Promise.all([foodAPI.getAvailable(), categoryAPI.getAll()])
      .then(([foodRes, catRes]) => {
        setItems(foodRes.data.data)
        setCategories(catRes.data.data)
      })
      .catch(() => toast.error('Failed to load menu'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = items.filter(item => {
    const matchCat    = selectedCat === 'all' || item.categoryId === Number(selectedCat)
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-screen bg-orange-50">
      <div className="bg-orange-500 text-white py-12 px-4 text-center">
        <h1 className="text-4xl font-bold mb-2">Our Menu</h1>
        <p className="text-orange-100">Fresh food, delivered fast 🚀</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search food items..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <select
            value={selectedCat} onChange={e => setSelectedCat(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400 text-lg">Loading menu...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-lg">No items found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(item => <FoodCard key={item.id} item={item} />)}
          </div>
        )}
      </div>
    </div>
  )
}
