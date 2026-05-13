import React, { useState, useEffect } from 'react'
import { foodAPI } from '../api/services'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { FiSearch, FiShoppingCart, FiTag } from 'react-icons/fi'
import toast from 'react-hot-toast'

const FOOD_IMAGE_META: Record<string, { src?: string; gradient?: string[]; emoji?: string }> = {
  'Classic Cheeseburger': { src: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&h=700&fit=crop' },
  'Bacon Burger': { src: 'https://images.unsplash.com/photo-1551615593-ef5fe247e8f7?w=900&h=700&fit=crop' },
  'Spicy Chicken Burger': { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8PcwpG-4vXAy0FngXi_H69qvuox3dc66Jww&s' },
  'Mushroom Swiss Burger': { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMP4znXiOMT_Qyq6-gb8fwd-Nq5-X6FVuM1w&s' },
  'Margherita Pizza': { src: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=900&h=700&fit=crop' },
  'Pepperoni Pizza': { src: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=900&h=700&fit=crop' },
  'Vegetarian Pizza': { src: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=900&h=700&fit=crop' },
  'BBQ Chicken Pizza': { src: 'https://www.scrumdiddlyumptious.com/wp-content/uploads/sites/9/2025/07/sc-bbq-chicken-pizza.jpeg' },
  'Four Cheese Pizza': { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYQ99vJJkcDGl57S9b_oldcJF5camYVRhPtQ&s' },
  'Caesar Salad': { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUUO7I6p5hcfCMYa6URocjt0M1RzVEsf5fHg&s' },
  'Greek Salad': { src: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=900&h=700&fit=crop' },
  'Grilled Chicken Salad': { src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&h=700&fit=crop' },
  'Caprese Salad': { src: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&h=700&fit=crop' },
  'Spaghetti Carbonara': { src: 'https://www.allrecipes.com/thmb/Vg2cRidr2zcYhWGvPD8M18xM_WY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/11973-spaghetti-carbonara-ii-DDMFS-4x3-6edea51e421e4457ac0c3269f3be5157.jpg' },
  'Penne Arrabbiata': { src: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=900&h=700&fit=crop' },
  'Fettuccine Alfredo': { src: 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2017/1/9/6/FNK_Spring-Vegetable-Alfredo_s4x3.jpg.rend.hgtvcom.1280.1280.suffix/1484859771784.webp' },
  'Lasagna': { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSzvmIJz7KThP7npFIg6zVgA5LIwJgZzpSWg&s' },
  'Shrimp Pasta': { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaGWfW1_vqxSKgVLsqw5JF59zewzqe83n6RA&s' },
  'Iced Cola': { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQuQFZiHCMMNMqGkvyAw0rCRccaljemPJHdw&s' },
  'Fresh Orange Juice': { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPCh2_1MSlvo0RL_BpzjbbeRuIqqzMDGaTYA&s'},
  'Iced Coffee': { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk3gqEgKmiyyyBEdKvRfb49eU5_j5SblfLdg&s' },
  'Lemonade': { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe-CzUa9H9i8yfgEp-jerlXk-BiA4nhjUYpQ&s' },
  'Smoothie Bowl': { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8CEgT6UjDl4HU6_QKFDXW2qUzkMFL-hJZVQ&s' },
  'Chocolate Cake': { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi5uzd0MPG6toMfzoVmOIzJuKRmRyGxUyyUQ&s' },
  'Ice Cream Sundae': { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4o0IZKiSwgw2l4gDXj6Is0vAE6yiNOKyGUw&s' },
  'Cheesecake': { src: 'https://t4.ftcdn.net/jpg/01/45/70/89/360_F_145708901_jO47pCUoyO4gO9dVHIXeQyc1oydysY2S.jpg' },
  'Brownie': { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvr235YPd2V4Mw36waATJCV2rcAIVDFOcTKw&s' },
  'Apple Pie': { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwNGuGNY-L0NbhARv5gYp4Daf-9SW8rms4_Q&s' }
}

const DEFAULT_FOOD_IMAGE = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80'

function getFoodImageUrl(item: any) {
  if (item.imageUrl) {
    return item.imageUrl
  }

  const meta = FOOD_IMAGE_META[item.name as keyof typeof FOOD_IMAGE_META]
  if (!meta) {
    return DEFAULT_FOOD_IMAGE
  }

  if (meta.src) {
    return meta.src
  }

  const gradient = meta.gradient || ['#ff9a9e', '#fecfef']
  const emoji = meta.emoji || '🍽️'

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 700" role="img" aria-labelledby="title desc">
      <title>${item.name}</title>
      <desc>Food illustration for ${item.name}</desc>
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${gradient[0]}" />
          <stop offset="100%" stop-color="${gradient[1]}" />
        </linearGradient>
      </defs>
      <rect width="900" height="700" rx="40" fill="url(#bg)" />
      <circle cx="720" cy="120" r="96" fill="rgba(255,255,255,0.14)" />
      <circle cx="140" cy="580" r="130" fill="rgba(255,255,255,0.10)" />
      <text x="80" y="140" font-size="56" fill="rgba(255,255,255,0.88)" font-family="Arial, sans-serif" font-weight="700">${item.categoryName || 'Food'}</text>
      <text x="80" y="360" font-size="190">${emoji}</text>
      <text x="80" y="520" font-size="58" fill="#ffffff" font-family="Arial, sans-serif" font-weight="700">${item.name}</text>
      <text x="80" y="585" font-size="28" fill="rgba(255,255,255,0.86)" font-family="Arial, sans-serif">Freshly prepared and made to match the menu item</text>
    </svg>`

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function FoodCard({ item }: { item: any }) {
  const { addItem }             = useCart()
  const { isLoggedIn, isAdmin } = useAuth()
  const isAvailable = String(item.status || '').toUpperCase() === 'AVAILABLE'
  const imageUrl = getFoodImageUrl(item)

  return (
    <div className="group bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 ease-out transform hover:-translate-y-1 hover:shadow-xl flex flex-col">
      <div className="h-44 bg-orange-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.src = DEFAULT_FOOD_IMAGE
          }}
        />
      </div>
      <div className="p-4 flex flex-col flex-1 transition-colors duration-300 group-hover:bg-orange-50">
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
  const [items,      setItems]      = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCat, setSelectedCat] = useState('all')
  const [search,     setSearch]     = useState('')
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    foodAPI.getAll()
      .then((foodRes) => {
        console.log('Food API Response:', foodRes)
        const foodData = Array.isArray(foodRes.data.data) ? foodRes.data.data : []
        setItems(foodData)
        
        // Extract unique categories from food items
        const uniqueCategories: any[] = []
        const categoryIds = new Set()
        foodData.forEach((item: any) => {
          if (!categoryIds.has(item.categoryId)) {
            categoryIds.add(item.categoryId)
            uniqueCategories.push({
              id: item.categoryId,
              name: item.categoryName
            })
          }
        })
        console.log('Extracted categories:', uniqueCategories)
        setCategories(uniqueCategories)
      })
      .catch((err: any) => {
        console.error('Menu API Error:', err)
        toast.error('Failed to load menu: ' + (err.message || 'Unknown error'))
        setItems([])
        setCategories([])
      })
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
