import { useState, useEffect } from 'react'
import { foodAPI, categoryAPI, orderAPI, userAPI } from '../api/services'
import toast from 'react-hot-toast'

const TABS = ['Food Items', 'Categories', 'Orders', 'Users']

// ─── Food Items Tab ───────────────────────────────────────────
function FoodItemsTab() {
  const [items,      setItems]      = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ name:'', description:'', price:'', imageUrl:'', status:'AVAILABLE', categoryId:'' })
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchAll = async () => {
    try {
      const [f, c] = await Promise.all([foodAPI.getAll(), categoryAPI.getAll()])
      setItems(f?.data?.data || []); setCategories(c?.data?.data || []); setLoading(false)
    } catch (err) {
      console.error('Error loading food items:', err)
      toast.error('Failed to load food items')
      setItems([]); setCategories([]); setLoading(false)
    }
  }
  useEffect(() => { fetchAll() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editId) { await foodAPI.update(editId, form); toast.success('Updated!') }
      else        { await foodAPI.create(form);          toast.success('Created!') }
      setForm({ name:'', description:'', price:'', imageUrl:'', status:'AVAILABLE', categoryId:'' })
      setEditId(null); fetchAll()
    } catch (err) { toast.error(err.response?.data?.message || 'Error') }
  }

  const handleEdit = (item) => {
    setEditId(item.id)
    setForm({
      name: item.name || '',
      description: item.description || '',
      price: item.price ?? '',
      imageUrl: item.imageUrl || '',
      status: item.status || 'AVAILABLE',
      categoryId: item.categoryId ?? item.category?.id ?? ''
    })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this food item?')) return
    try { await foodAPI.delete(id); toast.success('Deleted'); fetchAll() }
    catch (err) { toast.error(err.response?.data?.message || 'Error') }
  }

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-bold text-gray-800 mb-4">{editId ? 'Edit Food Item' : 'Add New Food Item'}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label:'Name',        name:'name',        type:'text',   placeholder:'e.g. Margherita Pizza' },
            { label:'Price (LKR)', name:'price',       type:'number', placeholder:'e.g. 1200' },
            { label:'Description', name:'description', type:'text',   placeholder:'Short description' },
            { label:'Image URL',   name:'imageUrl',    type:'text',   placeholder:'https://...' },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type={type} value={form[name]} onChange={e => setForm({...form,[name]:e.target.value})}
                placeholder={placeholder} required={name==='name'||name==='price'}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={form.categoryId} onChange={e => setForm({...form,categoryId:e.target.value})} required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={form.status} onChange={e => setForm({...form,status:e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
              <option value="AVAILABLE">Available</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
          </div>
          <div className="sm:col-span-2 flex gap-3">
            <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors">
              {editId ? 'Update Item' : 'Add Item'}
            </button>
            {editId && <button type="button" onClick={() => { setEditId(null); setForm({ name:'',description:'',price:'',imageUrl:'',status:'AVAILABLE',categoryId:'' }) }}
              className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">Cancel</button>}
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-orange-50 text-gray-600">
            <tr>{['Name','Category','Price','Status','Actions'].map(h => <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? <tr><td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td></tr>
              : items.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>
                <td className="px-4 py-3 text-gray-500">{item.categoryName}</td>
                <td className="px-4 py-3 text-orange-500 font-medium">LKR {parseFloat(item.price).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.status==='AVAILABLE'?'bg-green-100 text-green-700':'bg-red-100 text-red-500'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => handleEdit(item)} className="text-blue-500 hover:text-blue-700 text-xs font-medium">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600 text-xs font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Categories Tab ───────────────────────────────────────────
function CategoriesTab() {
  const [cats,    setCats]    = useState([])
  const [form,    setForm]    = useState({ name:'', description:'' })
  const [editId,  setEditId]  = useState(null)

  const fetchAll = async () => {
    try {
      const res = await categoryAPI.getAll(); setCats(res?.data?.data || [])
    } catch (err) {
      console.error('Error loading categories:', err)
      toast.error('Failed to load categories')
      setCats([])
    }
  }
  useEffect(() => { fetchAll() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editId) { await categoryAPI.update(editId, form); toast.success('Updated!') }
      else        { await categoryAPI.create(form);          toast.success('Created!') }
      setForm({ name:'', description:'' }); setEditId(null); fetchAll()
    } catch (err) { toast.error(err.response?.data?.message || 'Error') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return
    try { await categoryAPI.delete(id); toast.success('Deleted'); fetchAll() }
    catch (err) { toast.error(err.response?.data?.message || 'Error') }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-bold text-gray-800 mb-4">{editId ? 'Edit Category' : 'Add New Category'}</h3>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input value={form.name} onChange={e => setForm({...form,name:e.target.value})}
            placeholder="Category name e.g. Pizza" required
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <input value={form.description} onChange={e => setForm({...form,description:e.target.value})}
            placeholder="Description (optional)"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors">
            {editId ? 'Update' : 'Add'}
          </button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({name:'',description:''}) }}
            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200">Cancel</button>}
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-orange-50 text-gray-600">
            <tr>{['Name','Description','Actions'].map(h => <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {cats.map(cat => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{cat.name}</td>
                <td className="px-4 py-3 text-gray-500">{cat.description || '—'}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => { setEditId(cat.id); setForm({name:cat.name,description:cat.description||''}) }}
                    className="text-blue-500 hover:text-blue-700 text-xs font-medium">Edit</button>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-400 hover:text-red-600 text-xs font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Orders Tab ───────────────────────────────────────────────
function OrdersTab() {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAll = async () => {
    try {
      const res = await orderAPI.getOrders(); setOrders(res?.data?.data || []); setLoading(false)
    } catch (err) {
      console.error('Error loading orders:', err)
      toast.error('Failed to load orders')
      setOrders([]); setLoading(false)
    }
  }
  useEffect(() => { fetchAll() }, [])

  const handleStatus = async (id, status) => {
    try { await orderAPI.updateStatus(id, status); toast.success('Status updated'); fetchAll() }
    catch (err) { toast.error(err.response?.data?.message || 'Error') }
  }

  const STATUS_COLORS = { PLACED:'bg-blue-100 text-blue-700', PREPARING:'bg-yellow-100 text-yellow-700', DELIVERED:'bg-green-100 text-green-700', CANCELLED:'bg-red-100 text-red-500' }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
      <table className="w-full text-sm min-w-[600px]">
        <thead className="bg-orange-50 text-gray-600">
          <tr>{['Order ID','User ID','Total','Status','Delivery Address','Change Status'].map(h => <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {loading ? <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr>
            : orders.map(order => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">#{order.id}</td>
              <td className="px-4 py-3 text-gray-500">{order.userId}</td>
              <td className="px-4 py-3 text-orange-500 font-medium">LKR {parseFloat(order.totalAmount).toFixed(2)}</td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status]||'bg-gray-100'}`}>{order.status}</span>
              </td>
              <td className="px-4 py-3 text-gray-500 max-w-[160px] truncate">{order.deliveryAddress}</td>
              <td className="px-4 py-3">
                <select defaultValue={order.status}
                  onChange={e => handleStatus(order.id, e.target.value)}
                  disabled={order.status==='DELIVERED'||order.status==='CANCELLED'}
                  className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-orange-400 disabled:opacity-40">
                  <option value="PLACED">PLACED</option>
                  <option value="PREPARING">PREPARING</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Users Tab ───────────────────────────────────────────────
function UsersTab() {
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAll = async () => {
    try {
      const res = await userAPI.getAll(); setUsers(res?.data?.data || []); setLoading(false)
    } catch (err) {
      console.error('Error loading users:', err)
      toast.error('Failed to load users')
      setUsers([]); setLoading(false)
    }
  }
  useEffect(() => { fetchAll() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return
    try { await userAPI.delete(id); toast.success('User deleted'); fetchAll() }
    catch (err) { toast.error(err.response?.data?.message || 'Error') }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-orange-50 text-gray-600">
          <tr>{['ID','Name','Email','Phone','Role','Actions'].map(h => <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {loading ? <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr>
            : users.map(user => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-500">{user.id}</td>
              <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
              <td className="px-4 py-3 text-gray-500">{user.email}</td>
              <td className="px-4 py-3 text-gray-500">{user.phone}</td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.role==='ADMIN'?'bg-purple-100 text-purple-700':'bg-blue-100 text-blue-700'}`}>
                  {user.role}
                </span>
              </td>
              <td className="px-4 py-3">
                <button onClick={() => handleDelete(user.id)} className="text-red-400 hover:text-red-600 text-xs font-medium">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Main Admin Page ─────────────────────────────────────────
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('Food Items')

  return (
    <div className="min-h-screen bg-orange-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">⚙️ Admin Panel</h1>
        <p className="text-gray-500 mb-8">Manage your food ordering system</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeTab === tab ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-orange-50 border border-gray-200'
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'Food Items'  && <FoodItemsTab />}
        {activeTab === 'Categories'  && <CategoriesTab />}
        {activeTab === 'Orders'      && <OrdersTab />}
        {activeTab === 'Users'       && <UsersTab />}
      </div>
    </div>
  )
}
